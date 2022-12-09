import Markdoc from "@markdoc/markdoc";

export default async function markdownToHtml(markdown: string) {
  const ast = Markdoc.parse(markdown);
  const content = Markdoc.transform(ast /* config */);

  const html = Markdoc.renderers.html(content);
  return html;
}
