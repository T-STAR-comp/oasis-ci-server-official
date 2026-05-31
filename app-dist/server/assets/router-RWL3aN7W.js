import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouterState, useNavigate, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, Outlet, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useRef, useEffect, useMemo, createContext, useContext } from "react";
import { Bell, Shield, Search, LogOut, LogIn, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const appCss = "/assets/styles-BhP2GTK5.css";
function LoadingOverlay({
  open,
  message = "Please wait..."
}) {
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-[100] grid place-items-center bg-background/80 px-6 backdrop-blur-sm",
      role: "status",
      "aria-live": "polite",
      "aria-busy": "true",
      children: /* @__PURE__ */ jsxs("div", { className: "panel flex max-w-sm flex-col items-center px-8 py-10 text-center shadow-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-foreground", children: message }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "This may take a few seconds." })
      ] })
    }
  );
}
const apiRoutes = {
  bootstrap: "/api/bootstrap",
  session: "/api/session",
  signIn: "/api/auth/sign-in",
  profile: "/api/auth/profile",
  signOut: "/api/auth/sign-out",
  claims: "/api/claims",
  verifyClaim: "/api/claims/verify",
  exposures: "/api/exposures",
  rescan: (exposureId) => `/api/exposures/${exposureId}/rescan`,
  submissions: "/api/submissions",
  reviewSubmission: "/api/submissions/review",
  flags: "/api/flags",
  resolveFlag: "/api/flags/resolve",
  users: "/api/users"
};
const apiBaseUrl = "http://localhost:4000".replace(/\/$/, "");
function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}
function buildFetchInit(method, init, body) {
  const { headers: initHeaders, method: _method, body: _body, ...rest } = init ?? {};
  return {
    ...rest,
    method,
    credentials: "include",
    headers: {
      ...method === "POST" ? { "content-type": "application/json" } : {},
      ...initHeaders ?? {}
    },
    ...body !== void 0 ? { body } : {}
  };
}
async function postJson(url, input, init) {
  const response = await fetch(
    apiUrl(url),
    buildFetchInit("POST", init, JSON.stringify(input))
  );
  return parseApiResponse(response);
}
async function getJson(url, init) {
  const response = await fetch(apiUrl(url), buildFetchInit("GET", init));
  return parseApiResponse(response);
}
async function parseApiResponse(response) {
  const payload = await response.json().catch(() => null);
  if (payload && typeof payload === "object" && "ok" in payload) {
    return payload;
  }
  if (!response.ok) {
    return {
      ok: false,
      message: `Request failed with HTTP ${response.status}.`
    };
  }
  return {
    ok: true,
    data: payload
  };
}
const emptyState = {
  currentUserId: null,
  publicSearch: "",
  platform: {
    remediationEmail: "remediation@oasisci.com",
    remediationPhone: "",
    policiesVersion: "2026.1",
    policiesEffectiveDate: "2026-01-01",
    policiesTitle: "Oasis CI Cybersecurity Investigation Policies"
  },
  users: [],
  domains: [],
  exposures: [],
  submissions: [],
  flags: [],
  claims: [],
  notifications: [],
  auditLog: [],
  analytics: []
};
const AppContext = createContext(null);
function AppProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [csrfToken, setCsrfToken] = useState();
  const csrfRef = useRef(void 0);
  const [publicSearch, setPublicSearchValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("Please wait...");
  function applyCsrfToken(token) {
    csrfRef.current = token;
    setCsrfToken(token);
  }
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getJson(apiRoutes.bootstrap),
      getJson(apiRoutes.session)
    ]).then(([bootstrap, session]) => {
      if (cancelled) return;
      if (bootstrap.ok) {
        setState({ ...bootstrap.data, publicSearch });
      }
      if (session.ok) {
        setCurrentUser(session.data.user);
        applyCsrfToken(session.data.csrfToken);
      }
    }).finally(() => {
      if (!cancelled) setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const stateWithUiSearch = useMemo(
    () => ({ ...state, currentUserId: currentUser?.id ?? null, publicSearch }),
    [currentUser?.id, publicSearch, state]
  );
  function serverHeaders() {
    if (!csrfRef.current) return void 0;
    return { "x-csrf-token": csrfRef.current };
  }
  async function refreshFromServer() {
    const [bootstrap, session] = await Promise.all([
      getJson(apiRoutes.bootstrap),
      getJson(apiRoutes.session)
    ]);
    if (bootstrap.ok) {
      setState({ ...bootstrap.data, publicSearch });
    }
    if (session.ok) {
      setCurrentUser(session.data.user);
      applyCsrfToken(session.data.csrfToken);
    }
  }
  async function ensureCsrfToken() {
    if (csrfRef.current) return csrfRef.current;
    const session = await getJson(apiRoutes.session);
    if (session.ok && session.data.csrfToken) {
      applyCsrfToken(session.data.csrfToken);
      return session.data.csrfToken;
    }
    return void 0;
  }
  async function runWithLoading(message, action) {
    setPendingMessage(message);
    setIsPending(true);
    try {
      return await action();
    } finally {
      setIsPending(false);
    }
  }
  async function mutate(request, fallbackMessage, loadingMessage = fallbackMessage) {
    return runWithLoading(loadingMessage, async () => {
      if (currentUser && !await ensureCsrfToken()) {
        return { ok: false, message: "Your session expired. Sign in again and retry." };
      }
      const result = await request().catch((error) => ({
        ok: false,
        message: error instanceof Error ? error.message : fallbackMessage
      }));
      if (result.ok) {
        await refreshFromServer();
        return { ok: true, message: result.message ?? fallbackMessage };
      }
      return { ok: false, message: result.message };
    });
  }
  async function signIn(email, password) {
    return runWithLoading("Signing in...", async () => {
      const result = await postJson(apiRoutes.signIn, { email, password });
      if (result.ok) {
        setCurrentUser(result.data.user);
        applyCsrfToken(result.data.csrfToken);
        await refreshFromServer();
        return { ok: true, message: result.message ?? `Signed in as ${result.data.user?.name ?? email}.` };
      }
      return { ok: false, message: result.message };
    });
  }
  async function signInAs(userId) {
    const user = stateWithUiSearch.users.find((candidate) => candidate.id === userId);
    if (!user) return { ok: false, message: "That account is not available from the server." };
    return { ok: false, message: "Enter that account's password to sign in." };
  }
  async function updateAccount(input) {
    return runWithLoading("Saving account...", async () => {
      const result = await postJson(
        apiRoutes.profile,
        input,
        { headers: serverHeaders() }
      );
      if (result.ok) {
        setCurrentUser(result.data.user);
        applyCsrfToken(result.data.csrfToken);
        await refreshFromServer();
        return { ok: true, message: result.message ?? "Account updated." };
      }
      return { ok: false, message: result.message };
    });
  }
  async function signOut() {
    return runWithLoading("Signing out...", async () => {
      await postJson(
        apiRoutes.signOut,
        {},
        { headers: serverHeaders() }
      );
      setCurrentUser(null);
      await refreshFromServer();
    });
  }
  async function resetDemo() {
    return runWithLoading("Resetting platform...", async () => {
      await postJson(
        "/api/admin/reset",
        {},
        { headers: serverHeaders() }
      );
      await refreshFromServer();
    });
  }
  function setPublicSearch(value2) {
    setPublicSearchValue(value2);
  }
  async function startClaim(input) {
    return runWithLoading("Sending verification code...", async () => {
      const result = await postJson(apiRoutes.claims, input);
      if (!result.ok) return null;
      await refreshFromServer();
      return result.data;
    });
  }
  async function acceptPolicies(version) {
    return runWithLoading("Recording policy acceptance...", async () => {
      if (!await ensureCsrfToken()) {
        return { ok: false, message: "Your session expired. Sign in again and retry." };
      }
      const result = await postJson(
        "/api/policies/accept",
        { version, acknowledged: true },
        { headers: serverHeaders() }
      );
      if (result.ok) {
        setCurrentUser(result.data.user);
        applyCsrfToken(result.data.csrfToken);
        await refreshFromServer();
        return { ok: true, message: result.message ?? "Policies accepted." };
      }
      return { ok: false, message: result.message };
    });
  }
  async function verifyClaim(input) {
    return runWithLoading("Verifying ownership...", async () => {
      const result = await postJson(apiRoutes.verifyClaim, input);
      if (result.ok) {
        setCurrentUser(result.data.user);
        applyCsrfToken(result.data.csrfToken);
        await refreshFromServer();
        return { ok: true, message: result.message ?? "Ownership verified." };
      }
      return { ok: false, message: result.message };
    });
  }
  const value = {
    state: stateWithUiSearch,
    currentUser,
    isHydrated,
    signIn,
    signInAs,
    updateAccount,
    signOut,
    resetDemo,
    setPublicSearch,
    startClaim,
    verifyClaim,
    updateExposure: (input) => mutate(
      () => postJson(apiRoutes.exposures, input, { headers: serverHeaders() }),
      "Exposure updated."
    ),
    requestRescan: (exposureId) => mutate(
      () => postJson(apiRoutes.rescan(exposureId), {}, { headers: serverHeaders() }),
      "A new scan was queued."
    ),
    submitFinding: (input) => mutate(
      () => postJson(apiRoutes.submissions, input, { headers: serverHeaders() }),
      "Finding submitted for review.",
      "Submitting finding for review..."
    ),
    reviewSubmission: (input) => mutate(
      () => postJson(apiRoutes.reviewSubmission, input, { headers: serverHeaders() }),
      "Submission review saved."
    ),
    resolveFlag: (flagId, status) => mutate(
      () => postJson(apiRoutes.resolveFlag, { flagId, status }, { headers: serverHeaders() }),
      "Flag updated."
    ),
    flagExposure: (exposureId, reason, options) => mutate(
      () => postJson(
        apiRoutes.flags,
        {
          exposureId,
          reason,
          flagType: options?.flagType,
          title: options?.title
        },
        { headers: serverHeaders() }
      ),
      "The flag has been added to the moderator queue."
    ),
    updateUserAccess: (input) => mutate(
      () => postJson(apiRoutes.users, input, { headers: serverHeaders() }),
      "User access updated."
    ),
    deleteUser: (userId) => mutate(
      () => postJson("/api/users/delete", { userId }, { headers: serverHeaders() }),
      "User deleted."
    ),
    addExposure: (input) => mutate(
      () => postJson(apiRoutes.exposures, input, { headers: serverHeaders() }),
      "Exposure created."
    ),
    editExposure: (input) => mutate(
      () => postJson(apiRoutes.exposures, input, { headers: serverHeaders() }),
      "Exposure updated."
    ),
    deleteExposure: (exposureId) => mutate(
      () => postJson(`/api/exposures/${exposureId}/delete`, {}, { headers: serverHeaders() }),
      "Exposure deleted."
    ),
    requestResearcherAccount: (input) => mutate(
      () => postJson("/api/researcher-accounts", input),
      "Researcher account sent to moderators for verification."
    ),
    createModeratorAccount: (input) => mutate(
      () => postJson("/api/moderators", input, { headers: serverHeaders() }),
      "Moderator account created."
    ),
    verifyExposureRemoval: (exposureId) => mutate(
      () => postJson(
        `/api/exposures/${exposureId}/verify-removal`,
        {},
        { headers: serverHeaders() }
      ),
      "Exposure verified and archived."
    ),
    removeDomainFromDirectory: (domain) => mutate(
      () => postJson("/api/domains/remove", { domain }, { headers: serverHeaders() }),
      "Domain removed."
    ),
    denyExposureFix: (exposureId, moderatorNote) => mutate(
      () => postJson(
        `/api/exposures/${exposureId}/deny-fix`,
        { moderatorNote },
        { headers: serverHeaders() }
      ),
      "Fix declined. Owner notified.",
      "Declining fix and notifying owner..."
    ),
    reverseExposureVerification: (exposureId, moderatorNote) => mutate(
      () => postJson(
        `/api/exposures/${exposureId}/reverse-verification`,
        { moderatorNote },
        { headers: serverHeaders() }
      ),
      "Verification reversed.",
      "Reversing verification..."
    ),
    markNotificationsRead: (notificationIds, markAll) => mutate(
      () => postJson(
        "/api/notifications/mark-read",
        { notificationIds, markAll },
        { headers: serverHeaders() }
      ),
      "Notifications updated."
    ),
    acceptPolicies,
    updatePlatformSettings: (input) => mutate(
      () => postJson("/api/admin/platform-settings", input, { headers: serverHeaders() }),
      "Remediation contact updated."
    ),
    isPending,
    pendingMessage
  };
  return /* @__PURE__ */ jsxs(AppContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx(LoadingOverlay, { open: isPending, message: pendingMessage })
  ] });
}
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider.");
  }
  return context;
}
function hasAnyRole(role, allowed) {
  return role != null && allowed.includes(role);
}
const categoryMeta = {
  sensitive_data: { label: "Sensitive Data", color: "var(--color-severity-critical)" },
  open_directory: { label: "Open Directory", color: "var(--color-severity-medium)" },
  admin_panel: { label: "Admin Panel", color: "var(--color-severity-high)" },
  backup_config: { label: "Backup / Config", color: "var(--color-chart-4)" }
};
const severityMeta = {
  critical: { label: "Critical", color: "var(--color-severity-critical)" },
  high: { label: "High", color: "var(--color-severity-high)" },
  medium: { label: "Medium", color: "var(--color-severity-medium)" },
  low: { label: "Low", color: "var(--color-severity-low)" },
  info: { label: "Info", color: "var(--color-severity-info)" }
};
const roleMeta = {
  owner: {
    label: "Owner",
    color: "var(--color-primary)",
    description: "Claim domains, unlock full evidence, and track remediation."
  },
  pen_tester: {
    label: "Pen Tester",
    color: "var(--color-chart-2)",
    description: "Submit findings, request re-scans, and monitor moderation feedback."
  },
  moderator: {
    label: "Moderator",
    color: "var(--color-chart-3)",
    description: "Review submissions, triage flags, and maintain listing quality."
  },
  admin: {
    label: "System Admin",
    color: "var(--color-chart-5)",
    description: "Manage platform roles, schedules, and global overrides."
  }
};
const rolePermissions = {
  owner: [
    "View full evidence",
    "Update remediation status",
    "Request re-scan",
    "Flag false positives"
  ],
  pen_tester: [
    "Submit new findings",
    "Edit pending submissions",
    "Request re-scan",
    "View researcher analytics"
  ],
  moderator: [
    "Approve or reject submissions",
    "Resolve flags",
    "Assign tester roles",
    "View audit activity"
  ],
  admin: [
    "Full exposure override",
    "Manage user roles",
    "Adjust review queues",
    "View full system audit"
  ]
};
const severityOrder = ["critical", "high", "medium", "low", "info"];
const dayMs = 24 * 60 * 60 * 1e3;
function formatShortDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
function formatFullDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function daysBetween(from, to = (/* @__PURE__ */ new Date()).toISOString()) {
  const delta = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(0, Math.round(delta / dayMs));
}
function isExposureVisibleToPublic(exposure) {
  return exposure.status === "approved";
}
function getExposurePublicTitle(exposure) {
  return exposure.loginTitle?.trim() || categoryMeta[exposure.category].label;
}
function isExposureLockedForOwner(exposure) {
  return exposure.removalReviewStatus === "verified_removed";
}
function isDomainClaimed(domains, domain, currentUserId) {
  const record = domains.find((entry) => entry.domain === domain);
  if (!record || record.verificationStatus !== "verified" || !record.ownerUserId) return false;
  if (currentUserId && record.ownerUserId === currentUserId) return false;
  return true;
}
function sortBySeverity(exposures) {
  return [...exposures].sort((left, right) => {
    const severityDelta = severityOrder.indexOf(left.severity) - severityOrder.indexOf(right.severity);
    if (severityDelta !== 0) return severityDelta;
    return new Date(right.lastSeen).getTime() - new Date(left.lastSeen).getTime();
  });
}
function NotificationCenter() {
  const { state, currentUser, markNotificationsRead } = useAppContext();
  const [open, setOpen] = useState(false);
  if (!currentUser) return null;
  const mine = (state.notifications ?? []).filter((item) => item.userId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unread = mine.filter((item) => !item.read).length;
  async function openPanel() {
    setOpen((value) => !value);
    const unreadIds = mine.filter((item) => !item.read).map((item) => item.id);
    if (unreadIds.length > 0) {
      await markNotificationsRead(unreadIds);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: openPanel,
        className: "relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground hover:text-foreground",
        "aria-label": "Notifications",
        children: [
          /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
          unread > 0 ? /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground", children: unread > 9 ? "9+" : unread }) : null
        ]
      }
    ),
    open ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "fixed inset-0 z-40",
          "aria-label": "Close notifications",
          onClick: () => setOpen(false)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,380px)] rounded-lg border border-border bg-card shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/70 px-4 py-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Notifications" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: unread > 0 ? `${unread} unread` : "All caught up" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto", children: mine.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-4 py-8 text-center text-sm text-muted-foreground", children: "No notifications yet." }) : mine.slice(0, 20).map((item) => /* @__PURE__ */ jsx(NotificationRow, { item }, item.id)) })
      ] })
    ] }) : null
  ] });
}
function NotificationRow({ item }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `border-b border-border/50 px-4 py-3 ${item.read ? "opacity-75" : "bg-primary/5"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: item.title }),
          /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px] text-muted-foreground", children: formatShortDate(item.createdAt) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-muted-foreground", children: item.message }),
        item.domain ? /* @__PURE__ */ jsxs("p", { className: "mt-2 mono text-[10px] uppercase tracking-[0.18em] text-primary", children: [
          item.domain,
          item.exposureId ? ` • ${item.exposureId}` : ""
        ] }) : null
      ]
    }
  );
}
function RoleBadge({ role }) {
  const meta = roleMeta[role];
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "inline-flex items-center rounded-full border px-2 py-0.5 mono text-[10px] uppercase tracking-[0.22em]",
      style: {
        color: meta.color,
        borderColor: `color-mix(in oklab, ${meta.color} 35%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${meta.color} 12%, transparent)`
      },
      children: meta.label
    }
  );
}
const PEN_TESTER_DISABLED_MESSAGE = "Pen tester accounts and submissions are not available on this platform right now.";
function penTesterMutedClass(disabled = true) {
  return disabled ? "pointer-events-none opacity-40 saturate-50 select-none" : "";
}
function PenTesterUnavailableBanner({ className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded-md border border-border/80 bg-muted/30 px-4 py-3 text-sm text-muted-foreground ${className}`,
      role: "status",
      children: PEN_TESTER_DISABLED_MESSAGE
    }
  );
}
function PenTesterDisabledShell({
  title,
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl px-6 py-16", children: /* @__PURE__ */ jsxs("div", { className: "panel p-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Unavailable" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground", children: PEN_TESTER_DISABLED_MESSAGE }),
    children
  ] }) });
}
const nav = [
  { to: "/", label: "Overview" },
  { to: "/exposures", label: "Exposures" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/submit", label: "Submit" },
  { to: "/ethics", label: "Ethics" }
];
function SiteHeader() {
  const { state, currentUser, setPublicSearch, signOut } = useAppContext();
  const path = useRouterState({ select: (router2) => router2.location.pathname });
  const navigate = useNavigate();
  const [query, setQuery] = useState(state.publicSearch);
  useEffect(() => {
    setQuery(state.publicSearch);
  }, [state.publicSearch]);
  function handleSearchSubmit(event) {
    event.preventDefault();
    setPublicSearch(query);
    navigate({ to: "/exposures" });
  }
  const actionButtonClass = "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55";
  const quietButtonClass = `${actionButtonClass} border border-border bg-card/80 text-muted-foreground hover:bg-accent hover:text-foreground`;
  const primaryButtonClass = `${actionButtonClass} bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90`;
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center gap-4 px-6 py-3", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/",
        className: "flex min-w-0 items-center gap-3 rounded-md pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
        children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-md border border-primary/25 bg-primary/8", children: /* @__PURE__ */ jsx(Shield, { className: "h-4.5 w-4.5 text-primary", strokeWidth: 2.4 }) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden min-w-0 sm:block", children: [
            /* @__PURE__ */ jsx("div", { className: "display-font text-base font-semibold tracking-tight", children: "Oasis CI" }),
            /* @__PURE__ */ jsx("div", { className: "mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Cybersecurity investigations" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("nav", { className: "hidden items-center gap-1 lg:flex", children: nav.map((item) => {
      const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
      const disabled = item.to === "/submit";
      if (disabled) {
        return /* @__PURE__ */ jsx(
          "span",
          {
            title: "Pen tester submissions are not available",
            className: `inline-flex h-9 cursor-not-allowed items-center rounded-md px-3 text-sm font-medium ${penTesterMutedClass()}`,
            children: item.label
          },
          item.to
        );
      }
      return /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          className: `inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 ${active ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`,
          children: item.label
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSearchSubmit,
        className: "ml-auto hidden h-10 w-full max-w-sm items-center gap-2 rounded-md border border-border bg-card/75 px-3 md:flex",
        children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: query,
              onChange: (event) => setQuery(event.target.value),
              placeholder: "Lookup a domain, path, or exposure ID",
              className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
      currentUser ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NotificationCenter, {}),
        /* @__PURE__ */ jsxs("div", { className: "hidden h-10 items-center gap-2 rounded-md border border-border bg-card/80 px-3 md:flex", children: [
          /* @__PURE__ */ jsx(RoleBadge, { role: currentUser.role }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium leading-none", children: currentUser.name }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: currentUser.company })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: signOut, className: quietButtonClass, children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Sign out" })
        ] })
      ] }) : null,
      /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: primaryButtonClass, children: [
        !currentUser ? /* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4" }) : null,
        currentUser ? "Open workspace" : "Sign in"
      ] })
    ] })
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsx("footer", { className: "mt-20 border-t border-border/70 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl border border-primary/25 bg-primary/8", children: /* @__PURE__ */ jsx(Shield, { className: "h-4.5 w-4.5 text-primary", strokeWidth: 2.4 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "display-font text-lg font-semibold", children: "Oasis CI" }),
            /* @__PURE__ */ jsx("div", { className: "mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Responsible discovery platform" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-sm text-sm leading-6 text-muted-foreground", children: "Oasis CI helps owners discover exposed internet assets, privately review the evidence, and drive remediation without public shaming or exploit guidance." }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 inline-flex items-center rounded-full border border-border bg-card/80 px-3 py-2 text-xs text-muted-foreground", children: "POWERED BY OASIS" })
      ] }),
      /* @__PURE__ */ jsx(
        FooterColumn,
        {
          title: "Platform",
          items: [
            { to: "/exposures", label: "Public exposures" },
            { to: "/dashboard", label: "Owner dashboard" },
            { to: "/submit", label: "Researcher submission", disabled: true }
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        FooterColumn,
        {
          title: "Trust",
          items: [
            { href: "/ethics#policies-outline", label: "Platform policies" },
            { to: "/ethics", label: "Ethical pledge" },
            { href: "mailto:owners@oasisci.com", label: "Owner support" }
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        FooterColumn,
        {
          title: "Contact",
          items: [
            { href: "mailto:security@oasisci.com", label: "security.txt" },
            { href: "mailto:moderation@oasisci.com", label: "Moderation desk" },
            { href: "mailto:research@oasisci.com", label: "Researcher ops", disabled: true }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Copyright ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Oasis CI. POWERED BY OASIS"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "mono uppercase tracking-[0.22em]", children: "Built to protect, not to expose" })
    ] })
  ] }) });
}
function FooterColumn({
  title,
  items
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h4", { className: "mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: items.map((item) => {
      const className = `block text-sm transition-colors ${item.disabled ? `${penTesterMutedClass()} cursor-not-allowed text-muted-foreground` : "text-foreground/85 hover:text-primary"}`;
      if (item.disabled) {
        return /* @__PURE__ */ jsx("span", { className, title: "Not available", children: item.label }, `${title}-${item.label}`);
      }
      if (item.to) {
        return /* @__PURE__ */ jsx(Link, { to: item.to, className, children: item.label }, `${title}-${item.label}`);
      }
      return /* @__PURE__ */ jsx("a", { href: item.href, className, children: item.label }, `${title}-${item.label}`);
    }) })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[70vh] items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "mono text-xs uppercase tracking-[0.3em] text-primary", children: "Error 404" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-4 display-font text-4xl font-semibold tracking-tight", children: "Signal lost." }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This route was never indexed by the current workspace." }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Return to overview"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[70vh] items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "display-font text-xl font-semibold tracking-tight", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Try again"
      }
    )
  ] }) });
}
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Oasis CI - Cybersecurity investigations" },
      {
        name: "description",
        content: "See your website's blind spots before attackers do. Oasis CI investigates public exposures, notifies verified owners, and tracks remediation."
      },
      { name: "author", content: "Oasis CI" },
      {
        property: "og:title",
        content: "Oasis CI - Cybersecurity investigations"
      },
      {
        property: "og:description",
        content: "Built to protect, not to expose. Cybersecurity investigations, ownership verification, and remediation workflows."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
      },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "min-h-screen bg-background text-foreground antialiased", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$5.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AppProvider, { children: /* @__PURE__ */ jsx(RootLayout, {}) }) });
}
function RootLayout() {
  const { isHydrated } = useAppContext();
  if (!isHydrated) {
    return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Loading Oasis CI..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
const $$splitComponentImporter$4 = () => import("./submit-DTYt7SpT.js");
const Route$4 = createFileRoute("/submit")({
  head: () => ({
    meta: [{
      title: "Oasis CI - Researcher submission form"
    }, {
      name: "description",
      content: "Pen tester submissions are not available on this platform."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./exposures-DbQUX8_h.js");
const Route$3 = createFileRoute("/exposures")({
  head: () => ({
    meta: [{
      title: "Oasis CI - Public exposure directory"
    }, {
      name: "description",
      content: "Browse public, redacted exposure listings and begin the owner claim flow."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./ethics-CIC_W3ly.js");
const Route$2 = createFileRoute("/ethics")({
  head: () => ({
    meta: [{
      title: "Oasis CI - Ethical pledge and rules of engagement"
    }, {
      name: "description",
      content: "Read the platform principles, owner protections, and researcher rules of engagement."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const $$splitComponentImporter$1 = () => import("./dashboard-BRjBj7OA.js");
const Route$1 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Oasis CI - Workspace dashboard"
    }, {
      name: "description",
      content: "Role-based owner, researcher, moderator, and admin workspace for Oasis CI."
    }, {
      property: "og:title",
      content: "Oasis CI - Workspace dashboard"
    }, {
      property: "og:description",
      content: "Claim domains, review private evidence, manage submissions, and track remediation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-xGXBokWE.js");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Oasis CI - Discover, notify, and remediate public exposures"
    }, {
      name: "description",
      content: "Oasis CI is a responsible exposure intelligence platform for owners, researchers, and moderators."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SubmitRoute = Route$4.update({
  id: "/submit",
  path: "/submit",
  getParentRoute: () => Route$5
});
const ExposuresRoute = Route$3.update({
  id: "/exposures",
  path: "/exposures",
  getParentRoute: () => Route$5
});
const EthicsRoute = Route$2.update({
  id: "/ethics",
  path: "/ethics",
  getParentRoute: () => Route$5
});
const DashboardRoute = Route$1.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$5
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  DashboardRoute,
  EthicsRoute,
  ExposuresRoute,
  SubmitRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Dialog as D,
  PenTesterDisabledShell as P,
  RoleBadge as R,
  DialogContent as a,
  DialogDescription as b,
  DialogFooter as c,
  DialogHeader as d,
  DialogTitle as e,
  PenTesterUnavailableBanner as f,
  categoryMeta as g,
  daysBetween as h,
  formatFullDate as i,
  formatShortDate as j,
  getExposurePublicTitle as k,
  hasAnyRole as l,
  isDomainClaimed as m,
  isExposureLockedForOwner as n,
  isExposureVisibleToPublic as o,
  penTesterMutedClass as p,
  rolePermissions as q,
  roleMeta as r,
  router as s,
  severityMeta as t,
  sortBySeverity as u,
  useAppContext as v
};
