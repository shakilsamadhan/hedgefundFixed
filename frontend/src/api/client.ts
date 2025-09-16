// frontend/src/api/client.ts
import axios from "axios";

// point at your FastAPI backend
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// you can also set up interceptors, headers, etc. here if you like
export default axios;
