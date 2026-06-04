import { jsxs, jsx } from "react/jsx-runtime";
import { t as severityMeta } from "./router-C-EVOOem.js";
function SeverityPill({ severity }) {
  const meta = severityMeta[severity];
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 mono text-[10px] uppercase tracking-wider",
      style: {
        color: meta.color,
        borderColor: `color-mix(in oklab, ${meta.color} 35%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${meta.color} 10%, transparent)`
      },
      children: [
        /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full", style: { backgroundColor: meta.color } }),
        meta.label
      ]
    }
  );
}
export {
  SeverityPill as S
};
