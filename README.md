# Laboratoire QA - Playwright

Suite de tests automatisés construite sur une application de paiement dans le cadre d'un programme d'entraînement de 8 semaines.
Utilisation de : Playwright, CI/CD, gestion de tests outillée, IA appliquée aux tests, tests de contrat, performance et accessibilité.

Programme complet : [ROADMAP.md](ROADMAP.md) - avancement quotidien : [JOURNAL.md](JOURNAL.md)

## Structure

```
playwright.config.ts       configuration de la suite
tests/ui/                  tests de bout en bout
cypress-realworld-app/     l'application testée
```

L'application et la suite de tests vivent dans le même dépôt, dans deux paquets npm distincts.

## Essayer

Prérequis : Node 22 ou 24, yarn 1.

```bash
# installation
cd cypress-realworld-app && yarn install && cd ..
npm install && npx playwright install

# terminal 1 : l'application (interface sur le port 3000, API sur le port 3001)
cd cypress-realworld-app && yarn dev

# terminal 2 : les tests
npm test                  # chromium, firefox, webkit
npm run test:chromium     # un seul navigateur
npm run test:ui           # mode UI : chronologie des actions, voyage dans le temps
npm run report            # dernier rapport HTML
```

Playwright est épinglé à la version exacte **1.62.1** (2026-08-14), pour que les mesures de temps d'exécution restent comparables d'une semaine à l'autre. Sous Linux, Playwright ne supporte officiellement que Debian 12/13 et Ubuntu 22.04/24.04/26.04.

## cypress-realworld-app kesako ?

`cypress-realworld-app/` est l'application de démonstration publiée par [Cypress](https://github.com/cypress-io/cypress-realworld-app) reprise ici comme terrain d'exercice. Sa suite de tests Cypress d'origine est conservée comme matériau de comparaison.
