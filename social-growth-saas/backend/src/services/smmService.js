import axios from "axios";
import { SMM_API_KEY, SMM_API_URL } from "../config/env.js";

if (!SMM_API_URL || !SMM_API_KEY) {
  console.warn("SMM panel API configuration is missing. SMM integration will be disabled.");
}

function getClient() {
  if (!SMM_API_URL || !SMM_API_KEY) {
    throw new Error("SMM panel API is not configured");
  }

  const client = axios.create({
    baseURL: SMM_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SMM_API_KEY}`,
    },
    timeout: 10000,
  });

  return client;
}

export async function smmCreateOrder({ service, quantity, link }) {
  const client = getClient();

  const payload = {
    service_id: service.providerServiceId,
    quantity,
    link,
  };

  const { data } = await client.post("/orders", payload);
  return {
    providerOrderId: data.id,
    status: data.status,
  };
}

export async function smmGetOrderStatus(providerOrderId) {
  const client = getClient();
  const { data } = await client.get(`/orders/${providerOrderId}`);
  return data;
}

