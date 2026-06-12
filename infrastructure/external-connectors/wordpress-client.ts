export type WordPressConnectorConfig = {
  applicationPassword?: string;
  siteUrl?: string;
  username?: string;
};

export type WordPressDraftPostInput = {
  categories?: number[];
  content: string;
  excerpt?: string | null;
  metaDescription?: string | null;
  seoTitle?: string | null;
  title: string;
};

export type WordPressPostResult = {
  id: number;
  link: string | null;
  status: string;
};

function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/+$/, "");
}

function getAuthHeader(config: Required<WordPressConnectorConfig>) {
  return `Basic ${Buffer.from(
    `${config.username}:${config.applicationPassword}`,
  ).toString("base64")}`;
}

export function isWordPressConfigReady(
  config: WordPressConnectorConfig,
): config is Required<WordPressConnectorConfig> {
  return Boolean(config.siteUrl && config.username && config.applicationPassword);
}

async function requestWordPress<TResponse>(
  config: Required<WordPressConnectorConfig>,
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(`${normalizeSiteUrl(config.siteUrl)}${path}`, {
    ...init,
    headers: {
      Authorization: getAuthHeader(config),
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : `WordPress a répondu avec le statut ${response.status}.`;

    throw new Error(message);
  }

  return payload as TResponse;
}

export async function testWordPressConnection(
  config: Required<WordPressConnectorConfig>,
) {
  const user = await requestWordPress<{ id: number; name?: string; slug?: string }>(
    config,
    "/wp-json/wp/v2/users/me?context=edit",
  );

  return {
    id: user.id,
    label: user.name ?? user.slug ?? String(user.id),
  };
}

export async function createWordPressDraftPost(
  config: Required<WordPressConnectorConfig>,
  post: WordPressDraftPostInput,
) {
  const payload = await requestWordPress<{
    id: number;
    link?: string;
    status: string;
  }>(config, "/wp-json/wp/v2/posts", {
    body: JSON.stringify({
      categories: post.categories ?? [],
      content: post.content,
      excerpt: post.excerpt ?? "",
      meta: {
        vlm_seo_description: post.metaDescription ?? "",
        vlm_seo_title: post.seoTitle ?? "",
      },
      status: "draft",
      title: post.title,
    }),
    method: "POST",
  });

  return {
    id: payload.id,
    link: payload.link ?? null,
    status: payload.status,
  } satisfies WordPressPostResult;
}
