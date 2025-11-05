import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import jestPlugin from 'eslint-plugin-jest'
import githubPlugin from 'eslint-plugin-github'
import prettierPlugin from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'

export default [
  // Global ignores
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.json']
  },

  // Base configuration for all files
  eslint.configs.recommended,

  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        project: ['./.github/linters/tsconfig.json', './tsconfig.json']
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        global: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      jest: jestPlugin,
      github: githubPlugin,
      prettier: prettierPlugin
    },
    rules: {
      // Spread recommended rules from plugins
      ...tseslint.configs['eslint-recommended'].overrides[0].rules,
      ...tseslint.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,

      // Custom rules
      camelcase: 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      semi: ['error', 'never'],
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
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        global: 'readonly'
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
