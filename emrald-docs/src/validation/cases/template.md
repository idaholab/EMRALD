# Template
**Name of C# Test Method**: *Template_ValidationCase_Test()*

## Description
This is a template for a Validation Case page.

### How To Use this Template
1. Create a new Markdown (md) file with a relevant name for the test case within this folder: `emrald-docs\src\validation\cases\`.
1. Add a menu link to the file by adding a new item to the Validation Cases `children` array in [`emrald-docs\src\.vuepress\config.js`](https://github.com/idaholab/EMRALD/blob/main/emrald-docs/src/.vuepress/config.js)
   - A new item should use this format: `'cases/{filename}'`
      - Be sure to add the necessary comma on the previous line or the new line, depending on item placement in the array.
      - Do not include the `.md` file extension in the filename.
      - Do not include curly braces (`{}`) in the new item. They appear in the format merely to indicate what should be changed.
1. Copy and paste this template (`emrald-docs\src\validation\cases\template.md`) into the new file.
1. Replace "Template" on the first line with the name of the test case.
1. Fill in a description.
1. Fill in all other details and create new headers as is necessary, using the [Markdown Syntax](https://www.markdownguide.org/basic-syntax/)

## Validation Process
Explain the validation process here and how the comparison data was determined to be correct.  Any references can be linked using this syntax: `[Reference Title](https://example.com/some-link)`

<!--Each new file must contain this copyright notice-->
<!--Copyright 2021 Battelle Energy Alliance-->
