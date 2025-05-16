import { Language } from "../LangSelector/types";
import { DiscordIcon, GithubIcon, InstagramIcon, RedditIcon, TelegramIcon, TwitterIcon, YoutubeIcon } from "../Svg";
import { FooterLinkType } from "./types";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Blog",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Community",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "BNW DEX EXCHANGE",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://t.me/BNW_DEX_EXCHANGE",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer Support",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Troubleshooting",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Guides",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Documentation",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Bug Bounty",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Audits",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
      {
        label: "Careers",
        href: "https://t.me/BNW_DEX_EXCHANGE",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me",
      },
      {
        label: "中文",
        href: "https://t.me",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/pancakeswap",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
