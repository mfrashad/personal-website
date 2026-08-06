---
name: update-cv
description: "Update, tailor, and render Rashad's CV as a PDF using RenderCV. Use when the user says 'update my CV', 'update my resume', 'generate a CV', 'tailor my resume for <job/company>', 'CV for this job', or pastes a job description wanting a resume. Optional argument: a job description (pasted text or URL) to tailor for. Without an argument, syncs latest site data into cv/master.yaml and re-renders the general CV."
---

# Update CV

Pipeline: **sync** site data → **tailor** (optional, if a job target is given) → **render** PDF → **deliver**.

Key files:
- `cv/master.yaml` — the single source of truth, RenderCV format, **superset** (longer than one page by design). Kept local, NOT committed: this repo is public and the file contains personal contact details. If it's ever missing, rebuild via the preflight bootstrap below.
- `cv/site-data.json` — generated snapshot of website data (`npm run generate:cv-data`). Gitignored.
- `cv/tailored/<slug>_CV.yaml` — per-application one-page versions. Gitignored.
- `cv/output/` — rendered PDFs. Gitignored.

## 0. Preflight

- Verify `uvx` exists (`command -v uvx`). If missing, fall back to `pipx run` or `pip3 install --user 'rendercv[full]==2.8'` and call `rendercv` directly.
- RenderCV is pinned to **2.8** and invoked as: `uvx --from 'rendercv[full]==2.8' rendercv …` (the `[full]` extra is required; plain `rendercv` refuses to render).
- If `cv/master.yaml` is somehow missing, rebuild it from `RASHAD_CONTEXT.md` (repo root), `cv/site-data.json`, and any reference resume in `cv/reference/`; then STOP and ask the user to review before rendering.

## 1. Sync

1. Run `npm run generate:cv-data`.
2. Read `cv/site-data.json` and `cv/master.yaml`. The `# cv-sync: <date>` comment at the top of master.yaml is the last-sync watermark.
3. Semantically diff: find site entries (hackathon judging, talks, achievements, projects, counter values like `hackathonsJudged`) that are newer than the watermark or absent from master. Matching is semantic, not string-equality — e.g. "IDFR Talk" in site data matches "Ministry of Foreign Affairs (IDFR)" in master.
4. Present proposed changes as a short bulleted list and **get user confirmation before editing master.yaml** (plain counter bumps like "15+ hackathons" may be applied without asking, but report them). Never rewrite the wording of existing master bullets during sync — site descriptions are casual/jokey; master wording is CV-grade. Only add facts or update numbers.
5. Update the `# cv-sync:` watermark date.

## 2. Tailor (only when a job target was given)

The argument is everything after `/update-cv`. If it looks like a URL, fetch it (WebFetch) and extract the job description; otherwise treat the text itself as the JD.

Create `cv/tailored/<company-or-program-slug>_CV.yaml` as a **copy-and-prune** of master:

- **Never fabricate.** Every fact must already exist in master.yaml. Wording may be sharpened; facts, numbers, and dates may not change.
- **Max 2 pages; prefer 1** for industry roles. Fellowship/research CVs may use 2 full pages. Keep the 3–4 most JD-relevant highlights per role; drop weakly relevant roles/sections entirely. Keep contact info and education always.
- **Rashad's priority order for achievements/projects** (applies to master too): (1) featured in news/media, (2) audience/user metrics (views, users, followers), (3) money won / awards. Cut projects with no real metric, award, media coverage, or unique skill showcase.
- **Mirror the JD's keywords** where truthful (ATS matching).
- **Reorder** sections and bullets so the most target-relevant appear first.
- Lead bullets with strong verbs + quantified outcomes.
- Rename generic section keys if it helps the target (section titles in RenderCV are arbitrary strings; capitalized keys like `AI for Public Good & Advocacy:` render verbatim — snake_case keys get title-cased and turn "AI" into "Ai").
- For mission-driven targets (AI safety, public interest, social impact), surface the advocacy material in master's leadership section: Build for Public (84+ builders as of July 2026 — confirm current count with Rashad, the public site may lag), UNHCR Malaysia campaign, AI-ethics content (data-centre water usage explainer), safer-schools demonstration.

## 3. Render

```sh
uvx --from 'rendercv[full]==2.8' rendercv render <yaml> \
  --pdf-path 'output/<slug>/Muhammad_Fathy_Rashad_CV.pdf' \
  --png-path 'output/<slug>/page.png' \
  --dont-generate-html --dont-generate-markdown
```

- **Path flags resolve relative to the YAML file's directory** (`cv/`), so `output/<slug>/...` lands in `cv/output/<slug>/`.
- Do NOT pass `--dont-generate-typst` — the PDF is compiled from the Typst file, so that flag silently produces no PDF. The intermediate `.typ` goes to `cv/rendercv_output/` (gitignored).
- Validation failures print pydantic errors with exact field paths — fix the YAML and retry.
- For **tailored** CVs, count the generated `page_*.png` files: if more than 1 page, trim lowest-relevance bullets and re-render (max 3 iterations). The master render is allowed to be multi-page.
- Gotchas: phone must be international format in quotes (`"+601162271261"`); `present` only valid as `end_date`; unknown YAML keys are rejected (strict schema — sync metadata lives in comments); `#` is Typst syntax and silently truncates a bullet (write "LinkedInUnwrapped", not "#LinkedInUnwrapped"); YAML strings containing `: ` must be quoted.
- Emphasis: `**text**` = bold, `*text*` = italic (single asterisks do NOT bold). Rashad wants key metrics/awards bolded for scannability (~1–2 per bullet). Punctuation immediately after a closing `**` can get swallowed in Typst — rephrase (e.g. use an em dash) instead of `**text**;`.
- If page 2 of a tailored CV is mostly empty, fill it with an Achievements & Awards section (news features → metrics → awards order) rather than leaving whitespace.
- Quick render of the general CV: `npm run cv:render`.

## 4. Deliver

Send the PDF to the user (SendUserFile / open it), and summarize: what sync added, and — for tailored runs — which bullets were selected/dropped and why they fit the JD.

## Future phase (not built)

An admin-page button can reuse this pipeline: Vercel can't run Python, so the button should trigger a GitHub Actions `workflow_dispatch` that runs `npm run generate:cv-data` + `pip install 'rendercv[full]==2.8'` + `rendercv render cv/master.yaml` and uploads the PDF artifact. Only the AI tailoring step stays skill-side.
