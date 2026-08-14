# Journal de bord

Règle : 5 lignes par jour maximum. Ce qui a été fait, ce qui a bloqué, le temps réellement passé. Ce journal est la matière première de la semaine 8 (récits situation / action / résultat).

Format d'une entrée :

```
## S<semaine>J<jour> - <date> - <titre>
- Fait :
- Blocage :
- Mesure :
- Temps passé dans cette partie :
- À retenir :
```

---

## S1J1 - 2026-08-14 - Installation Playwright et premier contact

- Fait : RWA (Real World App) integré au dépôt, Playwright **1.62.1** installé à la racine, config reglée (baseURL, testIdAttribute), écriture d'un premier test de connexion
- Blocage : WebKit ne démarre pas en local. Cause réelle : le WebKit livré par Playwright est lié à l'ABI d'Ubuntu (`libicu*.so.74`, `libjpeg.so.8`), alors que Fedora fournit un ICU plus récent et un libjpeg-turbo exportant `LIBJPEG_6.2`. Un `dnf install libicu libjpeg-turbo` ne corrige donc rien. Playwright ne supporte officiellement que Debian 12/13 et Ubuntu 22.04/24.04/26.04 (`refs/playwright/docs/src/intro-js.md:308`) et `install-deps` s'appuie sur apt. Dette acceptée : WebKit sera couvert par la CI en semaine 3 sur `ubuntu-latest`, et par un conteneur en S7J5, où il est de toute façon nécessaire pour les captures de référence.
- Mesure : chromium seul, 966 ms. Chromium + Firefox en parallèle (3 workers), 1,9 s. Durées totales rapportées par le lanceur, 1 test, application déjà démarrée, machine locale, mode headless. WebKit non mesurable ici.
- Temps passé dans cette partie : ~1 h, passée surtout sur les décisions de structure (fork ou clone, emplacement et nom du dossier de tests), pas sur l'outil lui-même.
- À retenir : 
  - montage retenu du projet : format monorepo
  - l'application à tester : `cypress-realworld-app`
  - suite de tests mise à la racine, les tests ne sont donc pas dans le paquet applicatif, mais dans le meme depot git : une pull request peut toucher les deux, la CI les voit ensemble.

### Decisions du jour

| Decision | Pourquoi |
|---|---|
| Version epinglee a `1.62.1` (sans `^`) le 2026-08-14 | sans cela un `npm install` peut monter de version en silence, et les mesures de temps des semaines 1 a 8 ne sont plus comparables |
| `cypress-realworld-app` cloné et non forké | provenance notee dans le README : `cypress-io/cypress-realworld-app`, branche `develop`, commit `28ca4d0` |
| `data/database.json` retire du suivi git | reecrit a chaque `yarn dev` par le seed, integralement regenerable depuis `database-seed.json` |
| `testIdAttribute: 'data-test'` | le RWA utilise `data-test` et non `data-testid` ; equivalent natif du `cy.getBySel()` de sa suite Cypress |
| Pas de `webServer` dans la config | demarrer le RWA a la main au J1 pour voir ce que fait `yarn dev` ; a reprendre en semaine 3 |
