import {
  Bookmark,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  TextWrappingSide,
  TextWrappingType,
  UnderlineType,
  VerticalPositionRelativeFrom,
} from 'docx';
import { imageSize } from 'image-size';
import fs from 'node:fs/promises';
import path from 'node:path';

// Paths to ignore when generating the document (relative to the /docs folder)
const ignore = [
  /templates\.md/,
  /index\.md/,
  /\.vitepress[/\\].*/,
  /images[/\\].*/,
  /public[/\\].*/,
  /.*\.css/,
];

/**
 * Trims HTML line breaks from text.
 * @param {string} text - The text to trim.
 * @returns The trimmed text.
 */
function trim(text) {
  return text.replace('<br>', '');
}

/**
 * Helper function to create an ImageRun from a path to an image.
 * @param {string} path - The path to the image.
 * @param {number} width - The width to display the image as (defaults to 500).
 * @returns An ImageRun representing the image.
 */
async function createImage(path, width = 500) {
  const image = await fs.readFile(path);
  const dimensions = imageSize(image);
  return new ImageRun({
    type: 'png',
    data: image,
    transformation: {
      height: width * (dimensions.height / dimensions.width),
      width,
    },
    floating: {
      horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
        offset: 1014400,
      },
      verticalPosition: {
        relative: VerticalPositionRelativeFrom.LINE,
        offset: 0,
      },
      wrap: {
        type: TextWrappingType.TOP_AND_BOTTOM,
        side: TextWrappingSide.BOTH_SIDES,
      },
    },
  });
}

// Word documents don't support named colors, so put any named colors used in element styles here
const colorToHex = {
  red: 'FF0000',
  green: '00FF00',
  blue: '0000FF',
  orange: 'FFA500',
  gray: '808080',
};

/**
 * Reads style information out of a style property.
 * @param {string} style - The style property.
 */
function readStyle(style) {
  let color = undefined;
  const setColor = style.indexOf('color:');
  if (setColor !== -1) {
    color = style.substring(setColor + 6);
    if (Object.prototype.hasOwnProperty.call(colorToHex, color)) {
      /** @type {keyof typeof colorToHex} */
      const key = color;
      color = colorToHex[key];
    }
  }
  return { color };
}

/**
 * Helper function for creating a header with a bookmark anchor.
 * @param {string} text - The markdown text of the header.
 * @param {(typeof HeadingLevel)[keyof typeof HeadingLevel]} headingLevel - The heading level.
 * @returns
 */
function createHeading(text, headingLevel) {
  return new Paragraph({
    children: [
      new Bookmark({
        id: text
          .toLocaleLowerCase()
          .replace(/\s/g, '-')
          .replace(/^[A-z]/, ''),
        children: parseInnerText(text),
      }),
    ],
    heading: headingLevel,
  });
}

/**
 * Parses a line of Markdown text.
 * @param {string} line - The line of raw markdown.
 * @param {{ color?: string; underline?: { type: (typeof UnderlineType)[keyof typeof UnderlineType] }, bold?: boolean } | undefined} styles - Inherited styles from parents.
 */
function parseInnerText(line, styles = undefined) {
  let color = styles?.color;
  let underline = styles?.underline;
  let bold = styles?.bold;
  /** @type {(TextRun | ExternalHyperlink)[]} */
  const section = [];
  let lastSymbol = 0;
  const findNextSymbol = () => {
    let matches = [];
    for (const test of [
      /<a href/,
      /\[[^[]+\]\([^(]+\)/,
      /\*\*[^*]+\*\*/,
      /<span/,
      /<div/,
    ]) {
      const res = test.exec(line.substring(lastSymbol));
      if (res !== null) {
        matches.push(res.index + lastSymbol);
      }
    }
    return matches.length === 0 ? -1 : Math.min(...matches);
  };
  let nextSymbol = findNextSymbol();
  if (nextSymbol === -1) {
    section.push(new TextRun({ text: line, color, underline, bold }));
  } else {
    while (nextSymbol !== -1) {
      if (line.substring(nextSymbol, nextSymbol + 9) === '<a href="') {
        const urlEnd = line.indexOf('"', nextSymbol + 9);
        const linkEnd = line.indexOf('</a>', urlEnd + 2);
        section.push(
          new ExternalHyperlink({
            children: parseInnerText(
              trim(line.substring(urlEnd + 2, linkEnd)),
              {
                color: '5dd86b',
                underline: {
                  type: 'single',
                },
                bold,
              },
            ),
            link: line.substring(nextSymbol + 9, urlEnd),
          }),
        );
        lastSymbol = linkEnd + 4;
      } else if (line.substring(nextSymbol, nextSymbol + 1) === '[') {
        const bracketEnd = line.indexOf(']', nextSymbol + 1);
        const parenEnd = line.indexOf(')', bracketEnd + 2);
        section.push(
          new ExternalHyperlink({
            children: parseInnerText(
              trim(line.substring(nextSymbol + 1, bracketEnd)),
              {
                color: '5dd86b',
                underline: {
                  type: 'single',
                },
                bold,
              },
            ),
            link: line.substring(bracketEnd + 2, parenEnd),
          }),
        );
        lastSymbol = parenEnd + 1;
      } else if (line.substring(nextSymbol, nextSymbol + 2) === '**') {
        const boldEnd = line.indexOf('**', nextSymbol + 2);
        section.push(
          ...parseInnerText(trim(line.substring(nextSymbol + 2, boldEnd)), {
            color,
            underline,
            bold: true,
          }),
        );
        lastSymbol = boldEnd + 2;
      } else if (line.substring(nextSymbol, nextSymbol + 4) === '<div') {
        const openElEnd = line.indexOf('>', nextSymbol + 4) + 1;
        const closeElStart = line.indexOf('<', openElEnd);
        const styleIdx = line.indexOf('style=', nextSymbol + 4);
        let newColor;
        if (styleIdx !== -1) {
          const style = readStyle(
            line.substring(styleIdx + 7, line.indexOf('"', styleIdx + 7)),
          );
          newColor = style.color;
        }
        section.push(
          ...parseInnerText(line.substring(openElEnd, closeElStart), {
            color: newColor ?? color,
            underline,
            bold,
          }),
        );
        lastSymbol = closeElStart + 6;
      } else if (line.substring(nextSymbol, nextSymbol + 5) === '<span') {
        const openElEnd = line.indexOf('>', nextSymbol + 5) + 1;
        const closeElStart = line.indexOf('<', openElEnd);
        const styleIdx = line.indexOf('style=', nextSymbol + 5);
        let newColor;
        if (styleIdx !== -1) {
          const style = readStyle(
            line.substring(styleIdx + 7, line.indexOf('"', styleIdx + 7)),
          );
          newColor = style.color;
        }
        section.push(
          ...parseInnerText(line.substring(openElEnd, closeElStart), {
            color: newColor ?? color,
            underline,
            bold,
          }),
        );
        lastSymbol = closeElStart + 7;
      }
      nextSymbol = findNextSymbol();
      if (nextSymbol !== -1) {
        section.push(
          new TextRun({
            text: trim(line.substring(lastSymbol, nextSymbol)),
            color,
            underline,
            bold,
          }),
        );
      }
    }
    if (line.substring(lastSymbol).length > 0) {
      section.push(
        new TextRun({
          text: trim(line.substring(lastSymbol)),
          color,
          underline,
          bold,
        }),
      );
    }
  }
  return section;
}

/**
 * Parses a line of Markdown.
 * @param {string} line - The line of raw markdown.
 */
async function parseMarkdown(line) {
  /** @type {Paragraph[]} */
  const section = [];
  if (line.startsWith('###')) {
    section.push(
      createHeading(line.substring(3).trim(), HeadingLevel.HEADING_3),
    );
  } else if (line.startsWith('##')) {
    section.push(
      createHeading(line.substring(2).trim(), HeadingLevel.HEADING_2),
    );
  } else if (line.startsWith('#')) {
    section.push(
      createHeading(line.substring(1).trim(), HeadingLevel.HEADING_1),
    );
  } else {
    let lastSymbol = 0;
    const findNextSymbol = () => {
      let matches = [];
      for (const test of [
        /!\[[^[]+\]\([^(]+\)/,
        /<img src/,
        /<details>/,
        /<\/details>/,
        /<summary>/,
      ]) {
        const res = test.exec(line.substring(lastSymbol));
        if (res !== null) {
          matches.push(res.index + lastSymbol);
        }
      }
      return matches.length === 0 ? -1 : Math.min(...matches);
    };
    let nextSymbol = findNextSymbol();
    if (nextSymbol === -1) {
      section.push(new Paragraph({ children: parseInnerText(line) }));
    } else {
      while (nextSymbol !== -1) {
        if (
          ['<details>', '</details>'].includes(
            line.substring(nextSymbol).trim(),
          )
        ) {
          // Omit these
          lastSymbol = nextSymbol + line.substring(nextSymbol).trim().length;
        } else if (line.substring(nextSymbol, nextSymbol + 9) === '<summary>') {
          const summaryEnd = line.indexOf('<', nextSymbol + 9);
          section.push(
            new Paragraph({
              children: parseInnerText(
                line.substring(nextSymbol + 9, summaryEnd),
              ),
            }),
          );
          lastSymbol = summaryEnd + 10;
        } else if (line.substring(nextSymbol, nextSymbol + 2) === '![') {
          const startPath = line.indexOf('(', nextSymbol + 2) + 1;
          const endPath = line.indexOf(')', startPath);
          section.push(
            new Paragraph({
              children: [
                await createImage(
                  path.join('docs', line.substring(startPath, endPath)),
                ),
              ],
            }),
          );
          lastSymbol = endPath + 1;
        } else if (
          line.substring(nextSymbol, nextSymbol + 10) === '<img src="'
        ) {
          let width = undefined;
          const widthSpec = line.indexOf('width=', nextSymbol + 10);
          if (widthSpec !== -1) {
            width = Number(
              line.substring(widthSpec + 7, line.indexOf('"', widthSpec + 7)),
            );
          }
          section.push(
            new Paragraph({
              children: [
                await createImage(
                  path.join(
                    'docs',
                    line.substring(
                      nextSymbol + 11,
                      line.indexOf('"', nextSymbol + 11),
                    ),
                  ),
                  width,
                ),
              ],
            }),
          );
          lastSymbol = line.indexOf('>', nextSymbol + 11) + 1;
        }
        nextSymbol = findNextSymbol();
        if (nextSymbol !== -1) {
          section.push(
            new Paragraph({
              children: parseInnerText(line.substring(lastSymbol, nextSymbol)),
            }),
          );
        }
      }
      if (line.substring(lastSymbol).length > 0) {
        section.push(
          new Paragraph({
            children: parseInnerText(line.substring(lastSymbol)),
          }),
        );
      }
    }
  }
  return section;
}

async function generateDocx() {
  const sections = [];
  for (const file of await fs.readdir('docs', { recursive: true })) {
    const fullPath = path.join('docs', file);
    if (!(await fs.stat(fullPath)).isDirectory()) {
      let ignored = false;
      for (const rule of ignore) {
        if (fullPath.match(rule)) {
          ignored = true;
        }
      }
      if (!ignored) {
        /** @type {(Paragraph | Table)[]} */
        let section = [];
        /** @type {TableRow[]} */
        let rows = [];
        let inTable = false;
        for (const line of (await fs.readFile(fullPath))
          .toString()
          .split('\n')
          .map((l) => l.trimStart())) {
          if (line.startsWith('<!--')) {
            continue;
          } else if (line.startsWith('|')) {
            /** @type {TableCell[]} */
            const cells = [];
            let prevSep = 1;
            let nextSep = line.indexOf('|', 1);
            while (nextSep !== -1) {
              const cellContent = line.substring(prevSep, nextSep);
              if (cellContent === '---') {
                cells.push(
                  new TableCell({
                    children: [],
                  }),
                );
              } else {
                cells.push(
                  new TableCell({
                    children: await parseMarkdown(
                      line.substring(prevSep, nextSep),
                    ),
                  }),
                );
              }
              prevSep = nextSep + 1;
              nextSep = line.indexOf('|', nextSep + 1);
            }
            rows.push(new TableRow({ children: cells }));
            inTable = true;
          } else {
            if (inTable) {
              inTable = false;
              section.push(new Table({ rows }));
              rows = [];
            }
            section = section.concat(await parseMarkdown(line));
          }
        }
        sections.push({
          children: section,
        });
      }
    }
  }
  await fs.writeFile(
    'EMRALD Documentation.docx',
    await Packer.toBuffer(
      new Document({
        title: 'EMRALD Documentation',
        description: 'The official documentation for the EMRALD application',
        sections,
        styles: {
          default: {
            document: {
              run: {
                font: 'Sans Serif Collection',
                color: '3c3c43',
              },
            },
          },
          paragraphStyles: [
            {
              id: 'Heading1',
              name: 'Heading 1',
              basedOn: 'Normal',
              next: 'Normal',
              quickFormat: true,
              run: {
                size: 32,
              },
              paragraph: {
                spacing: {
                  before: 240,
                  after: 120,
                },
              },
            },
            {
              id: 'Heading2',
              name: 'Heading 2',
              basedOn: 'Normal',
              next: 'Normal',
              quickFormat: true,
              run: {
                size: 24,
              },
              paragraph: {
                spacing: {
                  before: 120,
                  after: 120,
                },
              },
            },
            {
              id: 'Heading3',
              name: 'Heading 3',
              basedOn: 'Normal',
              next: 'Normal',
              quickFormat: true,
              run: {
                size: 20,
              },
              paragraph: {
                spacing: {
                  before: 120,
                  after: 120,
                },
              },
            },
          ],
        },
      }),
    ),
  );
}

void generateDocx();
