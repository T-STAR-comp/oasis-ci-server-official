import { jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { P as PenTesterDisabledShell } from "./router-C-EVOOem.js";
import "@tanstack/react-query";
import "react";
import "lucide-react";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
function SubmitPage() {
  return /* @__PURE__ */ jsx(PenTesterDisabledShell, { title: "Researcher submission form unavailable", children: /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Sign in as owner or admin" }) });
}
export {
  SubmitPage as component
};
