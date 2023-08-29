import { render } from '@testing-library/react';
import Sidebar from '../Sidebar';

test('Sidebar component renders correctly', () => {
  const { getByTestId, getByText } = render(<Sidebar />);

  // Test that the sidebar is rendered
  const sidebarElement = getByTestId('sidebar');
  expect(sidebarElement).toBeInTheDocument();

  // Test that the panel names are rendered
  const panelNames = ['Diagrams', 'Logic Tree', 'External Sims'];
  panelNames.forEach((panel) => {
    const panelElement = getByText(panel);
    expect(panelElement).toBeInTheDocument();
  });
});
