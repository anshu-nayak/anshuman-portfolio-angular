import { ChangeDetectionStrategy, Component, HostListener, effect, inject, signal } from '@angular/core'
import { profile } from '../data/profile'
import { ThemeService } from '../services/theme.service'
import { DownloadCvButtonComponent } from './download-cv-button.component'
import { IconComponent } from './icon.component'

@Component({
  selector: 'app-navbar',
  imports: [IconComponent, DownloadCvButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav" [class.nav--scrolled]="scrolled()">
      <div class="container nav__inner">
        <a href="#top" class="nav__brand" (click)="open.set(false)">
          <span class="nav__logo">{{ profile.initials }}</span>
          <span class="nav__name">{{ profile.name }}</span>
        </a>

        <nav class="nav__links" [class.is-open]="open()" aria-label="Primary">
          @for (l of links; track l.href) {
            <a [href]="l.href" (click)="open.set(false)">{{ l.label }}</a>
          }
        </nav>

        <div class="nav__actions">
          <app-download-cv-button btnClass="btn btn--primary btn--sm" label="CV" />
          <button class="icon-btn" (click)="theme.toggle()"
            [attr.aria-label]="'Switch to ' + (theme.theme() === 'dark' ? 'light' : 'dark') + ' mode'">
            <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" />
          </button>
          <button class="icon-btn nav__menu" (click)="open.set(!open())"
            [attr.aria-label]="open() ? 'Close menu' : 'Open menu'" [attr.aria-expanded]="open()">
            <app-icon [name]="open() ? 'close' : 'menu'" />
          </button>
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  readonly theme = inject(ThemeService)
  readonly profile = profile
  readonly open = signal(false)
  readonly scrolled = signal(false)

  readonly links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' },
  ]

  constructor() {
    effect(() => {
      document.body.style.overflow = this.open() ? 'hidden' : ''
    })
    this.onScroll()
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 8)
  }
}
