# Admin-only editing

Right now the edit, add, delete and "undo my changes" buttons are visible to everyone on every page. This change hides them from visitors and puts them behind a private admin sign-in page.

## How it will work

- A new page at `/admin` asks for a single admin password.
- Enter the correct password and the site unlocks editing for you, on that device, for 7 days (or until you press "Lock").
- While unlocked, every editable page shows its buttons exactly as they do today: Directory, character pages, Timeline, Animated Films, Live-Action, Adjacent Characters, My Comics Collection, and the What Is the Spider-Verse page.
- While locked (every normal visitor), none of those buttons appear anywhere. No edit, no add, no delete, no undo, and no hint that editing exists — the `/admin` page is only reachable by typing the address.
- A small "Locked / Unlocked" state and a Lock button live on the `/admin` page itself.

## What you need to provide

The admin password you want to use. I'll store it as a private setting on the server, not in the site's code, so visitors can't read it from the page.

## What this is and isn't

This is a single shared admin password — a lock on the editing controls, not full user accounts. There are no separate logins, roles or per-person access. Your content edits still save in the browser you make them in; if you want edits to appear for everyone on every device, that's a separate step (adding a real database) we can do afterwards.

## Technical notes

- Store `SITE_PASSWORD` (user-supplied) and a generated `SESSION_SECRET` as server-only secrets.
- `src/lib/admin-gate.functions.ts`: `unlockAdmin` (timing-safe hash comparison), `lockAdmin`, `getAdminState`, backed by an encrypted `useSession` cookie (httpOnly, 7 days).
- Root route loader calls `getAdminState()` and exposes `isAdmin` through router context; a small `useIsAdmin()` hook reads it.
- `EditToolbar`, `AddButton`, `ResetButton` and `ItemControls` in `src/components/ContentEditor.tsx` return `null` when not admin — a single choke point, so no page can leak a control. Page-level `RecordDialog` triggers also guard on `isAdmin`.
- New route `src/routes/admin.tsx`: password form, unlock/lock actions, `router.invalidate()` after each so the controls appear or disappear immediately. `noindex` meta on this route.
- No changes to the content data, the 3D scene, or how edits are stored.
