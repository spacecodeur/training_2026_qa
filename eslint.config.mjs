import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'cypress-realworld-app/',
      'refs/',
      'playwright-report/',
      'test-results/',
      'blob-report/',
    ],
  },

  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['tests/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
  },

  /**
   * Regles supplementaires pour la suite qui protege l'application.
   * Elles ne s'appliquent pas a tests/lab/, dont le role est justement de
   * montrer les constructions deconseillees.
   */
  {
    files: ['tests/ui/**/*.spec.ts'],
    rules: {
      /**
       * Interdit first(), last() et nth(). Motif : designer un element par sa
       * position rend le test dependant de l'ordre d'affichage, qui n'est
       * presque jamais une regle metier. Echappatoire assumee quand la position
       * EST la regle ("la transaction la plus recente est en tete") :
       * eslint-disable-next-line avec un motif ecrit.
       */
      'playwright/no-nth-methods': 'error',
    },
  },

  prettierConfig,
);
