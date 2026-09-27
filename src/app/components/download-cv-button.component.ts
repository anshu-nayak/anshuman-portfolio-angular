import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core'
import { profile } from '../data/profile'
import { CvService } from '../services/cv.service'
import { IconComponent } from './icon.component'

// Downloads profile.resumeUrl if one is set, otherwise builds the CV PDF from site data.
@Component({
  selector: 'app-download-cv-button',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    @if (resumeUrl) {
      <a [class]="btnClass()" [href]="resumeUrl" download [attr.aria-label]="label()">
        <app-icon name="download" [size]="18" /> <span>{{ label() }}</span>
      </a>
    } @else {
      <button type="button" [class]="btnClass()" (click)="download()" [disabled]="busy()"
        [attr.aria-label]="label()" [attr.aria-busy]="busy()">
        <app-icon name="download" [size]="18" /> <span>{{ busy() ? 'Preparing…' : label() }}</span>
      </button>
    }
  `,
})
export class DownloadCvButtonComponent {
  private readonly cv = inject(CvService)

  readonly btnClass = input('btn')
  readonly label = input('Download CV')
  readonly busy = signal(false)
  readonly resumeUrl = profile.resumeUrl

  async download() {
    if (this.busy()) return
    this.busy.set(true)
    try {
      await this.cv.download()
    } catch (err) {
      console.error('CV generation failed', err)
      alert('Sorry, the CV could not be generated. Please try again.')
    } finally {
      this.busy.set(false)
    }
  }
}
