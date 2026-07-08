// Auth + transport for pushing existing Supabase content into WordPress.
// Local, one-time ops script — never bundled into the Vite app.

const WP_REST_ENDPOINT = process.env.WP_REST_ENDPOINT || "http://localhost:8090/wp-json";
const WP_GRAPHQL_ENDPOINT = process.env.WPGRAPHQL_ENDPOINT || "http://localhost:8090/graphql";
const WP_ADMIN_USER = process.env.WP_ADMIN_USER || "admin";
const WP_APPLICATION_PASSWORD = process.env.WP_APPLICATION_PASSWORD || "";

if (!WP_APPLICATION_PASSWORD) {
  console.warn(
    "WARNING: WP_APPLICATION_PASSWORD is not set. Generate one via `npm run wp:bootstrap` " +
      "(see docker/wordpress/scripts/.app-password) and export it before running a real migration."
  );
}

function basicAuthHeader(): string {
  const token = Buffer.from(`${WP_ADMIN_USER}:${WP_APPLICATION_PASSWORD}`).toString("base64");
  return `Basic ${token}`;
}

export async function wpGraphqlMutate<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`WPGraphQL mutation failed: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

/** REST is used only for multipart media upload, which GraphQL doesn't handle well. */
export async function wpRestUploadMedia(
  filename: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ id: number; source_url: string }> {
  const res = await fetch(`${WP_REST_ENDPOINT}/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: buffer,
  });
  if (!res.ok) {
    throw new Error(`Media upload failed for ${filename}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function wpRestRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${WP_REST_ENDPOINT}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`WP REST request failed (${path}): ${res.status} ${await res.text()}`);
  }
  return res.json();
}
