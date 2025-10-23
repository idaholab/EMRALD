import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
  TextWrappingSide,
  TextWrappingType,
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
 * @returns An ImageRun representing the image.
 */
async function createImage(path) {
  const image = await fs.readFile(path);
  const dimensions = imageSize(image);
  return new ImageRun({
    type: 'png',
    data: image,
    transformation: {
      height: 500 * (dimensions.height / dimensions.width),
      width: 500,
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
        const section = [];
        for (const line of (await fs.readFile(fullPath))
          .toString()
          .split('\n')) {
          if (line.startsWith('##')) {
            section.push(
              new Paragraph({
                text: line.substring(2).trim(),
                heading: HeadingLevel.HEADING_2,
              }),
            );
          } else if (line.startsWith('#')) {
            section.push(
              new Paragraph({
                text: line.substring(1).trim(),
                heading: HeadingLevel.HEADING_1,
              }),
            );
          } else {
            let lastSymbol = 0;
            const findNextSymbol = () => {
              let matches = [];
              for (const test of [
                /<a href/,
                /\[[^[]+\]\([^(]+\)/,
                /<img src/,
                /\*\*[^*]+\*\*/,
                /<details>/,
                /<\/details>/,
                /<summary>/,
              ]) {
                const res = test.exec(line.substring(lastSymbol));
                if (res !== null) {
                  let idx = res.index + lastSymbol;
                  // Images that start with ![ get picked up by the same regex as links, so this moves the index back to avoid extra exclamation points in the document
                  if (line.substring(idx - 1, idx + 1) === '![') {
                    idx -= 1;
                  }
                  matches.push(idx);
                }
              }
              return matches.length === 0 ? -1 : Math.min(...matches);
            };
            let nextSymbol = findNextSymbol();
            /** @type {(TextRun | ExternalHyperlink | ImageRun)[]} */
            const paragraph = [
              new TextRun({
                text: trim(line.substring(lastSymbol, nextSymbol)),
              }),
            ];
            if (nextSymbol === -1) {
              section.push(new Paragraph({ text: trim(line) }));
            } else {
              while (nextSymbol !== -1) {
                if (
                  ['<details>', '</details>'].includes(
                    line.substring(nextSymbol).trim(),
                  )
                ) {
                  // Omit these
                  lastSymbol =
                    nextSymbol + line.substring(nextSymbol).trim().length;
                } else if (
                  line.substring(nextSymbol, nextSymbol + 9) === '<summary>'
                ) {
                  const summaryEnd = line.indexOf('<', nextSymbol + 9);
                  paragraph.push(
                    new TextRun({
                      text: line.substring(nextSymbol + 9, summaryEnd),
                    }),
                  );
                  lastSymbol = summaryEnd + 10;
                } else if (
                  line.substring(nextSymbol, nextSymbol + 9) === '<a href="'
                ) {
                  const urlEnd = line.indexOf('"', nextSymbol + 9);
                  const linkEnd = line.indexOf('</a>', urlEnd + 2);
                  paragraph.push(
                    new ExternalHyperlink({
                      children: [
                        new TextRun({
                          text: trim(line.substring(urlEnd + 2, linkEnd)),
                          style: 'Hyperlink',
                        }),
                      ],
                      link: line.substring(nextSymbol + 9, urlEnd),
                    }),
                  );
                  lastSymbol = linkEnd + 4;
                } else if (
                  line.substring(nextSymbol, nextSymbol + 2) === '!['
                ) {
                  const startPath = line.indexOf('(', nextSymbol + 2) + 1;
                  const endPath = line.indexOf(')', startPath);
                  paragraph.push(
                    await createImage(
                      path.join('docs', line.substring(startPath, endPath)),
                    ),
                  );
                  lastSymbol = endPath + 1;
                } else if (line.substring(nextSymbol, nextSymbol + 1) === '[') {
                  const bracketEnd = line.indexOf(']', nextSymbol + 1);
                  const parenEnd = line.indexOf(')', bracketEnd + 2);
                  paragraph.push(
                    new ExternalHyperlink({
                      children: [
                        new TextRun({
                          text: trim(
                            line.substring(nextSymbol + 1, bracketEnd),
                          ),
                          style: 'Hyperlink',
                        }),
                      ],
                      link: line.substring(bracketEnd + 2, parenEnd),
                    }),
                  );
                  lastSymbol = parenEnd + 1;
                } else if (
                  line.substring(nextSymbol, nextSymbol + 10) === '<img src="'
                ) {
                  paragraph.push(
                    await createImage(
                      path.join(
                        'docs',
                        line.substring(
                          nextSymbol + 11,
                          line.indexOf('"', nextSymbol + 11),
                        ),
                      ),
                    ),
                  );
                  lastSymbol = line.indexOf('>', nextSymbol + 11) + 1;
                } else if (
                  line.substring(nextSymbol, nextSymbol + 2) === '**'
                ) {
                  const boldEnd = line.indexOf('**', nextSymbol + 2);
                  paragraph.push(
                    new TextRun({
                      text: trim(line.substring(nextSymbol + 2, boldEnd)),
                      bold: true,
                    }),
                  );
                  lastSymbol = boldEnd + 2;
                }
                nextSymbol = findNextSymbol();
                if (nextSymbol !== -1) {
                  paragraph.push(
                    new TextRun({
                      text: trim(line.substring(lastSymbol, nextSymbol)),
                    }),
                  );
                }
              }
              if (line.substring(lastSymbol).length > 0) {
                paragraph.push(
                  new TextRun({ text: trim(line.substring(lastSymbol)) }),
                );
              }
              section.push(new Paragraph({ children: paragraph }));
            }
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
              },
            },
            hyperlink: {
              run: {
                color: '5dd86b',
                underline: {
                  type: 'single',
                },
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
                bold: false,
                color: '3c3c43',
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
                bold: false,
                color: '3c3c43',
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
