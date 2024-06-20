# Emrald - Update Schema

## Description

This README contains instructions for updating the schema and associated types used for the Emrald UI. To do so requires the installation of Liquid Stuido.

Installation can be found here: [Liquid Studio](https://www.liquid-technologies.com/xml-studio)

## Steps to Update Schema

### Step 1

- Open Liquid Studio
- Open the file at \EMRALD\Emrald-UI\src\utils\Upgrades\v3_0

### Step 2: Edit Structure

- Use Liquid Studio to edit the structure of the desired definition or property.

### Step 3: Convert to JSON Schema

- Once the model in Liquid Studio matches the desired structure, copy the entire JSON schema shown.
- Paste the JSON schema into the following link on the JSON Schema side:
  [JSON Schema to TypeScript](https://transform.tools/json-schema-to-typescript)

### Step 4: Generate TypeScript Schema

- Copy the generated TypeScript schema from the right-hand side of the website.
- Paste the TypeScript side into: EMRALD\Emrald-UI\src\utils\Upgrades\v3_0\AllModelInterfacesV3_0.ts

### Step 5: Update Types Directory

- Copy the section -- or interface -- of `AllModelInterfacesV3_0.ts` that was edited.
- Paste it into its matching section in the `types` directory. For example, if you edited the structure of the `Diagram` type,
  copy the entire `Diagram` interface from `AllModelInterfacesV3_0.ts` and paste it into the `Diagram.ts` file in the `types` directory.

### Step 6: Update Documentation

- Once you are in the Emrald-UI directory, run the script `npm run prepare` to regenerate the documentation for the schema with your saved changes.
