import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell } from "recharts";
import { ArrowRight, Radar, ChartNoAxesCombined, UserRoundCheck, ShieldCheck, BellRing, Lock } from "lucide-react";
import { useState } from "react";
import { v as useAppContext, u as sortBySeverity, o as isExposureVisibleToPublic, g as categoryMeta, R as RoleBadge, r as roleMeta, q as rolePermissions, k as getExposurePublicTitle, i as formatFullDate } from "./router-C-EVOOem.js";
import { S as SeverityPill } from "./SeverityPill-Be8mqipI.js";
import "@tanstack/react-query";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];
function HomePage() {
  const {
    state,
    currentUser
  } = useAppContext();
  const [policyOpen, setPolicyOpen] = useState(false);
  const publicExposures = sortBySeverity(state.exposures.filter((exposure) => isExposureVisibleToPublic(exposure)));
  const recentExposures = publicExposures.slice(0, 6);
  const categoryBreakdown = Object.entries(categoryMeta).map(([key, meta]) => ({
    key,
    label: meta.label,
    value: publicExposures.filter((exposure) => exposure.category === key).length
  }));
  const tickerItems = [...state.auditLog.slice(0, 8), ...state.auditLog.slice(0, 8)];
  const stats = {
    domainsMonitored: state.domains.length,
    publicListings: publicExposures.length,
    verifiedOwners: state.domains.filter((domain) => domain.verificationStatus === "verified").length,
    remediated: state.exposures.filter((exposure) => exposure.remediationStatus === "fixed").length
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-border/70", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid-bg opacity-50" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: {
        background: "var(--gradient-hero)"
      } }),
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-7xl px-6 py-24 lg:py-28", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "eyebrow", children: "Responsible exposure operations" }),
            currentUser ? /* @__PURE__ */ jsx(RoleBadge, { role: currentUser.role }) : null
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-6 display-font text-5xl font-semibold leading-[1] tracking-tight md:text-7xl", children: [
            "See your website's ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "blind spots" }),
            /* @__PURE__ */ jsx("br", {}),
            "before attackers do."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-2xl text-lg leading-8 text-muted-foreground", children: "Oasis CI coordinates public discovery, private owner evidence, researcher submissions, and moderator review on one live operations workspace." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground", children: [
              currentUser ? "Open workspace" : "Sign in to a workspace",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/exposures", className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-3 text-sm font-medium text-foreground", children: "Browse public exposures" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-14 grid gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ jsx(MetricCard, { icon: Radar, label: "Domains monitored", value: stats.domainsMonitored.toString() }),
          /* @__PURE__ */ jsx(MetricCard, { icon: ChartNoAxesCombined, label: "Public listings", value: stats.publicListings.toString() }),
          /* @__PURE__ */ jsx(MetricCard, { icon: UserRoundCheck, label: "Verified owners", value: stats.verifiedOwners.toString() }),
          /* @__PURE__ */ jsx(MetricCard, { icon: ShieldCheck, label: "Remediated items", value: stats.remediated.toString() })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "overflow-hidden border-b border-border/70 bg-card/35", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center gap-6 py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "eyebrow shrink-0 px-6", children: "Live operations tape" }),
      /* @__PURE__ */ jsx("div", { className: "flex animate-ticker gap-8 whitespace-nowrap pr-6 text-xs text-muted-foreground", children: tickerItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border bg-background/80 px-2 py-1 mono text-[10px] uppercase tracking-[0.2em] text-foreground", children: item.action }),
        /* @__PURE__ */ jsxs("span", { children: [
          item.target,
          " handled through ",
          item.action.toLowerCase()
        ] })
      ] }, item.id)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(FeatureCard, { icon: Radar, title: "Discover", body: "Continuously index public surfaces for exposed data, open directories, backup artifacts, and reachable admin interfaces." }),
      /* @__PURE__ */ jsx(FeatureCard, { icon: BellRing, title: "Notify", body: "Route private evidence to verified owners through claim verification and ownership-aware access controls." }),
      /* @__PURE__ */ jsx(FeatureCard, { icon: Lock, title: "Protect", body: "Track remediation, request re-scans, resolve flags, and keep the public directory free of sensitive content." })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.3fr_0.9fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "panel p-7", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "30 day discovery trend" }),
            /* @__PURE__ */ jsx("h2", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: "Product sections sharing live operations state." }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-sm leading-7 text-muted-foreground", children: "The landing page, directory, owner workspace, tester workflow, and moderator controls operate from the same platform data so actions visibly change the rest of the app." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden rounded-full border border-border bg-background/70 px-3 py-2 text-xs text-muted-foreground lg:block", children: "Auth, moderation, and remediation included" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(AreaChart, { data: state.analytics, margin: {
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxs("defs", { children: [
            /* @__PURE__ */ jsxs("linearGradient", { id: "discover-gradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-chart-1)", stopOpacity: 0.55 }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-chart-1)", stopOpacity: 0 })
            ] }),
            /* @__PURE__ */ jsxs("linearGradient", { id: "fix-gradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-chart-2)", stopOpacity: 0.45 }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-chart-2)", stopOpacity: 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 5", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "label", stroke: "var(--color-muted-foreground)", fontSize: 10, tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 10, tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
          /* @__PURE__ */ jsx(Area, { dataKey: "discovered", stroke: "var(--color-chart-1)", strokeWidth: 2, fill: "url(#discover-gradient)" }),
          /* @__PURE__ */ jsx(Area, { dataKey: "remediated", stroke: "var(--color-chart-2)", strokeWidth: 2, fill: "url(#fix-gradient)" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel p-7", children: [
        /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Public exposure mix" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 display-font text-2xl font-semibold tracking-tight", children: "What the public directory shows" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: "Visitors see only redacted metadata. Full URLs, evidence samples, and owner notes are gated behind verified access." }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 h-56", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: categoryBreakdown, dataKey: "value", innerRadius: 56, outerRadius: 88, paddingAngle: 3, stroke: "var(--color-background)", children: categoryBreakdown.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: chartColors[index % chartColors.length] }, entry.key)) }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: categoryBreakdown.map((entry, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full", style: {
              backgroundColor: chartColors[index % chartColors.length]
            } }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: entry.label })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "mono text-foreground", children: entry.value })
        ] }, entry.key)) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsx("div", { className: "panel p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Protective aim" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 display-font text-4xl font-semibold tracking-tight", children: "Built to protect, not to expose." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-8 text-muted-foreground", children: "This platform exists solely to help website owners secure their assets. No sensitive content is shown publicly, only verified owners see the full evidence, and the product avoids exploit guidance or public shaming." }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setPolicyOpen(true), className: "mt-8 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary", children: [
          "Read the full pledge",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: ["No full URLs or file contents shown in public listings.", "Automatic removal workflows once a finding is fixed and verified clean.", "Owner identities stay private unless they choose to engage.", "False positives can be flagged directly from the private workspaces."].map((item) => /* @__PURE__ */ jsx("div", { className: "subtle-panel p-5 text-sm leading-7 text-foreground/88", children: item }, item)) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Role based workspaces" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-3 display-font text-4xl font-semibold tracking-tight", children: "One platform, four views." })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "text-sm font-medium text-primary", children: "Open the dashboard" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-4 lg:grid-cols-4", children: Object.entries(roleMeta).map(([role, meta]) => /* @__PURE__ */ jsxs("div", { className: "panel p-6", children: [
        /* @__PURE__ */ jsx(RoleBadge, { role }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 display-font text-2xl font-semibold tracking-tight", children: meta.label }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: meta.description }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-2", children: rolePermissions[role].map((permission) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 rounded-full bg-primary" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground/88", children: permission })
        ] }, permission)) })
      ] }, role)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Latest public entries" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-3 display-font text-4xl font-semibold tracking-tight", children: "Recent exposure cards" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/exposures", className: "text-sm font-medium text-primary", children: "View all listings" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: recentExposures.map((exposure) => /* @__PURE__ */ jsxs("div", { className: "panel p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground", children: exposure.id }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 text-base font-medium", children: exposure.domain }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: exposure.companyName })
          ] }),
          /* @__PURE__ */ jsx(SeverityPill, { severity: exposure.severity })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 inline-flex rounded-full border border-border px-2.5 py-1 mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: categoryMeta[exposure.category].label }),
        /* @__PURE__ */ jsx("h4", { className: "mt-4 text-sm font-semibold text-foreground", children: getExposurePublicTitle(exposure) }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Evidence and remediation guidance are private until ownership is verified." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Seen ",
            formatFullDate(exposure.lastSeen)
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Owners can claim this listing" })
        ] })
      ] }, exposure.id)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsx("div", { className: "panel p-10 text-center", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl", children: [
      /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Workspace ready" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 display-font text-4xl font-semibold tracking-tight md:text-5xl", children: "Claim a domain, review evidence, and simulate the full loop." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-8 text-muted-foreground", children: "Use the sign-in workspace for owner, tester, moderator, and admin roles. All views share the same records, so moderation and remediation changes propagate across the front end immediately." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground", children: [
          "Launch dashboard",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "inline-flex cursor-not-allowed items-center rounded-full border border-border px-5 py-3 text-sm font-medium opacity-40 saturate-50", title: "Pen tester submissions are not available", children: "Researcher form (unavailable)" })
      ] })
    ] }) }) }) }),
    policyOpen ? /* @__PURE__ */ jsx(EthicalPolicyModal, { onClose: () => setPolicyOpen(false) }) : null
  ] });
}
function MetricCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "panel p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "mono text-[10px] uppercase tracking-[0.2em]", children: label })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: value })
  ] });
}
function FeatureCard({
  icon: Icon,
  title,
  body
}) {
  return /* @__PURE__ */ jsxs("div", { className: "panel p-7", children: [
    /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/10", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
    /* @__PURE__ */ jsx("h3", { className: "mt-5 display-font text-2xl font-semibold tracking-tight", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: body })
  ] });
}
function EthicalPolicyModal({
  onClose
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-background/75 px-4 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "panel w-full max-w-2xl p-8", onClick: (event) => event.stopPropagation(), children: [
    /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Ethical pledge" }),
    /* @__PURE__ */ jsx("h3", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: "Product rules that protect owners and researchers" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4 text-sm leading-7 text-muted-foreground", children: [
      /* @__PURE__ */ jsx("p", { children: "Oasis CI exists to help website owners fix public exposures before malicious actors can abuse them. The public directory is metadata-only, while full evidence remains private to verified owners and authorized moderators." }),
      /* @__PURE__ */ jsx("p", { children: "Researchers are expected to avoid downloading live data, avoid exploitation beyond verification, respect robots.txt and rate limits, and disclose through the platform rather than contacting owners directly." }),
      /* @__PURE__ */ jsx("p", { children: "Listings can be flagged, re-scanned, and removed after remediation. Owners remain anonymous unless they choose to engage, and the platform avoids exploit code, credential sharing, or public blame." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Close" }) })
  ] }) });
}
const tooltipStyle = {
  background: "oklch(0.2 0.016 235)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)"
};
export {
  HomePage as component
};
