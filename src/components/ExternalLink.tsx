import type { ReactNode } from "react";

/**
 * Renders an outbound link that always opens in a new tab with safe rel
 * attributes. Use this for any link that leaves markcheverton.com (Amazon,
 * BookFunnel, social, etc.). Internal links should use next/link instead.
 */
export function ExternalLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
