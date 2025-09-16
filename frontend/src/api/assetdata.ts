// frontend/src/api/assetdata.ts
import axios from "axios";

export interface AssetFetchResponse {
  cusip: string;
  asset_type: string;
  issuer: string;
  deal_name: string;
  spread_coupon: number;
  maturity: string;
  px_bid?: number;
  px_ask?: number;
  yld_cnv_bid?: number;
  dm_zspread?: number;
  chg_net_1d?: number;
  chg_net_5d?: number;
  chg_net_1m?: number;
  chg_net_6m?: number;
  chg_net_ytd?: number;
  interval_high?: number;
  interval_low?: number;
  payment_rank: string;
  rtg_moody_long_term: string;
  rtg_moody: string;
  rtg_sp_lt_lc_issuer_credit: string;
  rtg_sp: string;
  amt_outstanding: number;
}

export async function fetchAssetData(
  cusip: string,
  asset_type: string
): Promise<AssetFetchResponse> {
  const { data } = await axios.post<AssetFetchResponse>(
    "/assetdata/fetch",
    { cusip, asset_type }
  );
  return data;
}
