import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, input, output, viewChild } from '@angular/core'
import { Project } from '../data/profile'
import { IconComponent } from './icon.component'
import { StatusBadgeComponent } from './status-badge.component'

@Component({
  selector: 'app-project-modal',
  imports: [IconComponent, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog class="modal" (close)="closed.emit()" (click)="onBackdrop($event)" aria-labelledby="modal-title">
      @let p = project();
      <div class="modal__body">
        <header class="modal__head">
          <div>
            <span class="project__badges">
              <span class="badge" [class]="'badge--' + p.category.toLowerCase()">{{ p.category }}</span>
              @if (p.status) {
                <app-status-badge [status]="p.status" />
              }
            </span>
            <h3 id="modal-title">{{ p.title }}</h3>
            <p class="muted small">{{ p.client }}</p>
          </div>
          <button class="icon-btn" (click)="dialog.close()" aria-label="Close"><app-icon name="close" /></button>
        </header>

        <p>{{ p.summary }}</p>

        <h4>Highlights</h4>
        <ul class="bullets">
          @for (h of p.highlights; track $index) {
            <li>{{ h }}</li>
          }
        </ul>

        @for (d of p.details ?? []; track d.heading) {
          <div>
            <h4>{{ d.heading }}</h4>
            @if (isList(d.body)) {
              <ul class="bullets">
                @for (b of d.body; track $index) {
                  <li>{{ b }}</li>
                }
              </ul>
            } @else {
              <p>{{ d.body }}</p>
            }
          </div>
        }

        <h4>Tech stack</h4>
        <div class="chips">
          @for (s of p.stack; track s) {
            <span class="chip">{{ s }}</span>
          }
        </div>

        @if (p.links?.length) {
          <div class="modal__links">
            @for (l of p.links; track l.url) {
              <a class="btn" [href]="l.url" target="_blank" rel="noreferrer">
                @if (l.url.includes('github.com')) {
                  <app-icon name="github" [size]="18" />
                }
                {{ l.label }}
              </a>
            }
          </div>
        }
      </div>
    </dialog>
  `,
})
export class ProjectModalComponent implements AfterViewInit, OnDestroy {
  readonly project = input.required<Project>()
  readonly closed = output<void>()
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  ngAfterViewInit() {
    this.dialog().nativeElement.showModal()
    document.body.style.overflow = 'hidden'
  }

  ngOnDestroy() {
    document.body.style.overflow = ''
  }

  // Close when clicking the backdrop (outside the dialog box)
  onBackdrop(e: MouseEvent) {
    if (e.target === this.dialog().nativeElement) this.dialog().nativeElement.close()
  }

  isList(body: string | string[]): body is string[] {
    return Array.isArray(body)
  }
}
