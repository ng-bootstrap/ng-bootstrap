import {Snippet} from '../../../../../shared/code/snippet';




export const SNIPPETS = {
  observableSetup: {
    template: Snippet({
      lang: 'html',
      code: `
        <input
          type="text"
          [ngbTypeahead]="initializeTypeahead"
        />
      `,
    }),
    component: Snippet({
      lang: 'typescript',
      code: `
        export class MyComponent {
          initializeTypeahead = (input$: Observable<string>): Observable<string[]> =>
            input$.pipe(
              // ...
              // do any processing you need
              // ...
            )
        }
      `,
    }),
  },
  data: Snippet({
    lang: 'typescript',
    code: `
      const COLORS = ['black', 'white', 'red', 'green', 'yellow', 'blue', 'brown', 'orange', 'pink', 'purple', 'grey'];
    `,
  }),
  observable: {
    mapping: Snippet({
      lang: 'typescript',
      code: `
        import {map} from 'rxjs/operators';
        // ...
        initializeTypeahead = (input$: Observable<string>): Observable<string[]> =>
          input$.pipe(
            map(searchTerm => searchTerm.length === 0
              ? COLORS
              : COLORS.filter(color => color.startsWith(searchTerm))
            ),
          )
      `,
    }),
  }
};
