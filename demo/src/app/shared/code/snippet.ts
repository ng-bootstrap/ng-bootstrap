export interface ISnippet {
  lang: 'html' | 'typescript' | 'css' | 'bash';
  code: string;
}

function removeEmptyLineAtIndex(lines: string[], index: number) {
  if (lines[index].trim().length === 0) {
    lines.splice(index, 1);
  }
}

function findIndentLevel(lines): number {
  return Math.min(...lines
    .map(line => {
      const result = /( *)[^ ]+/g.exec(line);
      return result == null ? null : result[1].length;
    })
    .filter(value => value != null)
  );
}

function fixIndent(lines: string[]): string[] {
  removeEmptyLineAtIndex(lines, 0);
  removeEmptyLineAtIndex(lines, lines.length - 1);
  const indentLevel = findIndentLevel(lines);

  return lines.map(line => line.substring(indentLevel));
}


export function Snippet({lang, code}: ISnippet): ISnippet {
  return {
    lang,
    code: fixIndent(code.split(/(?:\r\n)|\n|\r/gi)).join('\n'),
  };
}
