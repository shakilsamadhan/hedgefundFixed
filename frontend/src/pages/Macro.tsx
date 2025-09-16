import React, { useEffect, useState } from "react";
import { fetchMacroIndicators, MacroIndicator } from "../api/macro";

type MacroRow = MacroIndicator & { group: string };

export default function Macro() {
  const [data, setData]     = useState<MacroRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string>();

  useEffect(() => {
    fetchMacroIndicators()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading…</div>;
  if (error)   return <div className="p-4 text-red-500">Error: {error}</div>;

  // Group rows by `group`
  const byGroup = data.reduce((acc: Record<string, MacroRow[]>, row) => {
    (acc[row.group] ||= []).push(row);
    return acc;
  }, {});

  // Order in which groups should appear
  const groupOrder = ["Equities","Volatility","Credit","Rates","Commodities","Currencies"];

  // Column definitions
  const columns = [
    { key: "ticker",     label: "Ticker",      align: "left"  },
    { key: "last_price", label: "Last Price",  align: "right" },
    { key: "chg_net_1d", label: "1D Net",      align: "right" },
    { key: "chg_pct_1d", label: "1D %",        align: "right" },
    { key: "chg_pct_5d", label: "5D %",        align: "right" },
    { key: "chg_pct_1m", label: "1M %",        align: "right" },
    { key: "chg_pct_6m", label: "6M %",        align: "right" },
    { key: "chg_pct_ytd",label: "YTD %",       align: "right" },
  ] as const;

  // Helper: format numbers
  const numFmt = (n?: number) =>
    n != null
      ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "";

  return (
    <div className="p-4 overflow-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={
                  `p-2 font-bold ` +
                  (col.align === "right" ? "text-right" : "text-left")
                }
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupOrder.map(group => {
            const rows = byGroup[group] || [];
            if (!rows.length) return null;
            return (
              <React.Fragment key={group}>
                {/* Group-header row */}
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-2 bg-gray-200 font-semibold text-left"
                  >
                    {group}
                  </td>
                </tr>
                {/* Data rows for this group */}
                {rows.map(row => (
                  <tr key={row.ticker} className="border-b">
                    {columns.map(col => {
                      const raw = (row as any)[col.key] as number | string;
                      const text =
                        col.key === "ticker"
                          ? raw
                          : col.key.startsWith("chg_pct")
                          ? `${numFmt(raw as number)}%`
                          : numFmt(raw as number);
                      return (
                        <td
                          key={col.key}
                          className={
                            `p-2 ` +
                            (col.align === "right" ? "text-right" : "text-left")
                          }
                        >
                          {text}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
