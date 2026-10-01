# Emrald - Update Schema

## Description

This README contains instructions for updating the schema and associated types used for the Emrald UI. To do so requires the installation of Liquid Stuido.

Installation can be found here: [Liquid Studio](https://www.liquid-technologies.com/xml-studio)

## Steps to Update Schema

1. Create a new folder with the schema version as the name at Upgrades/vX_X.
2. Copy the previous EMRALD_JsonSchemaVX_X.json file to the new folder.
3. Make modifications to the JSON schema. Either directly or using a tool like Liquid Studio.
4.  Paste the JSON schema into the following link on the JSON Schema side:
  [JSON Schema to TypeScript](https://transform.tools/json-schema-to-typescript)
5. Paste the generated TypeScript into a new file at vX_X/AllModelInterfacesVX_X.ts.
6. Run Prettier and/or ESLint to fix any linting problems with the generated TypeScript.
7. Create an `Upgrade_VX_X` function in vX_X/UpgradeVX_X.ts to perform the necessary upgrades.
8. Add the new `Upgrade_VX_X` function to the `upgrades` array in the `upgradeGiveId` function in Upgrades/upgradeGiveID.ts.
9. Update the two import paths in src/types/EMRALD_Model.ts to point to your new schema TypeScript definitions at src/utils/Upgrades/vX_X/AllModelInterfacesVX_X.ts.
10. Update the `EMRALD_SchemaVersion` variable in src/types/ModelUtils.ts.
11. Update the `SCHEMA_VERSION` property of `EmraldModel` in SimulationDAL/EmraldModel.cs.
12. Check the Emrald-UI project for any new type errors resulting from schema changes.
13. Update Documentation
  - Navigate to emrald-docs in a terminal
  - Delete docs/Modeling/schema-md
  - Run the command `npx jsonschema2md -o docs/Modeling/schema-md -d ../Emrald-UI/src/utils/Upgrades/vXXX/ -e json` to regenerate the documentation for the schema with your saved changes.
