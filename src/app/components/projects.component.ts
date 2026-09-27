import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { Project, projects } from '../data/profile'
import { IconComponent } from './icon.component'
import { ProjectModalComponent } from './project-modal.component'
import { SectionComponent } from './section.component'
import { StatusBadgeComponent } from './status-badge.component'

@Component({
  selector: 'app-projects',
  imports: [SectionComponent, IconComponent, StatusBadgeComponent, ProjectModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-section sectionId="projects" eyebrow="Projects" heading="Things I’ve built and studied">
      <div class="filters" role="tablist" aria-label="Filter projects">
        @for (c of categories; track c) {
          <button role="tab" class="filter" [class.is-active]="filter() === c" [attr.aria-selected]="filter() === c"
            (click)="filter.set(c)">{{ c }}</button>
        }
      </div>

      <div class="grid grid--projects">
        @for (p of visible(); track p.id) {
          <article class="card project">
            <div class="project__top">
              <span class="project__badges">
                <span class="badge" [class]="'badge--' + p.category.toLowerCase()">{{ p.category }}</span>
                @if (p.status) {
                  <app-status-badge [status]="p.status" />
                }
              </span>
              <span class="muted small">{{ p.client }}</span>
            </div>
            <h3>{{ p.title }}</h3>
            <p class="project__summary">{{ p.summary }}</p>
            <div class="chips">
              @for (s of p.stack; track s) {
                <span class="chip">{{ s }}</span>
              }
            </div>
            <button class="link-btn" (click)="active.set(p)">View details <app-icon name="arrow" [size]="16" /></button>
          </article>
        }
      </div>

      @if (active(); as a) {
        <app-project-modal [project]="a" (closed)="active.set(null)" />
      }
    </app-section>
  `,
})
export class ProjectsComponent {
  readonly categories = ['All', ...new Set(projects.map((p) => p.category))]
  readonly filter = signal('All')
  readonly active = signal<Project | null>(null)
  readonly visible = computed(() => {
    const f = this.filter()
    return f === 'All' ? projects : projects.filter((p) => p.category === f)
  })
}
