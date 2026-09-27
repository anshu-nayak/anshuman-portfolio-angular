import { ChangeDetectionStrategy, Component } from '@angular/core'
import { profile } from '../data/profile'
import { DownloadCvButtonComponent } from './download-cv-button.component'
import { IconComponent } from './icon.component'

@Component({
  selector: 'app-hero',
  imports: [IconComponent, DownloadCvButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="top" class="hero">
      <div class="container hero__inner">
        <div class="hero__text">
          <p class="hero__status"><span class="dot"></span> {{ profile.availability }}</p>
          <h1>
            Hi, I’m {{ firstName }}.
            <span class="hero__role">{{ profile.role }}</span>
          </h1>
          <p class="hero__tagline">{{ profile.tagline }}</p>
          <p class="hero__summary">{{ profile.summary }}</p>
          <p class="hero__loc"><app-icon name="pin" [size]="16" /> {{ profile.location }}</p>
          <div class="hero__cta">
            <a class="btn btn--primary" href="#projects">View projects <app-icon name="arrow" [size]="18" /></a>
            <a class="btn" [href]="'mailto:' + profile.contact.email"><app-icon name="mail" [size]="18" /> Email me</a>
            <app-download-cv-button />
            <a class="btn btn--icon" [href]="profile.contact.linkedin" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <app-icon name="linkedin" [size]="18" />
            </a>
            @if (profile.contact.github) {
              <a class="btn btn--icon" [href]="profile.contact.github" target="_blank" rel="noreferrer" aria-label="GitHub">
                <app-icon name="github" [size]="18" />
              </a>
            }
          </div>
        </div>

        <div class="hero__card">
          @if (profile.photo) {
            <img class="avatar avatar--photo" [src]="profile.photo" [alt]="profile.name" width="160" height="160" />
          } @else {
            <div class="avatar" aria-hidden="true">{{ profile.initials }}</div>
          }
          <div class="hero__stats">
            @for (s of profile.stats; track s.label) {
              <div class="stat">
                <strong>{{ s.value }}</strong>
                <span>{{ s.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly profile = profile
  readonly firstName = profile.name.split(' ')[0]
}
