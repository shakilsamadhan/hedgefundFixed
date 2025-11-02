// frontend/src/pages/WatchList.tsx

// frontend/src/pages/WatchList.tsx

import React, { useEffect, useState } from "react";
import {
  listWatch,
  addToWatch,
  removeFromWatch,
  WatchItemWithData,
} from "../api/watchlist";
import DataTable, { Column } from "../components/DataTable";

const ASSET_TYPES = ["Term Loan", "Corporate Bond"] as const;

export default function WatchList() {
  const [items, setItems] = useState<WatchItemWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [cusip, setCusip] = useState("");
  const [assetType, setAssetType] = useState<typeof ASSET_TYPES[number]>(
    ASSET_TYPES[0]
  );

  const reload = () => {
    setLoading(true);
    setError(undefined);
    listWatch()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    console.log(items)
  };

  useEffect(reload, []);

  const handleAdd = async () => {
    try {
      await addToWatch(cusip, assetType);
      setCusip("");
      reload();
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = async (row: WatchItemWithData) => {
    try {
      await removeFromWatch(row.id);
      reload();
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    }
  };

  // Split out error rows
  const goodRows = items.filter((r) => !r.error);
  const badRows = items.filter((r) => !!r.error);

  // Shared formatter helper
  const fmtNum = (v?: number, suffix = "") =>
    v != null
      ? v.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + suffix
      : "—";

  const columns: Column<WatchItemWithData>[] = [
    { key: "cusip", header: "CUSIP", align: "left" },
    { key: "asset_type", header: "Asset Type", align: "left" },
    { key: "issuer", header: "Issuer", align: "left" },
    { key: "deal_name", header: "Deal Name", align: "left" },
    {
      key: "spread_coupon",
      header: "Spread/Coupon",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "maturity",
      header: "Maturity",
      format: (v) => v ?? "—",
      align: "left",
    },
    {
      key: "px_bid",
      header: "Bid Price",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "px_ask",
      header: "Offer Price",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "yld_cnv_bid",
      header: "YTW",
      format: (v) => fmtNum(v, "%"),
      align: "right",
    },
    {
      key: "dm_zspread",
      header: "DM/Z Spread",
      format: (v) =>
        v != null
          ? new Intl.NumberFormat(undefined, {
              maximumFractionDigits: 0,
            }).format(v)
          : "",
      align: "right",
    },
    {
      key: "chg_net_1d",
      header: "1D Net",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "chg_net_5d",
      header: "5D Net",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "chg_net_1m",
      header: "30D Net",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "chg_net_6m",
      header: "6M Net",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "chg_net_ytd",
      header: "YTD Net",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "interval_high",
      header: "12M High",
      format: (v) => fmtNum(v),
      align: "right",
    },
    {
      key: "interval_low",
      header: "12M Low",
      format: (v) => fmtNum(v),
      align: "right",
    },
    { key: "payment_rank", header: "Payment Rank", align: "left" },
    { key: "rtg_moody_long_term", header: "Moody CFR", align: "left" },
    { key: "rtg_moody", header: "Moody Asset", align: "left" },
    { key: "rtg_sp_lt_lc_issuer_credit", header: "S&P CFR", align: "left" },
    { key: "rtg_sp", header: "S&P Asset", align: "left" },
    {
      key: "amt_outstanding",
      header: "Amount Outstanding",
      format: (v) => fmtNum(v),
      align: "right",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Watch List</h1>

      {error && <div className="text-red-600">Error: {error}</div>}

      <div className="flex items-end space-x-4">
        <div>
          <label className="block text-sm">CUSIP</label>
          <input
            type="text"
            value={cusip}
            onChange={(e) => setCusip(e.target.value)}
            placeholder="e.g. 123456AB"
            className="mt-1 p-2 border rounded w-48"
          />
        </div>
        <div>
          <label className="block text-sm">Asset Type</label>
          <select
            value={assetType}
            onChange={(e) =>
              setAssetType(e.target.value as typeof ASSET_TYPES[number])
            }
            className="mt-1 p-2 border rounded"
          >
            {ASSET_TYPES.map((at) => (
              <option key={at} value={at}>
                {at}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="btn-form"
        >
          Add
        </button>
        <button
          onClick={reload}
          className="btn-form-secondary"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <DataTable columns={columns} data={goodRows} onDelete={handleDelete} />

          {/* inline errors */}
          {badRows.length > 0 && (
            <div className="mt-4 space-y-1">
              {badRows.map((r) => (
                <div key={r.id} className="text-red-500">
                  CUSIP {r.cusip}: {r.error}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
