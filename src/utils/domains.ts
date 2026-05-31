export function parseDomain(input: string) {
  try {
    const url = new URL(input);
    return url.hostname.toLowerCase();
  } catch {
    return input
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0];
  }
}

// Real mode requirement: do not mask domains.
export function redactDomain(domain: string) {
  return domain;
}

