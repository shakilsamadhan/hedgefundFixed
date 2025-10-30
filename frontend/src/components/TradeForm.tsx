// frontend/src/components/TradeForm.tsx

import React, { useState, useEffect } from "react";
import {
  createTrade,
  updateTrade,
  Trade
} from "../api/trades";
import { Asset } from "../api/assets";

export interface TradeFormValues {
  id?: number;
  trade_date: string;
  settle_date: string;
  direction: string;
  asset_type: string;
  asset_id: number;
  quantity: number;
  price: number;
  counterparty: string;
  fund_alloc: string;
  sub_alloc: string;
  agreement_type: string;
  doc_type: string;
  notes: string;
}

interface Props {
  assets: Asset[];                   // for the Display Name dropdown
  initialData?: TradeFormValues;     // when editing
  onSave: (trade: Trade) => void;
  onCancel: () => void;
}

// Your new option lists:
const assetTypeOptions = [
  "Corporate Bond",
  "Delayed Draw Term Loan",
  "Equity",
  "Equity Option",
  "Government Bond",
  "Index CDS",
  "Revolver",
  "Single Name CDS",
  "Term Loan",
  "Trade Claim",
];

const directionOptions = [
  "Buy Long",
  "Cover Short",
  "Sell Long",
  "Sell Short",
];

const agreementTypeOptions = [
  "Assignment",
  "Participation",
];

const docTypeOptions = [
  "Par",
  "Distressed",
];

const fundOptions = ["GCM"];
const subAllocOptions = ["GCM 1", "GCM 2", "GCM 3"];

export default function TradeForm({
  assets = [],
  initialData,
  onSave,
  onCancel,
}: Props) {
  // initialize state from initialData or empty for selects
  const [tradeDate, setTradeDate]     = useState(initialData?.trade_date   ?? "");
  const [settleDate, setSettleDate]   = useState(initialData?.settle_date  ?? "");
  const [direction, setDirection]     = useState(initialData?.direction    ?? "");
  const [assetType, setAssetType]     = useState(initialData?.asset_type   ?? "");
  const [assetId, setAssetId]         = useState<number | "">(initialData?.asset_id ?? "");
  const [quantity, setQuantity]       = useState(initialData?.quantity     ?? 0);
  const [price, setPrice]             = useState(initialData?.price        ?? 0);
  const [counterparty, setCounterparty] = useState(initialData?.counterparty ?? "");
  const [fundAlloc, setFundAlloc]     = useState(initialData?.fund_alloc   ?? "");
  const [subAlloc, setSubAlloc]       = useState(initialData?.sub_alloc    ?? "");
  const [agreementType, setAgreementType] = useState(initialData?.agreement_type ?? "");
  const [docType, setDocType]         = useState(initialData?.doc_type     ?? "");
  const [notes, setNotes]             = useState(initialData?.notes        ?? "");

  // When editing, keep the initial asset-id
  console.log(assets)
  useEffect(() => {
    if (initialData?.asset_id !== undefined) {
      setAssetId(initialData.asset_id);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic dropdown validation
    if (!direction || !assetType || assetId === "") {
      alert("Please fill out all required dropdowns");
      return;
    }

    const payload: TradeFormValues = {
      trade_date: tradeDate,
      settle_date: settleDate,
      direction,
      asset_type: assetType,
      asset_id: assetId as number,
      quantity,
      price,
      counterparty,
      fund_alloc: fundAlloc,
      sub_alloc: subAlloc,
      agreement_type: agreementType,
      doc_type: docType,
      notes,
    };

    try {
      let saved: Trade;
      if (initialData?.id) {
        saved = await updateTrade(initialData.id, payload);
      } else {
        saved = await createTrade(payload);
      }
      onSave(saved);
    } catch (err) {
      console.error("Failed to save trade", err);
      alert(initialData ? "Could not update trade" : "Could not create trade");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="col-span-2 text-xl font-semibold">
          {initialData ? "Edit Trade" : "New Trade"}
        </h2>

        {/* Trade Date */}
        <label className="flex flex-col">
          <span className="text-sm">Trade Date</span>
          <input
            type="date"
            value={tradeDate}
            onChange={e => setTradeDate(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          />
        </label>

        {/* Settle Date */}
        <label className="flex flex-col">
          <span className="text-sm">Settle Date</span>
          <input
            type="date"
            value={settleDate}
            onChange={e => setSettleDate(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          />
        </label>

        {/* Direction */}
        <label className="flex flex-col">
          <span className="text-sm">Direction</span>
          <select
            value={direction}
            onChange={e => setDirection(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          >
            <option value="">-- Select --</option>
            {directionOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        {/* Asset Type */}
        <label className="flex flex-col">
          <span className="text-sm">Asset Type</span>
          <select
            value={assetType}
            onChange={e => setAssetType(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          >
            <option value="">-- Select --</option>
            {assetTypeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        {/* Display Name */}
        <label className="flex flex-col col-span-2 md:col-span-1">
          <span className="text-sm">Display Name</span>
          <select
            value={assetId}
            onChange={e => setAssetId(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
            className="border rounded p-2 text-sm"
            required
          >
            <option value="">-- Select --</option>
            {assets
              // optional: filter assets by assetType here
              .map(a => (
                <option key={a.id} value={a.id}>
                  {a.display_name}
                </option>
              ))}
          </select>
        </label>

        {/* Quantity */}
        <label className="flex flex-col">
          <span className="text-sm">Quantity</span>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value, 10))}
            className="border rounded p-2 text-sm"
            required
          />
        </label>

        {/* Price */}
        <label className="flex flex-col">
          <span className="text-sm">Price</span>
          <input
            type="number"
            step="0.0001"
            value={price}
            onChange={e => setPrice(parseFloat(e.target.value))}
            className="border rounded p-2 text-sm"
            required
          />
        </label>

        {/* Counterparty */}
        <label className="flex flex-col">
          <span className="text-sm">Counterparty</span>
          <input
            type="text"
            value={counterparty}
            onChange={e => setCounterparty(e.target.value)}
            className="border rounded p-2 text-sm"
            required
          />
        </label>

        {/* Fund Alloc */}
        <label className="flex flex-col">
          <span className="text-sm">Fund Alloc</span>
          <select
            value={fundAlloc}
            onChange={e => setFundAlloc(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- Select --</option>
            {fundOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        {/* Sub-alloc */}
        <label className="flex flex-col">
          <span className="text-sm">Sub-alloc</span>
          <select
            value={subAlloc}
            onChange={e => setSubAlloc(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- Select --</option>
            {subAllocOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        {/* Agreement Type */}
        <label className="flex flex-col">
          <span className="text-sm">Agreement Type</span>
          <select
            value={agreementType}
            onChange={e => setAgreementType(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- Select --</option>
            {agreementTypeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        {/* Doc Type */}
        <label className="flex flex-col">
          <span className="text-sm">Doc Type</span>
          <select
            value={docType}
            onChange={e => setDocType(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">-- Select --</option>
            {docTypeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        {/* Notes (full width) */}
        <label className="flex flex-col col-span-2">
          <span className="text-sm">Notes</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="border rounded p-2 text-sm h-24"
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
            {initialData ? "Update Trade" : "Create Trade"}
          </button>
        </div>
      </form>
    </div>
  );
}
