"use client";

import { Client, Account } from "appwrite";
import { PUBLIC_ENV } from "@/lib/env";

let _client: Client | null = null;

function client(): Client {
  if (_client) return _client;
  _client = new Client()
    .setEndpoint(PUBLIC_ENV.APPWRITE_ENDPOINT)
    .setProject(PUBLIC_ENV.APPWRITE_PROJECT_ID);
  return _client;
}

export function account() {
  return new Account(client());
}
