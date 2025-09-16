// frontend/src/components/AssetDataForm.tsx

import React, { useState, useEffect } from "react";
import { fetchAssetData, AssetFetchResponse } from "../api/assetdata";

export interface AssetDataFormProps {
  initialCusip?: string;
  initialType?: string;
  initialData?: AssetFetchResponse;
  onFetch: (cusip: string, type: string) => void;
  onSave: (data: AssetFetchResponse & { cusip: string; type: string }) => void;
  onCancel: () => void;
}

export default function AssetDataForm({
  initialCusip = "",
  initialType = "Term Loan",
  initialData,
  onFetch,
  onSave,
  onCancel,
}: AssetDataFormProps) {
  const [cusip, setCusip] = useState(initialCusip);
  const [type, setType] = useState(initialType);

  // Bloomberg‐fetched fields (or overridden by user)
  const [displayName, setDisplayName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [dealName, setDealName] = useState("");
  const [spreadCoupon, setSpreadCoupon] = useState<number | "">("");
  const [maturity, setMaturity] = useState<string>("");
  const [paymentRank, setPaymentRank] = useState("");
  const [moodysCfr, setMoodysCfr] = useState("");
  const [moodysAsset, setMoodysAsset] = useState("");
  const [spCfr, setSpCfr] = useState("");
  const [spAsset, setSpAsset] = useState("");
  const [amountOutstanding, setAmountOutstanding] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setDisplayName(initialData.display_name || "");
      setIssuer(initialData.issuer || "");
      setDealName(initialData.deal_name || "");
      setSpreadCoupon(initialData.spread_coupon ?? "");
      setMaturity(initialData.maturity ?? "");
      setPaymentRank(initialData.payment_rank || "");
      setMoodysCfr(initialData.rtg_moody_long_term || "");
      setMoodysAsset(initialData.rtg_moody || "");
      setSpCfr(initialData.rtg_sp_lt_lc_issuer_credit || "");
      setSpAsset(initialData.rtg_sp || "");
      setAmountOutstanding(initialData.amt_outstanding ?? "");
    }
  }, [initialData]);

  const doFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      await fetchAssetData(cusip.trim(), type);
      onFetch(cusip.trim(), type);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const doSave = () => {
    onSave({
      cusip,
      type,
      display_name: displayName,
      issuer: issuer || undefined,
      deal_name: dealName || undefined,
      spread_coupon:
        typeof spreadCoupon === "number" ? spreadCoupon : undefined,
      maturity: maturity || undefined,
      payment_rank: paymentRank || undefined,
      rtg_moody_long_term: moodysCfr || undefined,
      rtg_moody: moodysAsset || undefined,
      rtg_sp_lt_lc_issuer_credit: spCfr || undefined,
      rtg_sp: spAsset || undefined,
      amt_outstanding:
        typeof amountOutstanding === "number"
          ? amountOutstanding
          : undefined,
    } as AssetFetchResponse & { cusip: string; type: string });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Fetch Asset Data</h2>

        {/* CUSIP & Type */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm">CUSIP</label>
            <input
              type="text"
              value={cusip}
              onChange={(e) => setCusip(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Asset Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            >
              <option>Term Loan</option>
              <option>Corporate Bond</option>
              <option>Government Bond</option>
              <option>Revolver</option>
              <option>Delayed Draw Term Loan</option>
              <option>Equity</option>
              <option>Equity Option</option>
              <option>Index CDS</option>
              <option>Single Name CDS</option>
              <option>Trade Claim</option>
            </select>
          </div>
        </div>

        {/* Fetch / Cancel */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={doFetch}
            disabled={loading || !cusip.trim()}
            className={`btn-form-secondary ${
              loading ? "btn-form" : "btn-form-secondary"
            }`}
          >
            {loading ? "Fetching…" : "Fetch from Bloomberg"}
          </button>
          <button
            onClick={onCancel}
            className="btn-form-danger"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Data Fields: two columns, scrollable */}
        <div className="grid grid-cols-2 gap-4 mb-6 max-h-[65vh] overflow-y-auto pr-2">
          {/* Display Name */}
          <label className="block">
            <span className="text-sm">Display Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Issuer */}
          <label className="block">
            <span className="text-sm">Issuer</span>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Deal Name */}
          <label className="block">
            <span className="text-sm">Deal Name</span>
            <input
              type="text"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Spread / Coupon */}
          <label className="block">
            <span className="text-sm">Spread / Coupon</span>
            <input
              type="number"
              step="0.0001"
              value={spreadCoupon}
              onChange={(e) =>
                setSpreadCoupon(
                  e.target.value === "" ? "" : parseFloat(e.target.value)
                )
              }
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Maturity */}
          <label className="block">
            <span className="text-sm">Maturity</span>
            <input
              type="date"
              value={maturity}
              onChange={(e) => setMaturity(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Payment Rank */}
          <label className="block">
            <span className="text-sm">Payment Rank</span>
            <input
              type="text"
              value={paymentRank}
              onChange={(e) => setPaymentRank(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Moody’s CFR */}
          <label className="block">
            <span className="text-sm">Moody’s CFR</span>
            <input
              type="text"
              value={moodysCfr}
              onChange={(e) => setMoodysCfr(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Moody’s Asset */}
          <label className="block">
            <span className="text-sm">Moody’s Asset</span>
            <input
              type="text"
              value={moodysAsset}
              onChange={(e) => setMoodysAsset(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* S&P CFR */}
          <label className="block">
            <span className="text-sm">S&P CFR</span>
            <input
              type="text"
              value={spCfr}
              onChange={(e) => setSpCfr(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* S&P Asset */}
          <label className="block">
            <span className="text-sm">S&P Asset</span>
            <input
              type="text"
              value={spAsset}
              onChange={(e) => setSpAsset(e.target.value)}
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>

          {/* Amount Outstanding */}
          <label className="block">
            <span className="text-sm">Amount Outstanding</span>
            <input
              type="number"
              value={amountOutstanding}
              onChange={(e) =>
                setAmountOutstanding(
                  e.target.value === "" ? "" : parseInt(e.target.value, 10)
                )
              }
              className="mt-1 w-full border rounded p-2 text-sm"
            />
          </label>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={doSave}
            className="btn-form"
          >
            Save Asset
          </button>
        </div>
      </div>
    </div>
  );
}
