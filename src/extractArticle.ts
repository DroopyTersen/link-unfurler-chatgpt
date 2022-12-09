import { extract } from "@extractus/article-extractor";

export const extractArticle = async (url: string) => {
  const { extract } = await import("@extractus/article-extractor");
  const result = await extract(url);
  return result;
};
