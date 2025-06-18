import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
        // These rules are broken in typescript-eslint 8.32.1 but should be enabled (removed from this object) if they're fixed in future versions
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/dot-notation': 'off',
        // Daniel's preferred rules
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-deprecated": "error"
    }
  }
);
