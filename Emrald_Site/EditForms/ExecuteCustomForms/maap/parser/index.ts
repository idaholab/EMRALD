import parser from '../dist/parser';
import wrapper from './wrapper';

// The parser file must be rebuilt manually!
export default wrapper(
  parser,
);
