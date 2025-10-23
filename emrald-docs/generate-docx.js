import { Document, HeadingLevel, Packer, Paragraph } from 'docx';
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
  console.log('Generate documentation document...');
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
                text: line.substring(2),
                heading: HeadingLevel.HEADING_2,
              }),
            );
          } else if (line.startsWith('#')) {
            section.push(
              new Paragraph({
                text: line.substring(1),
                heading: HeadingLevel.HEADING_1,
              }),
            );
          } else {
            section.push(new Paragraph({ text: line }));
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
                  before: 240,
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
