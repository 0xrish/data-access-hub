import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;

export function getDatabase() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL. Set it to the Supabase PostgreSQL connection string.");
  }
  client ??= postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 15,
    ssl: "require",
  });
  return client;
}
