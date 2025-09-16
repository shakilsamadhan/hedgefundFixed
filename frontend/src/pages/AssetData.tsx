import React, { useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import AssetDataForm, { AssetDataFormValues, AssetFetchResponse } from "../components/AssetDataForm";
import { fetchAssetData } from "../api/assetdata";

export default function AssetData() {
  const [rows, setRows] = useState<AssetFetchResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialData, setInitialData] = useState<AssetDataFormValues | undefined>(undefined);

  // Called by the form when the user clicks "Fetch"
  const handleFetch = async (cusip: string, assetType: string) => {
    try {
      const data = await fetchAssetData(cusip, assetType);
      const fullRecord: AssetFetchResponse = { cusip, type: assetType, ...data };
      // Populate form fields but keep form open
      setInitialData(fullRecord);
    } catch (err: any) {
      alert(`Failed to fetch asset data: ${err.response?.data?.detail || err.message}`);
    }
  };

  // Called by the form when the user clicks "Save"
  const handleSave = (updated: AssetFetchResponse) => {
    setRows([updated]);
    setShowForm(false);
  };

  const columns: Column<AssetFetchResponse>[] = [
    { key: "cusip", header: "CUSIP" },
    { key: "type", header: "Type" },
    { key: "issuer", header: "Issuer" },
    { key: "deal_name", header: "Deal Name" },
    { key: "spread_coupon", header: "Spread / Coupon", format: v => v?.toFixed(4) },
    { key: "maturity", header: "Maturity" },
    { key: "payment_rank", header: "Payment Rank" },
    { key: "rtg_moody_long_term", header: "Moody’s CFR" },
    { key: "rtg_moody", header: "Moody’s Asset" },
    { key: "rtg_sp_lt_lc_issuer_credit", header: "S&P CFR" },
    { key: "rtg_sp", header: "S&P Asset" },
    { key: "amt_outstanding", header: "Amount Outstanding", format: v => v?.toLocaleString() },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Asset Data Fetch</h1>

      <button
        onClick={() => {
          setInitialData(undefined);
          setShowForm(true);
        }}
        className="btn-form"
      >
        + Fetch Asset Data
      </button>

      {rows.length > 0 && <DataTable columns={columns} data={rows} />}

      {showForm && (
        <AssetDataForm
          initialCusip={initialData?.cusip}
          initialType={initialData?.type}
          initialData={initialData}
          onFetch={handleFetch}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
