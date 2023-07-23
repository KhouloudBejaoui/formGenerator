import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9010/api",
  headers: {
    "Content-type": "application/json"
  }
});