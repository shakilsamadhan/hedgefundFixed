// frontend/src/components/EditTradeForm.tsx

import React, { useState } from "react";
import { updateTrade, Trade } from "../api/trades";

interface Props {
  trade: Trade;
  onClose: () => void;
  onUpdated: (updated: Trade) => void;
}

export default function EditTradeForm({ trade, onClose, onUpdated }: Props) {
  const [tradeDate, setTradeDate] = useState(trade.trade_date);
  const [settleDate, setSettleDate] = useState(trade.settle_date || "");
  const [direction, setDirection] = useState(trade.direction);
  const [assetType, setAssetType] = useState(trade.asset_type);
  const [assetId, setAssetId] = useState(trade.asset_id);
  const [quantity, setQuantity] = useState(trade.quantity);
  const [price, setPrice] = useState(trade.price);
  const [counterparty, setCounterparty] = useState(trade.counterparty || "");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateTrade(trade.id, {
        trade_date: tradeDate,
        settle_date: settleDate || undefined,
        direction,
        asset_type: assetType,
        asset_id: assetId,
        quantity,
        price,
        counterparty: counterparty || undefined,
        fund_alloc: undefined,
        sub_alloc: undefined,
        agreement_type: undefined,
        doc_type: undefined,
        notes: undefined,
      });
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      console.error("✏️ updateTrade error:", err);
      setError(err.response?.data?.detail || "Failed to update trade");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        className="bg-white rounded-2xl shadow-lg p-4 w-96 grid gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold">Edit Trade</h2>
        {error && <div className="text-red-500">{error}</div>}

        {/* Trade Date */}
        <div className="flex flex-col">
          <label className="text-sm">Trade Date</label>
          <input
            type="date"
            className="border p-1 rounded"
            value={tradeDate}
            onChange={(e) => setTradeDate(e.target.value)}
            required
          />
        </div>

        {/* Settle Date */}
        <div className="flex flex-col">
          <label className="text-sm">Settle Date</label>
          <input
            type="date"
            className="border p-1 rounded"
            value={settleDate}
            onChange={(e) => setSettleDate(e.target.value)}
          />
        </div>

        {/* Direction */}
        <div className="flex flex-col">
          <label className="text-sm">Direction</label>
          <select
            className="border p-1 rounded"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option>Buy</option>
            <option>Sell</option>
          </select>
        </div>

        {/* Asset Type */}
        <div className="flex flex-col">
          <label className="text-sm">Asset Type</label>
          <select
            className="border p-1 rounded"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          >
            <option>Bond</option>
            <option>Stock</option>
            <option>Other</option>
          </select>
        </div>

        {/* Asset ID */}
        <div className="flex flex-col">
          <label className="text-sm">Asset ID</label>
          <input
            type="number"
            className="border p-1 rounded"
            value={assetId}
            onChange={(e) => setAssetId(Number(e.target.value))}
            required
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label className="text-sm">Quantity</label>
          <input
            type="number"
            step="0.0001"
            className="border p-1 rounded"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            required
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-sm">Price</label>
          <input
            type="number"
            step="0.0001"
            className="border p-1 rounded"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>

        {/* Counterparty */}
        <div className="flex flex-col">
          <label className="text-sm">Counterparty</label>
          <input
            type="text"
            className="border p-1 rounded"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="btn-form-danger"
            onClick={onClose}
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
