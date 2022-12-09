export const convertHtmlToText = async (html: string): Promise<string> => {
  // async import htmlToText from "html-to-text"
  const { htmlToText } = await import("html-to-text");

  if (!html) return "";

  let text = htmlToText(html, {
    ignoreImage: true,
    wordwrap: false, // defaults to 80 chars
    selectors: [
      {
        selector: "a",
        format: "anchor",
        options: { ignoreHref: true, hideLinkHrefIfSameAsText: true },
      },
      { selector: "img", format: "skip", options: null },
      { selector: "td", format: "inline" },
      { selector: `[style*="display:none"]`, format: "skip" },
      { selector: `[style*="visiblity:hidden"]`, format: "skip" },
    ],
  })
    .replace(/\n[\n|\s]+/g, "\n\n")
    .replace(/<>|�/g, "");

  return (text || "").trim();
};
