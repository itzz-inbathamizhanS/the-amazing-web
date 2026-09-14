import { useRouteContext } from "@tanstack/react-router";

/** True only when this browser has unlocked editing on the /admin page. */
export function useIsAdmin(): boolean {
  return useRouteContext({
    from: "__root__",
    select: (context) => (context as { isAdmin?: boolean }).isAdmin === true,
  });
}
