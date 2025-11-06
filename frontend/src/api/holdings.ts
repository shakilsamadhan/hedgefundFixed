// frontend/src/api/holdings.ts
import axios from "./client";
import api from "./interceptors";


export interface Holding {
  id: number;
  fund: string;
  display_name: string;
  position: number;
  mark: number;
  market_value: number;
  cost_basis: number;
  mtm_pnl: number;
}

export async function getHoldings(): Promise<Holding[]> {
  const resp = await api.get<Holding[]>("/holdings/");
  return resp.data;
}
