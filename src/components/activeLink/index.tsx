import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { cn } from "@/utils/cn";

type ActiveLinkProps = Omit<React.ComponentProps<typeof Link>, "children"> & {
  href: string;
  children:
    | (({ isActive }: { isActive: boolean }) => React.ReactNode)
    | React.ReactNode;
  activeClassName?: string;
  className?: string;
  onTransitionComplete?: () => void; // 遷移完了時に実行する関数
};

export const ActiveLink = ({
  href,
  children,
  activeClassName = "",
  onTransitionComplete,
  className = "",
  ...props
}: ActiveLinkProps) => {
  const router = useRouter();

  const isActive = router.asPath === href;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!onTransitionComplete) return () => {};

    const handleRouteChangeComplete = () => onTransitionComplete();

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events, onTransitionComplete]);

  return (
    <Link
      {...props}
      className={cn(className, isActive ? activeClassName : "")}
      href={href}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
};
