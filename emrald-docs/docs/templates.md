# Template
Name of C# Test Method: Template_ValidationCase_Test()

## Description
This is a template for a Validation Case page.

## How To Use this Template
1. Create a new Markdown file for your case under `docs/validation-cases/`, e.g. `docs/validation-cases/my-case.md`. (You can start by copying this `templates.md` file.)
2. Add a sidebar link under **Validation Cases → User Validation Cases** in `docs/.vitepress/config.mts`:
   ```ts
   {
     text: 'User Validation Cases',
     items: [
       { text: 'My Case Name', link: '/validation-cases/my-case' },
     ],
   },
   ```
   - Omit the `.md` extension in the link.
3. Replace "Template" on the first line with the name of the test case.
4. Fill in the description.
5. Fill in all other details and create new headers as needed, using Markdown syntax.

# Validation Process
Explain the validation process here and how the comparison data was determined to be correct. Any references can be linked using this syntax: [Reference Title](https://www.google.com)

