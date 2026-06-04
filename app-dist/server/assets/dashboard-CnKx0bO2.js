import { T as reactExports, K as jsxRuntimeExports } from "./server-B5J_1do6.js";
import { j as createLucideIcon, h as categoryMeta, z as useAppContext, f as PenTesterUnavailableBanner, t as penTesterMutedClass, P as PenTesterDisabledShell, L as Link, r as isExposureLockedForOwner, k as daysBetween, n as getExposurePublicTitle, R as RoleBadge, D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter, m as formatShortDate, l as formatFullDate, o as getJson, g as apiRoutes, u as roleMeta } from "./router-B51iN22u.js";
import { S as SeverityPill } from "./SeverityPill-DQdoFCDl.js";
import { a as POLICIES_OPERATOR, P as POLICIES_EFFECTIVE_DATE, b as POLICIES_TITLE, C as CURRENT_POLICIES_VERSION, c as POLICY_PREAMBLE, d as POLICY_SECTIONS } from "./oasis-ci-policies-D7vl66Ag.js";
import { P as PoliciesCheckbox } from "./PoliciesCheckbox-POaoHQxm.js";
import { F as Flag } from "./flag-BtFakibh.js";
import { m as generateCategoricalChart, B as Bar, X as XAxis, Y as YAxis, k as formatAxisMap, R as ResponsiveContainer, b as AreaChart, C as CartesianGrid, g as Tooltip, a as Area } from "./AreaChart-BL3z2MAq.js";
import { S as ShieldCheck } from "./shield-check-Bgae_aLb.js";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$8 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$8);
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$7);
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$6);
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
      key: "1ngwbx"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
function OpsDesk({
  title,
  subtitle,
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  stats,
  aside,
  children
}) {
  const [internalTab, setInternalTab] = reactExports.useState(defaultTab ?? tabs[0]?.id ?? "");
  const activeTab = controlledTab ?? internalTab;
  function setActiveTab(tab) {
    if (onTabChange) onTabChange(tab);
    else setInternalTab(tab);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono text-[10px] uppercase tracking-[0.24em] text-primary", children: "Operations desk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 display-font text-3xl font-semibold tracking-tight", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-3xl text-sm text-muted-foreground", children: subtitle })
      ] }),
      aside
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4", children: stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-border/80 bg-card/60 px-4 py-3 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: stat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-mono text-2xl font-semibold tabular-nums text-foreground", children: stat.value }),
          stat.hint ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: stat.hint }) : null
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 rounded-lg border border-border/80 bg-card/40 p-1", children: tabs.map((tab) => {
      const active = tab.id === activeTab;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab(tab.id),
          className: `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`,
          children: [
            tab.label,
            tab.badge != null && tab.badge > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`,
                children: tab.badge
              }
            ) : null
          ]
        },
        tab.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[420px]", children: children(activeTab) })
  ] });
}
function DeskPanel({
  title,
  description,
  actions,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border border-border/80 bg-card/50 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: title }),
        description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: description }) : null
      ] }),
      actions
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-0", children })
  ] });
}
function DenseTable({
  columns,
  rows,
  emptyMessage = "No records."
}) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-12 text-center text-sm text-muted-foreground", children: emptyMessage });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[900px] text-left text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/70 bg-muted/30 text-xs text-muted-foreground", children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `px-4 py-3 font-medium ${col.className ?? ""}`, children: col.label }, col.key)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "tr",
      {
        className: "border-b border-border/40 transition-colors hover:bg-accent/30",
        children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 align-top ${col.className ?? ""}`, children: row.cells[col.key] }, col.key))
      },
      row.id
    )) })
  ] }) });
}
const severities = ["critical", "high", "medium", "low", "info"];
function ProblemDetailsForm({
  value,
  onChange,
  urlLabel = "Vulnerable URL"
}) {
  function update(key, next) {
    onChange({ ...value, [key]: next });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Problem title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: value.title,
        onChange: (event) => update("title", event.target.value),
        className: "input-base text-sm",
        placeholder: "Public backup directory exposed"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: urlLabel, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: value.fullUrl,
        onChange: (event) => update("fullUrl", event.target.value),
        type: "url",
        className: "input-base text-sm",
        placeholder: "https://example.com/backups/"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Problem type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          value: value.category,
          onChange: (event) => update("category", event.target.value),
          className: "select-base text-sm",
          children: Object.entries(categoryMeta).map(([key, meta]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: meta.label }, key))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Severity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          value: value.severity,
          onChange: (event) => update("severity", event.target.value),
          className: "select-base text-sm",
          children: severities.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item }, item))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Field$1,
      {
        label: "Description",
        hint: "Explain what was exposed, the affected path, and why it matters.",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: value.description,
            onChange: (event) => update("description", event.target.value),
            rows: 4,
            className: "textarea-base resize-none text-sm",
            placeholder: "The public path returns an indexed backup directory without authentication."
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Field$1,
      {
        label: "Actual documentation",
        hint: "Safe reproduction notes, redacted evidence, commands, screenshots summary, or remediation context.",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: value.documentation,
            onChange: (event) => update("documentation", event.target.value),
            rows: 5,
            className: "textarea-base resize-none mono text-xs",
            placeholder: "GET /backups/ returns a directory index. Evidence is redacted and no files were downloaded."
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Field$1, { label: "Upload documents", hint: "Attached filenames are stored with the problem notes.", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-background/50 px-4 py-5 text-center transition-colors hover:border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 text-sm font-medium text-foreground", children: "Choose supporting files" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 text-xs text-muted-foreground", children: "PDF, text, image, or report files" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            multiple: true,
            className: "sr-only",
            onChange: (event) => update(
              "documentNames",
              Array.from(event.target.files ?? []).map((file) => file.name)
            )
          }
        )
      ] }),
      value.documentNames.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: value.documentNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground",
          children: name
        },
        name
      )) }) : null
    ] })
  ] });
}
function Field$1({
  label,
  hint,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-sm font-medium text-foreground", children: label }),
    hint ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-xs text-muted-foreground", children: hint }) : null,
    children
  ] });
}
function PolicyDocument({ compact = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: compact ? "space-y-6" : "space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: compact ? "space-y-2" : "space-y-3 border-b border-border/70 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mono text-[10px] uppercase tracking-[0.24em] text-primary", children: [
        POLICIES_OPERATOR,
        " · Effective ",
        POLICIES_EFFECTIVE_DATE
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h1",
        {
          className: compact ? "display-font text-2xl font-semibold tracking-tight" : "display-font text-4xl font-semibold tracking-tight md:text-5xl",
          children: POLICIES_TITLE
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Version ",
        CURRENT_POLICIES_VERSION,
        " · Responsible. Transparent. Evidence-Based."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-4", children: POLICY_PREAMBLE.map((block, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyBlockView, { block }, `preamble-${index}`)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "rounded-lg border border-border/80 bg-muted/20 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Contents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 grid gap-2 text-sm sm:grid-cols-2", children: POLICY_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `#policy-${section.id}`, className: "text-foreground hover:text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[10px] text-primary", children: section.number }),
        " ",
        section.title
      ] }) }, section.id)) })
    ] }),
    POLICY_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: `policy-${section.id}`,
        className: "scroll-mt-24 rounded-lg border border-border/80 bg-card/40 p-5 sm:p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mono text-[10px] uppercase tracking-[0.2em] text-primary", children: [
            "Policy ",
            section.number
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-lg font-semibold text-foreground", children: section.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: section.blocks.map((block, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyBlockView, { block }, `${section.id}-${index}`)) })
        ]
      },
      section.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/70 pt-6 text-xs leading-6 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Approved by ",
        POLICIES_OPERATOR,
        " leadership. Document classification: Confidential — Internal & Disclosed Parties Only."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        POLICIES_OPERATOR,
        ". Source: Oasis_CI_Policies.docx in the project documentation set."
      ] })
    ] })
  ] });
}
function PolicyBlockView({ block }) {
  if (block.kind === "h3") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: block.text });
  }
  if (block.kind === "ul") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground", children: block.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item }, item)) });
  }
  if (block.kind === "important") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-7 text-foreground", children: block.text });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-7 text-muted-foreground", children: block.text });
}
function userNeedsPolicyAcceptance(user, policiesVersion = CURRENT_POLICIES_VERSION) {
  if (!user) return false;
  return user.policiesAcceptedVersion !== policiesVersion;
}
function PolicyAcceptanceScreen({ user }) {
  const { acceptPolicies, signOut } = useAppContext();
  const [acknowledged, setAcknowledged] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const [isBusy, setIsBusy] = reactExports.useState(false);
  async function handleAccept() {
    if (!acknowledged) {
      setMessage("Check the agreement box after reviewing the policies.");
      return;
    }
    setIsBusy(true);
    const result = await acceptPolicies(CURRENT_POLICIES_VERSION);
    setMessage(result.message);
    setIsBusy(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-6 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/70 bg-primary/5 px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "eyebrow", children: "Required agreement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 display-font text-3xl font-semibold tracking-tight", children: "Accept Oasis CI policies to continue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm leading-7 text-muted-foreground", children: [
        "Signed in as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: user.name }),
        " (",
        user.email,
        "). You must accept version ",
        CURRENT_POLICIES_VERSION,
        " before using the dashboard or making changes on the platform."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[42vh] overflow-y-auto border-b border-border/70 px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyDocument, { compact: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 px-6 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PoliciesCheckbox, { checked: acknowledged, onChange: setAcknowledged, disabled: isBusy }),
      message ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-primary/25 bg-primary/10 px-4 py-3 text-sm", children: message }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            disabled: isBusy,
            onClick: handleAccept,
            className: "rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60",
            children: isBusy ? "Recording acceptance..." : "I agree and continue"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/ethics#policies-outline",
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center rounded-md border border-border px-4 py-2.5 text-sm",
            children: "Open policy outline"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => signOut(),
            className: "rounded-md px-4 py-2.5 text-sm text-muted-foreground",
            children: "Sign out"
          }
        )
      ] })
    ] })
  ] }) });
}
function buildRemediationMailto(remediationEmail, input) {
  const exposureLine = input.exposure ? `Exposure ID: ${input.exposure.id}
Severity: ${input.exposure.severity}
Category: ${input.exposure.category}
` : "";
  const subject = `Oasis CI remediation assistance — ${input.domain}`;
  const body = [
    "Hello Oasis CI remediation team,",
    "",
    `I am ${input.ownerName} (${input.ownerEmail}), a verified owner of ${input.companyName} (${input.domain}).`,
    "",
    "I would like to engage Oasis CI to help remediate the following finding (hired remediation support):",
    "",
    exposureLine,
    "Please share scope, timeline, and next steps for Oasis-led remediation.",
    "",
    "Thank you,",
    input.ownerName
  ].filter(Boolean).join("\n");
  return `mailto:${encodeURIComponent(remediationEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function OwnerRemediationOptions({
  user,
  remediationEmail,
  remediationPhone,
  domain,
  exposure,
  onOpenWorkbench
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-muted-foreground", children: [
      "Choose how you want to handle findings on your verified domains. The contact below is set by your Oasis CI administrator for owners who want",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Oasis CI to help fix issues" }),
      " (hired remediation). You can also remediate on your own and update status in the Workbench tab."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-primary/5 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-primary" }),
          "Option A — Hire Oasis CI"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs leading-6 text-muted-foreground", children: "Contact Oasis to request professional remediation assistance for your exposure(s). This is not the email used for domain-claim verification." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium", children: remediationEmail }),
        remediationPhone ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: remediationPhone }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: buildRemediationMailto(remediationEmail, {
              ownerName: user.name,
              ownerEmail: user.email,
              companyName: user.company,
              domain,
              exposure
            }),
            className: "mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground",
            children: "Request Oasis remediation help"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/80 bg-card/50 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-4 w-4 text-primary" }),
          "Option B — Fix it yourself"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs leading-6 text-muted-foreground", children: "Your team remediates internally using private evidence in the Workbench. When work is complete, mark issues fixed there so a moderator can verify removal from the directory." }),
        onOpenWorkbench ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onOpenWorkbench,
            className: "mt-4 inline-flex h-10 items-center justify-center rounded-md border border-border bg-background/80 px-4 text-sm font-medium text-foreground hover:bg-accent",
            children: "Open Workbench"
          }
        ) : null
      ] })
    ] })
  ] });
}
const tooltipStyle = {
  background: "oklch(0.2 0.016 235)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)"
};
function DashboardPage() {
  const {
    state,
    currentUser,
    signIn,
    requestResearcherAccount
  } = useAppContext();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [isBusy, setIsBusy] = reactExports.useState(false);
  const [researcherName, setResearcherName] = reactExports.useState("");
  const [researcherEmail, setResearcherEmail] = reactExports.useState("");
  const [researcherCompany, setResearcherCompany] = reactExports.useState("");
  const [researcherPassword, setResearcherPassword] = reactExports.useState("");
  const [researcherPoliciesAccepted, setResearcherPoliciesAccepted] = reactExports.useState(false);
  async function handleSignIn(event) {
    event.preventDefault();
    setIsBusy(true);
    const result = await signIn(email, password);
    setMessage(result.message);
    setIsBusy(false);
  }
  if (!currentUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid min-h-[72vh] max-w-4xl place-items-center px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "eyebrow", children: "Authentication" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 display-font text-5xl font-semibold tracking-tight", children: "Sign in to Oasis CI." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-7 text-muted-foreground", children: "Use your account credentials. If this is the first server launch, use the admin email and password printed in the API console." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignIn, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-sm font-medium", children: "Account email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: email, onChange: (event) => setEmail(event.target.value), className: "input-base text-sm", placeholder: "owner@northwind-logistics.com" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-sm font-medium", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: password, onChange: (event) => setPassword(event.target.value), className: "input-base text-sm", type: "password", placeholder: "Enter your password" })
        ] }),
        message ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm", children: message }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isBusy, className: "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: isBusy ? "Signing in..." : "Sign in" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-8 border-t border-border/70 pt-8 ${penTesterMutedClass()}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PenTesterUnavailableBanner, { className: "mb-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "display-font text-2xl font-semibold tracking-tight", children: "Pen tester account request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-muted-foreground", children: "This program is not available. Owners and admins use the workspaces above." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: researcherName, onChange: (event) => setResearcherName(event.target.value), className: "input-base text-sm", placeholder: "Researcher name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: researcherEmail, onChange: (event) => setResearcherEmail(event.target.value), className: "input-base text-sm", placeholder: "researcher@example.com" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: researcherCompany, onChange: (event) => setResearcherCompany(event.target.value), className: "input-base text-sm", placeholder: "Company or Independent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: researcherPassword, onChange: (event) => setResearcherPassword(event.target.value), className: "input-base text-sm", type: "password", placeholder: "Password (8+ characters)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PoliciesCheckbox, { checked: researcherPoliciesAccepted, onChange: setResearcherPoliciesAccepted, disabled: isBusy }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
            if (!researcherPoliciesAccepted) {
              setMessage("Accept the Oasis CI policies before submitting your account request.");
              return;
            }
            setIsBusy(true);
            const result = await requestResearcherAccount({
              name: researcherName,
              email: researcherEmail,
              company: researcherCompany,
              password: researcherPassword,
              policiesVersion: CURRENT_POLICIES_VERSION,
              policiesAcknowledged: true
            });
            setMessage(result.message);
            if (result.ok) {
              setResearcherName("");
              setResearcherEmail("");
              setResearcherCompany("");
              setResearcherPassword("");
              setResearcherPoliciesAccepted(false);
            }
            setIsBusy(false);
          }, className: "inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground", children: isBusy ? "Sending..." : "Send to moderator" })
        ] })
      ] })
    ] }) }) });
  }
  const policiesVersion = state.platform?.policiesVersion ?? CURRENT_POLICIES_VERSION;
  if (userNeedsPolicyAcceptance(currentUser, policiesVersion)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyAcceptanceScreen, { user: currentUser });
  }
  if (currentUser.role === "owner") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerWorkspace, { user: currentUser });
  }
  if (currentUser.role === "pen_tester") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PenTesterDisabledShell, { title: "Pen tester workspace unavailable", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "mt-6 inline-flex rounded-md border border-border px-4 py-2 text-sm", onClick: (event) => event.preventDefault(), children: "Sign in with an owner or admin account" }) });
  }
  if (currentUser.role === "moderator") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ModeratorWorkspace, { user: currentUser });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminWorkspace, { user: currentUser });
}
function OwnerWorkspace({
  user
}) {
  const {
    state,
    updateExposure,
    requestRescan,
    flagExposure
  } = useAppContext();
  const [evidenceOpen, setEvidenceOpen] = reactExports.useState(false);
  const remediationEmail = state.platform?.remediationEmail ?? "remediation@oasisci.com";
  const remediationPhone = state.platform?.remediationPhone ?? "";
  const ownedDomains = state.domains.filter((domain) => domain.ownerUserId === user.id);
  const ownedDomainNames = new Set(ownedDomains.map((domain) => domain.domain));
  const exposures = state.exposures.filter((exposure) => ownedDomainNames.has(exposure.domain));
  const activeExposures = exposures.filter((exposure) => exposure.remediationStatus !== "fixed");
  const selectedDefault = activeExposures[0]?.id ?? exposures[0]?.id ?? null;
  const [selectedId, setSelectedId] = reactExports.useState(selectedDefault);
  const [note, setNote] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [ownerTab, setOwnerTab] = reactExports.useState("workbench");
  const selected = exposures.find((exposure) => exposure.id === selectedId) ?? exposures[0];
  const isLocked = selected ? isExposureLockedForOwner(selected) : false;
  const coverage = ownedDomains.length === 0 ? 0 : Math.round(ownedDomains.reduce((total, domain) => total + domain.coverageScore, 0) / ownedDomains.length);
  const criticalHigh = activeExposures.filter((exposure) => ["critical", "high"].includes(exposure.severity)).length;
  activeExposures.length === 0 ? 0 : Math.round(activeExposures.reduce((total, exposure) => total + daysBetween(exposure.discoveredAt), 0) / activeExposures.length);
  async function updateSelected(remediationStatus) {
    if (!selected) return;
    const result = await updateExposure({
      exposureId: selected.id,
      remediationStatus,
      internalNote: note || selected.internalNote
    });
    setMessage(result.message);
  }
  const fixedCount = exposures.filter((exposure) => exposure.remediationStatus === "fixed").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OpsDesk, { title: user.company, subtitle: `${ownedDomains.length} verified domain${ownedDomains.length === 1 ? "" : "s"} · ${activeExposures.length} active exposure${activeExposures.length === 1 ? "" : "s"}`, aside: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role }), activeTab: ownerTab, onTabChange: setOwnerTab, defaultTab: "workbench", stats: [{
      label: "Active exposures",
      value: String(activeExposures.length),
      hint: "Needs remediation"
    }, {
      label: "Critical / high",
      value: String(criticalHigh),
      hint: "Priority queue"
    }, {
      label: "Marked fixed",
      value: String(fixedCount),
      hint: "Awaiting moderator verify"
    }, {
      label: "Coverage score",
      value: String(coverage),
      hint: "Portfolio health"
    }], tabs: [{
      id: "overview",
      label: "Overview"
    }, {
      id: "exposures",
      label: "All exposures",
      badge: exposures.length
    }, {
      id: "workbench",
      label: "Workbench",
      badge: activeExposures.length
    }, {
      id: "trends",
      label: "Trends"
    }], children: (tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      message && tab === "workbench" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Notice, { children: message }) : null,
      tab === "overview" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerAlerts, { userId: user.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Remediation paths", description: "Hire Oasis CI for help, or remediate internally and mark status in Workbench.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerRemediationOptions, { user, remediationEmail, remediationPhone, domain: ownedDomains[0]?.domain ?? user.verifiedDomains[0] ?? "your-domain", exposure: selected, onOpenWorkbench: () => setOwnerTab("workbench") }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Verified domains", description: "Domains linked to your owner account.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { emptyMessage: "No verified domains yet.", columns: [{
            key: "domain",
            label: "Domain"
          }, {
            key: "risk",
            label: "Risk"
          }, {
            key: "status",
            label: "Status"
          }], rows: ownedDomains.map((domain) => ({
            id: domain.id,
            cells: {
              domain: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: domain.domain }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: domain.companyName })
              ] }),
              risk: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: domain.riskScore }),
              status: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-xs text-muted-foreground", children: domain.verificationStatus })
            }
          })) }) })
        ] })
      ] }) : null,
      tab === "exposures" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Exposure registry", description: "All findings on your verified domains. Open the workbench tab to take action.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { emptyMessage: "No exposures on your domains yet.", columns: [{
        key: "id",
        label: "ID"
      }, {
        key: "issue",
        label: "Issue"
      }, {
        key: "severity",
        label: "Severity"
      }, {
        key: "remediation",
        label: "Remediation"
      }, {
        key: "actions",
        label: "",
        className: "text-right"
      }], rows: exposures.map((exposure) => ({
        id: exposure.id,
        cells: {
          id: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[11px]", children: exposure.id }),
          issue: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: getExposurePublicTitle(exposure) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: exposure.domain })
          ] }),
          severity: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: exposure.severity }),
          remediation: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-xs", children: exposure.remediationStatus.replace(/_/g, " ") }),
          actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setSelectedId(exposure.id);
            setOwnerTab("workbench");
          }, className: "rounded-md border border-border px-3 py-1.5 text-xs", children: "Open" })
        }
      })) }) }) : null,
      tab === "workbench" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Select an exposure", description: "Choose a row to review evidence and update status.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExposureTable, { exposures, selectedId: selected?.id, onSelect: setSelectedId }) }) }),
        selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel h-fit p-6 xl:sticky xl:top-24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: selected.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 display-font text-xl font-semibold tracking-tight", children: "Private evidence" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: selected.severity })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateField, { label: "Issue title", value: getExposurePublicTitle(selected) }),
            selected.remediationRecommendation ? /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateField, { label: "Admin remediation guidance", value: selected.remediationRecommendation, pre: true }) : null,
            isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-severity-medium/35 bg-severity-medium/10 px-4 py-3 text-sm", children: "A moderator verified this fix. Remediation controls are locked until they reverse the decision." }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateField, { label: "Full URL", value: selected.fullUrl }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Evidence sample" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEvidenceOpen(true), className: "rounded-md border border-border px-3 py-1.5 text-xs font-medium", children: "Full screen" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 max-h-36 overflow-auto rounded-md border border-border bg-background/70 p-3 mono text-[11px] whitespace-pre-wrap", children: selected.evidenceSample || "No evidence on file." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Internal note" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: note || selected.internalNote, onChange: (event) => setNote(event.target.value), className: "textarea-base mt-2 h-20 resize-none text-xs" })
            ] }),
            message ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-primary/25 bg-primary/10 px-4 py-3 text-sm", children: message }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => updateSelected("in_progress"), disabled: isLocked, className: "rounded-md border border-border px-3 py-2 text-xs font-medium disabled:opacity-50", children: "In progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => updateSelected("fixed"), disabled: isLocked, className: "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50", children: "Mark fixed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
                const result = await requestRescan(selected.id);
                setMessage(result.message);
              }, disabled: isLocked, className: "inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs disabled:opacity-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                "Re-scan"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
                const result = await flagExposure(selected.id, "Owner requested a moderator review from the dashboard.", {
                  flagType: "review_request",
                  title: `Review request: ${getExposurePublicTitle(selected)}`
                });
                setMessage(result.message);
              }, disabled: isLocked, className: "inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs disabled:opacity-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
                "Flag"
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-border/80 p-8 text-sm text-muted-foreground", children: "Select an exposure from the list to review evidence and update remediation." })
      ] }) : null,
      tab === "trends" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Investigation trends", description: "Age and volume of active findings.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 p-4 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExposureAgePanel, { exposures: activeExposures })
      ] }) }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EvidenceViewerDialog, { open: evidenceOpen, onOpenChange: setEvidenceOpen, exposure: selected ?? null })
  ] });
}
function EvidenceViewerDialog({
  open,
  onOpenChange,
  exposure
}) {
  if (!exposure) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex max-h-[92vh] max-w-5xl flex-col gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "border-b border-border/70 px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Private evidence — ",
        exposure.id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        exposure.domain,
        " • ",
        getExposurePublicTitle(exposure)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-5 overflow-y-auto px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Full URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 break-all text-sm text-foreground", children: exposure.fullUrl })
      ] }),
      exposure.remediationRecommendation ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-primary", children: "Admin remediation guidance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm leading-7 text-foreground", children: exposure.remediationRecommendation })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Evidence / documentation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 min-h-[240px] whitespace-pre-wrap rounded-2xl border border-border bg-background/70 p-4 mono text-xs leading-6 text-foreground", children: exposure.evidenceSample || exposure.snippet || "No evidence on file." })
      ] }),
      exposure.description ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground", children: exposure.description })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "border-t border-border/70 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onOpenChange(false), className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Close" }) })
  ] }) });
}
function ModeratorWorkspace({
  user
}) {
  const {
    state,
    reviewSubmission,
    resolveFlag,
    updateUserAccess,
    verifyExposureRemoval,
    denyExposureFix,
    reverseExposureVerification
  } = useAppContext();
  const [noteBySubmission, setNoteBySubmission] = reactExports.useState({});
  const [verifyNote, setVerifyNote] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [verifyTarget, setVerifyTarget] = reactExports.useState(null);
  const [submissionTarget, setSubmissionTarget] = reactExports.useState(null);
  const [flagTarget, setFlagTarget] = reactExports.useState(null);
  const pendingSubmissions = state.submissions.filter((submission) => submission.status === "pending_review");
  const openFlags = state.flags.filter((flag) => flag.status === "open");
  const pendingResearchers = state.users.filter((candidate) => candidate.role === "pen_tester" && candidate.status === "pending_review");
  const verifiableExposures = state.exposures.filter((exposure) => exposure.remediationStatus === "fixed" && exposure.removalReviewStatus === "requested" && exposure.status !== "archived");
  const verifiedExposures = state.exposures.filter((exposure) => exposure.removalReviewStatus === "verified_removed");
  const approvedCount = state.exposures.filter((item) => item.status === "approved").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OpsDesk, { title: "Moderator desk", subtitle: "Triage submissions, flags, researcher access, and owner fix verification from one operations console.", aside: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role }), defaultTab: "submissions", stats: [{
      label: "Pending submissions",
      value: String(pendingSubmissions.length),
      hint: "Awaiting publish decision"
    }, {
      label: "Open flags",
      value: String(openFlags.length),
      hint: "Needs triage"
    }, {
      label: "Fix verification",
      value: String(verifiableExposures.length),
      hint: "Owner marked fixed"
    }, {
      label: "Live listings",
      value: String(approvedCount),
      hint: "Approved exposures"
    }], tabs: [{
      id: "researchers",
      label: "Researchers",
      badge: pendingResearchers.length
    }, {
      id: "registry",
      label: "Exposure registry"
    }, {
      id: "submissions",
      label: "Submissions",
      badge: pendingSubmissions.length
    }, {
      id: "flags",
      label: "Flags",
      badge: openFlags.length
    }, {
      id: "removal",
      label: "Fix verification",
      badge: verifiableExposures.length
    }], children: (tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      message ? /* @__PURE__ */ jsxRuntimeExports.jsx(Notice, { children: message }) : null,
      tab === "researchers" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: penTesterMutedClass(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PenTesterUnavailableBanner, { className: "mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Researcher verification", description: "Pen tester onboarding is disabled on this platform.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "No pen tester applications are accepted." }) })
      ] }) : null,
      tab === "registry" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Exposure registry", description: "Listing, remediation, and removal review status for every exposure.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { columns: [{
        key: "id",
        label: "ID"
      }, {
        key: "domain",
        label: "Domain"
      }, {
        key: "listing",
        label: "Listing"
      }, {
        key: "remediation",
        label: "Remediation"
      }, {
        key: "removal",
        label: "Removal"
      }, {
        key: "severity",
        label: "Severity"
      }], rows: state.exposures.map((exposure) => ({
        id: exposure.id,
        cells: {
          id: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[11px]", children: exposure.id }),
          domain: exposure.domain,
          listing: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: exposure.status.replace(/_/g, " ") }),
          remediation: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: exposure.remediationStatus.replace(/_/g, " ") }),
          removal: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: exposure.removalReviewStatus.replace(/_/g, " ") }),
          severity: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: exposure.severity })
        }
      })) }) }) : null,
      tab === "submissions" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Submission queue", description: "Approve to publish listings; reject to keep them private.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { emptyMessage: "The submission queue is clear.", columns: [{
        key: "id",
        label: "ID"
      }, {
        key: "domain",
        label: "Domain"
      }, {
        key: "severity",
        label: "Severity"
      }, {
        key: "summary",
        label: "Summary"
      }, {
        key: "actions",
        label: "",
        className: "text-right"
      }], rows: pendingSubmissions.map((submission) => ({
        id: submission.id,
        cells: {
          id: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[11px]", children: submission.id }),
          domain: submission.domain,
          severity: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: submission.severity }),
          summary: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-xs leading-5 text-muted-foreground line-clamp-2", children: submission.description }),
          actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSubmissionTarget(submission), className: "rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Review" })
        }
      })) }) }) : null,
      tab === "flags" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Open flags", description: "Reports from owners, researchers, and the public with full exposure context.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { emptyMessage: "There are no open flags.", columns: [{
        key: "flag",
        label: "Flag"
      }, {
        key: "exposure",
        label: "Exposure"
      }, {
        key: "reporter",
        label: "Reporter"
      }, {
        key: "states",
        label: "States"
      }, {
        key: "actions",
        label: "",
        className: "text-right"
      }], rows: openFlags.map((flag) => ({
        id: flag.id,
        cells: {
          flag: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: flag.title || flag.flagType.replace(/_/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs capitalize text-primary", children: flag.flagType.replace(/_/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xs text-xs leading-5 text-muted-foreground line-clamp-2", children: flag.reason })
          ] }),
          exposure: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: flag.domain }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: flag.exposureTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono mt-1 text-[10px] text-muted-foreground", children: flag.exposureId })
          ] }),
          reporter: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: flag.reporterName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs capitalize text-muted-foreground", children: flag.reporterRole.replace(/_/g, " ") })
          ] }),
          states: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Listing:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-foreground", children: flag.exposureListingStatus.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Remediation:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-foreground", children: flag.exposureRemediationStatus.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: flag.severity })
          ] }),
          actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setFlagTarget(flag), className: "rounded-md border border-border px-3 py-1.5 text-xs", children: "Review" })
        }
      })) }) }) : null,
      tab === "removal" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Pending fix verification", description: "Owners marked these fixed; confirm before archiving from the directory.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { emptyMessage: "No fixes waiting for verification.", columns: [{
          key: "exposure",
          label: "Exposure"
        }, {
          key: "path",
          label: "Path"
        }, {
          key: "severity",
          label: "Severity"
        }, {
          key: "actions",
          label: "",
          className: "text-right"
        }], rows: verifiableExposures.map((exposure) => ({
          id: exposure.id,
          cells: {
            exposure: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: exposure.domain }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono text-[10px] text-muted-foreground", children: exposure.id })
            ] }),
            path: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              categoryMeta[exposure.category].label,
              " • ",
              exposure.publicPath
            ] }),
            severity: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: exposure.severity }),
            actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setVerifyTarget(exposure), className: "rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Review fix" })
          }
        })) }) }),
        verifiedExposures.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Verified fixes", description: "Reverse a decision to reopen owner remediation controls.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DenseTable, { columns: [{
          key: "exposure",
          label: "Exposure"
        }, {
          key: "actions",
          label: "",
          className: "text-right"
        }], rows: verifiedExposures.map((exposure) => ({
          id: exposure.id,
          cells: {
            exposure: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: exposure.domain }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono text-[10px] text-muted-foreground", children: exposure.id })
            ] }),
            actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setVerifyTarget(exposure);
              setVerifyNote("");
            }, className: "rounded-md border border-border px-3 py-1.5 text-xs", children: "Reverse" })
          }
        })) }) }) : null
      ] }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: verifyTarget != null, onOpenChange: (open) => {
      if (!open) {
        setVerifyTarget(null);
        setVerifyNote("");
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Verify fix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Confirm that the flaw is no longer observable before archiving it." })
      ] }),
      verifyTarget ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: verifyTarget.severity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: verifyTarget.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: verifyTarget.domain }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
            categoryMeta[verifyTarget.category].label,
            " • ",
            verifyTarget.publicPath
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground", children: verifyTarget.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-sm font-medium", children: "Moderator note (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: verifyNote, onChange: (event) => setVerifyNote(event.target.value), className: "textarea-base min-h-20 resize-none text-sm", placeholder: "Note to include if you decline the fix." })
        ] })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-wrap gap-2 sm:justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setVerifyTarget(null);
          setVerifyNote("");
        }, className: "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground", children: "Cancel" }),
        verifyTarget?.removalReviewStatus === "verified_removed" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          if (!verifyTarget) return;
          const result = await reverseExposureVerification(verifyTarget.id, verifyNote || void 0);
          setMessage(result.message);
          setVerifyTarget(null);
          setVerifyNote("");
        }, className: "rounded-full border border-border px-4 py-2 text-sm font-medium", children: "Reverse verification" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
            if (!verifyTarget) return;
            const result = await denyExposureFix(verifyTarget.id, verifyNote || void 0);
            setMessage(result.message);
            setVerifyTarget(null);
            setVerifyNote("");
          }, className: "rounded-full border border-destructive/40 px-4 py-2 text-sm text-destructive", children: "Deny fix" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
            if (!verifyTarget) return;
            const result = await verifyExposureRemoval(verifyTarget.id);
            setMessage(result.message);
            setVerifyTarget(null);
            setVerifyNote("");
          }, className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Confirm verified" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: submissionTarget != null, onOpenChange: (open) => {
      if (!open) setSubmissionTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Review submission" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Approve to publish, or reject to keep it private." })
      ] }),
      submissionTarget ? /* @__PURE__ */ jsxRuntimeExports.jsx(SubmissionReviewRow, { submission: submissionTarget, note: noteBySubmission[submissionTarget.id] ?? "", onNoteChange: (value) => setNoteBySubmission((current) => ({
        ...current,
        [submissionTarget.id]: value
      })), onReview: async (decision) => {
        const result = await reviewSubmission({
          submissionId: submissionTarget.id,
          decision,
          moderatorNote: noteBySubmission[submissionTarget.id] || (decision === "approve" ? "Approved from the moderator workspace." : "Rejected from the moderator workspace.")
        });
        setMessage(result.message);
        setSubmissionTarget(null);
      } }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: flagTarget != null, onOpenChange: (open) => {
      if (!open) setFlagTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Review flag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Resolve or dismiss the report." })
      ] }),
      flagTarget ? /* @__PURE__ */ jsxRuntimeExports.jsx(FlagCard, { flag: flagTarget, onResolve: async (status) => {
        const result = await resolveFlag(flagTarget.id, status);
        setMessage(result.message);
        setFlagTarget(null);
      } }) : null
    ] }) })
  ] });
}
function AdminPlatformSettingsPanel({
  remediationEmail,
  remediationPhone,
  onSave
}) {
  const [email, setEmail] = reactExports.useState(remediationEmail);
  const [phone, setPhone] = reactExports.useState(remediationPhone);
  reactExports.useEffect(() => {
    setEmail(remediationEmail);
    setPhone(remediationPhone);
  }, [remediationEmail, remediationPhone]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Oasis remediation contact", description: "Owners use this address to request Oasis CI help fixing issues (hired remediation). Default: remediation@oasisci.com. This is separate from per-exposure claim verification emails.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid max-w-xl gap-4 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Remediation assistance email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: email, onChange: (event) => setEmail(event.target.value), className: "input-base text-sm", placeholder: "remediation@oasisci.com" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Remediation phone (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: phone, onChange: (event) => setPhone(event.target.value), className: "input-base text-sm", placeholder: "+1 ..." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onSave({
      remediationEmail: email,
      remediationPhone: phone
    }), className: "h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground", children: "Save platform contact" })
  ] }) });
}
function AdminWorkspace({
  user
}) {
  const {
    state,
    updateUserAccess,
    deleteUser,
    resetDemo,
    addExposure,
    editExposure,
    deleteExposure,
    removeDomainFromDirectory,
    createModeratorAccount,
    reverseExposureVerification,
    updatePlatformSettings
  } = useAppContext();
  const [message, setMessage] = reactExports.useState("");
  const [moderatorName, setModeratorName] = reactExports.useState("");
  const [moderatorEmail, setModeratorEmail] = reactExports.useState("");
  const [moderatorTitle, setModeratorTitle] = reactExports.useState("");
  const [moderatorPassword, setModeratorPassword] = reactExports.useState("");
  const [selectedExposureId, setSelectedExposureId] = reactExports.useState(state.exposures[0]?.id ?? "");
  const [editExposureOpen, setEditExposureOpen] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [userDeleteTarget, setUserDeleteTarget] = reactExports.useState(null);
  const [isDeletingUser, setIsDeletingUser] = reactExports.useState(false);
  const selectedExposure = state.exposures.find((exposure) => exposure.id === selectedExposureId);
  reactExports.useEffect(() => {
    if (state.exposures.length === 0) {
      if (selectedExposureId) setSelectedExposureId("");
      return;
    }
    const stillValid = state.exposures.some((exposure) => exposure.id === selectedExposureId);
    if (!stillValid) {
      setSelectedExposureId(state.exposures[0].id);
    }
  }, [state.exposures, selectedExposureId]);
  const pendingUsers = state.users.filter((candidate) => candidate.status === "pending_review").length;
  async function confirmDeleteTarget() {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.kind === "exposure") {
        const exposureId = deleteTarget.value;
        const result = await deleteExposure(exposureId);
        setMessage(result.message);
        if (selectedExposureId === exposureId) {
          setSelectedExposureId("");
        }
      } else {
        const domain = deleteTarget.value;
        const result = await removeDomainFromDirectory(domain);
        setMessage(result.message);
        if (selectedExposure?.domain === domain) {
          setSelectedExposureId("");
        }
      }
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }
  async function confirmDeleteUser() {
    if (!userDeleteTarget || isDeletingUser) return;
    if (userDeleteTarget.role === "admin") {
      setMessage("Admin accounts cannot be deleted.");
      setUserDeleteTarget(null);
      return;
    }
    setIsDeletingUser(true);
    try {
      const result = await deleteUser(userDeleteTarget.id);
      setMessage(result.message);
      setUserDeleteTarget(null);
    } finally {
      setIsDeletingUser(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OpsDesk, { title: "Admin control desk", subtitle: "Create exposures, edit remediation contacts, manage accounts, and provision moderators.", aside: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role }), defaultTab: "exposures", stats: [{
      label: "Users",
      value: String(state.users.length),
      hint: "All roles"
    }, {
      label: "Domains",
      value: String(state.domains.length),
      hint: "Claimed + tracked"
    }, {
      label: "Exposures",
      value: String(state.exposures.length),
      hint: "Full registry"
    }, {
      label: "Audit events",
      value: String(state.auditLog.length),
      hint: "Immutable log"
    }], tabs: [{
      id: "create",
      label: "Create"
    }, {
      id: "exposures",
      label: "Exposures"
    }, {
      id: "details",
      label: "Record editor"
    }, {
      id: "platform",
      label: "Remediation contact"
    }, {
      id: "access",
      label: "Access",
      badge: pendingUsers
    }, {
      id: "moderators",
      label: "Moderators"
    }], children: (tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      message ? /* @__PURE__ */ jsxRuntimeExports.jsx(Notice, { children: message }) : null,
      tab === "create" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Create investigation entry", description: "Upload exposure details, contacts, remediation guidance, and private evidence.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminExposureForm, { onSubmit: async (input) => {
        const result = await addExposure(input);
        setMessage(result.message);
        return result.ok;
      } }) }) }) : null,
      tab === "exposures" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Exposure registry", description: "Select a row to open the full record editor.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExposureTable, { exposures: state.exposures, selectedId: selectedExposure?.id, onSelect: (id) => {
        setSelectedExposureId(id);
        setEditExposureOpen(true);
      }, onDeleteExposure: async (exposureId) => {
        setDeleteTarget({
          kind: "exposure",
          value: exposureId
        });
      }, onDeleteDomain: async (domain) => {
        setDeleteTarget({
          kind: "domain",
          value: domain
        });
      } }) }) }) : null,
      tab === "details" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[280px_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Select exposure", className: "lg:max-h-[720px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[640px] overflow-y-auto p-2", children: state.exposures.map((exposure) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedExposureId(exposure.id), className: `mb-1 block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${selectedExposureId === exposure.id ? "border-primary/40 bg-primary/10" : "border-transparent hover:bg-accent/50"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: exposure.domain }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono text-[10px] text-muted-foreground", children: exposure.id })
        ] }, exposure.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Account & remediation details", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: selectedExposure ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminExposureRecordEditor, { exposure: selectedExposure, onSave: async (input) => {
          const result = await editExposure(input);
          setMessage(result.message);
        }, onReverseVerification: async () => {
          const result = await reverseExposureVerification(selectedExposure.id);
          setMessage(result.message);
        } }, selectedExposure.id) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No exposure selected", body: "Choose an exposure from the list to edit account and remediation details." }) }) })
      ] }) : null,
      tab === "platform" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPlatformSettingsPanel, { remediationEmail: state.platform?.remediationEmail ?? "remediation@oasisci.com", remediationPhone: state.platform?.remediationPhone ?? "", onSave: async (input) => {
        const result = await updatePlatformSettings(input);
        setMessage(result.message);
      } }) : null,
      tab === "access" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 xl:grid-cols-[1fr_340px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "User access", description: "Change roles, account states, and account details.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/70", children: state.users.map((candidate) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserAccessRow, { user: candidate, canDelete: candidate.role !== "admin", onUpdate: async (input) => {
          const result = await updateUserAccess(input);
          setMessage(result.message);
        }, onDelete: async (userId) => {
          const target = state.users.find((entry) => entry.id === userId);
          if (!target) {
            setMessage("User account not found.");
            return;
          }
          if (target.role === "admin") {
            setMessage("Admin accounts cannot be deleted.");
            return;
          }
          setUserDeleteTarget(target);
        } }, candidate.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Audit tail", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4", children: [
          state.auditLog.slice(0, 12).map((event) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border/60 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: event.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[10px] text-muted-foreground", children: formatShortDate(event.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-5 text-muted-foreground", children: event.detail })
          ] }, event.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
            await resetDemo();
            setMessage("Platform state reset.");
          }, className: "inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
            "Reset platform state"
          ] })
        ] }) })
      ] }) : null,
      tab === "moderators" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeskPanel, { title: "Create moderator account", description: "Moderators are provisioned by admins only.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 p-5 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: moderatorName, onChange: (event) => setModeratorName(event.target.value), className: "input-base text-sm", placeholder: "Moderator name" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: moderatorEmail, onChange: (event) => setModeratorEmail(event.target.value), className: "input-base text-sm", placeholder: "moderator@oasisci.com" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: moderatorTitle, onChange: (event) => setModeratorTitle(event.target.value), className: "input-base text-sm", placeholder: "Platform Moderator" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: moderatorPassword, onChange: (event) => setModeratorPassword(event.target.value), className: "input-base text-sm", type: "password", placeholder: "Optional temporary password" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
          const result = await createModeratorAccount({
            name: moderatorName,
            email: moderatorEmail,
            title: moderatorTitle,
            password: moderatorPassword || void 0
          });
          setMessage(result.message);
          if (result.ok) {
            setModeratorName("");
            setModeratorEmail("");
            setModeratorTitle("");
            setModeratorPassword("");
          }
        }, className: "h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground", children: "Create" })
      ] }) }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editExposureOpen, onOpenChange: setEditExposureOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit exposure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update contacts, remediation guidance, and listing state." })
      ] }),
      selectedExposure ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminExposureRecordEditor, { exposure: selectedExposure, onSave: async (input) => {
        const result = await editExposure(input);
        setMessage(result.message);
        if (result.ok) setEditExposureOpen(false);
      }, onReverseVerification: async () => {
        const result = await reverseExposureVerification(selectedExposure.id);
        setMessage(result.message);
        if (result.ok) setEditExposureOpen(false);
      } }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteTarget !== null, onOpenChange: (open) => {
      if (!open && !isDeleting) {
        setDeleteTarget(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: deleteTarget?.kind === "domain" ? "Delete company profile?" : "Delete exposure?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: deleteTarget?.kind === "domain" ? `This removes the domain profile for "${deleteTarget.value}" and its linked exposure entries. This action cannot be undone.` : "This permanently deletes this exposure record. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDeleteTarget(null), disabled: isDeleting, className: "rounded-md border border-border px-4 py-2 text-sm", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: confirmDeleteTarget, disabled: isDeleting || !deleteTarget, className: "rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60", children: isDeleting ? "Deleting..." : "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: userDeleteTarget !== null, onOpenChange: (open) => {
      if (!open && !isDeletingUser) {
        setUserDeleteTarget(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete user account?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: userDeleteTarget ? `Delete ${userDeleteTarget.name} (${userDeleteTarget.email}). This action cannot be undone.` : "Delete this user account. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setUserDeleteTarget(null), disabled: isDeletingUser, className: "rounded-md border border-border px-4 py-2 text-sm", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: confirmDeleteUser, disabled: isDeletingUser || !userDeleteTarget, className: "rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60", children: isDeletingUser ? "Deleting..." : "Delete user" })
      ] })
    ] }) })
  ] });
}
function AdminExposureForm({
  onSubmit
}) {
  const [domain, setDomain] = reactExports.useState("");
  const [companyName, setCompanyName] = reactExports.useState("");
  const [sector, setSector] = reactExports.useState("");
  const [problem, setProblem] = reactExports.useState({
    title: "",
    fullUrl: "",
    category: "sensitive_data",
    severity: "medium",
    description: "",
    documentation: "",
    documentNames: []
  });
  const [status, setStatus] = reactExports.useState("approved");
  const [remediationStatus, setRemediationStatus] = reactExports.useState("not_started");
  const [assignedTeam, setAssignedTeam] = reactExports.useState("Admin Review");
  const [internalNote, setInternalNote] = reactExports.useState("");
  const [companyContactEmail, setCompanyContactEmail] = reactExports.useState("");
  const [companyContactPhone, setCompanyContactPhone] = reactExports.useState("");
  const [fileCount, setFileCount] = reactExports.useState("");
  const [remediationRecommendation, setRemediationRecommendation] = reactExports.useState("");
  const [localMessage, setLocalMessage] = reactExports.useState("");
  function resetForm() {
    setDomain("");
    setCompanyName("");
    setSector("");
    setProblem({
      title: "",
      fullUrl: "",
      category: "sensitive_data",
      severity: "medium",
      description: "",
      documentation: "",
      documentNames: []
    });
    setStatus("approved");
    setRemediationStatus("not_started");
    setAssignedTeam("Admin Review");
    setInternalNote("");
    setCompanyContactEmail("");
    setCompanyContactPhone("");
    setFileCount("");
    setRemediationRecommendation("");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (!problem.fullUrl.trim() || !problem.title.trim() || !problem.description.trim() || !problem.documentation.trim()) {
      setLocalMessage("Add the URL, title, description, and actual documentation.");
      return;
    }
    const documentation = [problem.documentation.trim(), problem.documentNames.length ? `Attached documents: ${problem.documentNames.join(", ")}` : ""].filter(Boolean).join("\n\n");
    const ok = await onSubmit({
      domain,
      companyName,
      sector,
      category: problem.category,
      severity: problem.severity,
      status,
      remediationStatus,
      description: problem.description,
      fullUrl: problem.fullUrl,
      snippet: documentation,
      evidenceSample: documentation,
      assignedTeam,
      internalNote,
      companyContactEmail,
      companyContactPhone,
      fileCount: fileCount.trim() ? Number(fileCount) : void 0,
      loginTitle: problem.title,
      remediationRecommendation
    });
    if (ok) {
      setLocalMessage("Entry added. It is now available in the shared workspace state.");
      resetForm();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "panel p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "eyebrow", children: "Admin entry creation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: "Create a domain problem profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-sm leading-7 text-muted-foreground", children: "If the domain already exists, this adds the new problem to that domain profile. New domains get a profile automatically." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
        "Add entry"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Domain", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: domain, onChange: (event) => setDomain(event.target.value), className: "input-base text-sm", placeholder: "example.com" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyName, onChange: (event) => setCompanyName(event.target.value), className: "input-base text-sm", placeholder: "Example Company" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sector", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: sector, onChange: (event) => setSector(event.target.value), className: "input-base text-sm", placeholder: "Technology" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyContactEmail, onChange: (event) => setCompanyContactEmail(event.target.value), className: "input-base text-sm", placeholder: "security@example.com" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyContactPhone, onChange: (event) => setCompanyContactPhone(event.target.value), className: "input-base text-sm", placeholder: "+27 10 555 0100" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProblemDetailsForm, { value: problem, onChange: (next) => {
        setProblem(next);
        try {
          const parsed = new URL(next.fullUrl);
          if (!domain) setDomain(parsed.hostname);
        } catch {
        }
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Assigned team", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: assignedTeam, onChange: (event) => setAssignedTeam(event.target.value), className: "input-base text-sm", placeholder: "Admin Review" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Listing state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: status, onChange: (event) => setStatus(event.target.value), className: "select-base text-sm", children: ["approved", "pending_review", "rejected", "fixed", "archived"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item.replace("_", " ") }, item)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Remediation state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: remediationStatus, onChange: (event) => setRemediationStatus(event.target.value), className: "select-base text-sm", children: ["not_started", "in_progress", "fixed"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item.replace("_", " ") }, item)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "File count", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: fileCount, onChange: (event) => setFileCount(event.target.value), type: "number", min: "0", className: "input-base text-sm", placeholder: "Optional" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Admin remediation guidance (private — owners & moderators only)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: remediationRecommendation, onChange: (event) => setRemediationRecommendation(event.target.value), className: "textarea-base min-h-28 resize-none text-sm", placeholder: "Steps the owner should take to remediate this issue." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Internal note", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: internalNote, onChange: (event) => setInternalNote(event.target.value), className: "textarea-base min-h-28 resize-none text-sm", placeholder: "Private staff or owner note." }) })
    ] }),
    localMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx(Notice, { children: localMessage }) : null
  ] });
}
function applyExposureToEditorForm(exposure, setters) {
  setters.setCompanyName(exposure.companyName);
  setters.setSector(exposure.sector);
  setters.setCategory(exposure.category);
  setters.setSeverity(exposure.severity);
  setters.setStatus(exposure.status);
  setters.setRemediationStatus(exposure.remediationStatus);
  setters.setDescription(exposure.description);
  setters.setFullUrl(exposure.fullUrl);
  setters.setSnippet(exposure.snippet);
  setters.setEvidenceSample(exposure.evidenceSample);
  setters.setAssignedTeam(exposure.assignedTeam);
  setters.setInternalNote(exposure.internalNote);
  setters.setCompanyContactEmail(exposure.companyContactEmail);
  setters.setCompanyContactPhone(exposure.companyContactPhone);
  setters.setLoginTitle(exposure.loginTitle ?? "");
  setters.setRemediationRecommendation(exposure.remediationRecommendation ?? "");
  setters.setRemediationPrice(exposure.remediationPrice != null ? String(exposure.remediationPrice) : "");
  setters.setFileCount(exposure.fileCount != null ? String(exposure.fileCount) : "");
}
function AdminExposureRecordEditor({
  exposure,
  onSave,
  onReverseVerification
}) {
  const [record, setRecord] = reactExports.useState(exposure);
  const [loadError, setLoadError] = reactExports.useState("");
  const [isLoadingRecord, setIsLoadingRecord] = reactExports.useState(true);
  const [companyName, setCompanyName] = reactExports.useState(exposure.companyName);
  const [sector, setSector] = reactExports.useState(exposure.sector);
  const [category, setCategory] = reactExports.useState(exposure.category);
  const [severity, setSeverity] = reactExports.useState(exposure.severity);
  const [status, setStatus] = reactExports.useState(exposure.status);
  const [remediationStatus, setRemediationStatus] = reactExports.useState(exposure.remediationStatus);
  const [description, setDescription] = reactExports.useState(exposure.description);
  const [fullUrl, setFullUrl] = reactExports.useState(exposure.fullUrl);
  const [snippet, setSnippet] = reactExports.useState(exposure.snippet);
  const [evidenceSample, setEvidenceSample] = reactExports.useState(exposure.evidenceSample);
  const [assignedTeam, setAssignedTeam] = reactExports.useState(exposure.assignedTeam);
  const [internalNote, setInternalNote] = reactExports.useState(exposure.internalNote);
  const [companyContactEmail, setCompanyContactEmail] = reactExports.useState(exposure.companyContactEmail);
  const [companyContactPhone, setCompanyContactPhone] = reactExports.useState(exposure.companyContactPhone);
  const [loginTitle, setLoginTitle] = reactExports.useState(exposure.loginTitle ?? "");
  const [remediationRecommendation, setRemediationRecommendation] = reactExports.useState(exposure.remediationRecommendation ?? "");
  const [remediationPrice, setRemediationPrice] = reactExports.useState(exposure.remediationPrice != null ? String(exposure.remediationPrice) : "");
  const [fileCount, setFileCount] = reactExports.useState(exposure.fileCount != null ? String(exposure.fileCount) : "");
  const formSetters = {
    setCompanyName,
    setSector,
    setCategory,
    setSeverity,
    setStatus,
    setRemediationStatus,
    setDescription,
    setFullUrl,
    setSnippet,
    setEvidenceSample,
    setAssignedTeam,
    setInternalNote,
    setCompanyContactEmail,
    setCompanyContactPhone,
    setLoginTitle,
    setRemediationRecommendation,
    setRemediationPrice,
    setFileCount
  };
  reactExports.useEffect(() => {
    let cancelled = false;
    setIsLoadingRecord(true);
    setLoadError("");
    getJson(apiRoutes.exposure(exposure.id)).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setRecord(result.data);
        applyExposureToEditorForm(result.data, formSetters);
        return;
      }
      setLoadError(result.message || "Could not load full exposure details.");
      setRecord(exposure);
      applyExposureToEditorForm(exposure, formSetters);
    }).catch(() => {
      if (cancelled) return;
      setLoadError("Could not load full exposure details from the server.");
      applyExposureToEditorForm(exposure, formSetters);
    }).finally(() => {
      if (!cancelled) setIsLoadingRecord(false);
    });
    return () => {
      cancelled = true;
    };
  }, [exposure.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: [
      record.id,
      " • ",
      record.domain
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 display-font text-2xl font-semibold tracking-tight", children: "Exposure account details" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Private evidence and contacts are only visible to verified owners, moderators, and admins." }),
    isLoadingRecord ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Loading full record from database..." }) : null,
    loadError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100", children: loadError }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Public title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: loginTitle, onChange: (event) => setLoginTitle(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyName, onChange: (event) => setCompanyName(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sector", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: sector, onChange: (event) => setSector(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Owner claim contact email", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyContactEmail, onChange: (event) => setCompanyContactEmail(event.target.value), className: "input-base text-sm", placeholder: "security@domain.com" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Used only for domain-claim verification codes—not the Oasis remediation desk." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Owner claim contact phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyContactPhone, onChange: (event) => setCompanyContactPhone(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full URL (private)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: fullUrl, onChange: (event) => setFullUrl(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Listing state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: status, onChange: (event) => setStatus(event.target.value), className: "select-base text-sm", children: ["approved", "pending_review", "rejected", "fixed", "archived"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item.replace("_", " ") }, item)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Remediation state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: remediationStatus, onChange: (event) => setRemediationStatus(event.target.value), className: "select-base text-sm", children: ["not_started", "in_progress", "fixed"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item.replace("_", " ") }, item)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: category, onChange: (event) => setCategory(event.target.value), className: "select-base text-sm", children: Object.keys(categoryMeta).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: categoryMeta[item].label }, item)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Severity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: severity, onChange: (event) => setSeverity(event.target.value), className: "select-base text-sm", children: ["critical", "high", "medium", "low", "info"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item }, item)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Remediation price (USD)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: remediationPrice, onChange: (event) => setRemediationPrice(event.target.value), type: "number", min: "0", className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "File count", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: fileCount, onChange: (event) => setFileCount(event.target.value), type: "number", min: "0", className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Assigned team", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: assignedTeam, onChange: (event) => setAssignedTeam(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description (private)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (event) => setDescription(event.target.value), className: "textarea-base min-h-24 resize-none text-sm" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Evidence / documentation (private)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: evidenceSample, onChange: (event) => {
        setEvidenceSample(event.target.value);
        setSnippet(event.target.value);
      }, className: "textarea-base min-h-32 resize-none text-sm mono" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Admin remediation guidance (private)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: remediationRecommendation, onChange: (event) => setRemediationRecommendation(event.target.value), className: "textarea-base min-h-28 resize-none text-sm" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Internal note", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: internalNote, onChange: (event) => setInternalNote(event.target.value), className: "textarea-base min-h-24 resize-none text-sm" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: isLoadingRecord, onClick: () => onSave({
        exposureId: record.id,
        companyName,
        sector,
        category,
        severity,
        status,
        remediationStatus,
        description,
        fullUrl,
        snippet,
        evidenceSample,
        assignedTeam,
        internalNote,
        companyContactEmail,
        companyContactPhone,
        loginTitle,
        remediationRecommendation,
        remediationPrice: remediationPrice.trim() ? Number(remediationPrice) : void 0,
        fileCount: fileCount.trim() ? Number(fileCount) : void 0
      }), className: "inline-flex h-11 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground", children: "Save exposure details" }),
      exposure.removalReviewStatus === "verified_removed" && onReverseVerification ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onReverseVerification, className: "inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium", children: "Reverse verification" }) : null
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block text-sm font-medium text-foreground", children: label }),
    children
  ] });
}
function TrendPanel() {
  const {
    state
  } = useAppContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-6 lg:col-span-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Remediation velocity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Discovered, remediated, and submitted records across live state." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: state.analytics, margin: {
      top: 10,
      right: 10,
      bottom: 0,
      left: -20
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "dashboard-discovered", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--color-severity-high)", stopOpacity: 0.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--color-severity-high)", stopOpacity: 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "dashboard-fixed", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--color-primary)", stopOpacity: 0.45 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--color-primary)", stopOpacity: 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 5", vertical: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", stroke: "var(--color-muted-foreground)", fontSize: 10, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 10, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { dataKey: "discovered", stroke: "var(--color-severity-high)", fill: "url(#dashboard-discovered)", strokeWidth: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { dataKey: "remediated", stroke: "var(--color-primary)", fill: "url(#dashboard-fixed)", strokeWidth: 2 })
    ] }) }) })
  ] });
}
function ExposureAgePanel({
  exposures
}) {
  const data = reactExports.useMemo(() => {
    const buckets = [{
      bucket: "<1d",
      count: 0
    }, {
      bucket: "1-7d",
      count: 0
    }, {
      bucket: "7-30d",
      count: 0
    }, {
      bucket: "30d+",
      count: 0
    }];
    exposures.forEach((exposure) => {
      const age = daysBetween(exposure.discoveredAt);
      if (age < 1) buckets[0].count += 1;
      else if (age <= 7) buckets[1].count += 1;
      else if (age <= 30) buckets[2].count += 1;
      else buckets[3].count += 1;
    });
    return buckets;
  }, [exposures]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Exposure age" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Days since each active item was first detected." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data, margin: {
      top: 10,
      right: 10,
      bottom: 0,
      left: -20
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 5", vertical: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "bucket", stroke: "var(--color-muted-foreground)", fontSize: 10, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 10, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle, cursor: {
        fill: "var(--color-accent)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", radius: [4, 4, 0, 0], fill: "var(--color-primary)" })
    ] }) }) })
  ] });
}
function ExposureTable({
  exposures,
  selectedId,
  onSelect,
  onDeleteExposure,
  onDeleteDomain
}) {
  const grouped = groupExposuresByDomain(exposures);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/70 px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Domain profiles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
        grouped.length,
        " domains"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/70", children: grouped.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-5 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: profile.domain }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            profile.companyName,
            " | ",
            profile.exposures.length,
            " problems"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground", children: [
            "Last seen ",
            formatFullDate(profile.lastSeen)
          ] }),
          onDeleteDomain ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onDeleteDomain(profile.domain), className: "rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50", children: "Delete profile" }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: profile.exposures.map((exposure) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid gap-3 rounded-md border px-4 py-3 text-left transition-colors md:grid-cols-[1fr_auto_auto] md:items-center ${selectedId === exposure.id ? "border-primary/45 bg-primary/10" : "border-border bg-background/40 hover:border-primary/30"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onSelect(exposure.id), className: "min-w-0 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: getExposureTitle(exposure) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate mono text-xs text-muted-foreground", children: exposure.exactPath })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: exposure.severity }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: exposure.remediationStatus }),
          onDeleteExposure ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onDeleteExposure(exposure.id), className: "rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50", children: "Delete" }) : null
        ] })
      ] }, exposure.id)) })
    ] }, profile.domain)) }),
    exposures.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No verified-domain exposures yet", body: "Claim a domain from the public directory to unlock private records." }) : null
  ] });
}
function groupExposuresByDomain(exposures) {
  const groups = /* @__PURE__ */ new Map();
  exposures.forEach((exposure) => {
    groups.set(exposure.domain, [...groups.get(exposure.domain) ?? [], exposure]);
  });
  return Array.from(groups.entries()).map(([domain, domainExposures]) => {
    const sorted = domainExposures.sort((left, right) => {
      return new Date(right.lastSeen).getTime() - new Date(left.lastSeen).getTime();
    });
    return {
      domain,
      companyName: sorted[0]?.companyName ?? domain,
      lastSeen: sorted[0]?.lastSeen ?? (/* @__PURE__ */ new Date()).toISOString(),
      exposures: sorted
    };
  }).sort((left, right) => left.domain.localeCompare(right.domain));
}
function getExposureTitle(exposure) {
  return exposure.loginTitle?.trim() || `${categoryMeta[exposure.category].label} on ${exposure.exactPath || exposure.domain}`;
}
function StatusBadge({
  status
}) {
  const meta = {
    not_started: {
      label: "Not started",
      color: "var(--color-muted-foreground)",
      icon: CircleAlert
    },
    in_progress: {
      label: "In progress",
      color: "var(--color-severity-medium)",
      icon: Clock
    },
    fixed: {
      label: "Fixed",
      color: "var(--color-primary)",
      icon: CircleCheck
    }
  }[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 mono text-[10px] uppercase tracking-wider", style: {
    color: meta.color
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(meta.icon, { className: "h-3 w-3" }),
    meta.label
  ] });
}
function PrivateField({
  label,
  value,
  pre
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: label }),
    pre ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 max-h-44 overflow-auto rounded-2xl border border-border bg-background/60 p-3 mono text-[11px] whitespace-pre-wrap text-muted-foreground", children: value }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 break-all mono text-xs text-foreground", children: value })
  ] });
}
function SubmissionReviewRow({
  submission,
  note,
  onNoteChange,
  onReview
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 px-5 py-5 lg:grid-cols-[1fr_280px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: submission.severity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: submission.id })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-sm font-medium", children: submission.domain }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-muted-foreground", children: submission.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-3 rounded-2xl border border-border bg-background/60 p-3 mono text-[11px] text-muted-foreground whitespace-pre-wrap", children: submission.proofOfConcept })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: note, onChange: (event) => onNoteChange(event.target.value), className: "textarea-base h-28 resize-none text-xs", placeholder: "Moderator note" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onReview("reject"), className: "rounded-full border border-border px-3 py-2 text-xs", children: "Reject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onReview("approve"), className: "rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground", children: "Approve" })
      ] })
    ] })
  ] });
}
function OwnerAlerts({
  userId
}) {
  const {
    state
  } = useAppContext();
  const alerts = (state.notifications ?? []).filter((item) => item.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  if (alerts.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/80 bg-card/60 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-primary" }),
      "Recent alerts"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: alerts.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-md border border-border/60 px-3 py-2 ${item.read ? "opacity-80" : "bg-primary/5"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: item.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[10px] text-muted-foreground", children: formatShortDate(item.createdAt) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-5 text-muted-foreground", children: item.message })
    ] }, item.id)) })
  ] });
}
function FlagCard({
  flag,
  onResolve
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 rounded-lg border border-border/80 bg-muted/20 p-4 text-sm sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Exposure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-medium", children: flag.domain }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: flag.exposureTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mono mt-1 text-[10px] text-muted-foreground", children: flag.exposureId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Reporter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-medium", children: flag.reporterName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs capitalize text-muted-foreground", children: flag.reporterRole.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Flag type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 capitalize", children: flag.flagType.replace(/_/g, " ") }),
        flag.title ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-foreground", children: flag.title }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Exposure state" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs", children: [
          "Listing:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: flag.exposureListingStatus.replace(/_/g, " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
          "Remediation:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: flag.exposureRemediationStatus.replace(/_/g, " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityPill, { severity: flag.severity }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Reason" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-foreground", children: flag.reason })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onResolve("dismissed"), className: "rounded-full border border-border px-3 py-2 text-xs", children: "Dismiss" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onResolve("resolved"), className: "rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground", children: "Resolve" })
    ] })
  ] });
}
function UserAccessRow({
  user,
  canDelete,
  onUpdate,
  onDelete
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(user.name);
  const [email, setEmail] = reactExports.useState(user.email);
  const [title, setTitle] = reactExports.useState(user.title);
  const [company, setCompany] = reactExports.useState(user.company);
  const [password, setPassword] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[1fr_180px_160px_auto_auto] lg:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: user.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-sm font-medium", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: user.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: user.passwordHint })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: user.role, onChange: (event) => onUpdate({
        userId: user.id,
        role: event.target.value
      }), className: "select-base text-sm", children: Object.keys(roleMeta).map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: role, children: roleMeta[role].label }, role)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: user.status, onChange: (event) => onUpdate({
        userId: user.id,
        status: event.target.value
      }), className: "select-base text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending_review", children: "Pending review" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "temporary", children: "Temporary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suspended", children: "Suspended" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setExpanded((current) => !current), className: "rounded-md border border-border px-3 py-2 text-xs", children: expanded ? "Hide" : "Edit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onDelete(user.id), disabled: canDelete === false, className: canDelete === false ? "rounded-md border border-border px-3 py-2 text-xs text-muted-foreground opacity-70" : "rounded-md border border-destructive/40 px-3 py-2 text-xs text-destructive", children: canDelete === false ? "Admin locked" : "Delete" })
    ] }),
    expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 rounded-xl border border-border/70 bg-background/40 p-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (event) => setName(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: email, onChange: (event) => setEmail(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (event) => setTitle(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: company, onChange: (event) => setCompany(event.target.value), className: "input-base text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Set new password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: password, onChange: (event) => setPassword(event.target.value), type: "password", className: "input-base text-sm", placeholder: "Leave blank to keep current" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onUpdate({
        userId: user.id,
        name,
        email,
        title,
        company,
        password: password.trim() || void 0
      }), className: "h-11 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground", children: "Save account details" }) })
    ] }) : null
  ] });
}
function Notice({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border border-primary/25 bg-primary/10 px-5 py-4 text-sm text-foreground", children });
}
function EmptyState({
  title,
  body
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mx-auto h-8 w-8 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 display-font text-2xl font-semibold tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground", children: body })
  ] });
}
export {
  DashboardPage as component
};
