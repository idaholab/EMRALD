/**
 * This file serves as a common path for files to get the latest model schema types and JSON schema.
 * When updating the schema to a new version, change these exports to point to the latest schema files.
 */
export * from '../utils/Upgrades/v3_4/AllModelInterfacesV3_4';
export { default as EMRALD_JsonSchema } from '../utils/Upgrades/v3_4/EMRALD_JsonSchemaV3_4.json';
