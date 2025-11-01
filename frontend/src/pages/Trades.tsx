import React, { useEffect, useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import TradeForm, { TradeFormValues } from "../components/TradeForm";
import {
  getTrades,
  createTrade,
  updateTrade,
  deleteTrade,
  Trade,
} from "../api/trades";
import { getAssets, Asset } from "../api/assets";

export default function Trades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TradeFormValues | null>(
    null
  );

  // load trades from backend
  const loadTrades = async () => {
    try {
      const data = await getTrades();
      setTrades(data);
      // console.log(data)
    } catch (err) {
      console.error("Error fetching trades", err);
      alert("Failed to load trades");
    }
  };

  // load assets (for the dropdown)
  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      console.error("Error loading assets for dropdown", err);
      alert("Failed to load assets list");
    }
  };

  useEffect(() => {
    loadTrades();
    loadAssets();
  }, []);

  // save handler (for both create & update)
  const handleSave = async (vals: Trade) => {
    // if (vals.id) {
    //   await updateTrade(vals.id, vals);
    // } else {
    //   await createTrade(vals);
    // }
    setShowForm(false);
    setEditingTrade(null);
    await loadTrades();
  };

  // delete handler
  const handleDelete = async (id: number) => {
    if (window.confirm("Really delete this trade?")) {
      await deleteTrade(id);
      await loadTrades();
    }
  };

  // column definitions
  const columns: Column<Trade>[] = [
    { key: "trade_date", header: "Trade Date" },
    { key: "settle_date", header: "Settle Date" },
    { key: "asset_type", header: "Asset Type" },
    { key: "direction", header: "Direction" },
    {
      key: "asset_id",
      header: "Display Name",
      render: (row) =>
        assets.find((a) => a.id === row.asset_id)?.display_name ?? "",
    },
    {
      key: "quantity",
      header: "Quantity",
      format: (v) => Number(v).toLocaleString(),
    },
    {
      key: "price",
      header: "Price",
      format: (v) => parseFloat(v).toFixed(2),
    },
    { key: "counterparty", header: "Counterparty" },
    { key: "fund_alloc", header: "Fund Alloc" },
    { key: "sub_alloc", header: "Sub-alloc" },
    { key: "agreement_type", header: "Agreement Type" },
    { key: "doc_type", header: "Doc Type" },
    { key: "notes", header: "Notes" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trades</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingTrade(null);
            setShowForm(true);
          }}
        >
          + New Trade
        </button>
      </div>

      <DataTable
        columns={columns}
        data={trades}
        onEdit={(row) => {
          // map Trade -> TradeFormValues (stringified where needed)
          setEditingTrade({
            id: row.id,
            trade_date: row.trade_date,
            settle_date: row.settle_date || "",
            direction: row.direction,
            asset_type: row.asset_type,
            asset_id: row.asset_id,
            quantity: row.quantity,//.toString()
            price: row.price,//.toString()
            counterparty: row.counterparty || "",
            fund_alloc: row.fund_alloc || "",
            sub_alloc: row.sub_alloc || "",
            agreement_type: row.agreement_type || "",
            doc_type: row.doc_type || "",
            notes: row.notes ?? "",
          });
          setShowForm(true);
        }}
        onDelete={(row) => handleDelete(row.id!)}
      />

      {showForm && (
        <TradeForm
        assets={assets}
        initialData={editingTrade ?? undefined}
        onSave={handleSave}
        onCancel={() => {
          // now we both clear out any "editing" row AND hide the form
          setEditingTrade(null);
          setShowForm(false);
        }}
      />
      )}
    </div>
  );
}
