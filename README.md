# Anshuman Nayak — Portfolio (Angular)

The Angular version of my personal portfolio: experience, projects, skills, education and certifications. It uses Angular 19 standalone components, signals and the built-in control flow, has no backend or database, and works on phones, tablets and desktops, with a light/dark theme.

| Version | Live site | Source |
| --- | --- | --- |
| React | https://anshu-nayak.github.io/anshuman-portfolio/ | https://github.com/anshu-nayak/anshuman-portfolio |
| Angular | https://anshu-nayak.github.io/anshuman-portfolio-angular/ | https://github.com/anshu-nayak/anshuman-portfolio-angular |

## Run locally

```bash
npm install
npm start        # http://localhost:4200
npm run build    # production build in dist/
```

## Updating content

All content lives in **[`src/app/data/profile.ts`](src/app/data/profile.ts)**. It's typed, so the build catches missing or misspelled fields. To add a job, project or certification, edit that file. You don't need to touch any components.

- **Projects** can include an optional `details` array (`{ heading, body }`, where `body` is a string or a list of bullets), shown in the "View details" dialog, and `links: [{ label, url }]`.
- **Certifications and publications** accept a `url` that links to the credential.
- **Download CV** builds a PDF from the same data in the browser (`src/app/services/cv.service.ts`). To serve a fixed PDF instead, put it in `public/` and set `resumeUrl`.

## Project structure

```
src/app/
  data/profile.ts          all site content and its types
  services/                theme (signals + localStorage) and CV PDF generation
  components/              navbar, hero, about, experience, projects (+ modal),
                           skills, education, contact, icon, section wrapper
src/styles.css             design tokens and all styles
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds with the correct `--base-href` and publishes to GitHub Pages. Enable it once under **Settings → Pages → Source: GitHub Actions**.
