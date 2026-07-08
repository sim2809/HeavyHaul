import { useQuery } from "@tanstack/react-query";
import { wpFetch } from "./client";
import {
  GET_MENU_BY_LOCATION,
  GET_PAGE_BY_URI,
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_THEME_SETTINGS,
  buildOptionsPageQuery,
} from "./queries";
import {
  mapWpMenuItemsToNavItems,
  mapWpOptionsToByKey,
  mapWpPageMeta,
  mapWpPageSections,
  mapWpPostToBlogPost,
  mapWpPostsListToBlogList,
  mapWpThemeSettingsToAnalyticsSettings,
  mapWpThemeSettingsToSiteSettings,
} from "./mappers";
import type {
  WpMenu,
  WpOptionsContentBlockRaw,
  WpPage,
  WpPost,
  WpThemeSettingsRaw,
} from "./types";

export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: ["wp", "page", slug],
    queryFn: async () => {
      const uri = slug === "home" ? "/" : `/${slug}/`;
      const data = await wpFetch<{ pageBy: WpPage | null }>(GET_PAGE_BY_URI, { uri });
      if (!data.pageBy) return null;
      return {
        meta: mapWpPageMeta(data.pageBy),
        sections: mapWpPageSections(data.pageBy.pageSections?.sections),
      };
    },
  });
}

export function useOptionsPage(pageKey: string) {
  return useQuery({
    queryKey: ["wp", "options", pageKey],
    queryFn: async () => {
      const rootField = `acfOptionsSiteContent${pageKey[0].toUpperCase()}${pageKey.slice(1)}`;
      const data = await wpFetch<Record<string, { items: WpOptionsContentBlockRaw[] } | null>>(
        buildOptionsPageQuery(pageKey)
      );
      return mapWpOptionsToByKey(pageKey, data[rootField]?.items);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useThemeSettings() {
  return useQuery({
    queryKey: ["wp", "theme-settings"],
    queryFn: async () => {
      const data = await wpFetch<{ acfOptionsThemeSettings: WpThemeSettingsRaw | null }>(
        GET_THEME_SETTINGS
      );
      return {
        settings: mapWpThemeSettingsToSiteSettings(data.acfOptionsThemeSettings),
        analytics: mapWpThemeSettingsToAnalyticsSettings(data.acfOptionsThemeSettings),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePosts() {
  return useQuery({
    queryKey: ["wp", "posts"],
    queryFn: async () => {
      const data = await wpFetch<{ posts: { nodes: WpPost[] } }>(GET_POSTS);
      return mapWpPostsListToBlogList(data.posts.nodes);
    },
  });
}

export function usePostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["wp", "post", slug],
    queryFn: async () => {
      const data = await wpFetch<{ post: WpPost | null }>(GET_POST_BY_SLUG, { slug });
      return mapWpPostToBlogPost(data.post);
    },
    enabled: !!slug,
  });
}

export function useNavMenu(location: string) {
  return useQuery({
    queryKey: ["wp", "menu", location],
    queryFn: async () => {
      const data = await wpFetch<{ menus: WpMenu }>(GET_MENU_BY_LOCATION, {
        location: [location.toUpperCase()],
      });
      return mapWpMenuItemsToNavItems(data.menus);
    },
    staleTime: 5 * 60 * 1000,
  });
}
