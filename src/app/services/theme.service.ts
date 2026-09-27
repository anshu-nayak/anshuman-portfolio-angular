import { Injectable, effect, signal } from '@angular/core'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // storage unavailable — fall through to system preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(initialTheme())

  constructor() {
    effect(() => {
      const t = this.theme()
      document.documentElement.dataset['theme'] = t
      try {
        localStorage.setItem(THEME_KEY, t)
      } catch {
        // ignore
      }
    })
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'))
  }
}
