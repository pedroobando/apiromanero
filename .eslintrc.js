module.exports = {
  root: true,
  env: {
    "jest/globals": true,
    "node": true,
    "es6": true
  },
  "plugins": [
    "node",
    "jest"
  ],
  "extends": [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "prettier"
  ],
  parserOptions: {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};