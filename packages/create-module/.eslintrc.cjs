/**
 * Copyright © 2022 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  "plugins": [
    "no-only-tests",
    "@typescript-eslint",
    "prettier"
  ],
  "env": {
    "node": true,
    "mocha": true,
    "es6": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "no-only-tests/no-only-tests": "error",
    "no-console": 1,
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true
      }
    ],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit",
        "overrides": {
          "constructors": "no-public"
        }
      }
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        "functions": false,
        "classes": false
      }
    ],
    "prefer-promise-reject-errors": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "logger"
      }
    ],
    "max-len": ["error", {"code": 160}],
    "@typescript-eslint/no-floating-promises": ["error"],
    "require-await": "error",
    "@typescript-eslint/await-thenable": "error"
  },
}

