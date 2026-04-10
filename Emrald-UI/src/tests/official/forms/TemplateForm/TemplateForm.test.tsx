import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { App } from '@/App';
import { appData } from '@/hooks/useAppData';
import { click, rightClick } from '@/tests/test-utils';

describe('TemplateForm', () => {
  test('makes a template from a diagram', async () => {
    const name = 'makes_a_template_from_a_diagram';
    render(<App></App>);
    const user = userEvent.setup();

    // Expand to the C-CKV-A component, right click on it, and select "Make Template"
    await click((await screen.findAllByText('Diagrams'))[0]);
    await click((await screen.findAllByText('Component'))[0]);
    await rightClick(await screen.findByText('C-CKV-A'));
    await user.click(await screen.findByText('Make Template'));

    // Wait for the template form to render
    await waitFor(async () => {
      expect(await screen.findByText('Create a Template')).not.toBe(undefined);
    });

    await user.type(await screen.findByLabelText('Name'), name);

    // Create a group and assign this template to it
    await click(await screen.findByText('Add Main Group'));
    await user.type(
      await screen.findByLabelText('New Group Name'),
      'New Group',
    );
    await user.click(await screen.findByRole('button', { name: 'Save' }));
    await user.click(await screen.findByTestId('group-New_Group'));
    expect((await screen.findByTestId('selected-group')).textContent).toEqual(
      'New Group',
    );

    // Add a sub group & assign this template to it
    await rightClick(await screen.findByTestId('group-New_Group'));
    await user.click(await screen.findByText('Add Sub Group'));
    await user.type(
      await screen.findByLabelText('New Group Name'),
      'New Sub Group',
    );
    await user.click(await screen.findByRole('button', { name: 'Save' }));
    await user.click(await screen.findByTestId('group-New_Sub_Group'));
    expect((await screen.findByTestId('selected-group')).textContent).toEqual(
      'New Sub Group',
    );

    // Save the template
    await user.click(await screen.findByText('Save Changes'));
    expect(appData.value.templates).not.toBeUndefined();
    expect(appData.value.templates?.length).toBe(1);
  });
});
