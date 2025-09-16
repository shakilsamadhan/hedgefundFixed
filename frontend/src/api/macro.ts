import client from "./client";
export interface MacroIndicator {
  ticker: string;
  last_price: number;
  chg_net_1d?: number;
  chg_pct_1d?: number;
  chg_pct_5d?: number;
  chg_pct_1m?: number;
  chg_pct_6m?: number;
  chg_pct_ytd?: number;
}

export function fetchMacroIndicators(): Promise<MacroIndicator[]> {
  return client.get<MacroIndicator[]>('/macro').then(res => res.data);
}
