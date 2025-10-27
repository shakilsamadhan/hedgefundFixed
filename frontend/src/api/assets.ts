// frontend/src/api/assets.ts
import axios from "./client";
import api from "./interceptors";

// Define the Asset type (add more fields as needed)
export interface Asset {
  id: number;
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
  mark?: number;            // ← new: market price
}

// Base URL for your backend (adjust if different)
const BASE_URL = '/api';

// const token = localStorage.getItem("token"); 

export const getAssets = async (): Promise<Asset[]> => {

  const response = await api.get<Asset[]>(`/assets/`);
  return response.data;
};

// Create a new asset
export const createAsset = async (asset: {
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
  mark?: number;            // ← allow sending mark
}): Promise<Asset> => {
  const response = await api.post<Asset>(`/assets/`, asset);
  console.log('create');
  return response.data;
};

// Update an existing asset
export const updateAsset = async (
  id: number,
  data: {
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
    mark?: number;          // ← allow sending updated mark
  }
): Promise<Asset> => {
      console.log('update data')
  const response = await api.put<Asset>(
    `/assets/${id}/`,
    data
  );
  console.log(data)

  return response.data;
};

// Delete an existing asset
export const deleteAsset = async (id: number): Promise<void> => {
  await api.delete(`/assets/${id}/`);
};
