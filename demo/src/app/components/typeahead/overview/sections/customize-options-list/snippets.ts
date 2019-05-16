import {Snippet} from '../../../../../shared/code/snippet';



export const SNIPPETS = {
  resultFormatter: {
    api: Snippet({
      lang: 'typescript',
      code: `@Input() resultFormatter: (item: any) => string;`
    }),
    template: Snippet({
      lang: 'html',
      code: `
        <input
          type="text"
          [ngbTypeahead]="initializeTypeahead"
          [resultFormatter]="formatResultForPopup"
        />
      `
    }),
    component: Snippet({
      lang: 'typescript',
      code: `
        export class MyComponent {
          formatResultForPopup(color: Color): string {
            return \`\${color.name} (\${color.hexCode})\`;
          }
        }
      `
    }),
  },
  resultTemplate: {
    html: Snippet({
      lang: 'html',
      code: `
        <ng-template
          #displayResult

          let-color="result"
          let-term="term"
        >
          <div class="middle">
            <div class="color-chip" [ngStyle]="{'background-color': '#' + color.hexCode}"></div>
            <ngb-highlight [result]="color.name" [term]="term"></ngb-highlight>
            <span> ({{color.hexCode}})</span>
          </div>
        </ng-template>

        <input
          type="text"
          [ngbTypeahead]="initializeTypeahead"
          [resultTemplate]="displayResult"
        />
      `
    }),
  },
};
