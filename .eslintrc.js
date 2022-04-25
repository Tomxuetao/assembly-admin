module.exports = {
  extends: ['plugin:vue/vue3-essential'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 300 }],
    'comma-dangle': ['error', 'never'],
    'no-param-reassign': ['error', { props: false }],
    'object-curly-newline': ['error', { ImportDeclaration: 'never', ExportDeclaration: 'never' }],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 10 }],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'no-plusplus': ['off', { allowForLoopAfterthoughts: true }],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off'
  }
}
