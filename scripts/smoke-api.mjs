const base = process.env.API_BASE ?? "http://localhost:4000";

async function post(path, body, cookie, csrf) {
  const headers = { "content-type": "application/json" };
  if (csrf) headers["x-csrf-token"] = csrf;
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: cookie ? { ...headers, cookie } : headers,
    credentials: "include",
    body: JSON.stringify(body),
  });
  const setCookie = res.headers.getSetCookie?.() ?? [];
  const json = await res.json();
  return { status: res.status, json, setCookie };
}

async function get(path, cookie) {
  const res = await fetch(`${base}${path}`, {
    headers: cookie ? { cookie } : {},
    credentials: "include",
  });
  return { status: res.status, json: await res.json() };
}

const email = process.env.ADMIN_EMAIL ?? "admin@oasis.local";
const password = process.env.ADMIN_PASSWORD ?? "fyauWgA2bljO70-f";

let cookie = "";
const signIn = await post("/api/auth/sign-in", { email, password });
if (!signIn.json.ok) {
  console.error("Sign-in failed:", signIn.json);
  process.exit(1);
}
cookie = signIn.setCookie.map((c) => c.split(";")[0]).join("; ");
const csrf = signIn.json.data.csrfToken;
console.log("Signed in as", signIn.json.data.user.name);

const create = await post(
  "/api/exposures",
  {
    domain: "smoke-test.example",
    companyName: "Smoke Test Co",
    sector: "Testing",
    category: "open_directory",
    severity: "low",
    status: "approved",
    remediationStatus: "not_started",
    description: "Smoke test exposure",
    fullUrl: "https://smoke-test.example/public/",
    snippet: "test",
    evidenceSample: "test",
    assignedTeam: "Admin",
    internalNote: "smoke",
    companyContactEmail: "security@smoke-test.example",
    companyContactPhone: "+1 555 010 0000",
  },
  cookie,
  csrf,
);
console.log("Create exposure:", create.status, create.json.ok ? create.json.message : create.json);

const claim = await post(
  "/api/claims",
  { domain: "smoke-test.example", method: "email", contact: "owner@smoke-test.example" },
  cookie,
);
console.log("Start claim:", claim.status, claim.json.ok ? claim.json.data.token : claim.json);

process.exit(create.json.ok ? 0 : 1);
