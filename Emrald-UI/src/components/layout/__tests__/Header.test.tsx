import { render } from '@testing-library/react';
import Header from '../Header';

test('Header component renders correctly', () => {
  const { getByRole } = render(<Header />);

  // Test that the logo is rendered
  const logoElement = getByRole('img', { name: 'Logo' });
  expect(logoElement).toBeInTheDocument();

  // Test that the text "Model Editor" is rendered
  const titleElement = getByRole('heading', { name: 'Model Editor' });
  expect(titleElement).toBeInTheDocument();
});
