import { describe, expect, it } from "vitest";
import {
  mapWpOptionsToByKey,
  mapWpPageMeta,
  mapWpPageSections,
  mapWpPostToBlogPost,
} from "@/integrations/wordpress/mappers";
import type { WpPage, WpPost, WpRawSection } from "@/integrations/wordpress/types";

describe("mapWpPageSections", () => {
  const cases: { fieldGroupName: string; expectedType: string; raw: WpRawSection }[] = [
    { fieldGroupName: "Page_PageSections_Sections_Hero", expectedType: "hero", raw: { fieldGroupName: "", headline: "Move Heavy", image: { sourceUrl: "https://example.com/hero.jpg" } } },
    { fieldGroupName: "Page_PageSections_Sections_Cta", expectedType: "cta", raw: { fieldGroupName: "", headline: "Get a quote" } },
    { fieldGroupName: "Page_PageSections_Sections_Faq", expectedType: "faq", raw: { fieldGroupName: "", items: [{ q: "Q1", a: "A1" }] } },
    { fieldGroupName: "Page_PageSections_Sections_Reviews", expectedType: "reviews", raw: { fieldGroupName: "", items: [{ quote: "Great!", author: "Jane", company: "Acme", rating: 5 }] } },
    { fieldGroupName: "Page_PageSections_Sections_Services", expectedType: "services", raw: { fieldGroupName: "", items: [{ title: "Hauling", description: "desc", href: "/services", icon: "Truck" }] } },
    { fieldGroupName: "Page_PageSections_Sections_Stats", expectedType: "stats", raw: { fieldGroupName: "", items: [{ value: "50", label: "States" }] } },
    { fieldGroupName: "Page_PageSections_Sections_Gallery", expectedType: "gallery", raw: { fieldGroupName: "", items: [{ src: { sourceUrl: "https://example.com/g1.jpg" }, alt: "alt", caption: "cap" }] } },
    { fieldGroupName: "Page_PageSections_Sections_RichText", expectedType: "rich_text", raw: { fieldGroupName: "", html: "<p>Hi</p>" } },
    { fieldGroupName: "Page_PageSections_Sections_ImageBlock", expectedType: "image_block", raw: { fieldGroupName: "", src: { sourceUrl: "https://example.com/img.jpg" }, alt: "alt" } },
    { fieldGroupName: "Page_PageSections_Sections_VideoBlock", expectedType: "video_block", raw: { fieldGroupName: "", url: "https://youtube.com/watch?v=1", poster: { sourceUrl: "https://example.com/poster.jpg" } } },
    { fieldGroupName: "Page_PageSections_Sections_Features", expectedType: "features", raw: { fieldGroupName: "", items: [{ icon: "Check", title: "Fast", description: "desc" }] } },
    { fieldGroupName: "Page_PageSections_Sections_CustomHtml", expectedType: "custom_html", raw: { fieldGroupName: "", html: "<div>raw</div>" } },
  ];

  it.each(cases)("maps $fieldGroupName to type $expectedType", ({ fieldGroupName, expectedType, raw }) => {
    const [mapped] = mapWpPageSections([{ ...raw, fieldGroupName, enabled: true }]);
    expect(mapped.type).toBe(expectedType);
    expect(mapped.enabled).toBe(true);
  });

  it("normalizes the legacy 'testimonials' alias to 'reviews'", () => {
    const [mapped] = mapWpPageSections([
      { fieldGroupName: "Page_PageSections_Sections_Testimonials", enabled: true, items: [] },
    ]);
    expect(mapped.type).toBe("reviews");
  });

  it("flattens image fields from {sourceUrl} objects to plain URL strings", () => {
    const [mapped] = mapWpPageSections([
      { fieldGroupName: "Page_PageSections_Sections_Hero", enabled: true, headline: "x", image: { sourceUrl: "https://example.com/a.jpg" } },
    ]);
    expect(mapped.data.image).toBe("https://example.com/a.jpg");
  });

  it("carries per-block style through to data.style", () => {
    const [mapped] = mapWpPageSections([
      {
        fieldGroupName: "Page_PageSections_Sections_Cta",
        enabled: true,
        headline: "x",
        style: { color: "#fff", font_weight: "700" },
      },
    ]);
    expect(mapped.data.style).toEqual({ color: "#fff", fontWeight: "700" });
  });

  it("filters out disabled sections", () => {
    const mapped = mapWpPageSections([
      { fieldGroupName: "Page_PageSections_Sections_Cta", enabled: false, headline: "hidden" },
      { fieldGroupName: "Page_PageSections_Sections_Cta", enabled: true, headline: "shown" },
    ]);
    expect(mapped).toHaveLength(1);
    expect(mapped[0].data.headline).toBe("shown");
  });

  it("returns an empty array for null/undefined input", () => {
    expect(mapWpPageSections(null)).toEqual([]);
    expect(mapWpPageSections(undefined)).toEqual([]);
  });
});

describe("mapWpPageMeta", () => {
  it("maps Yoast SEO fields into the {title, description, og_image} shape CmsCatchAll expects", () => {
    const page: WpPage = {
      id: "1",
      slug: "about",
      title: "About Us",
      seo: {
        title: "About | Heavy Haul Group",
        metaDesc: "Learn about us",
        opengraphImage: { sourceUrl: "https://example.com/og.jpg" },
      },
    };
    const meta = mapWpPageMeta(page);
    expect(meta.seo).toEqual({
      title: "About | Heavy Haul Group",
      description: "Learn about us",
      og_image: "https://example.com/og.jpg",
    });
  });
});

describe("mapWpOptionsToByKey", () => {
  it("flattens repeater rows into a flat page_key.block_key map", () => {
    const { byKey } = mapWpOptionsToByKey("home", [
      { block_key: "hero_headline", content: "Heavy Haul & Oversize" },
      { block_key: "hero_subtitle", content: "Nationwide transport" },
    ]);
    expect(byKey).toEqual({
      "home.hero_headline": "Heavy Haul & Oversize",
      "home.hero_subtitle": "Nationwide transport",
    });
  });

  it("maps per-row style into a parallel styleByKey map keyed the same way", () => {
    const { styleByKey } = mapWpOptionsToByKey("home", [
      { block_key: "hero_headline", content: "x", style: { color: "#f00" } },
    ]);
    expect(styleByKey["home.hero_headline"]).toEqual({ color: "#f00" });
  });

  it("returns empty maps for null/undefined items", () => {
    expect(mapWpOptionsToByKey("home", null)).toEqual({ byKey: {}, styleByKey: {} });
  });
});

describe("mapWpPostToBlogPost", () => {
  it("maps Yoast fields onto the legacy blog_posts SEO column names", () => {
    const post: WpPost = {
      id: "1",
      slug: "oversize-load-permits-101",
      title: "Oversize Load Permits 101",
      excerpt: "A guide",
      content: "<p>Body</p>",
      date: "2026-05-28T00:00:00",
      featuredImage: { node: { sourceUrl: "https://example.com/hero.jpg" } },
      author: { node: { name: "Jane Doe" } },
      seo: {
        title: "SEO Title",
        metaDesc: "SEO description",
        opengraphImage: { sourceUrl: "https://example.com/og.jpg" },
        metaRobotsNoindex: "noindex",
      },
    };
    const mapped = mapWpPostToBlogPost(post);
    expect(mapped).toMatchObject({
      title: "Oversize Load Permits 101",
      author_name: "Jane Doe",
      featured_image: "https://example.com/hero.jpg",
      seo_title: "SEO Title",
      seo_description: "SEO description",
      og_image: "https://example.com/og.jpg",
      no_index: true,
    });
  });

  it("returns null for null input", () => {
    expect(mapWpPostToBlogPost(null)).toBeNull();
  });
});
