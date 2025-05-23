import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
        // These rules are broken in typescript-eslint 8.32.1 but should be enabled (removed from this object) if they're fixed in future versions
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        "@typescript-eslint/consistent-type-imports": "error"
    }
  }
);
