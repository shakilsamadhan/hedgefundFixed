// frontend/src/components/AssetForm.tsx

import React, { useState } from "react";
import { createAsset, updateAsset, Asset } from "../api/assets";
import { fetchAssetData, AssetFetchResponse } from "../api/assetdata";





export interface AssetFormValues {
  id?: number;
  cusip: string;
  type: string;
  display_name: string;
  issuer?: string;
  deal_name?: string;
  spread_coupon?: number;
  maturity?: string;
  payment_rank?: string;
  moodys_cfr?: string;
  moodys_asset?: string;
  sp_cfr?: string;
  sp_asset?: string;
  amount_outstanding?: number;
  mark?: number;
}

interface Props {
  initialData?: AssetFormValues;
  onSave: (asset: Asset) => void;
  onCancel: () => void;
}

export default function AssetForm({ initialData, onSave, onCancel }: Props) {
  const [cusip, setCusip] = useState(initialData?.cusip ?? "");
  const [type, setType] = useState(initialData?.type ?? "");
  const [displayName, setDisplayName] = useState(initialData?.display_name ?? "");
  const [issuer, setIssuer] = useState(initialData?.issuer ?? "");
  const [dealName, setDealName] = useState(initialData?.deal_name ?? "");
  const [spreadCoupon, setSpreadCoupon] = useState<number>(initialData?.spread_coupon ?? 0);
  const [maturity, setMaturity] = useState(initialData?.maturity ?? "");
  const [paymentRank, setPaymentRank] = useState(initialData?.payment_rank ?? "");
  const [moodysCfr, setMoodysCfr] = useState(initialData?.moodys_cfr ?? "");
  const [moodysAsset, setMoodysAsset] = useState(initialData?.moodys_asset ?? "");
  const [spCfr, setSpCfr] = useState(initialData?.sp_cfr ?? "");
  const [spAsset, setSpAsset] = useState(initialData?.sp_asset ?? "");
  const [amountOutstanding, setAmountOutstanding] = useState<number>(initialData?.amount_outstanding ?? 0);
  const [mark, setMark] = useState<number>(initialData?.mark ?? 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const data: AssetFetchResponse = await fetchAssetData(cusip.trim(), type);
      // populate form fields from Bloomberg response:
      setDisplayName(data.display_name || "");
      setIssuer(data.issuer || "");
      setDealName(data.deal_name || "");
      setSpreadCoupon(data.spread_coupon ?? 0);
      setMaturity(data.maturity || "");
      setPaymentRank(data.payment_rank || "");
      setMoodysCfr(data.rtg_moody_long_term || "");
      setMoodysAsset(data.rtg_moody || "");
      setSpCfr(data.rtg_sp_lt_lc_issuer_credit || "");
      setSpAsset(data.rtg_sp || "");
      setAmountOutstanding(data.amt_outstanding ?? 0);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      cusip,
      type,
      display_name: displayName,
      issuer,
      deal_name: dealName,
      spread_coupon: spreadCoupon,
      maturity,
      payment_rank: paymentRank,
      moodys_cfr: moodysCfr,
      moodys_asset: moodysAsset,
      sp_cfr: spCfr,
      sp_asset: spAsset,
      amount_outstanding: amountOutstanding,
      mark,
    };
    try {
      const saved = initialData?.id
        ? await updateAsset(initialData.id, payload)
        : await createAsset(payload);
      onSave(saved);
    } catch (err) {
      console.error("Failed to save asset", err);
      alert(initialData ? "Could not update asset" : "Could not create asset");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full"
      >
        <h2 className="col-span-2 text-xl font-semibold">
          {initialData ? "Edit Asset" : "Add New Asset"}
        </h2>

        {/* CUSIP + Fetch */}
        <div className="col-span-1 flex items-end space-x-2">
          <div className="flex-1 flex flex-col">
            <label className="text-sm">CUSIP</label>
            <input
              type="text"
              value={cusip}
              onChange={e => setCusip(e.target.value)}
              className="border rounded p-2 text-sm"
              required
            />
          </div>
          <button
            type="button"
            onClick={doFetch}
            disabled={loading || !cusip.trim() || !type}
            className={`btn-form-secondary ${
              loading ? "btn-form" : "btn-form-secondary"
            }`}
          >
            {loading ? "Fetching…" : "Fetch"}
          </button>
        </div>

        {/* Type */}
        <label className="flex flex-col">
          <span className="text-sm">Type</span>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          >
            <option value="">-- Select Asset Type --</option>
            <option>Corporate Bond</option>
            <option>Term Loan</option>
            <option>Government Bond</option>
            <option>Revolver</option>
            <option>Delayed Draw Term Loan</option>
            <option>Equity</option>
            <option>Equity Option</option>
            <option>Index CDS</option>
            <option>Single Name CDS</option>
            <option>Trade Claim</option>
          </select>
        </label>

        {/* Display Name */}
        <label className="flex flex-col">
          <span className="text-sm">Display Name</span>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          />
        </label>

        {/* Issuer */}
        <label className="flex flex-col">
          <span className="text-sm">Issuer</span>
          <input
            type="text"
            value={issuer}
            onChange={e => setIssuer(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Deal Name */}
        <label className="flex flex-col">
          <span className="text-sm">Deal Name</span>
          <input
            type="text"
            value={dealName}
            onChange={e => setDealName(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Spread / Coupon */}
        <label className="flex flex-col">
          <span className="text-sm">Spread / Coupon</span>
          <input
            type="number"
            step="0.0001"
            value={spreadCoupon}
            onChange={e => setSpreadCoupon(parseFloat(e.target.value))}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Maturity */}
        <label className="flex flex-col">
          <span className="text-sm">Maturity</span>
          <input
            type="date"
            value={maturity}
            onChange={e => setMaturity(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Payment Rank */}
        <label className="flex flex-col">
          <span className="text-sm">Payment Rank</span>
          <input
            type="text"
            value={paymentRank}
            onChange={e => setPaymentRank(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Moody’s CFR */}
        <label className="flex flex-col">
          <span className="text-sm">Moody’s CFR</span>
          <input
            type="text"
            value={moodysCfr}
            onChange={e => setMoodysCfr(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Moody’s Asset */}
        <label className="flex flex-col">
          <span className="text-sm">Moody’s Asset</span>
          <input
            type="text"
            value={moodysAsset}
            onChange={e => setMoodysAsset(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* S&P CFR */}
        <label className="flex flex-col">
          <span className="text-sm">S&P CFR</span>
          <input
            type="text"
            value={spCfr}
            onChange={e => setSpCfr(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* S&P Asset */}
        <label className="flex flex-col">
          <span className="text-sm">S&P Asset</span>
          <input
            type="text"
            value={spAsset}
            onChange={e => setSpAsset(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Amount Outstanding */}
        <label className="flex flex-col">
          <span className="text-sm">Amount Outstanding</span>
          <input
            type="number"
            value={amountOutstanding}
            onChange={e => setAmountOutstanding(parseInt(e.target.value, 10))}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Market Price */}
        <label className="flex flex-col">
          <span className="text-sm">Market Price</span>
          <input
            type="number"
            step="0.0001"
            value={mark}
            onChange={e => setMark(parseFloat(e.target.value))}
            className="border rounded p-2 text-sm"
          />
        </label>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-form-danger"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-form"
          >
            {initialData ? "Save Changes" : "Create"}
          </button>
        </div>

        {error && <p className="col-span-2 text-red-600">{error}</p>}
      </form>
    </div>
  );
}
