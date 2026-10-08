import { Injectable } from '@angular/core'
import type { jsPDF } from 'jspdf'
import { certifications, education, experience, languages, profile, projects, publications, skills } from '../data/profile'

// Builds an A4 PDF CV from the same data the website renders, so the two
// never drift apart. jsPDF is loaded on demand to keep the initial bundle small.

type RGB = [number, number, number]

const PAGE_W = 210
const PAGE_H = 297
const M = 16 // page margin (mm)
const CONTENT_W = PAGE_W - M * 2

// The site shows everything; the CV is trimmed to stay at about two pages
const DETAILED_JOBS = 1 // most recent jobs that keep their bullets; older roles get one line each
const CV_CATEGORIES: string[] = ['Professional', 'Personal'] // Analytics/Academic work is already in the Education notes
const CV_HIGHLIGHTS: Record<string, number> = { Professional: 0, Personal: 2 } // work projects are already told in the experience bullets
const CV_STACK = 6 // stack items per project

const ACCENT: RGB = [79, 70, 229]
const TEXT: RGB = [15, 23, 42]
const MUTED: RGB = [91, 100, 119]
const RULE: RGB = [226, 230, 239]

// Built-in PDF fonts only cover Latin-1, so swap typographic characters for plain ones
const clean = (s: string) =>
  String(s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/…/g, '...')

const lineH = (size: number) => size * 0.42 // mm per line for a given pt size

@Injectable({ providedIn: 'root' })
export class CvService {
  async download(): Promise<void> {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    new CvWriter(doc).write()
    doc.setProperties({ title: `${profile.name} - CV`, author: profile.name, subject: profile.role })
    doc.save(`${profile.name.replace(/\s+/g, '_')}_CV.pdf`)
  }
}

class CvWriter {
  private y = M

  constructor(private doc: jsPDF) {}

  private setFont(size: number, style = 'normal', color: RGB = TEXT) {
    this.doc.setFont('helvetica', style)
    this.doc.setFontSize(size)
    this.doc.setTextColor(...color)
  }

  private ensure(h: number) {
    if (this.y + h > PAGE_H - M - 6) {
      this.doc.addPage()
      this.y = M
    }
  }

  private paragraph(
    text: string,
    { size = 9.5, style = 'normal', color = TEXT, indent = 0, gap = 1.5 }: { size?: number; style?: string; color?: RGB; indent?: number; gap?: number } = {},
  ) {
    this.setFont(size, style, color)
    const lines: string[] = this.doc.splitTextToSize(clean(text), CONTENT_W - indent)
    for (const ln of lines) {
      this.ensure(lineH(size))
      this.doc.text(ln, M + indent, this.y + lineH(size) * 0.8)
      this.y += lineH(size)
    }
    this.y += gap
  }

  private bullet(text: string, size = 9.5) {
    this.setFont(size)
    const lines: string[] = this.doc.splitTextToSize(clean(text), CONTENT_W - 5)
    this.ensure(lineH(size))
    this.doc.setFillColor(...ACCENT)
    this.doc.circle(M + 1.3, this.y + lineH(size) * 0.5, 0.55, 'F')
    for (const ln of lines) {
      this.ensure(lineH(size))
      this.doc.text(ln, M + 5, this.y + lineH(size) * 0.8)
      this.y += lineH(size)
    }
    this.y += 0.8
  }

  private heading(title: string) {
    this.ensure(28) // keep the heading with the first entry below it
    this.y += 3
    this.setFont(11, 'bold', ACCENT)
    this.doc.text(title.toUpperCase(), M, this.y + 4)
    this.y += 6
    this.doc.setDrawColor(...RULE)
    this.doc.setLineWidth(0.3)
    this.doc.line(M, this.y, PAGE_W - M, this.y)
    this.y += 3
  }

  // Bold label followed by wrapped text, e.g. "Frontend: Angular 18, TypeScript, ..."
  private labelRow(label: string, text: string) {
    const doc = this.doc
    this.setFont(9.5, 'bold')
    const labelText = `${clean(label)}: `
    const labelW = doc.getTextWidth(labelText) + 1.2
    this.setFont(9.5)
    const lines: string[] = doc.splitTextToSize(clean(text), CONTENT_W - labelW)
    this.ensure(lineH(9.5) * lines.length)
    this.setFont(9.5, 'bold')
    doc.text(labelText, M, this.y + lineH(9.5) * 0.8)
    this.setFont(9.5)
    for (const ln of lines) {
      doc.text(ln, M + labelW, this.y + lineH(9.5) * 0.8)
      this.y += lineH(9.5)
    }
    this.y += 1
  }

  // Title line on the left with a right-aligned date on the same baseline
  private titleRow(left: string, right: string | null, size = 10.5) {
    this.ensure(lineH(size) + 16) // keep the title with at least a couple of lines below it
    this.setFont(size, 'bold')
    const rightW = right ? this.doc.getTextWidth(clean(right)) + 4 : 0
    const lines: string[] = this.doc.splitTextToSize(clean(left), CONTENT_W - rightW)
    if (right) {
      this.setFont(9, 'normal', MUTED)
      this.doc.text(clean(right), PAGE_W - M, this.y + lineH(size) * 0.8, { align: 'right' })
      this.setFont(size, 'bold')
    }
    for (const ln of lines) {
      this.doc.text(ln, M, this.y + lineH(size) * 0.8)
      this.y += lineH(size)
    }
    this.y += 0.5
  }

  write() {
    const doc = this.doc

    // ---------- Header ----------
    this.setFont(22, 'bold')
    doc.text(clean(profile.name), M, this.y + 8)
    this.y += 11
    this.setFont(11.5, 'bold', ACCENT)
    doc.text(clean(`${profile.role}  |  ${profile.tagline}`), M, this.y + 4)
    this.y += 7

    const { email, phone, linkedin, github } = profile.contact
    const contacts: { text: string; url?: string }[] = [
      { text: email, url: `mailto:${email}` },
      ...(phone ? [{ text: phone }] : []),
      { text: profile.location },
      { text: linkedin.replace(/^https?:\/\/(www\.)?/, ''), url: linkedin },
      ...(github ? [{ text: github.replace(/^https?:\/\//, ''), url: github }] : []),
    ]

    this.setFont(9, 'normal', MUTED)
    const sep = '   |   '
    let x = M
    contacts.forEach((c, i) => {
      const t = clean(c.text)
      const w = doc.getTextWidth(t)
      if (x + w > PAGE_W - M) {
        x = M
        this.y += lineH(9) + 0.5
      }
      if (c.url) doc.textWithLink(t, x, this.y + 3, { url: c.url })
      else doc.text(t, x, this.y + 3)
      x += w
      if (i < contacts.length - 1) {
        doc.text(sep, x, this.y + 3)
        x += doc.getTextWidth(sep)
      }
    })
    this.y += 6

    const site = window.location.origin + window.location.pathname
    if (site.startsWith('http') && !site.includes('localhost')) {
      this.setFont(9, 'normal', MUTED)
      doc.text('Portfolio: ', M, this.y + 3)
      const lw = doc.getTextWidth('Portfolio: ')
      doc.setTextColor(...ACCENT)
      doc.textWithLink(site.replace(/^https?:\/\//, ''), M + lw, this.y + 3, { url: site })
      this.y += 6
    }

    // ---------- Summary ----------
    this.heading('Professional Summary')
    this.paragraph(profile.summary)

    // ---------- Skills ----------
    this.heading('Technical Skills')
    for (const g of skills) this.labelRow(g.group, g.items.join(', '))

    // ---------- Experience ----------
    this.heading('Professional Experience')
    for (const [i, job] of experience.entries()) {
      if (i >= DETAILED_JOBS) {
        this.titleRow(`${job.role} - ${job.company}`, job.period, 10)
        continue
      }
      this.titleRow(job.role, job.period)
      this.paragraph(`${job.company}  ·  ${job.location}`, { color: MUTED, gap: 1 })
      job.points.forEach((p) => this.bullet(p))
      this.y += 2
    }

    // ---------- Projects ----------
    this.heading('Key Projects')
    for (const p of projects.filter((p) => CV_CATEGORIES.includes(p.category))) {
      if (!CV_HIGHLIGHTS[p.category]) {
        // Role and client are already in the experience bullets, so just the title and stack
        this.titleRow(p.title, null, 9.5)
        this.paragraph(p.stack.slice(0, CV_STACK).join(', '), { size: 8.5, style: 'italic', color: MUTED, gap: 1.5 })
        continue
      }
      this.titleRow(p.title, p.status ? `${p.category} · ${p.status}` : p.category, 10)
      this.paragraph(`${p.client}  ·  ${p.stack.slice(0, CV_STACK).join(', ')}`, { size: 8.5, style: 'italic', color: MUTED, gap: 1 })
      p.highlights.slice(0, CV_HIGHLIGHTS[p.category]).forEach((h) => this.bullet(h, 9))
      for (const l of p.links ?? []) {
        this.setFont(8.5, 'normal', ACCENT)
        this.ensure(lineH(8.5))
        doc.textWithLink(clean(l.url.replace(/^https?:\/\//, '')), M + 5, this.y + lineH(8.5) * 0.8, { url: l.url })
        this.y += lineH(8.5) + 0.5
      }
      this.y += 2
    }

    // ---------- Education ----------
    this.heading('Education')
    for (const e of education) {
      this.titleRow(e.degree, e.period, 10)
      this.paragraph(`${e.school}  ·  ${e.location}`, { color: MUTED, gap: 0.5 })
      if (e.note) this.paragraph(e.note, { size: 9, gap: 2 })
    }

    // ---------- Certifications, Publications & Languages ----------
    this.heading('Certifications & Languages')
    certifications.forEach((c) => this.bullet(`${c.title} - ${c.issuer}`, 9))
    this.y += 1
    if (publications.length) this.labelRow('Publication', publications.map((p) => `${p.title} - ${p.venue}`).join('; '))
    this.labelRow('Languages', languages.map((l) => `${l.name} - ${l.level}`).join(sep))

    // ---------- Footer: page numbers ----------
    const pages = doc.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i)
      this.setFont(8, 'normal', MUTED)
      doc.text(`${clean(profile.name)}  -  CV`, M, PAGE_H - 8)
      doc.text(`Page ${i} of ${pages}`, PAGE_W - M, PAGE_H - 8, { align: 'right' })
    }
  }
}
