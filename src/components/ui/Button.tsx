import { AppLink as Link } from "@/components/ui/AppLink";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Size = "lg" | "nav";
type Tone = "plum" | "light";

type Common = {
  children: ReactNode;
  size?: Size;
  tone?: Tone;
  arrow?: boolean;
  className?: string;
};

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

function Inner({ children, arrow = true }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      )}
    </>
  );
}

/** Primary button: plum pill, 52px (40px in the nav), arrow nudges 3px on hover. */
export function ButtonLink({
  children,
  size = "lg",
  tone = "plum",
  arrow,
  className,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link {...rest} className={cx(styles.btn, styles[size], styles[tone], className)}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

export function Button({
  children,
  size = "lg",
  tone = "plum",
  arrow,
  className,
  ...rest
}: Common & Omit<ComponentProps<"button">, "children">) {
  return (
    <button {...rest} className={cx(styles.btn, styles[size], styles[tone], className)}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}

/** Text link: underline grows on hover, arrow moves right. */
export function TextLink({
  children,
  className,
  arrow = true,
  ...rest
}: { children: ReactNode; className?: string; arrow?: boolean } & Omit<
  ComponentProps<typeof Link>,
  "children"
>) {
  return (
    <Link {...rest} className={cx(styles.text, className)}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

/** Plum inline link ("See our work →"): turns ink on hover. */
export function AccentLink({
  children,
  className,
  size = "md",
  ...rest
}: { children: ReactNode; className?: string; size?: "md" | "sm" } & Omit<
  ComponentProps<typeof Link>,
  "children"
>) {
  return (
    <Link {...rest} className={cx(styles.accent, size === "sm" && styles.accentSm, className)}>
      <Inner>{children}</Inner>
    </Link>
  );
}
