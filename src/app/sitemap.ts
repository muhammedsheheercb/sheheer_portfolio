import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  return origin
    ? [{ url: origin, changeFrequency: "monthly", priority: 1 }]
    : [];
}
