import client from "./client";
import api from "./interceptors";
export interface WatchItem {
  id: number;
  cusip: string;
  asset_type: string;
}

export interface WatchItemWithData extends WatchItem {
  issuer?: string;
  deal_name?: string;
  ln_current_margin?: number;
  maturity?: string;        // ISO date
  px_bid?: number;
  px_ask?: number;
  yld_cnv_bid?: number;
  disc_mrgn_bid?: number;
  chg_net_1d?: number;
  chg_net_5d?: number;
  chg_net_1m?: number;
  chg_net_6m?: number;
  chg_net_ytd?: number;
  interval_high?: number;
  interval_low?: number;
  payment_rank?: string;
  rtg_moody_long_term?: string;
  rtg_moody?: string;
  rtg_sp_lt_lc_issuer_credit?: string;
  rtg_sp?: string;
  amt_outstanding?: number;
}

export function listWatch(): Promise<WatchItemWithData[]> {
  return api.get<WatchItemWithData[]>("/watchlist").then((r) => r.data);
}

export function addToWatch(
  cusip: string,
  asset_type: string
): Promise<WatchItem> {
  return client
    .post<WatchItem>("/watchlist", { cusip, asset_type })
    .then((r) => r.data);
}

export function removeFromWatch(id: number): Promise<void> {
  return client.delete(`/watchlist/${id}`).then(() => {});
}
