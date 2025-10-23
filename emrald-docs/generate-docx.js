import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
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

async function generateDocx() {
  console.log('Generating documentation document...');
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
            const nextSymbol = Math.max(
              line.indexOf('<a href'),
              /^!\[[^[]+\]\([^(]+\)/.exec(line)?.index ?? -1,
              line.indexOf('<img src'),
              /!\[[^[]+\]\([^(]+\)/.exec(line)?.index ?? -1,
              /\*\*[^*]+\*\*/.exec(line)?.index ?? -1,
            );
            if (nextSymbol === -1) {
              section.push(new Paragraph({ text: line }));
            } else {
              /** @type {(TextRun | ExternalHyperlink | ImageRun)[]} */
              const paragraph = [
                new TextRun({ text: line.substring(0, nextSymbol) }),
              ];
              if (line.substring(nextSymbol, nextSymbol + 9) === '<a href="') {
                const urlEnd = line.indexOf('"', nextSymbol + 9);
                const linkEnd = line.indexOf('</a>', urlEnd + 2);
                paragraph.push(
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: line.substring(urlEnd + 2, linkEnd),
                        style: 'Hyperlink',
                      }),
                    ],
                    link: line.substring(nextSymbol + 9, urlEnd),
                  }),
                );
                lastSymbol = linkEnd + 4;
              } else if (line.substring(nextSymbol, nextSymbol + 2) === '![') {
                const startPath = line.indexOf('(', nextSymbol + 2) + 1;
                const endPath = line.indexOf(')', startPath);
                paragraph.push(
                  new ImageRun({
                    type: 'png',
                    data: await fs.readFile(
                      path.join('docs', line.substring(startPath, endPath)),
                    ),
                    transformation: {
                      height: 250,
                      width: 250,
                    },
                  }),
                );
                lastSymbol = endPath + 1;
              } else if (line.substring(nextSymbol, nextSymbol + 1) === '[') {
                const bracketEnd = line.indexOf(']', nextSymbol + 1);
                const parenEnd = line.indexOf(')', bracketEnd + 2);
                paragraph.push(
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: line.substring(nextSymbol + 1, bracketEnd),
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
                  new ImageRun({
                    type: 'png',
                    data: await fs.readFile(
                      path.join(
                        'docs',
                        line.substring(
                          nextSymbol + 11,
                          line.indexOf('"', nextSymbol + 11),
                        ),
                      ),
                    ),
                    transformation: {
                      height: 250,
                      width: 250,
                    },
                  }),
                );
                lastSymbol = line.indexOf('/>', nextSymbol + 11);
              } else if (line.substring(nextSymbol, nextSymbol + 2) === '**') {
                const boldEnd = line.indexOf('**', nextSymbol + 2);
                paragraph.push(
                  new TextRun({
                    text: line.substring(nextSymbol + 2, boldEnd),
                    bold: true,
                  }),
                );
                lastSymbol = boldEnd + 2;
              }
              paragraph.push(new TextRun({ text: line.substring(lastSymbol) }));
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
