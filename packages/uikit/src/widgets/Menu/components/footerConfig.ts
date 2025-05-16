import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Trade"),
        href: "/swap",
      },
      {
        label: t("Earn"),
        href: "/liquidity/pools",
      },
      {
        label: t("Play"),
        href: "/prediction",
      },
      {
        label: t("veCAKE"),
        href: "/cake-staking",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        label: t("BNW Incentives"),
        href: "/docs/ecosystem-and-partnerships/business-partnerships/syrup-pools-and-farms",
      },
      {
        label: t("Staking Pools"),
        href: "/pools",
      },
      {
        label: t("Token Launches"),
        href: "/docs/ecosystem-and-partnerships/business-partnerships/initial-farm-offerings-ifos",
      },
      {
        label: t("Brand Assets"),
        href: "/docs/ecosystem-and-partnerships/brand",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: t("Contributing"),
        href: "/docs/developers/contributing",
      },
      {
        label: t("Github"),
        href: "https://github.com/bnw-dex",
      },
      {
        label: t("Bug Bounty"),
        href: "/docs/developers/bug-bounty",
      },
      {
        label: t("V4"),
        href: "/v4",
      },
    ],
  },
  {
    label: t("Support"),
    items: [
      {
        label: t("Get Help"),
        href: "/docs/contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "/docs/readme/help/troubleshooting",
      },
      {
        label: t("Documentation"),
        href: "/docs",
      },
      {
        label: t("Audits"),
        href: "/docs/readme/audits",
      },
    ],
  },
  {
    label: t("About"),
    items: [
      {
        label: t("Tokenomics"),
        href: "/docs/governance-and-tokenomics/cake-tokenomics",
      },
      {
        label: t("BNW Emission Projection"),
        href: "/analytics",
      },
      {
        label: t("Blog"),
        href: "/blog",
      },
      {
        label: t("Careers"),
        href: "/docs/team/become-a-chef",
      },
    ],
  },
];
