/**
 * This file serves as a common path for files to get the latest model schema types and JSON schema.
 * When updating the schema to a new version, change these exports to point to the latest schema files.
 */
export * from '../utils/Upgrades/v3_3/AllModelInterfacesV3_3';
export { default as EMRALD_JsonSchema } from '../utils/Upgrades/v3_3/EMRALD_JsonSchemaV3_3.json';
