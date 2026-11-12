# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The GitHub profile README for `JuanDLCH` (the special `<username>/<username>` repo whose `readme.md` renders on github.com/JuanDLCH). There is no lint or test tooling. The deliverable is `readme.md` plus the SVGs under `assets/`, and it renders on GitHub as soon as it is pushed to `main`.

## Commands

- `GITHUB_TOKEN=$(gh auth token) node scripts/fetch-activity.mjs`: refreshes `data/activity.json` from the GraphQL API. It stores the contribution calendar (private contributions included), streaks and recently pushed public repos. `build-svgs.mjs` reads this file for the activity card and skips the card if the file is missing.
- `.github/workflows/activity.yml`: runs fetch and build every day (or by hand with `gh workflow run activity.yml`) and commits as `github-actions[bot]` only when something changed. Pull before you push, because the bot commits to `main` daily.
- `node scripts/build-svgs.mjs`: regenerates every animated SVG (hero, terminal, lab-voice, lab-chat, timeline, footer, activity and the four `case-*` diagrams) in `-dark` and `-light` variants into `assets/`. The script has no dependencies.
- `rsvg-convert assets/<file>.svg -o /tmp/x.png`: a quick XML-validity and static-layout check. rsvg ignores CSS animation, so what you see is the final frame.
- `gh api markdown -f mode=gfm -f context=JuanDLCH/JuanDLCH -F text=@readme.md`: renders the README with GitHub's own renderer. Wrap the output in `github-markdown-css` with a `<base href>` that points at the repo, then open or screenshot it, for example with `firefox --headless --screenshot --window-size=1060,11000`. The pref `ui.systemUsesDarkTheme` in a temporary profile forces dark mode.

## How the page is put together

- **`readme.md`** (lowercase filename) is hand-written GitHub-flavoured Markdown with inline HTML (`<picture>`, `<table>`, `<p>`, `<sub>`, `<details>`). GitHub sanitises HTML, so stick to attributes it allows (`align`, `width`, `height`, `valign`, `alt`, `title`, `srcset`, `media`). `<style>`, `class`, and inline `style` are stripped. A source-reader Easter egg sits in the HTML comment at the top.
- **Animated SVGs are generated, never hand-edited.** `assets/{hero,terminal,lab-voice,lab-chat,timeline,footer,activity,case-*}-{dark,light}.svg` all come from `scripts/build-svgs.mjs`. One builder function per asset takes a palette from `THEMES`, and that keeps the dark and light variants identical in content. To change wording or layout, edit the builder and re-run the script. The rules the script follows:
  - The SVGs load through `<img>`/`<picture>`, so they get no JavaScript, no external fonts or images, and no working links inside. Links go on a wrapping `<a>` in the README, as on the lab cards and the footer. Fonts are system stacks (`SANS` and `MONO`).
  - Motion uses CSS `@keyframes` only, never SMIL. Base styles describe the final frame and keyframes supply the motion, so `prefers-reduced-motion` (the `REDUCED()` helper) can turn everything off with `animation:none` and still leave a readable image.
  - Sequenced effects (terminal typing, the hero word reveal, chat steps) are timelines in seconds converted to keyframe percentages with `pct(t, T)` over one loop of `T` seconds. Typing works by moving a solid cover rect in `steps(n)` with a caret attached, so it only works on a solid background.
  - Gradients stroked on straight horizontal or vertical lines need `gradientUnits="userSpaceOnUse"`, because a zero-height bounding box makes the gradient disappear. Dash animations use `pathLength="100"`.
- **Every themed image** is a `<picture>` with `prefers-color-scheme` `<source>`s and the dark file as the `<img>` fallback.
- **Case files** ("What I've shipped") are `<details>` blocks. Each has a short write-up, an animated architecture diagram, and a row of 26px stack icons. The diagram comes from the `flow()` builder: nodes are placed by hand and edges are hand-written cubic paths. Don't use Mermaid here: GitHub's Mermaid renderer breaks inside a collapsed `<details>`, leaving spinners that never finish or zero-size diagrams. Client names stay anonymised. Only claim stack and work that juandlch.dev or the user confirms; don't invent components.
- **Career facts** (keep in sync with juandlch.dev): Full Stack at Stellion Tech (2022), Full Stack at Trade EC (2023), Lead AI Engineer at Trade EC (2024, a 3-person team). There was no separate "AI Engineer" phase at Trade. The current public title is "AI Engineer". The timeline shows start years only. Each stop's big line is what was being built, with role · company in small caps underneath, so it doesn't read as a rank ladder. The last stop and `whoami` come from the `NOW` object in `scripts/build-svgs.mjs`. Never publish internal levels. Don't announce an upcoming employer until the user says it is public.
- **Bilingual**: the main copy is English. The Spanish version is a `<details>` ("🇨🇴 Léelo en español") under the intro, and edits to the intro or contact copy should be mirrored there. The SVGs are English-only.
- **Activity card** ("Lately on GitHub"): this replaced the third-party stats card. That card only counted public data and showed a low grade, which misrepresented the work. The new card deliberately leaves out languages, because public repos are mostly dotfiles and QML and don't represent the AI work.
- **Icons come from three places**:
  - `assets/aws/*.svg`: official AWS Architecture Icons (80×80, `Icon-Architecture/64/Arch_*` titles). Add new services from the official AWS icon pack rather than drawing them.
  - `assets/icons/*.svg`: non-AWS brand icons, normalised to a 64×64 rounded square (`rect rx="14"`) with the brand colour as background, `role="img"`, and `aria-label`/`<title>`. The LangChain and LangGraph icons are the exceptions: they are LangChain's official 65×65 files.
  - `skillicons.dev` and `shields.io` (`style=flat-square`) URLs for common technologies, badges and the Credly-linked certification badges.
- **Icon row conventions**: local icons use relative `./assets/...` paths, and every `<img>` has matching `alt` and `title`. Sizes are 44 for "Daily drivers", 42 for the toolbox rows, 39 inside the AWS table cells and 26 inside case files. Each toolbox row is followed by a `<sub>` caption naming the same tools, so add or remove a caption entry together with its icon. The full toolbox and the AWS table sit in collapsed `<details>`.

## Working conventions

- Every SVG in `assets/` is referenced by `readme.md`. Keep it that way: delete an icon when its last reference goes, and check that new paths resolve.
- Rendering on GitHub in both colour schemes, plus mobile width, is the final check.
- Commit messages follow `type(profile): ...`, with types such as `feat`, `style`, `assets`, `design`, `polish`, `docs`. Icon additions usually go in their own `assets(profile): ...` commits, separate from the `readme.md` changes that use them.
- Tone of the copy: honest, warm, a little playful (Medellín, Linux and automation touches), and never overclaiming. The user doesn't want goalkeeper or football references, and personal traits shouldn't be invented. The toolbox note says outright that not every listed tool is a daily driver. Keep new copy in that voice.
