// frontend/src/components/EditAssetForm.tsx

import React, { useState, useEffect } from "react";
import { Asset, updateAsset } from "../api/assets";

interface Props {
  asset: Asset;
  onUpdated: (asset: Asset) => void;
  onCancel: () => void;
}

export default function EditAssetForm({ asset, onUpdated, onCancel }: Props) {
  // Initialize state from props.asset
  const [cusip, setCusip] = useState(asset.cusip);
  const [type, setType] = useState(asset.type);
  const [displayName, setDisplayName] = useState(asset.display_name);
  const [issuer, setIssuer] = useState(asset.issuer || "");
  const [dealName, setDealName] = useState(asset.deal_name || "");
  const [spreadCoupon, setSpreadCoupon] = useState<number>(asset.spread_coupon);
  const [maturity, setMaturity] = useState(asset.maturity);
  const [paymentRank, setPaymentRank] = useState(asset.payment_rank || "");
  const [moodysCfr, setMoodysCfr] = useState(asset.moodys_cfr || "");
  const [moodysAsset, setMoodysAsset] = useState(asset.moodys_asset || "");
  const [spCfr, setSpCfr] = useState(asset.sp_cfr || "");
  const [spAsset, setSpAsset] = useState(asset.sp_asset || "");
  const [amountOutstanding, setAmountOutstanding] = useState<number>(asset.amount_outstanding);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateAsset(asset.id, {
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
      });
      onUpdated(updated);
    } catch (err) {
      console.error("Failed to update asset", err);
      alert("Could not update asset");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full"
      >
        <h2 className="col-span-2 text-xl font-semibold">Edit Asset</h2>

        {/* form fields identical to AssetForm, pre-filled */}

        {/* CUSIP */}
        <label className="flex flex-col">
          <span className="text-sm">CUSIP</span>
          <input
            type="text"
            value={cusip}
            onChange={e => setCusip(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          />
        </label>
        {/* Type */}
        <label className="flex flex-col">
          <span className="text-sm">Type</span>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option>Bond</option>
            <option>Stock</option>
            <option>Other</option>
          </select>
        </label>
        {/* Display Name, Issuer, Deal Name, Spread, Maturity, etc. */}
        {/* ... repeat labels/inputs exactly as AssetForm, using above state setters ... */}

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
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
