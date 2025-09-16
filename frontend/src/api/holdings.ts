// frontend/src/api/holdings.ts
import axios from "./client";
import axios from "./client";


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
  const resp = await axios.get<Holding[]>("/holdings/");
  return resp.data;
}
