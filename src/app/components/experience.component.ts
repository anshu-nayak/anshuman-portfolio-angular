import { ChangeDetectionStrategy, Component } from '@angular/core'
import { experience } from '../data/profile'
import { SectionComponent } from './section.component'

@Component({
  selector: 'app-experience',
  imports: [SectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section sectionId="experience" eyebrow="Experience" heading="Where I’ve worked" [alt]="true">
      <ol class="timeline">
        @for (job of experience; track job.company + job.period) {
          <li class="timeline__item">
            <span class="timeline__dot" [class.is-current]="job.current"></span>
            <article class="card">
              <div class="job__head">
                <div>
                  <h3>{{ job.role }}</h3>
                  <p class="job__company">{{ job.company }} <span class="muted">· {{ job.location }}</span></p>
                </div>
                <span class="badge" [class.badge--accent]="job.current">{{ job.period }}</span>
              </div>
              <ul class="bullets">
                @for (pt of job.points; track $index) {
                  <li>{{ pt }}</li>
                }
              </ul>
              <div class="chips">
                @for (t of job.tags; track t) {
                  <span class="chip">{{ t }}</span>
                }
              </div>
            </article>
          </li>
        }
      </ol>
    </app-section>
  `,
})
export class ExperienceComponent {
  readonly experience = experience
}
