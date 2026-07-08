// Thin GraphQL client for the headless WordPress backend (WPGraphQL).
// Mirrors the "just export a configured client" shape of src/integrations/supabase/client.ts.

const WPGRAPHQL_ENDPOINT =
  import.meta.env.VITE_WPGRAPHQL_ENDPOINT || "http://localhost:8090/graphql";

export class WpGraphQLError extends Error {
  constructor(message: string, public errors: unknown[]) {
    super(message);
    this.name = "WpGraphQLError";
  }
}

export async function wpFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(WPGRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new WpGraphQLError(json.errors[0]?.message ?? "WPGraphQL error", json.errors);
  }

  return json.data as T;
}
