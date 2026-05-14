import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['build']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      'no-only-tests': noOnlyTests,
    },
    rules: {
      'max-len': ['error', { code: 160 }],
      '@typescript-eslint/no-floating-promises': ['error'],
      'prefer-promise-reject-errors': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-only-tests/no-only-tests': 'error',
      'no-console': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: 'logger',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 0,
    },
  },
]);
