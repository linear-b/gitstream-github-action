import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import jestPlugin from 'eslint-plugin-jest'
import githubPlugin from 'eslint-plugin-github'
import prettierPlugin from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
  // Global ignores
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.json']
  },

  // Base ESLint recommended config for all files
  eslint.configs.recommended,

  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        project: ['./.github/linters/tsconfig.json', './tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      jest: jestPlugin,
      github: githubPlugin,
      prettier: prettierPlugin
    },
    rules: {
      // TypeScript recommended rules
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.stylistic[0].rules,

      // Jest recommended rules
      ...jestPlugin.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': 'error',

      // Custom overrides
      camelcase: 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      semi: ['error', 'never'],

      // TypeScript-specific custom rules
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' }
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true }
      ],
      'func-call-spacing': ['error', 'never'],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/unbound-method': 'error'
    }
  },

  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin
    },
    rules: {
      'no-console': 'off',
      'prettier/prettier': 'error',
      semi: ['error', 'never'],
      'import/no-commonjs': 'off'
    }
  }
]
