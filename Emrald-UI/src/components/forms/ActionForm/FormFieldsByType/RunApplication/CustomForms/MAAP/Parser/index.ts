import { parse } from './maap-inp-parser';
import { wrapper } from './wrapper';

// The parser file must be rebuilt manually!
export const parser = wrapper(parse);
