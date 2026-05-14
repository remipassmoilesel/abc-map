import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import noOnlyTests from 'eslint-plugin-no-only-tests';

export default defineConfig([
  globalIgnores(['build', 'src/version.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
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
      'no-console': 1,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: 'logger',
        },
      ],
      // FIXME: Restore these rules
      'react-hooks/set-state-in-effect': [0],
      'react-refresh/only-export-components': [0],
      '@typescript-eslint/no-explicit-any': [0],
    },
  },
]);
