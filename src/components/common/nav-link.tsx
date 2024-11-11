"use client";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";


export type NavLinkProps = LinkProps & {
  children: React.ReactNode;
};

export function NavLink({ ...props }: NavLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      {...props}
      data-current={pathname === props.href}
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary data-[current=true]:text-primary dark:text-muted-foreground-dark dark:hover:text-primary-dark data-[current=true]:dark:text-primary-dark"
    >
      {props.children}
    </Link>
  );
}
