import axios from "axios";

export const api = axios.create({
  baseURL: `0.0.0.0:${process.env.PORT || 3000}`,
});
