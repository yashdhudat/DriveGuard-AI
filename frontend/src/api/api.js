import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 20000,
});

export async function runAgent(payload) {
  const res = await API.post("/api/agent/process", payload);
  return res.data;
}
