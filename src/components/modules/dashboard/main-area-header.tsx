import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";

function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

function Content({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sm:flex-row",
        className
      )}
    >
      {children}
    </header>
  );
}

function H1({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn("text-2xl font-bold mb-2 sm:mb-0", className)}>
      {children}
    </h1>
  );
}

function Actions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center mt-2 sm:mt-0", className)}>
      {children}
    </div>
  );
}

function Footer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <footer className={cn("", className)}>{children}</footer>;
}
Header.Content = Content;
Header.H1 = H1;
Header.Actions = Actions;
Header.Footer = Footer;

export { Header };
