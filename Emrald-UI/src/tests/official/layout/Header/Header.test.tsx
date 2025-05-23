import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from '../../../../App';
import userEvent from '@testing-library/user-event';
import { appData } from '../../../../hooks/useAppData';
import { ensureState, ensureVariable } from '../../../test-utils';

describe('Header', () => {
  test('renames project', async () => {
    const name = 'renames project';
    render(<App></App>);
    const user = userEvent.setup();

    // Rename the project
    await user.click(await screen.findByText('Click Here to Name Project'));
    await user.type(await screen.findByLabelText('Name'), name);
    await user.type(await screen.findByLabelText('Description'), 'Desc');
    await user.type(await screen.findByLabelText('Version'), '2');
    await user.click(await screen.findByRole('button', { name: 'Save' }));

    expect(screen.queryByText(name)).not.toBeNull();
    expect(appData.value.name).toBe(name);
    expect(appData.value.desc).toBe('Desc');
    expect(appData.value.version).toBe(12);
  });

  test('search bar', async () => {
    render(<App></App>);
    const user = userEvent.setup();

    // Add things to the model to search for
    ensureVariable("abcd");
    ensureState("abcd");

    await user.type(await screen.findByLabelText("Search"), "abcd");
    await user.click(await screen.findByTestId("SearchIcon"));

    expect(screen.queryByText("Variables (1)")).not.toBeNull();
    expect(screen.queryByText("States (1)")).not.toBeNull();
  })
});
