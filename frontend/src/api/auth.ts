import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // your FastAPI backend
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};


const GOOGLE_CLIENT_ID="170452749354-2hgbu9oaltpev3thtokhvgfss3vrgbn5.apps.googleusercontent.com"

const REDIRECT_URI = "http://localhost:8000/auth/google/callback"

export const handleGoogle = () => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=email%20profile`;

  window.location.href = googleAuthUrl;
};