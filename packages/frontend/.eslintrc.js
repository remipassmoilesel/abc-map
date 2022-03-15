module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  "plugins": [
    "react",
    "@typescript-eslint",
    "no-only-tests",
    "prettier"
  ],
  "env": {
    "browser": true,
    "jest": true,
    "es6": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "no-only-tests/no-only-tests": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit",
        "overrides": {
          "constructors": "no-public"
        }
      }
    ],
    "@typescript-eslint/explicit-function-return-type": 0,
    "no-use-before-define": "off",
    "no-console": "error",
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true
      }
    ],
    "prefer-promise-reject-errors": "error",
    "max-len": ["error", {"code": 160}],
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "logger"
      }
    ],
    "@typescript-eslint/no-floating-promises": ["error"],
    "react-hooks/exhaustive-deps": "error",
    "no-useless-rename": "error",
    "react/prop-types": 0
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  }
}

