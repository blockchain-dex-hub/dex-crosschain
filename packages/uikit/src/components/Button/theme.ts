import { vars } from "../../css/vars.css";
import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "48px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary60",
    color: "contrast",
    borderRadius: "12px",
    boxShadow: "0 4px 16px 0 rgba(59,130,246,0.10)",
    fontWeight: 600,
    transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
    ":hover": {
      backgroundColor: "primary",
      boxShadow: "0 6px 24px 0 rgba(59,130,246,0.15)",
      transform: "translateY(-2px) scale(1.03)",
    },
    ":active": {
      backgroundColor: "primaryDark",
      boxShadow: "0 2px 8px 0 rgba(59,130,246,0.08)",
      transform: "scale(0.98)",
    },
    ":disabled": {
      backgroundColor: "backgroundDisabled",
      color: "textDisabled",
      boxShadow: "none",
      cursor: "not-allowed",
    },
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "primary60",
    color: "primary60",
    borderRadius: "12px",
    fontWeight: 600,
    transition: "border 0.2s, color 0.2s, background 0.2s, transform 0.1s",
    ":hover": {
      backgroundColor: "backgroundHover",
      borderColor: "primary",
      color: "primary",
      transform: "scale(1.03)",
    },
    ":active": {
      borderColor: "primaryDark",
      color: "primaryDark",
      transform: "scale(0.98)",
    },
    ":disabled": {
      borderColor: "backgroundDisabled",
      color: "textDisabled",
      cursor: "not-allowed",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    color: "primary60",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background 0.2s, color 0.2s",
    ":hover": {
      backgroundColor: "backgroundHover",
      color: "primary",
    },
    ":disabled": {
      color: "textDisabled",
      backgroundColor: "backgroundDisabled",
    },
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background 0.2s, color 0.2s",
    ":hover": {
      backgroundColor: "primary10",
      color: "primary60",
    },
    ":disabled": {
      color: "textDisabled",
      backgroundColor: "backgroundDisabled",
    },
  },
  [variants.DANGER]: {
    backgroundColor: "destructive",
    color: "contrast",
    borderRadius: "12px",
    fontWeight: 600,
    transition: "background 0.2s, color 0.2s",
    ":hover": {
      backgroundColor: "destructive60",
    },
    ":disabled": {
      color: "textDisabled",
      backgroundColor: "backgroundDisabled",
    },
  },
  [variants.SUCCESS]: {
    backgroundColor: "positive60",
    color: "contrast",
    borderRadius: "12px",
    fontWeight: 600,
    transition: "background 0.2s, color 0.2s",
    ":hover": {
      backgroundColor: "positive20",
    },
    ":disabled": {
      color: "textDisabled",
      backgroundColor: "backgroundDisabled",
    },
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary60",
    fontWeight: 500,
    borderRadius: "12px",
    transition: "color 0.2s",
    ":hover": {
      color: "primary",
    },
    ":disabled": {
      color: "textDisabled",
    },
  },
  [variants.LIGHT]: {
    backgroundColor: "input",
    color: "textSubtle",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background 0.2s, color 0.2s",
    ":hover": {
      backgroundColor: "primary10",
      color: "primary60",
    },
    ":disabled": {
      color: "textDisabled",
      backgroundColor: "backgroundDisabled",
    },
  },
  [variants.BUBBLEGUM]: {
    background: vars.colors.gradientBubblegum,
    color: "textSubtle",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background 0.2s, color 0.2s",
    ":hover": {
      background: vars.colors.gradientPrimary,
      color: "primary60",
    },
    ":disabled": {
      background: vars.colors.disabled,
      color: "textDisabled",
    },
  },
};
