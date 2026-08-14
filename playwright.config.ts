import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright du laboratoire QA.
 * L'application testee (cypress-realworld-app) vit dans son propre sous-dossier
 * et se demarre a la main : `yarn dev` depuis cypress-realworld-app/.
 *
 * Documentation locale : refs/playwright/docs/src/test-configuration-js.md
 */
export default defineConfig({
  testDir: './tests',

  /**
   * Les fichiers de test tournent en parallele.
   * A surveiller : le backend du RWA ecrit dans un unique fichier JSON
   * (data/database.json, chemin code en dur). Tant que les tests ne font que
   * lire, le parallelisme est sans risque. Des qu'ils ecriront, il faudra
   * trancher - c'est le sujet du J1 de la semaine 2.
   */
  fullyParallel: true,

  /* Fait echouer la CI si un test.only a ete oublie dans le code. */
  forbidOnly: !!process.env.CI,

  /* Aucun reessai en local : un echec doit se voir. La CI en aura (semaine 3). */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',

    /**
     * Le RWA marque ses elements avec `data-test`, alors que getByTestId()
     * cherche `data-testid` par defaut. Ce reglage est l'equivalent natif de
     * la commande Cypress `cy.getBySel()` definie dans cypress/support/commands.ts.
     */
    testIdAttribute: 'data-test',

    /* Trace enregistree uniquement quand un test est rejoue apres un echec. */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /**
   * webServer : Playwright peut demarrer l'application lui-meme.
   * Volontairement non active au J1 - demarrer le RWA a la main permet de voir
   * ce que fait `yarn dev` (reseed de la base, deux serveurs sur 3000 et 3001).
   * Decision a reprendre en semaine 3, quand la CI devra le faire seule.
   */
});
