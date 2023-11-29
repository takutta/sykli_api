module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "jest/globals": true,
    "cypress/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    "plugin:perfectionist/recommended-natural"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['perfectionist', '@stylistic', 'react-refresh', 'jest', "cypress"],
  rules: {
    '@stylistic/indent': ['error', 2]
    ,
    '@stylistic/array-bracket-newline': ['error', 'consistent'],
    "@stylistic/linebreak-style": [
      "error",
      "unix"
    ],
    "@stylistic/quotes": [
      "error",
      "single"
    ],
    "@stylistic/semi": [
      "error",
      "never"
    ],
    "eqeqeq": "error",
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/object-curly-spacing": [
      "error", "always"
    ],
    "@stylistic/arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-console": 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": 0,
    "perfectionist/sort-objects": [
      "error",
      {
        "type": "natural",
        "order": "asc"
      }
    ]
  },
}