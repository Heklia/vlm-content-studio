"use server";

import { redirect } from "next/navigation";
import {
  createWordPressDraftPost,
  isWordPressConfigReady,
  testWordPressConnection,
  type WordPressConnectorConfig,
} from "@/infrastructure/external-connectors/wordpress-client";
import { createClient } from "@/infrastructure/supabase/server";
import {
  hasStoredWordPressPassword,
  parseWordPressConnectorConfig,
} from "@/modules/connectors/domain/wordpress-connector-config";
import { createAuditLog } from "@/repositories/audit/audit-logs-repository";
import {
  getConnectorSettingByProvider,
  updateConnectorSetting,
} from "@/repositories/connectors/connector-settings-repository";
import { getChannelVariantById } from "@/repositories/channel-variants/channel-variants-repository";
import { requireAuth } from "@/services/auth/require-auth";
import type { JsonValue } from "@/types/common";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function ensureAdministrator(role: string | undefined) {
  return role === "administrator";
}

function ensurePublisher(role: string | undefined) {
  return role === "administrator" || role === "validator";
}

function buildWordPressContent(variant: {
  body: string | null;
  callToAction: string | null;
  hashtags: string[];
}) {
  const blocks = [
    variant.body,
    variant.callToAction ? `**${variant.callToAction}**` : null,
    variant.hashtags.length > 0 ? variant.hashtags.join(" ") : null,
  ].filter((block): block is string => Boolean(block));

  return blocks
    .map((block) =>
      block
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
        .join("\n"),
    )
    .join("\n\n");
}

async function getWordPressConnectorConfig() {
  const supabase = await createClient();
  const setting = await getConnectorSettingByProvider(supabase, "wordpress");

  if (!setting) {
    return { config: {}, setting: null, supabase };
  }

  return {
    config: parseWordPressConnectorConfig(setting.config),
    setting,
    supabase,
  };
}

export async function saveWordPressConnectorAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile || !ensureAdministrator(profile.role)) {
    redirect("/settings/connectors/wordpress?error=forbidden");
  }

  const { config: existingConfig, setting, supabase } =
    await getWordPressConnectorConfig();

  if (!setting) {
    redirect("/settings/connectors/wordpress?error=missing_connector");
  }

  const siteUrl = getTextValue(formData, "site_url");
  const username = getTextValue(formData, "username");
  const applicationPassword = getTextValue(formData, "application_password");
  const status =
    getTextValue(formData, "status") === "disabled" ? "disabled" : "configured";

  if (status !== "disabled" && (!siteUrl || !username)) {
    redirect("/settings/connectors/wordpress?error=missing_config");
  }

  const nextConfig = {
    applicationPassword:
      applicationPassword ?? existingConfig.applicationPassword ?? "",
    siteUrl: siteUrl ?? "",
    username: username ?? "",
  } satisfies WordPressConnectorConfig;

  if (status !== "disabled" && !hasStoredWordPressPassword(nextConfig)) {
    redirect("/settings/connectors/wordpress?error=missing_password");
  }

  await updateConnectorSetting(supabase, setting.id, {
    config: nextConfig as JsonValue,
    status,
  });

  await createAuditLog(supabase, {
    action: "wordpress_connector_saved",
    actor_profile_id: profile.id,
    metadata: {
      siteUrl: nextConfig.siteUrl,
      status,
      username: nextConfig.username,
    },
    target_id: setting.id,
    target_table: "connector_settings",
  });

  redirect("/settings/connectors/wordpress?saved=1");
}

export async function testWordPressConnectorAction() {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile || !ensureAdministrator(profile.role)) {
    redirect("/settings/connectors/wordpress?error=forbidden");
  }

  const { config, setting, supabase } = await getWordPressConnectorConfig();

  if (!setting || !isWordPressConfigReady(config)) {
    redirect("/settings/connectors/wordpress?error=missing_config");
  }

  let testedUser: Awaited<ReturnType<typeof testWordPressConnection>> | null =
    null;

  try {
    testedUser = await testWordPressConnection(config);
    await updateConnectorSetting(supabase, setting.id, {
      status: "active",
    });

    await createAuditLog(supabase, {
      action: "wordpress_connector_tested",
      actor_profile_id: profile.id,
      metadata: {
        result: "success",
        wordpressUserId: testedUser.id,
        wordpressUserLabel: testedUser.label,
      },
      target_id: setting.id,
      target_table: "connector_settings",
    });
  } catch (error) {
    await updateConnectorSetting(supabase, setting.id, {
      status: "error",
    });

    await createAuditLog(supabase, {
      action: "wordpress_connector_tested",
      actor_profile_id: profile.id,
      metadata: {
        message: error instanceof Error ? error.message : "Erreur inconnue",
        result: "error",
      },
      target_id: setting.id,
      target_table: "connector_settings",
    });

    redirect("/settings/connectors/wordpress?error=test_failed");
  }

  redirect(
    `/settings/connectors/wordpress?tested=1&user=${encodeURIComponent(testedUser.label)}`,
  );
}

export async function createWordPressDraftFromVariantAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  const channelVariantId = getTextValue(formData, "channel_variant_id");

  if (!profile || !ensurePublisher(profile.role)) {
    redirect(`/channel-variants/${channelVariantId ?? ""}?wordpress_error=forbidden`);
  }

  if (!channelVariantId) {
    redirect("/channel-variants?error=missing_variant");
  }

  const { config, setting, supabase } = await getWordPressConnectorConfig();

  if (!setting || setting.status === "disabled" || !isWordPressConfigReady(config)) {
    redirect(`/channel-variants/${channelVariantId}?wordpress_error=not_configured`);
  }

  const variant = await getChannelVariantById(supabase, channelVariantId);

  if (!variant) {
    redirect("/channel-variants?error=missing_variant");
  }

  if (variant.channel?.key !== "wordpress") {
    redirect(`/channel-variants/${variant.id}?wordpress_error=not_wordpress`);
  }

  if (!["ready", "scheduled"].includes(variant.status)) {
    redirect(`/channel-variants/${variant.id}?wordpress_error=invalid_status`);
  }

  let createdPost: Awaited<ReturnType<typeof createWordPressDraftPost>> | null =
    null;

  try {
    createdPost = await createWordPressDraftPost(config, {
      categories: variant.wordpressCategory?.wordpressId
        ? [variant.wordpressCategory.wordpressId]
        : [],
      content: buildWordPressContent(variant),
      excerpt: variant.excerpt,
      metaDescription: variant.seoDescription,
      seoTitle: variant.seoTitle,
      title: variant.seoTitle ?? variant.title,
    });

    await createAuditLog(supabase, {
      action: "wordpress_draft_created",
      actor_profile_id: profile.id,
      metadata: {
        wordpressPostId: createdPost.id,
        wordpressPostLink: createdPost.link,
        wordpressPostStatus: createdPost.status,
      },
      target_id: variant.id,
      target_table: "channel_variants",
    });
  } catch (error) {
    await createAuditLog(supabase, {
      action: "wordpress_draft_failed",
      actor_profile_id: profile.id,
      metadata: {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      target_id: variant.id,
      target_table: "channel_variants",
    });

    redirect(`/channel-variants/${variant.id}?wordpress_error=draft_failed`);
  }

  redirect(`/channel-variants/${variant.id}?wordpress_draft=${createdPost.id}`);
}
