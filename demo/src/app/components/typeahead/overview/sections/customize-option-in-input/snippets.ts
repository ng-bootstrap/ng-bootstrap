import {Snippet} from '../../../../../shared/code/snippet';



export const SNIPPETS = {
  inputFormatter: {
    api: Snippet({
      lang: 'typescript',
      code: `@Input() inputFormatter: (item: any) => string;`
    }),
    template: Snippet({
      lang: 'html',
      code: `
        <input
          type="text"
          [ngbTypeahead]="initializeTypeahead"
          [inputFormatter]="formatResultForInput"
        />
      `
    }),
    component: Snippet({
      lang: 'typescript',
      code: `
        export class MyComponent {
          formatResultForInput(color: Color): string {
            return color.name.toUpperCase();
          }
        }
      `
    }),
  },
};
