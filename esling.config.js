import eslint from '@eslint/js';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Ваши правила
    },
    ignores: ['dist/', 'node_modules/'] // Заменяет .eslintignore
  }
];