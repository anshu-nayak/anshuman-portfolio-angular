import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <span class="badge badge--status" [class.is-done]="status() === 'Completed'" [class.is-wip]="status() !== 'Completed'">
      {{ status() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>()
}
