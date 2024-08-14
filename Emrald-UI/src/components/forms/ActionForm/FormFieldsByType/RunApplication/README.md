# What is the MAAP custom form

The MAAP custom form allows users to upload and edit MAAP parameter and input files. It provides a user-friendly interface for modifying various parts of the form, then regenerates it with the user's changes. The edited information is integrated into the application and tied to "doclink" variables for further use.

## What Parses the MAAP files

When a user creates a custom application of type "MAAP", they begin by uploading a MAAP parameter file and a MAAP input file. The software utilizes two parsers: one for input files and another for parameter files. These parsers transform the uploaded files (in string format) into large data structures known as Abstract Syntax Trees (ASTs).

The parsers are generated automatically using a tool called [PEGGY](https://peggyjs.org/). PEGGY creates a parser based on grammar rules defined by the user. The grammar for the parameter parser is located in grammar-par.pegjs (found in ./CustomForms/MAAP/Parser), while the input parser grammar is in grammar.pegjs. The actual parsers are in maap-inp-parser.ts (for input files) and maap-par-parser.ts (for parameter files). These parsers should only be updated by modifying the PEGGY grammar files and regenerating the parsers.

The parsers export a "parse" function that can be called within your components.

## Process of the peggy parser:

1. PEGGY turns the grammar into a series of pattern-matching functions, which are used to create a javascript parser.
2. The parser it generates processes the input file by breaking it into tokens, matching the tokens to the lexical and synactic rules, and building an AST.
3. You can define actions in each rule to construct custom data structures (like an AST) during parsing.
4. When you call the parser, it runs through lexical and syntactic analysis in the parser, attempting to match the input to the grammar rules and returning a structured output based on your defined actions.

When calling the parse function, the syntax looks like: `const data = InputParse(fileString, {});`. The second parameter is only required by TypeScript but is optional in JavaScript. After the parser finishes parsing the file, it returns an AST object with all of the information from the file. This AST node is then processed and divided into sections for easier access throughout the application.

## Sections of a MAAP file as stored from the parser

Once we have the resultant AST node from the parser, we iterate through it and stored it in sections within a large object called formData. Formdata is a property of all actions but because it is defined as an empty, key-value strucuted object in the schema, you can put any information you want in there. The sections sections of the MAAP input file that are stored in formData are the title, parameter variables, aliases, initiators, conditional blocks, print interval, time settings, and plotfile output.

When rendering different sections of the form, the relevant data is retrieved from formData. For example, when displaying the "Parameter" component, it accesses the parameters property from formData. Any changes made by the user are reflected by updating the corresponding properties in formData.
