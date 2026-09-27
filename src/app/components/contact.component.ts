import { ChangeDetectionStrategy, Component } from '@angular/core'
import { profile } from '../data/profile'
import { DownloadCvButtonComponent } from './download-cv-button.component'
import { IconComponent, IconName } from './icon.component'
import { SectionComponent } from './section.component'

interface ContactItem {
  icon: IconName
  label: string
  value: string
  href: string
  external?: boolean
}

@Component({
  selector: 'app-contact',
  imports: [SectionComponent, IconComponent, DownloadCvButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section sectionId="contact" eyebrow="Contact" heading="Let’s work together" [alt]="true">
      <p class="contact__lead">
        I’m open to frontend engineering, data analytics and consulting roles, as well as freelance work and
        collaborations. The quickest way to reach me is email.
      </p>
      <div class="contact__cta">
        <app-download-cv-button btnClass="btn btn--primary" label="Download my CV (PDF)" />
      </div>
      <div class="grid grid--contact">
        @for (it of items; track it.label) {
          <a class="card contact" [href]="it.href" [attr.target]="it.external ? '_blank' : null"
            [attr.rel]="it.external ? 'noreferrer' : null">
            <span class="contact__icon"><app-icon [name]="it.icon" /></span>
            <span>
              <span class="muted small">{{ it.label }}</span>
              <strong class="contact__value">{{ it.value }}</strong>
            </span>
          </a>
        }
      </div>
    </app-section>
  `,
})
export class ContactComponent {
  readonly items: ContactItem[] = (() => {
    const { email, phone, linkedin, github } = profile.contact
    const list: ContactItem[] = [{ icon: 'mail', label: 'Email', value: email, href: `mailto:${email}` }]
    if (phone) list.push({ icon: 'phone', label: 'Phone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` })
    list.push({ icon: 'linkedin', label: 'LinkedIn', value: 'anshuman-nayak', href: linkedin, external: true })
    if (github)
      list.push({ icon: 'github', label: 'GitHub', value: github.replace('https://github.com/', ''), href: github, external: true })
    return list
  })()
}
