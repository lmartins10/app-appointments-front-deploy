import js from '@eslint/js'
import rocketseatEslintConfig from '@rocketseat/eslint-config/react.mjs'
import tailwind from 'eslint-plugin-tailwindcss'
import ts from 'typescript-eslint'

export default [
  ...rocketseatEslintConfig,
  js.configs.recommended,
  ...ts.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    rules: {
      ...rocketseatEslintConfig.rules,
      '@stylistic/max-len': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@stylistic/multiline-ternary': 'off',
      'tailwindcss/enforces-negative-arbitrary-values': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
    },
  },
]
