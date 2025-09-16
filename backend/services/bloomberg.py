# backend/services/bloomberg.py

import os
import blpapi
import pandas as pd
import math
from typing import List, Dict, Any

###########################
# Configuration Constants #
###########################

BLOOMBERG_HOST = os.getenv("BLP_HOST", "localhost")
BLOOMBERG_PORT = int(os.getenv("BLP_PORT", 8194))

##############################################
# Low-level Bloomberg fetch for any set of fields
##############################################

def get_raw_bloomberg_data(
    tickers: List[str],
    fields: List[str],
    host: str = BLOOMBERG_HOST,
    port: int = BLOOMBERG_PORT,
) -> pd.DataFrame:
    session_opts = blpapi.SessionOptions()
    session_opts.setServerHost(host)
    session_opts.setServerPort(port)

    session = blpapi.Session(session_opts)
    if not session.start():
        raise ConnectionError("Failed to start Bloomberg session.")
    if not session.openService("//blp/refdata"):
        raise ConnectionError("Failed to open //blp/refdata service.")

    svc = session.getService("//blp/refdata")
    req = svc.createRequest("ReferenceDataRequest")

    for t in tickers:
        req.getElement("securities").appendValue(t)
    for f in fields:
        req.getElement("fields").appendValue(f)

    session.sendRequest(req)

    rows: List[List[Any]] = []
    cols = ["ticker"] + fields

    while True:
        ev = session.nextEvent()
        for msg in ev:
            if msg.messageType() == blpapi.Name("ReferenceDataResponse"):
                sd = msg.getElement("securityData")
                for i in range(sd.numValues()):
                    elm = sd.getValueAsElement(i)
                    ticker = elm.getElementAsString("security")
                    fd = elm.getElement("fieldData")
                    row = [ticker]
                    for f in fields:
                        row.append(fd.getElementAsString(f) if fd.hasElement(f) else None)
                    rows.append(row)
        if ev.eventType() == blpapi.Event.RESPONSE:
            break

    session.stop()
    return pd.DataFrame(rows, columns=cols)


######################################
# Normalize raw Macro Data to floats #
######################################

FIELDS = [
    "LAST_PRICE",
    "CHG_NET_1D",
    "CHG_PCT_1D",
    "CHG_PCT_5D",
    "CHG_PCT_1M",
    "CHG_PCT_6M",
    "CHG_PCT_YTD",
]

def normalize_macro_df(raw: pd.DataFrame) -> pd.DataFrame:
    rename_map = {
        "LAST_PRICE":    "last_price",
        "CHG_NET_1D":    "chg_net_1d",
        "CHG_PCT_1D":    "chg_pct_1d",
        "CHG_PCT_5D":    "chg_pct_5d",
        "CHG_PCT_1M":    "chg_pct_1m",
        "CHG_PCT_6M":    "chg_pct_6m",
        "CHG_PCT_YTD":   "chg_pct_ytd",
    }
    df = pd.DataFrame({"ticker": raw["ticker"]})
    for blp_col, out_col in rename_map.items():
        if blp_col in raw.columns:
            ser = raw[blp_col].astype(str).str.rstrip("%")
            df[out_col] = pd.to_numeric(ser, errors="coerce")
        else:
            df[out_col] = None
    return df.where(pd.notnull(df), None)


##############################################
# Watchlist-style fetch: single CUSIP + type #
##############################################

# These maps power fetch_watchlist_data in your watchlist router:
FIELD_MAPS: Dict[str, List[str]] = {
    "Term Loan": [
        "ISSUER", "DEAL_NAME", "LN_CURRENT_MARGIN", "MATURITY",
        "PX_BID", "PX_ASK", "YLD_CNV_BID", "DISC_MRGN_BID",
        "CHG_NET_1D","CHG_NET_5D","CHG_NET_1M","CHG_NET_6M","CHG_NET_YTD",
        "INTERVAL_HIGH","INTERVAL_LOW","PAYMENT_RANK",
        "RTG_MOODY_LONG_TERM","RTG_MOODY",
        "RTG_SP_LT_LC_ISSUER_CREDIT","RTG_SP","AMT_OUTSTANDING",
    ],
    "Corporate Bond": [
        "ISSUER", "NAME", "SECURITY_DES", "CPN", "MATURITY",
        "PX_BID","PX_ASK","YLD_CNV_BID","YAS_ZSPREAD",
        "CHG_NET_1D","CHG_NET_5D","CHG_NET_1M","CHG_NET_6M","CHG_NET_YTD",
        "INTERVAL_HIGH","INTERVAL_LOW","PAYMENT_RANK",
        "RTG_MOODY_LONG_TERM","RTG_MOODY",
        "RTG_SP_LT_LC_ISSUER_CREDIT","RTG_SP","AMT_OUTSTANDING",
    ],
    "Government Bond": [
        "ISSUER", "NAME", "SECURITY_DES", "CPN", "MATURITY",
        "PX_BID","PX_ASK","YLD_CNV_BID","YAS_ZSPREAD",
        "CHG_NET_1D","CHG_NET_5D","CHG_NET_1M","CHG_NET_6M","CHG_NET_YTD",
        "INTERVAL_HIGH","INTERVAL_LOW","PAYMENT_RANK",
        "RTG_MOODY_LONG_TERM","RTG_MOODY",
        "RTG_SP_LT_LC_ISSUER_CREDIT","RTG_SP","AMT_OUTSTANDING",
    ],
}
FIELD_KEY_MAP: Dict[str, str] = {
    "ISSUER": "issuer", "DEAL_NAME": "deal_name", "NAME": "deal_name", "SECURITY_DES": "display_name",
    "LN_CURRENT_MARGIN": "spread_coupon", "CPN": "spread_coupon",
    "DISC_MRGN_BID": "dm_zspread","YAS_ZSPREAD": "dm_zspread",
}
STRING_ONLY = {
    "ISSUER","DEAL_NAME","SECURITY_DES","NAME","MATURITY",
    "PAYMENT_RANK","RTG_MOODY_LONG_TERM","RTG_MOODY",
    "RTG_SP_LT_LC_ISSUER_CREDIT","RTG_SP",
}

def fetch_watchlist_data(cusip: str, asset_type: str) -> Dict[str, Any]:
    security = f"{cusip} Corp"
    fields = FIELD_MAPS.get(asset_type)
    if not fields:
        raise ValueError(f"No FIELD_MAPS entry for asset_type={asset_type!r}")
    df = get_raw_bloomberg_data([security], fields)
    row = df.iloc[0]
    out: Dict[str, Any] = {"cusip": cusip, "asset_type": asset_type}
    for fld in fields:
        raw_val = row.get(fld, None)
        json_key = FIELD_KEY_MAP.get(fld, fld.lower())
        if fld in STRING_ONLY:
            out[json_key] = raw_val or None
        elif isinstance(raw_val, str) and raw_val.endswith("%"):
            try: out[json_key] = float(raw_val.rstrip("%"))
            except: out[json_key] = None
        else:
            try: val = float(raw_val)
            except: val = None
            out[json_key] = None if (isinstance(val, float) and math.isnan(val)) else val
    return out


##################################################
# New: fetch just the Asset-creation fields list #
##################################################

ASSETDATA_FIELD_MAPS: Dict[str, List[str]] = {
    "Term Loan": [
        "ISSUER","DEAL_NAME","LN_CURRENT_MARGIN","MATURITY",
        "PAYMENT_RANK","RTG_MOODY_LONG_TERM","RTG_MOODY",
        "RTG_SP_LT_LC_ISSUER_CREDIT","RTG_SP","AMT_OUTSTANDING",
    ],
    "Corporate Bond": [
        "ISSUER","NAME","CPN","MATURITY",
        "PAYMENT_RANK","RTG_MOODY_LONG_TERM","RTG_MOODY",
        "RTG_SP_LT_LC_ISSUER_CREDIT","RTG_SP","AMT_OUTSTANDING",
    ],
}
_ASSETDATA_KEY_MAP: Dict[str, str] = {
    "ISSUER": "issuer",
    "DEAL_NAME": "deal_name",
    "NAME": "deal_name",
    "LN_CURRENT_MARGIN": "spread_coupon",
    "CPN": "spread_coupon",
    "MATURITY": "maturity",
    "PAYMENT_RANK": "payment_rank",
    "RTG_MOODY_LONG_TERM": "rtg_moody_long_term",
    "RTG_MOODY": "rtg_moody",
    "RTG_SP_LT_LC_ISSUER_CREDIT": "rtg_sp_lt_lc_issuer_credit",
    "RTG_SP": "rtg_sp",
    "AMT_OUTSTANDING": "amt_outstanding",
}

def fetch_assetdata(cusip: str, asset_type: str) -> Dict[str, Any]:
    security = f"{cusip} Corp"
    fields = ASSETDATA_FIELD_MAPS.get(asset_type)
    if fields is None:
        raise ValueError(f"Unknown asset_type={asset_type!r}")
    df = get_raw_bloomberg_data([security], fields)
    row = df.iloc[0]
    out: Dict[str, Any] = {}
    for fld in fields:
        raw_val = row.get(fld)
        key = _ASSETDATA_KEY_MAP[fld]
        if isinstance(raw_val, str):
            out[key] = raw_val
        else:
            try:
                num = float(raw_val)
            except:
                out[key] = None
            else:
                out[key] = None if math.isnan(num) else round(num, 2)
    return out
