## Goal
Turn the existing inline text editor into a **full visual block editor** (Webflow-style) where staff can click any element on any page and edit:
- Text content (already works)
- **Text color, font size, font weight, font family, text alignment**
- **Background color, padding**
- **Background image** (upload or pick from Media library)
- **Swap images / video posters** per block (upload or pick from Media)

All overrides are saved per-element and applied automatically on every visit.

---

## How it will work for you

1. Click the **Edit Page** button (bottom-left) — same as today.
2. Hover any element → yellow dashed outline.
3. **Click once** → a floating **Style Toolbar** opens next to the element with tabs:
   - **Text** — content (textarea), font size slider, weight, family, color, alignment
   - **Background** — color picker, padding slider, "Replace background image" button
   - **Image** — (only for `<img>` / `<video>`) "Replace media" button → opens Media Library modal with upload + existing assets
4. Click **Save** → change is written to the database and applied site-wide instantly.
5. **Reset** button per property removes that override.

A small **selection ring** + toolbar like Figma/Webflow, not a full-page modal.

---

## Technical sections

### 1. Stable per-element identity
Each element needs a stable key that survives re-renders. Compose:
```
sig = pageKey + "|" + domPath(el) + "|" + hash(textContent)
```
- `domPath` = tag chain with `nth-of-type` from nearest id'd ancestor (or `<body>`).
- Stored in `site_content.block_key` as `style_<hash(sig)>`.
- `label` stores a human-readable preview (first 60 chars of text or tag path).

### 2. Style storage
Reuse the existing `site_content` table. New row shape:
```
page_key:   "/about" or "*" (global region)
block_key:  "style_<hash>"
kind:       "style"
content:    JSON string of { color, bg, fontSize, fontWeight, fontFamily, textAlign, padding, bgImage, src }
label:      preview text / path
```
No schema change needed — `content` is already text.

### 3. Apply overrides at runtime
Extend `InlineEditOverlay`:
- On every DOM mutation, walk leaves, compute sig, look up override.
- Apply text override (existing behavior) + inline `style` attributes for css overrides.
- For `<img>` / source-having elements, set `src` if `src` override present.
- For background images, set `background-image: url(...)`.

### 4. Style Toolbar component
New file `src/components/StyleToolbar.tsx`:
- Floating panel anchored to selected element via `getBoundingClientRect()`.
- Tabs: Text / Background / Media.
- Inputs: `<input type="color">`, range sliders (12–96px font size, 0–80px padding), select for weight (300/400/500/600/700/800) and family (Inter, sans, serif, mono + any project fonts), alignment toggle group.
- Live preview: changes apply immediately to the DOM; "Save" persists; "Cancel" reverts.

### 5. Media Library modal
New file `src/components/MediaPickerModal.tsx`:
- **Upload tab**: drag-drop or file input → upload to existing `media` storage bucket → insert into `media_assets` → returns public URL.
- **Library tab**: lists existing `media_assets` rows with thumbnails, click to pick.
- Returns selected URL to caller (Style Toolbar).

### 6. App wiring
- `src/App.tsx` — no new providers needed (overlay already mounted).
- `src/components/InlineEditOverlay.tsx` — refactor: text-edit modal becomes the Style Toolbar; keep current text editing inside it; add style + media controls.
- `src/hooks/useSiteContent.tsx` — add `getStyle(sig)` and `upsertStyle(sig, partial)` helpers.

### 7. Safety
- Only staff (`isStaff`) sees the toolbar.
- Overrides apply for everyone (read-only) so changes are visible to all visitors.
- Overrides are scoped to page (or `*` for header/footer/nav).

---

## Files to add
- `src/components/StyleToolbar.tsx` (new)
- `src/components/MediaPickerModal.tsx` (new)

## Files to edit
- `src/components/InlineEditOverlay.tsx` — open toolbar instead of text-only modal; compute & apply per-element style overrides; handle `<img>` src swap
- `src/hooks/useSiteContent.tsx` — add style helpers
- (no DB migration)

## Out of scope (ask later if needed)
- "Apply to all similar elements" mode (you chose per-element only)
- Drag-to-resize, drag-to-reorder blocks
- Layout/grid editing
- Undo/redo history beyond per-property Reset

After you approve, I'll build it in one pass.