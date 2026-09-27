import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AboutComponent } from './components/about.component'
import { ContactComponent } from './components/contact.component'
import { EducationComponent } from './components/education.component'
import { ExperienceComponent } from './components/experience.component'
import { HeroComponent } from './components/hero.component'
import { NavbarComponent } from './components/navbar.component'
import { ProjectsComponent } from './components/projects.component'
import { SkillsComponent } from './components/skills.component'
import { profile } from './data/profile'
import { ThemeService } from './services/theme.service'

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    EducationComponent,
    ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-about />
      <app-experience />
      <app-projects />
      <app-skills />
      <app-education />
      <app-contact />
    </main>
    <footer class="footer">
      <div class="container">© {{ year }} {{ name }} · Built with Angular</div>
    </footer>
  `,
})
export class AppComponent {
  // Injected here so the theme is applied on startup
  private readonly theme = inject(ThemeService)
  readonly year = new Date().getFullYear()
  readonly name = profile.name
}
