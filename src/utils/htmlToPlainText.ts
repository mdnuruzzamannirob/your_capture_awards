const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  nbsp: ' ',
  '#39': "'",
};

// Rich text descriptions are stored as HTML. Use this where only a short text
// excerpt fits (cards) and TipTapViewer's headings and spacing would not.
export const htmlToPlainText = (html: string) =>
  html
    // Block tags separate words, inline tags can sit in the middle of one.
    .replace(/<\/?(?:p|div|h[1-6]|ul|ol|li|blockquote|pre|br|hr)\b[^>]*>/gi, ' ')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .replace(/&(amp|lt|gt|quot|nbsp|#39);/g, (_, entity: string) => HTML_ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
