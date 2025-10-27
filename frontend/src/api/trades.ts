// frontend/src/api/trades.ts

import axios from "axios";
import api from "./interceptors";
// import axios from "./client";


export interface Trade {
  id: number;
  trade_date: string;
  settle_date?: string;
  direction: string;
  asset_type: string;
  asset_id: number;
  quantity: number;
  price: number;
  counterparty?: string;
  fund_alloc?: string;
  sub_alloc?: string;
  agreement_type?: string;
  doc_type?: string;
  notes?: string;
}

const BASE_URL = "/api";

export const getTrades = (): Promise<Trade[]> =>
  api.get<Trade[]>(`${BASE_URL}/trades/`).then((res) => res.data);

export const createTrade = (data: Omit<Trade, "id">): Promise<Trade> =>
  api.post<Trade>(`${BASE_URL}/trades/`, data).then((res) => res.data);

export const updateTrade = (id: number, data: Omit<Trade, "id">): Promise<Trade> =>
  api.put<Trade>(`${BASE_URL}/trades/${id}/`, data).then((res) => res.data);

export const deleteTrade = (id: number): Promise<void> =>
  api.delete(`${BASE_URL}/trades/${id}/`);
