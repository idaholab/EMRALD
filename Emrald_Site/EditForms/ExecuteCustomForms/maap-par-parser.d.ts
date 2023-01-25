declare module 'maap-par-parser' {
  type MAAPParParserOutput = {
    desc: string;
    index: number;
    value: string;
  };

  export type MAAPParParser = {
    default: MAAPParParser;
    parse(input: string): MAAPParParserOutput;
  };
}
