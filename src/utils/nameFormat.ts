const TITLES = new Set(["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]);
const SUFFIX_RE = /^(Jr\.|Sr\.|II|III|IV|V|VI|VII|VIII|IX|X)$/;

function formatDisplayName(rawName: string): {
  display: string;
  lastKey: string;
  firstKey: string;
} {
  const cleaned = rawName.trim().replace(/\s+/g, " ");
  if (!cleaned) return { display: "", lastKey: "", firstKey: "" };

  // Tokenize on spaces (we keep punctuation like "Mrs." as part of the token).
  let tokens = cleaned.split(" ");

  let title: string | null = null;
  if (tokens.length > 0 && TITLES.has(tokens[0])) {
    title = tokens[0];
    tokens = tokens.slice(1);
  }

  let suffix: string | null = null;
  if (tokens.length > 1 && SUFFIX_RE.test(tokens[tokens.length - 1])) {
    suffix = tokens[tokens.length - 1];
    tokens = tokens.slice(0, -1);
  }

  // If we only have one token after stripping title/suffix, we can't reliably split.
  if (tokens.length === 1) {
    const only = tokens[0];
    const display = title ? `${only} (${title})` : only;
    return { display, lastKey: only.toLowerCase(), firstKey: "" };
  }

  // Treat the last token as last name; everything before it is the given name(s).
  const lastName = tokens[tokens.length - 1];
  const givenNames = tokens.slice(0, -1).join(" ");

  const lastWithSuffix = suffix ? `${lastName} ${suffix}` : lastName;
  const display = `${lastWithSuffix}, ${givenNames}${title ? ` (${title})` : ""}`;

  return {
    display,
    lastKey: lastWithSuffix.toLowerCase(),
    firstKey: givenNames.toLowerCase()
  };
}

function includesIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

export { formatDisplayName, includesIgnoreCase };
