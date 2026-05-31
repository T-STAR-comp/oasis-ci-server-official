import { env } from "../config/env.js";
import {
  CURRENT_POLICIES_VERSION,
  POLICIES_EFFECTIVE_DATE,
  POLICIES_TITLE,
} from "../config/policies.js";

export function getPlatformSettings() {
  return {
    remediationEmail: env.remediationEmail,
    remediationPhone: env.remediationPhone,
    policiesVersion: CURRENT_POLICIES_VERSION,
    policiesEffectiveDate: POLICIES_EFFECTIVE_DATE,
    policiesTitle: POLICIES_TITLE,
  };
}
