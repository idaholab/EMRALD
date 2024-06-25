# Install dependencies
npm install
# yarn install

# Start local dev server
npm run dev

# Generate new documentation for the schema
npm run prepare

This command uses a tool called "jsonschema2md". It will go to our schema in the UI and generate mardown documentation for it. Sometimes the command to generate new documentation for the schema will fail due to "maximum call stack exceeded". In this case, you need to delete the line 907, "$ref": "#/definitions/Group". This line is found under "items", in the "subgroup" property of the "Group" object. The tool used to generate the markdown documentation from the schema is often not able to handle the recursive nature of the schema. If you get this error when running "npm run prepare", delete this line, run the command again, and add the line back in.  
<!--Copyright 2021 Battelle Energy Alliance-->
