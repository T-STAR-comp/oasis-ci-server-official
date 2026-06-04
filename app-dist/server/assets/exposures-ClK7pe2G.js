import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { P as PoliciesCheckbox } from "./PoliciesCheckbox-DQ3_JU38.js";
import { S as SeverityPill } from "./SeverityPill-Be8mqipI.js";
import { C as CURRENT_POLICIES_VERSION } from "./oasis-ci-policies-D7vl66Ag.js";
import { v as useAppContext, l as hasAnyRole, u as sortBySeverity, o as isExposureVisibleToPublic, m as isDomainClaimed, g as categoryMeta, k as getExposurePublicTitle, i as formatFullDate } from "./router-C-EVOOem.js";
import "@tanstack/react-query";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
const severityOptions = ["all", "critical", "high", "medium", "low", "info"];
function ExposuresPage() {
  const {
    state,
    currentUser,
    setPublicSearch
  } = useAppContext();
  const [tab, setTab] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [range, setRange] = useState("30d");
  const [query, setQuery] = useState(state.publicSearch);
  const [claimTarget, setClaimTarget] = useState(null);
  useEffect(() => {
    setQuery(state.publicSearch);
  }, [state.publicSearch]);
  useEffect(() => {
    setPublicSearch(query);
  }, [query, setPublicSearch]);
  const canSeePending = hasAnyRole(currentUser?.role, ["moderator", "admin"]);
  const tabs = [{
    key: "all",
    label: "All"
  }, {
    key: "sensitive_data",
    label: "Sensitive Data"
  }, {
    key: "open_directory",
    label: "Open Directories"
  }, {
    key: "admin_panel",
    label: "Admin Panels"
  }, {
    key: "backup_config",
    label: "Backup and Config"
  }, ...canSeePending ? [{
    key: "pending_review",
    label: "Pending Review"
  }] : []];
  const visibleExposures = sortBySeverity(state.exposures.filter((exposure) => tab === "pending_review" ? canSeePending && exposure.status === "pending_review" : isExposureVisibleToPublic(exposure))).filter((exposure) => {
    if (tab !== "all" && tab !== "pending_review" && exposure.category !== tab) return false;
    if (severity !== "all" && exposure.severity !== severity) return false;
    if (!matchesDateRange(exposure.discoveredAt, range)) return false;
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return exposure.domain.toLowerCase().includes(normalized) || exposure.companyName.toLowerCase().includes(normalized) || exposure.id.toLowerCase().includes(normalized);
  });
  const suggestions = Array.from(new Set(state.exposures.filter((exposure) => isExposureVisibleToPublic(exposure)).map((exposure) => exposure.domain))).filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5);
  return /* @__PURE__ */ jsxs("div", { className: "border-b border-border/70", children: [
    /* @__PURE__ */ jsx("section", { className: "border-b border-border/70", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Public directory" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 display-font text-5xl font-semibold tracking-tight", children: "Exposure listings" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-sm leading-7 text-muted-foreground", children: "Owners can claim a domain to unlock the full evidence, while testers and moderators can review pending items inside their authenticated workspaces." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-full border border-border bg-card/85 px-4 py-3", children: [
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search a domain, company, or exposure ID", className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" })
          ] }),
          query.trim() && suggestions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-3xl border border-border bg-card p-2 shadow-2xl", children: suggestions.map((suggestion) => /* @__PURE__ */ jsx("button", { onClick: () => setQuery(suggestion), className: "block w-full rounded-2xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent/70", children: suggestion }, suggestion)) }) : null
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 flex flex-wrap gap-2", children: tabs.map((item) => {
        const active = tab === item.key;
        const count = countTabItems(state.exposures, item.key, canSeePending);
        return /* @__PURE__ */ jsxs("button", { onClick: () => setTab(item.key), className: `rounded-full border px-4 py-2 text-sm transition-colors ${active ? "border-primary/45 bg-primary/12 text-foreground" : "border-border bg-card/70 text-muted-foreground hover:text-foreground"}`, children: [
          item.label,
          /* @__PURE__ */ jsx("span", { className: "ml-2 mono text-[10px] uppercase tracking-[0.2em]", children: count })
        ] }, item.key);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[260px_1fr]", children: [
      /* @__PURE__ */ jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "panel p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4 text-primary" }),
            "Filters"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Severity" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: severityOptions.map((item) => {
              const active = severity === item;
              return /* @__PURE__ */ jsx("button", { onClick: () => setSeverity(item), className: `rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${active ? "border-primary/45 bg-primary/12 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`, children: item === "all" ? "All severities" : item }, item);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t border-border/70 pt-5", children: [
            /* @__PURE__ */ jsx("p", { className: "mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Date range" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: [{
              value: "24h",
              label: "Last 24 hours"
            }, {
              value: "7d",
              label: "Last 7 days"
            }, {
              value: "30d",
              label: "Last 30 days"
            }, {
              value: "90d",
              label: "Last 90 days"
            }, {
              value: "all",
              label: "All time"
            }].map((item) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx("input", { type: "radio", checked: range === item.value, onChange: () => setRange(item.value), className: "accent-[var(--color-primary)]" }),
              item.label
            ] }, item.value)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "panel p-5", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsx("h3", { className: "mt-4 display-font text-2xl font-semibold tracking-tight", children: "Is this your website?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: "Claim ownership with a one-time email code sent to the company contact details Oasis CI has on file. The owner dashboard stays open while issues are ongoing." }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            const fallback = visibleExposures[0] ?? null;
            if (fallback) setClaimTarget(fallback);
          }, className: "mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Start a claim" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Showing ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: visibleExposures.length }),
            " listings"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "mono uppercase tracking-[0.2em]", children: "Sorted by severity" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-4", children: [
          visibleExposures.map((exposure) => {
            const claimed = isDomainClaimed(state.domains, exposure.domain, currentUser?.id);
            return /* @__PURE__ */ jsxs("button", { onClick: () => !claimed && setClaimTarget(exposure), disabled: claimed, className: `panel p-5 text-left transition-colors ${claimed ? "cursor-default opacity-80" : "hover:border-primary/35"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ jsx(SeverityPill, { severity: exposure.severity }),
                    /* @__PURE__ */ jsx("span", { className: "rounded-full border px-2 py-0.5 mono text-[10px] uppercase tracking-[0.2em]", style: {
                      color: categoryMeta[exposure.category].color,
                      borderColor: `color-mix(in oklab, ${categoryMeta[exposure.category].color} 35%, transparent)`,
                      backgroundColor: `color-mix(in oklab, ${categoryMeta[exposure.category].color} 10%, transparent)`
                    }, children: categoryMeta[exposure.category].label }),
                    exposure.status === "pending_review" ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border px-2 py-0.5 mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Pending review" }) : null,
                    /* @__PURE__ */ jsx("span", { className: "mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: exposure.id })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-lg font-medium", children: exposure.domain }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: exposure.companyName })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "mt-4 text-base font-semibold text-foreground", children: getExposurePublicTitle(exposure) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Remediation guidance and evidence are available only after verified ownership." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "shrink-0 rounded-3xl border border-border bg-background/55 px-4 py-3 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsx("div", { children: "Discovered" }),
                  /* @__PURE__ */ jsx("div", { className: "text-foreground", children: formatFullDate(exposure.discoveredAt) }),
                  /* @__PURE__ */ jsx("div", { className: "mt-3", children: "Last seen" }),
                  /* @__PURE__ */ jsx("div", { className: "text-foreground", children: formatFullDate(exposure.lastSeen) }),
                  /* @__PURE__ */ jsx("div", { className: "mt-3", children: "Sector" }),
                  /* @__PURE__ */ jsx("div", { className: "text-foreground", children: exposure.sector })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: claimed ? "This domain has a verified owner." : "Evidence stays private until ownership is verified." }),
                !claimed ? /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: "Is this your website?" }) : null
              ] })
            ] }, exposure.id);
          }),
          visibleExposures.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "panel p-8 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "display-font text-2xl font-semibold tracking-tight", children: "No exposures matched the current filters." }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: "Try a broader date range, clear the search query, or switch back to the main tabs for public listings." })
          ] }) : null
        ] })
      ] })
    ] }),
    claimTarget ? /* @__PURE__ */ jsx(ClaimFlowModal, { exposure: claimTarget, onClose: () => setClaimTarget(null) }) : null
  ] });
}
function ClaimFlowModal({
  exposure,
  onClose
}) {
  const {
    state,
    currentUser,
    startClaim,
    verifyClaim
  } = useAppContext();
  const navigate = useNavigate();
  const method = "email";
  const domainContactEmail = state.domains.find((entry) => entry.domain === exposure.domain)?.contactEmail?.trim() ?? "";
  const claimEmail = (exposure.companyContactEmail?.trim() || domainContactEmail).trim();
  const hasConfiguredClaimEmail = claimEmail.length > 0;
  const domainAlreadyClaimed = isDomainClaimed(state.domains, exposure.domain, currentUser?.id);
  const [ownerName, setOwnerName] = useState(currentUser?.name ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [claimId, setClaimId] = useState(null);
  const [enteredToken, setEnteredToken] = useState("");
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [message, setMessage] = useState("");
  async function handleStartClaim() {
    if (domainAlreadyClaimed) {
      setMessage("This domain already has a verified owner and cannot be claimed again.");
      return;
    }
    if (!hasConfiguredClaimEmail) {
      setMessage("No admin verification email is configured for this exposure yet.");
      return;
    }
    const claimResult = await startClaim({
      exposureId: exposure.id,
      domain: exposure.domain,
      method,
      contact: claimEmail
    });
    if (!claimResult.ok || !claimResult.claim) {
      setMessage(claimResult.message || "The server could not start this claim. Check the API and try again.");
      return;
    }
    const claim = claimResult.claim;
    setClaimId(claim.id);
    setEnteredToken("");
    setMessage(claimResult.message || `A verification code was sent to ${claimEmail}. Enter it below with your password to finish claiming.`);
  }
  async function handleVerify() {
    if (!claimId) return;
    if (!password || password.length < 8) {
      setMessage("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Password and confirmation must match.");
      return;
    }
    if (!policiesAccepted) {
      setMessage("Accept the Oasis CI policies before completing your claim.");
      return;
    }
    const result = await verifyClaim({
      claimId,
      token: enteredToken,
      password,
      confirmPassword,
      name: ownerName.trim() || void 0,
      policiesVersion: CURRENT_POLICIES_VERSION,
      policiesAcknowledged: true
    });
    setMessage(result.message);
    if (result.ok) {
      setTimeout(() => {
        navigate({
          to: "/dashboard"
        });
        onClose();
      }, 500);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-background/75 px-4 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsx("div", { className: "panel flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden", onClick: (event) => event.stopPropagation(), children: /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto p-6 sm:p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "eyebrow", children: "Owner claim workflow" }),
    /* @__PURE__ */ jsxs("h3", { className: "mt-3 display-font text-3xl font-semibold tracking-tight", children: [
      "Verify ownership for ",
      exposure.domain
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-muted-foreground", children: "Verify your company email, set a password for your owner account, and open the private dashboard. Once a domain is claimed, no one else can start a new claim." }),
    domainAlreadyClaimed ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl border border-severity-medium/40 bg-severity-medium/10 px-4 py-3 text-sm", children: "This domain already has a verified owner." }) : null,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Domain" }),
        /* @__PURE__ */ jsx("input", { value: exposure.domain, readOnly: true, className: "input-base text-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Verification method" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "subtle-panel flex cursor-pointer items-start gap-3 px-4 py-3 text-sm", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name: "claim-method", checked: true, readOnly: true, className: "mt-1 accent-[var(--color-primary)]" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: "Email code" }),
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Registered contact on file" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "subtle-panel flex cursor-not-allowed items-start gap-3 px-4 py-3 text-sm opacity-45", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", checked: false, disabled: true, readOnly: true, className: "mt-1 accent-[var(--color-primary)]" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: "SMS code unavailable" }),
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Email verification is required for now." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Verification email (set by admin)" }),
        /* @__PURE__ */ jsx("input", { value: claimEmail || "Not configured", readOnly: true, className: "input-base text-sm opacity-80" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Codes are sent only to this address. It cannot be changed during the claim flow." })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Your name" }),
        /* @__PURE__ */ jsx("input", { value: ownerName, onChange: (event) => setOwnerName(event.target.value), className: "input-base text-sm", placeholder: "Security lead name", disabled: domainAlreadyClaimed })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Set password" }),
          /* @__PURE__ */ jsx("input", { value: password, onChange: (event) => setPassword(event.target.value), type: "password", className: "input-base text-sm", placeholder: "Minimum 8 characters", disabled: domainAlreadyClaimed })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Confirm password" }),
          /* @__PURE__ */ jsx("input", { value: confirmPassword, onChange: (event) => setConfirmPassword(event.target.value), type: "password", className: "input-base text-sm", disabled: domainAlreadyClaimed })
        ] })
      ] }),
      claimId ? /* @__PURE__ */ jsx(PoliciesCheckbox, { checked: policiesAccepted, onChange: setPoliciesAccepted, disabled: domainAlreadyClaimed }) : null,
      claimId ? /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-2 block text-sm font-medium", children: "Verification code from email" }),
        /* @__PURE__ */ jsx("input", { value: enteredToken, onChange: (event) => setEnteredToken(event.target.value), className: "input-base text-sm", placeholder: "Enter the code you received", autoComplete: "one-time-code" })
      ] }) : null,
      message ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground", children: message }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap justify-end gap-2 border-t border-border/70 bg-card/95 px-6 py-4 sm:px-8", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { onClick: handleStartClaim, disabled: domainAlreadyClaimed || !hasConfiguredClaimEmail, className: "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground disabled:opacity-50", children: "Send code" }),
      /* @__PURE__ */ jsx("button", { onClick: handleVerify, disabled: domainAlreadyClaimed, className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50", children: "Verify and continue" })
    ] })
  ] }) }) });
}
function matchesDateRange(date, range) {
  if (range === "all") return true;
  const days = range === "24h" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1e3;
  return new Date(date).getTime() >= cutoff;
}
function countTabItems(exposures, tab, canSeePending) {
  return exposures.filter((exposure) => {
    if (tab === "pending_review") return canSeePending && exposure.status === "pending_review";
    if (!isExposureVisibleToPublic(exposure)) return false;
    if (tab === "all") return true;
    return exposure.category === tab;
  }).length;
}
export {
  ExposuresPage as component
};
