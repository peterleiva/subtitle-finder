module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  settings: {
    'import/resolver': 'webpack',
  },

  overrides: [
    {
      files: '**/*.ts',
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
    },
    {
      files: '**/__*(tests|mocks|snapshots)__/**/*',
      plugins: ['jest'],
      env: {
        'jest/globals': true,
      },
      extends: ['plugin:jest/recommended'],
    },
    {
      files: '**/*.json',
      extends: ['plugin:json/recommended'],
    },
    {
      files: '**/*.md',
      extends: 'plugin:markdown/recommended',
    },
  ],
};
