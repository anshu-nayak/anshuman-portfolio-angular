import { ChangeDetectionStrategy, Component } from '@angular/core'
import { languages, profile } from '../data/profile'
import { SectionComponent } from './section.component'

@Component({
  selector: 'app-about',
  imports: [SectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section sectionId="about" eyebrow="About" heading="Bridging tech and business">
      <div class="about">
        <div class="about__text">
          @for (p of profile.about; track $index) {
            <p>{{ p }}</p>
          }
        </div>
        <aside class="card about__side">
          <h3>Languages</h3>
          <ul class="lang-list">
            @for (l of languages; track l.name) {
              <li><span>{{ l.name }}</span><span class="muted">{{ l.level }}</span></li>
            }
          </ul>
        </aside>
      </div>
    </app-section>
  `,
})
export class AboutComponent {
  readonly profile = profile
  readonly languages = languages
}
