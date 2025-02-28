# Creating Component Tests

To create a new component test suite, create a file called (Component).test.tsx in the tests/contributed folder, with a path matching the component's path in src/components. A test suite corresponds to a single component, and is created by using the `describe` function imported from `vitest`. The function takes the name of the test suite, and a function containing individual tests.

Example:
```
describe('Component Name', () => {
    // ...
});
```

Within this function, use the `test` function imported from `vitest` to test specific individual parts of the UI. The tests use `@testing-library/react` to render React components, and `@testing-library/user-event` to simulate a user interacting with the components. At the beginning of each test, the component being tested must be rendered and the user event library must be initialized. Many EMRALD form components require one or more context wrapper components to function, which should also be rendered. A custom `render` function is provided in `test-utils.tsx`, which automatically wraps the components in the global EMRALD context wrapper and creates the sidebar.

Example:
```
describe('Component Name', () => {
    test('clicks a button', () => {
        render(<ComponentName />);

        const user = userEvent.setup();

        await user.click(screen.findByLabelText('Button'));
    });
});
```

For simplicity, place expected JSON outputs in a dedicated .json file called (Component).expected.json. The test-utils file additionaly exports some helper methods for common test-related tasks. To manipulate the EMRALD model directly, such as adding variables needed to test a "select variable" dropdown menu, the `updateModel` helper function is provided. To quickly retrieve individual events, actions, etc. from the model, `get[Type]` functions are provided.

To save the model and check against expected values, it is necessary to simulate the user clicking the "save" button at the bottom of forms. This can be accomplished with the following snippet:
```
await user.click(await screen.findByText('Save'));
```

Interacting with MUI's combobox components can be accomplished by using the following snippet:
```
await user.click(await findByRole(await screen.findByLabelText('<Combobox Label>'), 'combobox'));
await user.click(await screen.findByRole('option', { name: '<Option to select>' }));
```
