# GoWish — shared wishlist

This is a take-home case built with [Expo](https://expo.dev) and [expo-router](https://docs.expo.dev/router/introduction/). The app talks to an in-memory mock API in `src/api.ts` and supports viewing, filtering, and sorting wishes, plus optimistic add, reserve, and unreserve flows.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Screens live under `src/app` using file-based routing.

## Decisions

**TanStack Query** backs all server state against the mock API (`src/lib/query-client.ts`, wishlist hooks under `src/wishlist/`).

- **Ease of use** — Loading, error, refetch, and cached data come from a single `useQuery` in `use-wishlist.ts` instead of hand-rolled `useEffect` and local state.
- **Familiar in 2026** — For React apps, TanStack Query is close to an industry default, so the data layer should read naturally to reviewers and future teammates.
- **Optimistic updates** — The case needed instant feedback on reserve, unreserve, and add-wish. The `onMutate` / `onError` / `onSettled` lifecycle gives snapshot-and-rollback almost for free (`use-reserve-wish.ts`, `use-add-wish.ts`).
- **Other benefits** — One cache keyed by `wishlistKeys.all` keeps every consumer in sync; stale-while-revalidate plus `invalidateQueries` helps the list stay plausible while the mock simulates other users; `ConflictError` and `NotFoundError` can be handled in mutations instead of in UI; built-in retry and deduplication tolerate the flaky mock; hooks isolate fetching so swapping the mock for a real HTTP client should not require touching components.

## If I had more time

### User experience improvements

- **Create wish as a screen** — Replace `src/wishlist/create-wish-dialog.tsx` with a dedicated full-screen modal route in the Stack rather than a bottom sheet dialog. Forms with more than a couple of fields benefit from the space, especially on mobile where the keyboard consumes a large share of the viewport.
- **Unsaved changes on back** — With `src/wishlist/create-wish-dialog.tsx` open, the hardware back button closes the dialog and discards any entered data without warning. That can be acceptable on small forms, but on larger ones it is good practice to confirm before abandoning input and to require an explicit discard, so mistaken back presses do not wipe what the user already typed.
- **Toasts on iOS** — `src/utils/toast.ts` only calls `ToastAndroid` and no-ops elsewhere. Wire up a cross-platform fallback (GoWish already has one in production) so success and info feedback is consistent on iOS.
- **Privacy** — Avoid showing who reserved an item, in `src/wishlist/wish-row.tsx` and in conflict messaging (e.g. “Item already reserved”). Anonymize labels from `reservedByLabel` so gift surprises are not spoiled.
- **Stable list layout** — The “Reserved by …” pill appears only for taken items and changes row height by a few pixels, which shifts the list. Reserve space for the status row (or use a fixed min height) so layout does not jump.
- **Paste URL** — Add a “Paste from clipboard” control beside the URL field in `src/wishlist/create-wish-form.tsx` to support one-tap pasting from the browser or messages.
- **Stale list retry** — The banner in `src/wishlist/wish-list.tsx` currently only dismisses a failed refresh while cached data stays on screen. Prompt a Retry that refetches the list instead of (or in addition to) Dismiss, so users can recover without pull-to-refresh.
- **End-of-list footer** — A subtle “No more items” line at the bottom of the list (e.g. `ListFooterComponent` on the FlatList in `src/wishlist/wish-list.tsx`) helps users see they have reached the end and that eventual “next page” or infinite-scroll loading is not broken.

### Developer experience improvements

- **Theme colors** — Restructure the `Colors` object in `src/constants/theme.ts` into `background`, `text`, `icon`, and `border` groupings so it is harder to pick the wrong token for a given surface.
- **Font sizes** — Introduce a `FONT_SIZE` object in `src/constants/theme.ts` as a single source of truth, and for inline styles that only need a size without full `Typography` (line height, font family, weight).
- **Feature components** — Colocate `src/wishlist/` under `src/components/`; those files are still UI components, just scoped to the wishlist feature.
- **Hooks location** — Consider moving `use-add-wish.ts`, `use-reserve-wish.ts`, and `use-wishlist.ts` into `src/hooks/` as the app grows and multiple features share the same server state.
- **On-surface colors** — `#fff` is hard-coded for labels and icons on primary buttons and the FAB; a theme token (e.g. on-accent) would support theming and dark mode consistently. `wish-image.tsx` uses a hard-coded placeholder gray that duplicates `skeleton` and ignores dark mode.
- **Interaction tokens** — `hitSlop={8}` is repeated across several components; `minHeight: 48` is duplicated on buttons and text fields. Named constants (including minimum touch target) would reduce drift.
- **Validation constants** — Title max length (75), the progressive-disclosure threshold (60), and price ceiling live in both `src/utils/validate.ts` and the form; error copy for max price duplicates the numeric limit. Export shared limits so UI and business logic stays aligned.
- **Locale and currency** — `"DKK"` and `"da-DK"` are scattered across the API, optimistic add payload, and `formatPrice`; centralize defaults for a real backend later.
- **Optimistic rows** — Optimistic IDs use the `optimistic-${Date.now()}` prefix and the list dims rows via `startsWith("optimistic-")`. A shared helper or explicit flag on cached items would be safer than string conventions.
- **Motion and layout magic numbers** — Press opacities, image transition duration, and dialog spring parameters are ad hoc; name animation presets.
- **Theme module purity** — `theme.ts` imports `@/global.css` for side effects; constants and global CSS setup could be split so theme exports stay dependency-light.

## What I'm not satisfied with

- **`create-wish-dialog.tsx`** — Most in need of a refactor into a dedicated screen for keyboard and layout headroom.
- **Overall styling** — Colors, spacing, and typography should follow the real GoWish design system; here they are improvised for the case under a time constraint.
- **Dialog motion** — The fade/slide entrance on dialogs still feels slightly off and would benefit from dedicated tuning.
- **New items at the bottom** — The API appends created wishes to the end of the list, which is less intuitive than showing the newest item first. On successful creation, consider auto-scrolling to the bottom so the user immediately can see their new row in the list.
- **Native error alerts** — Error handling currently uses the native `Alert()`, which is not styleable. Custom error dialogs that match the app’s branded visual style would feel more cohesive.
- **Pagination** — In production, large wishlists would likely need pagination. The mock server does not support it today; if it did, we would implement infinite scroll that fetches the next page once the user scrolls past a threshold.
