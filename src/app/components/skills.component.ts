import { ChangeDetectionStrategy, Component } from '@angular/core'
import { skills } from '../data/profile'
import { SectionComponent } from './section.component'

@Component({
  selector: 'app-skills',
  imports: [SectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section sectionId="skills" eyebrow="Skills" heading="What I work with" [alt]="true">
      <div class="grid grid--skills">
        @for (g of skills; track g.group) {
          <div class="card">
            <h3 class="skill__title">{{ g.group }}</h3>
            <div class="chips">
              @for (s of g.items; track s) {
                <span class="chip">{{ s }}</span>
              }
            </div>
          </div>
        }
      </div>
    </app-section>
  `,
})
export class SkillsComponent {
  readonly skills = skills
}
