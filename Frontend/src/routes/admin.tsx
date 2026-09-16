import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { lockAdmin, unlockAdmin } from "@/lib/admin-gate.functions";
import { useIsAdmin } from "@/hooks/use-admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner access — The Amazing Web" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private owner access for editing this site." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const unlock = useServerFn(unlockAdmin);
  const lock = useServerFn(lockAdmin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const { ok } = await unlock({ data: { password } });
    setBusy(false);
    if (!ok) {
      setError(true);
      return;
    }
    localStorage.setItem("spider-admin-key", password);
    setPassword("");
    await router.invalidate();
  };

  const signOut = async () => {
    setBusy(true);
    await lock();
    localStorage.removeItem("spider-admin-key");
    setBusy(false);
    await router.invalidate();
  };

  return (
    <>
      <PageHeader
        eyebrow="Private"
        title={isAdmin ? "EDITING UNLOCKED" : "OWNER ACCESS"}
        intro={
          isAdmin
            ? "Edit, add and delete buttons are now visible to you across the site. They stay unlocked on this device for a week, or until you lock again."
            : "Enter the owner password to reveal the editing buttons. Visitors never see them."
        }
      />

      <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
        {isAdmin ? (
          <div className="ink-panel rounded-lg p-6 text-center">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent">
              Status · Unlocked
            </p>
            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="mt-5 w-full rounded-full border border-border px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground/85 transition-colors hover:border-accent disabled:opacity-60"
            >
              Lock editing
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="ink-panel rounded-lg p-6">
            <label className="block">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                Owner password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background/70 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
              />
            </label>
            {error && (
              <p className="mt-3 text-sm text-destructive">That password didn't match.</p>
            )}
            <button
              type="submit"
              disabled={busy || !password}
              className="mt-5 w-full rounded-full bg-primary px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity disabled:opacity-50"
            >
              {busy ? "Checking…" : "Unlock editing"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
