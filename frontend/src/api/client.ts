// frontend/src/api/client.ts
import axios from "axios";

// point at your FastAPI backend
axios.defaults.baseURL = "http://localhost:8000/api";

//import.meta.env.VITE_API_BASE_URL || 

// you can also set up interceptors, headers, etc. here if you like
export default axios;
