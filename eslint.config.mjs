import vuetify from 'eslint-config-vuetify';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// eslint-disable-next-line no-restricted-exports
export default defineConfig(
  tseslint.configs.strictTypeChecked,
  await vuetify({
    rules: {
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/jsx-one-expression-per-line': ['warn', { allow: 'non-jsx' }],
      '@stylistic/space-before-function-paren': [
        'warn',
        { named: 'never', anonymous: 'always' },
      ],
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
          },
        },
      ],
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
        },
      ],
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
      '@stylistic/quote-props': ['warn', 'as-needed'],
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-event-target': 'off',
      'no-control-regex': 'off',
      complexity: 'off',
    },
  }),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  { ignores: ['**/*.js', '**/vite.config.ts'] },
);
