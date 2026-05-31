import { jsxs, jsx } from "react/jsx-runtime";
import { C as CURRENT_POLICIES_VERSION } from "./oasis-ci-policies-D7vl66Ag.js";
function PoliciesCheckbox({
  checked,
  onChange,
  disabled = false
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-start gap-3 rounded-md border border-border/80 bg-muted/20 px-4 py-3 text-sm leading-6", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "checkbox",
        checked,
        disabled,
        onChange: (event) => onChange(event.target.checked),
        className: "mt-1 accent-[var(--color-primary)]"
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
      "I have read and agree to the",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/ethics#policies-outline", className: "font-medium text-primary hover:underline", target: "_blank", rel: "noreferrer", children: "Oasis CI platform policies" }),
      " ",
      "(version ",
      CURRENT_POLICIES_VERSION,
      "), including all ten investigation and disclosure policies governing submissions, claims, evidence, remediation, and enforcement."
    ] })
  ] });
}
export {
  PoliciesCheckbox as P
};
