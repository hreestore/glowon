import { Markdown } from "@/components/markdown";

// ----------------------------------------------------------------------

// Text pasted from Google Docs/Word into the admin editor arrives with &nbsp;
// between every word, which stops the browser wrapping lines at spaces.
function normalizeSpaces(html) {
  return html.replace(/&nbsp;|&#160;| /g, ' ');
}

const LEADING_TAGS = '((?:\\s*<[^>]+>)*)\\s*';
const BULLET_RE = new RegExp(`^${LEADING_TAGS}[-•*–]\\s+`);
const NUMBER_RE = new RegExp(`^${LEADING_TAGS}\\d+[.)]\\s+`);

// Admins type "- item" / "1. item" as plain paragraphs. Turn each run of
// such paragraphs into a real <ul>/<ol> so they render as bullet points.
function paragraphsToLists(html) {
  const paragraphRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let out = '';
  let cursor = 0;
  let openList = null;

  const closeList = () => {
    if (openList) out += `</${openList}>`;
    openList = null;
  };

  for (const match of html.matchAll(paragraphRe)) {
    const [whole, inner] = match;
    const between = html.slice(cursor, match.index);
    const type = BULLET_RE.test(inner) ? 'ul' : NUMBER_RE.test(inner) ? 'ol' : null;

    // Only whitespace between list paragraphs keeps the list going
    if (openList && (type !== openList || between.trim())) closeList();
    out += between;

    if (type) {
      if (!openList) {
        out += `<${type}>`;
        openList = type;
      }
      out += `<li>${inner.replace(type === 'ul' ? BULLET_RE : NUMBER_RE, '$1')}</li>`;
    } else {
      out += whole;
    }
    cursor = match.index + whole.length;
  }

  const rest = html.slice(cursor);
  if (openList && rest.trim()) closeList();
  out += rest;
  closeList();

  return out;
}

export function ProductDetailsDescription({ description, className = '' }) {
  const raw = paragraphsToLists(normalizeSpaces(`${description ?? ''}`));
  const hasContent =
    /<(img|iframe|video|table)\b/i.test(raw) ||
    !!raw.replace(/<[^>]*>/g, '').trim();

  if (!hasContent) {
    return (
      <p className="py-6 text-center text-sm text-gray-500">
        No description available for this product.
      </p>
    );
  }

  return (
    <Markdown
      children={raw}
      className={`product-description p-0 ${className} text-justify`}
    />
  );
}
