import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>
  );
}

export function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-3xl px-6 prose-content ${className}`}
      style={{ lineHeight: 1.7 }}
    >
      {children}
    </div>
  );
}
