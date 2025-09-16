// frontend/src/pages/Holdings.tsx

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "../components/DataTable";
import { getHoldings, Holding } from "../api/holdings";

export default function Holdings() {
  const [all, setAll] = useState<Holding[]>([]);
  const [filtered, setFiltered] = useState<Holding[]>([]);
  const [funds, setFunds] = useState<string[]>([]);
  const [subAllocs, setSubAllocs] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [issuers, setIssuers] = useState<string[]>([]);

  const [fundFilter, setFundFilter] = useState("");
  const [subAllocFilter, setSubAllocFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [issuerFilter, setIssuerFilter] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getHoldings();
        setAll(data);

        // extract unique values for dropdowns
        setFunds([...new Set(data.map((h) => h.fund))].sort());
        setSubAllocs([...new Set(data.map((h) => h.sub_alloc))].sort());
        setTypes([...new Set(data.map((h) => h.type))].sort());
        setIssuers([...new Set(data.map((h) => h.issuer))].sort());

        setFiltered(data);
      } catch (err) {
        console.error("Failed to load holdings", err);
        alert("Could not fetch holdings");
      }
    }
    load();
  }, []);

  // re-filter whenever any filter changes
  useEffect(() => {
    setFiltered(
      all.filter((h) =>
        (fundFilter === "" || h.fund === fundFilter) &&
        (subAllocFilter === "" || h.sub_alloc === subAllocFilter) &&
        (typeFilter === "" || h.type === typeFilter) &&
        (issuerFilter === "" || h.issuer === issuerFilter)
      )
    );
  }, [all, fundFilter, subAllocFilter, typeFilter, issuerFilter]);

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const columns: Column<Holding>[] = [
    { key: "display_name", header: "Asset" },
    {
      key: "position",
      header: "Quantity",
      format: fmt,
    },
    {
      key: "market_value",
      header: "Market Value",
      format: fmt,
    },
    {
      key: "cost_basis",
      header: "Avg Cost",
      format: fmt,
    },
    {
      key: "mark",
      header: "Market Price",
      format: fmt,
    },
    {
      key: "mtm_pnl",
      header: "P/L",
      format: fmt,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Portfolio Holdings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        {/* each dropdown defaults to null ("") */}
        <label className="flex flex-col">
          <span className="text-sm">Fund</span>
          <select
            value={fundFilter}
            onChange={(e) => setFundFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- All Funds --</option>
            {funds.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Sub-Alloc</span>
          <select
            value={subAllocFilter}
            onChange={(e) => setSubAllocFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- All Sub-Allocs --</option>
            {subAllocs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Asset Class</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- All Types --</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Issuer</span>
          <select
            value={issuerFilter}
            onChange={(e) => setIssuerFilter(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- All Issuers --</option>
            {issuers.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
