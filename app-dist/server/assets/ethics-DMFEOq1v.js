import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronDown, EyeOff, Lock, UserRoundCheck, Flag, HeartHandshake, ShieldCheck } from "lucide-react";
import { a as POLICIES_OPERATOR, P as POLICIES_EFFECTIVE_DATE, b as POLICIES_TITLE, C as CURRENT_POLICIES_VERSION, c as POLICY_PREAMBLE, d as POLICY_SECTIONS } from "./oasis-ci-policies-D7vl66Ag.js";
import { r as roleMeta, q as rolePermissions, p as penTesterMutedClass } from "./router-C-EVOOem.js";
import "@tanstack/react-query";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
function PolicyOutline() {
  const [expandedId, setExpandedId] = useState(null);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "mono text-[10px] uppercase tracking-[0.24em] text-primary", children: [
        POLICIES_OPERATOR,
        " · Effective ",
        POLICIES_EFFECTIVE_DATE
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "display-font text-3xl font-semibold tracking-tight md:text-4xl", children: POLICIES_TITLE }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Version ",
        CURRENT_POLICIES_VERSION,
        " · Ten policies governing investigation, disclosure, claims, evidence, and enforcement on Oasis CI."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 rounded-lg border border-border/80 bg-muted/20 p-4", children: POLICY_PREAMBLE.map((block, index) => /* @__PURE__ */ jsx(PolicyBlockView, { block, compact: true }, `preamble-${index}`)) })
    ] }),
    /* @__PURE__ */ jsxs(
      "nav",
      {
        "aria-label": "Policy contents",
        className: "rounded-lg border border-border/80 bg-card/50 p-4",
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Policy outline" }),
          /* @__PURE__ */ jsx("ol", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: POLICY_SECTIONS.map((section) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setExpandedId((current) => current === section.id ? null : section.id);
                document.getElementById(`policy-section-${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              },
              className: "flex w-full items-start gap-3 rounded-md border border-transparent px-3 py-2 text-left text-sm transition-colors hover:border-border hover:bg-accent/40",
              children: [
                /* @__PURE__ */ jsx("span", { className: "mono shrink-0 text-[10px] text-primary", children: section.number }),
                /* @__PURE__ */ jsx("span", { className: "text-foreground", children: section.title })
              ]
            }
          ) }, section.id)) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: POLICY_SECTIONS.map((section) => {
      const open = expandedId === section.id;
      return /* @__PURE__ */ jsxs(
        "section",
        {
          id: `policy-section-${section.id}`,
          className: "scroll-mt-24 rounded-lg border border-border/80 bg-card/40",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setExpandedId((current) => current === section.id ? null : section.id),
                className: "flex w-full items-center justify-between gap-4 px-5 py-4 text-left",
                "aria-expanded": open,
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "mono text-[10px] uppercase tracking-[0.2em] text-primary", children: [
                      "Policy ",
                      section.number
                    ] }),
                    /* @__PURE__ */ jsx("h3", { className: "mt-1 text-base font-semibold text-foreground", children: section.title })
                  ] }),
                  /* @__PURE__ */ jsx(
                    ChevronDown,
                    {
                      className: `h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`
                    }
                  )
                ]
              }
            ),
            open ? /* @__PURE__ */ jsx("div", { className: "space-y-4 border-t border-border/70 px-5 pb-5 pt-4", children: section.blocks.map((block, index) => /* @__PURE__ */ jsx(PolicyBlockView, { block }, `${section.id}-${index}`)) }) : null
          ]
        },
        section.id
      );
    }) }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs leading-6 text-muted-foreground", children: [
      "Approved by ",
      POLICIES_OPERATOR,
      ". Governing law: Republic of Malawi. Source document:",
      " ",
      "Oasis_CI_Policies.docx."
    ] })
  ] });
}
function PolicyBlockView({ block, compact = false }) {
  if (block.kind === "h3") {
    return /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: block.text });
  }
  if (block.kind === "ul") {
    return /* @__PURE__ */ jsx(
      "ul",
      {
        className: `list-disc space-y-2 pl-5 text-muted-foreground ${compact ? "text-xs leading-6" : "text-sm leading-7"}`,
        children: block.items.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item))
      }
    );
  }
  if (block.kind === "important") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `rounded-md border border-primary/30 bg-primary/10 text-foreground ${compact ? "px-3 py-2 text-xs leading-6" : "px-4 py-3 text-sm leading-7"}`,
        children: block.text
      }
    );
  }
  return /* @__PURE__ */ jsx("p", { className: `text-muted-foreground ${compact ? "text-xs leading-6" : "text-sm leading-7"}`, children: block.text });
}
const principles = [{
  icon: EyeOff,
  title: "Public metadata only",
  body: "Public listings stay redacted. Full URLs, file contents, and rich evidence are gated behind verified access."
}, {
  icon: Lock,
  title: "Owner evidence stays private",
  body: "Private evidence is intended for verified owners and authorized moderators only, matching the intended back-end controls from the docs."
}, {
  icon: UserRoundCheck,
  title: "Owner identity remains protected",
  body: "Ownership verification unlocks the dashboard without publishing who owns the affected domain."
}, {
  icon: Flag,
  title: "False positives are reviewable",
  body: "Owners and researchers can flag questionable listings, which routes them to the moderation queue for follow-up."
}, {
  icon: HeartHandshake,
  title: "No shaming and no exploit guidance",
  body: "The experience is designed for remediation, not spectacle. Researchers submit safe, redacted findings instead of exploit instructions."
}, {
  icon: ShieldCheck,
  title: "Fixed findings are eligible for cleanup",
  body: "Once findings are fixed and re-scanned clean, the product flow is designed to hide them from the public directory automatically."
}];
function EthicsPage() {
  useEffect(() => {
    if (window.location.hash === "#policies-outline") {
      document.getElementById("policies-outline")?.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Trust and safety foundations" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 display-font text-5xl font-semibold tracking-tight md:text-6xl", children: "Built to protect, not to expose." }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground", children: "The platform exists to help website owners secure public exposures before attackers do. Every workflow follows that boundary: public discovery, private evidence, moderated submissions, and careful remediation." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: principles.map((principle) => /* @__PURE__ */ jsxs("div", { className: "panel p-7", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/10", children: /* @__PURE__ */ jsx(principle.icon, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsx("h2", { className: "mt-5 display-font text-2xl font-semibold tracking-tight", children: principle.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: principle.body })
    ] }, principle.title)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: `border-b border-border/70 ${penTesterMutedClass()}`, children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-10 lg:grid-cols-[1fr_1fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "panel p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Researcher boundaries (unavailable)" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: "Rules of engagement for manual discovery" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-3", children: ["Never download, store, or share actual exposed data.", "Never exploit a finding beyond the minimum needed to verify it.", "Respect robots.txt, rate limits, and defensive controls.", "Escalate accidental critical PII immediately through moderation.", "Use redacted descriptions and proof of concept only.", "Do not contact affected owners directly outside the platform flow."].map((rule, index) => /* @__PURE__ */ jsxs("div", { className: "subtle-panel flex gap-4 px-4 py-4 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "mono text-primary", children: String(index + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx("span", { className: "leading-7 text-foreground/88", children: rule })
        ] }, rule)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Role permissions" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: "Workspace permissions" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: Object.entries(roleMeta).map(([role, meta]) => /* @__PURE__ */ jsxs("div", { className: "subtle-panel px-5 py-5", children: [
          /* @__PURE__ */ jsx("div", { className: "display-font text-xl font-semibold", children: meta.label }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-7 text-muted-foreground", children: meta.description }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2 text-sm", children: rolePermissions[role].map((permission) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 rounded-full bg-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground/88", children: permission })
          ] }, permission)) })
        ] }, role)) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { id: "policies-outline", className: "scroll-mt-24 border-b border-border/70 bg-muted/10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-20", children: [
      /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Governance" }),
      /* @__PURE__ */ jsx(PolicyOutline, {})
    ] }) }),
    /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "display-font text-4xl font-semibold tracking-tight", children: "Ready to walk through the secure workflow?" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground", children: "Sign in to the owner, researcher, moderator, or admin workspace and watch how records move through claim verification, submission, review, and remediation." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground", children: "Open dashboard" }),
        /* @__PURE__ */ jsx("a", { href: "/ethics#policies-outline", className: "rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground", children: "Read policy outline" }),
        /* @__PURE__ */ jsx(Link, { to: "/exposures", className: "rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground", children: "Browse public listings" })
      ] })
    ] }) })
  ] });
}
export {
  EthicsPage as component
};
