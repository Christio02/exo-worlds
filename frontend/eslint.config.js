import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect', // Use the string "detect" to auto-detect React version
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Disable rule for React 17+
      'react/no-deprecated': 'warn',
    },
    ignores: [
      // Dependencies
      'node_modules/',
      '.pnp/',
      '.pnp.js',

      // Build outputs
      'dist/',
      'build/',
      'out/',

      // Coverage directories
      'coverage/',

      // ShadCN components
      'components/ui/**/*',

      // Cache directories
      '.cache/',
      '.eslintcache',

      // Environment files
      '.env',
      '.env.*',
      '!.env.example',

      // Misc
      '.DS_Store',
      '*.pem',
      '*.log',

      // Debug logs
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',

      // IDE/Editor directories
      '.idea/',
      '*.swp',
      '*.swo',

      // TypeScript files
      '*.tsbuildinfo',
      'next-env.d.ts',
    ],
  },
];
