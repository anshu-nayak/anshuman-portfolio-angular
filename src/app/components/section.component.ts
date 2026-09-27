import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  template: `
    <section [id]="sectionId()" class="section" [class.section--alt]="alt()">
      <div class="container">
        <header class="section__head">
          @if (eyebrow()) {
            <p class="eyebrow">{{ eyebrow() }}</p>
          }
          <h2>{{ heading() }}</h2>
        </header>
        <ng-content />
      </div>
    </section>
  `,
})
export class SectionComponent {
  readonly sectionId = input.required<string>()
  readonly eyebrow = input<string>()
  readonly heading = input.required<string>()
  readonly alt = input(false)
}
