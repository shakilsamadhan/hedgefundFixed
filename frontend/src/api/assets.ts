// frontend/src/api/assets.ts
import axios from "./client";

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
const BASE_URL = 'http://localhost:8000/api';

const token = localStorage.getItem("token"); 

export const getAssets = async (): Promise<Asset[]> => {

  const response = await axios.get<Asset[]>(`${BASE_URL}/assets/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
  const response = await axios.post<Asset>(`${BASE_URL}/assets/`, asset,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
    }
  );
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
  const response = await axios.put<Asset>(
    `${BASE_URL}/assets/${id}/`,
    data
  );
  return response.data;
};

// Delete an existing asset
export const deleteAsset = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/assets/${id}/`);
};
