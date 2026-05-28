/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Databases, DatabasesIndexType, OrderBy } from "node-appwrite";
import { SCHEMA } from "../lib/appwrite/schema";

const IDX_TYPE: Record<string, DatabasesIndexType> = {
  key: DatabasesIndexType.Key,
  unique: DatabasesIndexType.Unique,
  fulltext: DatabasesIndexType.Fulltext,
};

const ORDER_BY: Record<string, OrderBy> = {
  ASC: OrderBy.Asc,
  DESC: OrderBy.Desc,
};

function need(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    console.error("Set it in .env.local or export it before running this script.");
    process.exit(1);
  }
  return v;
}

async function main() {
  const endpoint = need("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  const projectId = need("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  const apiKey = need("APPWRITE_API_KEY");
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "splits";

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const db = new Databases(client);

  console.log(`Connecting to ${endpoint} (project ${projectId}, db ${databaseId})`);

  try {
    await db.get(databaseId);
    console.log(`  database exists: ${databaseId}`);
  } catch {
    await db.create(databaseId, "Splits");
    console.log(`  created database: ${databaseId}`);
  }

  for (const col of SCHEMA) {
    try {
      await db.getCollection(databaseId, col.id);
      console.log(`  collection exists: ${col.id}`);
    } catch {
      await db.createCollection(databaseId, col.id, col.name, undefined, true);
      console.log(`  created collection: ${col.id}`);
    }

    const existingAttrs = await db.listAttributes(databaseId, col.id);
    const existingKeys = new Set(existingAttrs.attributes.map((a: any) => a.key));

    for (const attr of col.attributes) {
      if (existingKeys.has(attr.key)) {
        console.log(`    attr exists: ${col.id}.${attr.key}`);
        continue;
      }
      const required = !!attr.required;
      const array = !!attr.array;
      try {
        if (attr.type === "string") {
          await db.createStringAttribute(databaseId, col.id, attr.key, attr.size, required, undefined, array);
        } else if (attr.type === "enum") {
          await db.createEnumAttribute(databaseId, col.id, attr.key, attr.elements, required, undefined, array);
        } else if (attr.type === "integer") {
          await db.createIntegerAttribute(databaseId, col.id, attr.key, required, attr.min, attr.max, undefined, array);
        } else if (attr.type === "float") {
          await db.createFloatAttribute(databaseId, col.id, attr.key, required, attr.min, attr.max, undefined, array);
        } else if (attr.type === "boolean") {
          await db.createBooleanAttribute(databaseId, col.id, attr.key, required, undefined, array);
        } else if (attr.type === "datetime") {
          await db.createDatetimeAttribute(databaseId, col.id, attr.key, required, undefined, array);
        }
        console.log(`    created attr: ${col.id}.${attr.key} (${attr.type})`);
      } catch (e: any) {
        console.error(`    failed attr: ${col.id}.${attr.key} — ${e.message ?? e}`);
      }
    }

    // wait for attributes to become available before creating indexes
    await new Promise((r) => setTimeout(r, 1500));

    const existingIdx = await db.listIndexes(databaseId, col.id);
    const existingIdxKeys = new Set(existingIdx.indexes.map((i: any) => i.key));

    for (const idx of col.indexes) {
      if (existingIdxKeys.has(idx.key)) {
        console.log(`    index exists: ${col.id}.${idx.key}`);
        continue;
      }
      try {
        const orders = idx.orders?.map((o) => ORDER_BY[o]);
        await db.createIndex(databaseId, col.id, idx.key, IDX_TYPE[idx.type], idx.attributes, orders);
        console.log(`    created index: ${col.id}.${idx.key}`);
      } catch (e: any) {
        console.error(`    failed index: ${col.id}.${idx.key} — ${e.message ?? e}`);
      }
    }
  }

  console.log("done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
