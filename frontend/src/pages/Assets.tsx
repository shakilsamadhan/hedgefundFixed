// frontend/src/pages/Assets.tsx

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import AssetForm, { AssetFormValues } from "../components/AssetForm";
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  Asset,
} from "../api/assets";

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetFormValues | null>(
    null
  );

  // load assets from backend
  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets", err);
      alert("Failed to load assets");
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // save handler for both create & update
  const handleSave = async (vals: AssetFormValues) => {
    try {
      if (vals.id) {
        await updateAsset(vals.id, vals);
      } else {
        await createAsset(vals);
      }
      setShowForm(false);
      setEditingAsset(null);
      await loadAssets();
    } catch (err) {
      console.error("Failed to save asset", err);
      alert(vals.id ? "Could not update asset" : "Could not create asset");
    }
  };

  // delete handler
  const handleDelete = async (id: number) => {
    if (window.confirm("Really delete this asset?")) {
      await deleteAsset(id);
      await loadAssets();
    }
  };

  // column definitions (now including display_name)
  const columns: Column<Asset>[] = [
    { key: "id", header: "ID" },
    { key: "type", header: "Type" },
    { key: "cusip", header: "CUSIP" },
    { key: "issuer", header: "Issuer" },
    { key: "deal_name", header: "Deal Name" },
    { key: "display_name", header: "Display Name" },
    {
      key: "spread_coupon",
      header: "Spread/CPN",
      format: (v) => Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    { key: "maturity", header: "Maturity" },
    { key: "payment_rank", header: "Payment Rank" },
    { key: "moodys_cfr", header: "Moody’s CFR" },
    { key: "moodys_asset", header: "Moody’s Asset" },
    { key: "sp_cfr", header: "S&P CFR" },
    { key: "sp_asset", header: "S&P Asset" },
    {
      key: "amount_outstanding",
      header: "Amt Outst",
      format: (v) => Number(v).toLocaleString(undefined, { minimumFractionDigits: 0 }),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Assets</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingAsset(null);
            setShowForm(true);
          }}
        >
          + Add New Asset
        </button>
      </div>

      <DataTable
        columns={columns}
        data={assets}
        onEdit={(row) => {
          // map Asset -> AssetFormValues
          setEditingAsset({
            id: row.id,
            cusip: row.cusip,
            type: row.type,
            display_name: row.display_name,
            issuer: row.issuer ?? "",
            deal_name: row.deal_name ?? "",
            spread_coupon: row.spread_coupon ?? 0,
            maturity: row.maturity ?? "",
            payment_rank: row.payment_rank ?? "",
            moodys_cfr: row.moodys_cfr ?? "",
            moodys_asset: row.moodys_asset ?? "",
            sp_cfr: row.sp_cfr ?? "",
            sp_asset: row.sp_asset ?? "",
            amount_outstanding: row.amount_outstanding ?? 0,
            mark: row.mark ?? 0,
          });
          setShowForm(true);
        }}
        onDelete={(row) => handleDelete(row.id!)}
      />

      {showForm && (
        <AssetForm
          initialData={editingAsset ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setEditingAsset(null);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
