import { ChangeDetectionStrategy, Component } from '@angular/core'
import { certifications, education, publications } from '../data/profile'
import { IconComponent } from './icon.component'
import { SectionComponent } from './section.component'

@Component({
  selector: 'app-education',
  imports: [SectionComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section sectionId="education" eyebrow="Education & Credentials" heading="Qualifications">
      <div class="grid grid--edu">
        @for (e of education; track e.degree) {
          <article class="card edu">
            <span class="edu__icon"><app-icon name="cap" /></span>
            <span class="badge">{{ e.period }}</span>
            <h3>{{ e.degree }}</h3>
            <p class="job__company">{{ e.school }} <span class="muted">· {{ e.location }}</span></p>
            @if (e.note) {
              <p class="muted small">{{ e.note }}</p>
            }
          </article>
        }
      </div>

      <div class="creds">
        <div class="card">
          <h3 class="creds__title"><app-icon name="award" /> Certifications</h3>
          <ul class="cred-list">
            @for (c of certifications; track c.title) {
              <li>
                @if (c.url) {
                  <a [href]="c.url" target="_blank" rel="noreferrer"><strong>{{ c.title }}</strong></a>
                } @else {
                  <strong>{{ c.title }}</strong>
                }
                <span class="muted small">{{ c.issuer }}</span>
              </li>
            }
          </ul>
        </div>
        <div class="card">
          <h3 class="creds__title"><app-icon name="book" /> Publications</h3>
          <ul class="cred-list">
            @for (p of publications; track p.title) {
              <li>
                @if (p.url) {
                  <a [href]="p.url" target="_blank" rel="noreferrer"><strong>{{ p.title }}</strong></a>
                } @else {
                  <strong>{{ p.title }}</strong>
                }
                <span class="muted small">{{ p.venue }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </app-section>
  `,
})
export class EducationComponent {
  readonly education = education
  readonly certifications = certifications
  readonly publications = publications
}
