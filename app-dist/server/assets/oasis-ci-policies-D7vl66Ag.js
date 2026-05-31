const CURRENT_POLICIES_VERSION = "2026.1";
const POLICIES_EFFECTIVE_DATE = "2026-01-01";
const POLICIES_TITLE = "Oasis CI Cybersecurity Investigation Policies";
const POLICIES_OPERATOR = "Oasis Tech Capital LLC";
const POLICY_PREAMBLE = [
  {
    kind: "p",
    text: "Oasis CI is a cybersecurity investigation platform operated by Oasis Tech Capital LLC. The platform serves as a structured, controlled environment in which cybersecurity administrators identify, document, and disclose security vulnerabilities affecting digital platforms and domains. Verified domain owners may claim their asset and receive detailed, evidence-backed proof of vulnerabilities affecting it."
  },
  {
    kind: "p",
    text: "These policies govern every aspect of how Oasis CI operates: domain submission and logging, ownership verification, evidence standards, owner notification, sensitive data handling, and enforcement when the process is abused or disputed."
  },
  {
    kind: "important",
    text: "These policies apply without exception. No finding may be disclosed, no domain may be entered, and no ownership claim may be processed outside the procedures described here."
  }
];
const POLICY_SECTIONS = [
  {
    id: "purpose",
    number: "01",
    title: "Purpose, Scope & Definitions",
    blocks: [
      {
        kind: "h3",
        text: "1.1 Purpose"
      },
      {
        kind: "p",
        text: "Oasis CI exists to document and disclose cybersecurity vulnerabilities through a safe, verified, evidence-based process; protect finding integrity; prevent harassment, extortion, or unauthorised access; and establish accountability for every party involved."
      },
      {
        kind: "h3",
        text: "1.2 Scope"
      },
      {
        kind: "ul",
        items: [
          "Oasis Tech Capital LLC staff who operate or maintain the platform",
          "Cybersecurity administrators and investigators who submit or review cases",
          "Domain owners and authorised representatives who claim domains or receive disclosures",
          "All domains and digital assets entered into Oasis CI",
          "All evidence, communications, data, and records created through the platform"
        ]
      },
      {
        kind: "h3",
        text: "1.3 Definitions"
      },
      {
        kind: "ul",
        items: [
          "Platform: the Oasis CI cybersecurity investigation system.",
          "Administrator: an authorised Oasis Tech Capital LLC professional who submits, reviews, or manages cases.",
          "Domain: a registered internet domain or associated digital service.",
          "Case: a formal record documenting one or more vulnerabilities for a domain.",
          "Evidence: technical proof collected through lawful means.",
          "Domain Owner: the party with legal authority over a domain, verified through the claim process.",
          "Disclosure: formal communication of verified findings to a verified domain owner.",
          "Remediation: the process by which an owner resolves a disclosed vulnerability."
        ]
      }
    ]
  },
  {
    id: "submission",
    number: "02",
    title: "Domain Submission & Intake Policy",
    blocks: [
      {
        kind: "p",
        text: "Only authorised Oasis Tech Capital LLC cybersecurity administrators may submit domains. Submissions are internal and subject to review before activation."
      },
      {
        kind: "h3",
        text: "Grounds for submission"
      },
      {
        kind: "ul",
        items: [
          "Confirmed data exposure or credential leak from lawful intelligence sources",
          "Active misconfiguration (open directories, exposed env files, unauthenticated admin panels)",
          "Known critical CVE on software the domain runs without patching",
          "Evidence of active compromise, defacement, or malware",
          "Verified third-party breach or threat intelligence that can be corroborated"
        ]
      },
      {
        kind: "important",
        text: "Speculation, rumour, or unverified claims are not grounds for submission. Every domain must have documented, verifiable grounds at submission time."
      },
      {
        kind: "h3",
        text: "Submission requirements"
      },
      {
        kind: "ul",
        items: [
          "Full domain name and vulnerability classification",
          "Severity rating (Critical, High, Medium, Low)",
          "Evidence meeting Policy 04 standards",
          "Date and method of discovery",
          "Submitting administrator identity"
        ]
      },
      {
        kind: "p",
        text: "Every submission undergoes dual review by a second administrator before the case becomes active. Cases that fail review are returned or rejected and logged."
      }
    ]
  },
  {
    id: "ownership",
    number: "03",
    title: "Domain Ownership & Claim Verification Policy",
    blocks: [
      {
        kind: "p",
        text: "Owners may claim a domain to access full finding details. The public record shows only that a domain is flagged; specific vulnerabilities and evidence are released only after verification."
      },
      {
        kind: "h3",
        text: "Who may claim"
      },
      {
        kind: "ul",
        items: [
          "The registrant per WHOIS or equivalent records",
          "An employee or officer with documented authority",
          "A third party with written authorisation from the registrant"
        ]
      },
      {
        kind: "h3",
        text: "Verification"
      },
      {
        kind: "p",
        text: "Email verification to the admin-registered contact may be used where DNS or file verification is not feasible, but not alone for High or Critical cases. Verification links expire after 24 hours. Manual verification requires documentary proof and is logged."
      },
      {
        kind: "p",
        text: "Claim tokens are stored hashed and never logged in plain text. No vulnerability details are exposed until verification completes."
      }
    ]
  },
  {
    id: "evidence",
    number: "04",
    title: "Vulnerability Evidence Standards Policy",
    blocks: [
      {
        kind: "important",
        text: "Active exploitation, unauthorised access, traffic interception, and social engineering to obtain evidence are strictly prohibited."
      },
      {
        kind: "p",
        text: "Evidence must be lawfully obtained through passive observation of public information, reputable threat intelligence, permitted scanning of public surfaces, and public DNS, SSL, or WHOIS data."
      },
      {
        kind: "p",
        text: "Evidence must reflect the domain's current state. Material older than 30 days must be re-verified before submission."
      },
      {
        kind: "p",
        text: "Evidence is stored securely, access is restricted, and owner-facing packages are curated to prove the issue without dumping all collected material. Retention is at least 24 months after case closure."
      }
    ]
  },
  {
    id: "disclosure",
    number: "05",
    title: "Disclosure & Communication Policy",
    blocks: [
      {
        kind: "p",
        text: "Oasis CI follows responsible disclosure: findings go to the verified owner first with a fair opportunity to remediate. Vulnerability details are not sold or published broadly without legal justification."
      },
      {
        kind: "p",
        text: "Public records show domain name, general severity, and that findings exist—not specific vulnerability types, evidence, or affected components."
      },
      {
        kind: "important",
        text: "Demanding payment or services in exchange for disclosing, withholding, or removing a finding is extortion and an absolute violation of this policy."
      },
      {
        kind: "p",
        text: "Communications must be professional, factual, and conducted through the platform's secure interface—not personal email or unofficial channels."
      }
    ]
  },
  {
    id: "data",
    number: "06",
    title: "Data Handling & Confidentiality Policy",
    blocks: [
      {
        kind: "ul",
        items: [
          "Class 1 (Restricted): raw evidence, full packages, private owner communications—never public.",
          "Class 2 (Internal): case notes, audit logs—Oasis staff only.",
          "Class 3 (Public): domain name, severity indicator, statement that findings exist."
        ]
      },
      {
        kind: "p",
        text: "Access is role-based and logged. Evidence is encrypted at rest and in transit. PII is handled per applicable law and not reproduced in full when documenting scope."
      },
      {
        kind: "p",
        text: "All staff with platform access are bound by confidentiality during and after engagement."
      }
    ]
  },
  {
    id: "remediation",
    number: "07",
    title: "Remediation & Case Closure Policy",
    blocks: [
      {
        kind: "p",
        text: "Owners investigate and resolve vulnerabilities. Oasis CI provides evidence and guidance but does not perform remediation on behalf of owners."
      },
      {
        kind: "ul",
        items: [
          "Acknowledged — owner is aware of the finding",
          "In Progress — remediation work has begun",
          "Remediated — owner asserts the issue is resolved",
          "Disputed — owner contests the finding (see Policy 09)"
        ]
      },
      {
        kind: "p",
        text: "Administrators verify remediation with targeted checks. Outcomes: Verified, Partially Verified, or Not Verified. Cases close when all findings are verified remediated or formally withdrawn."
      }
    ]
  },
  {
    id: "enforcement",
    number: "08",
    title: "Prohibited Conduct & Enforcement Policy",
    blocks: [
      {
        kind: "h3",
        text: "Prohibited — administrators"
      },
      {
        kind: "ul",
        items: [
          "Submitting domains without valid grounds or evidence",
          "Fabricating or misrepresenting evidence",
          "Unauthorised access or exploitation beyond permitted observation",
          "Disclosing case details to unauthorised parties",
          "Extortion or personal/commercial targeting"
        ]
      },
      {
        kind: "h3",
        text: "Prohibited — owners & claimants"
      },
      {
        kind: "ul",
        items: [
          "Fraudulent claim documentation",
          "Claiming domains not legitimately controlled",
          "Harassment or intimidation of staff",
          "Temporary patches solely to pass verification"
        ]
      },
      {
        kind: "p",
        text: "Violations may result in warnings, suspension, permanent removal, or referral to law enforcement depending on severity."
      }
    ]
  },
  {
    id: "disputes",
    number: "09",
    title: "Dispute Resolution Policy",
    blocks: [
      {
        kind: "p",
        text: "Verified owners may dispute findings on grounds such as non-existence, insufficient evidence, incorrect severity, lack of control, or unlawful collection."
      },
      {
        kind: "p",
        text: "Disputes are initiated in-platform with a specific written statement, reviewed within 10 business days, and may be escalated to a senior administrator not involved in the original case."
      },
      {
        kind: "important",
        text: "Valid findings are not withdrawn in response to pressure or threats without legitimate technical grounds."
      }
    ]
  },
  {
    id: "amendments",
    number: "10",
    title: "Policy Review & Amendments",
    blocks: [
      {
        kind: "p",
        text: "Policies are reviewed at least annually and when platform scope, law, incidents, or the threat landscape materially change."
      },
      {
        kind: "p",
        text: "Amendments are approved by Oasis Tech Capital LLC leadership. Material changes affecting domain owner rights are communicated before taking effect."
      },
      {
        kind: "p",
        text: "Each version carries a version number and effective date. The current version supersedes all prior versions."
      },
      {
        kind: "p",
        text: "These policies and the operation of Oasis CI are governed by the laws of the Republic of Malawi, with compliance to other applicable local law where required."
      }
    ]
  }
];
export {
  CURRENT_POLICIES_VERSION as C,
  POLICIES_EFFECTIVE_DATE as P,
  POLICIES_OPERATOR as a,
  POLICIES_TITLE as b,
  POLICY_PREAMBLE as c,
  POLICY_SECTIONS as d
};
