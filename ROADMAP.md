# Roadmap QA / Lead QA 2026-2027

Programme intensif : 8 semaines, 6 jours par semaine, 3 a 4 heures par jour (environ 170 heures pour le socle).
Terrain d'exercice : `cypress-realworld-app` installe en local, appele RWA dans la suite du document.
Objectif : passer des entretiens QA senior / Lead QA, et etre operationnel des le premier jour d'une prise de poste Lead QA.

Version 2, corrigee apres une revue adversariale. La section 5 de ce document liste ce qui a change et pourquoi.

---

## 0. Point de depart (lecture du CV)

**Ce qui est deja acquis, et qu'il ne faut pas reapprendre :**

- Automatisation de tests fonctionnels : Selenium, Cypress, Codeception, CasperJS (2014 -> 2023). Les concepts de selecteurs, d'attente, de page object et de suite de tests sont maitrises.
- TypeScript / React / Node en langage principal. C'est exactement la stack de Playwright : aucun cout d'apprentissage du langage.
- CI/CD et GitHub Actions : deja enseignes en Master a Montpellier, deja mis en place au CNRS et chez Sogetrel.
- Conception d'architecture de tests et pilotage d'equipe : Lead QA chez Stardust (equipes de 2 a 10), QA Lead Engineer chez Sogetrel, tech lead a la Wild Code School.
- Tests de performance et de securite : JMeter chez Docapost.
- Pedagogie et transmission : formateur, jury RNCP, CAFEP. Utile pour la partie "argumenter un choix d'outillage" en entretien Lead QA.

**Les quatre vrais manques a combler :**

1. **Playwright** : zero experience pratique. Le transfert depuis Cypress est rapide sur les concepts, mais trois choses n'ont pas d'equivalent Cypress et doivent etre travaillees specifiquement : le modele asynchrone (async/await au lieu du chainage de commandes), l'isolation par contexte navigateur et par worker, et l'outillage de diagnostic (trace viewer).
2. **Gestion de tests outillee** : Xray n'apparait pas sur le CV. Des offres de Lead QA en France demandent explicitement "Playwright (niveau confirme), Xray (niveau confirme)". Constituez votre propre corpus : relevez 10 offres reelles avec leur URL et leur date, et notez les outils cites. Ce corpus vaut mieux que n'importe quelle affirmation de tendance, et il sert directement a orienter vos candidatures.
3. **IA appliquee a la QA** : l'objectif n'est pas de savoir demander un test a un modele, c'est de savoir **mesurer** ce que la generation par IA rapporte et ce qu'elle coute, avec un protocole que vous pouvez defendre.
4. **Formalisation Lead QA** : strategie de test ecrite, analyse de risque, quality gates, testabilite, metriques d'equipe, politique d'usage de l'IA. Le CV montre que le travail a ete fait sur le terrain, mais rien n'est capitalise sous une forme presentable.

---

## 1. Regles du jeu

- [ ] **Un depot GitHub public** nomme par exemple `qa-lab`. Tout le travail y va. C'est la piece a montrer en entretien, pas le CV.
- [ ] **Un livrable par jour**, meme minuscule, pousse sur une branche puis fusionne par une pull request (demande de fusion).
- [ ] **Un journal de bord** dans `JOURNAL.md` : 5 lignes par jour maximum. Ce qui a ete fait, ce qui a bloque, le temps reellement passe. Ce journal est la matiere premiere de la semaine 8.
- [ ] **Mesurer avant d'affirmer.** Chaque fois qu'une amelioration est faite, noter le chiffre avant et apres. Un entretien Lead QA se gagne avec un chiffre mesure, et se perd avec "j'ai optimise la CI". Corollaire : **aucun chiffre de cette roadmap n'est un resultat attendu**. Les ordres de grandeur cites sont des objectifs de mesure, pas des promesses.
- [ ] **Dater et sourcer.** Toute affirmation sur le marche, les prix ou les pratiques doit porter une date et un lien. Les prix d'outils et les versions changent pendant la duree du programme.
- [ ] **Ne pas installer un outil sans savoir quel probleme il resout.** Une phrase dans le journal : quel probleme, quelle alternative sans lui.
- [ ] **Regle de temps, revisee.** Si un point bloque plus de 45 minutes, le noter comme dette et passer a la suite. **Exception : les installations d'infrastructure** (Jira/Xray, Pact Broker, Lighthouse CI, Stryker) ne se timeboxent pas a 45 minutes, sinon vous accumulez des outils a moitie configures. Pour celles-la, la regle est : soit vous terminez l'installation, soit vous l'annulez proprement et vous notez pourquoi.

### Socle et extensions

Chaque journee distingue deux niveaux :

- **Socle** : ce qui tient reellement en 3 a 4 heures. C'est l'engagement du programme, environ 170 heures sur 8 semaines.
- **Extension** : ce qui merite d'etre fait mais ne tient pas dans la journee. A traiter si vous prenez de l'avance, ou apres les 8 semaines.

Cette distinction n'est pas cosmetique. La premiere version de cette roadmap promettait, a la mesure d'une revue externe, entre 253 et 331 heures de travail pour un budget de 170 heures. Un programme qui ment sur sa charge produit de la culpabilite et de l'abandon, pas des competences. **Si vous faites la totalite du socle et des extensions, comptez environ 11 semaines au meme rythme.**

### Documentation de reference en local

Le depot source de Playwright est clone dans `refs/playwright` (clone partiel : historique tronque, seuls les dossiers utiles sont extraits). La documentation officielle **est** le code source : elle vit dans `refs/playwright/docs/src/*.md`. Cherchez la dedans plutot que sur des articles de blog perimes.

```bash
cd refs/playwright
grep -rn "storageState" docs/src/*.md          # trouver la doc d'une API
sed -n '/^## Version 1.62/,/^## Version 1.61/p' docs/src/release-notes-js.md   # nouveautes d'une version
git pull                                        # mettre a jour la reference
```

Fichiers a connaitre : `docs/src/release-notes-js.md`, `docs/src/best-practices-js.md`, `docs/src/ci.md`, `docs/src/test-agents-js.md`, `docs/src/getting-started-mcp.md`, `docs/src/api/` (reference d'API), `docs/src/test-api/` (reference du lanceur de tests).

**Etat des versions au 14 aout 2026** (verifie dans le clone local) : derniere version publiee **1.62.1**, branche de developpement en `1.63.0-next`. Les nouveautes des versions 1.56 a 1.62 sont exploitees dans cette roadmap et signalees par leur numero. **Epinglez une version exacte dans votre `package.json` au J1 et notez la date**, sinon les mesures des semaines 1 a 8 ne seront pas comparables entre elles. Une version sort environ toutes les 6 semaines.

### Structure du depot

Forker le RWA et ajouter un dossier `playwright/` a la racine. Plus simple que deux depots separes : la chaine d'integration continue peut construire l'application et lancer les tests dans le meme espace de travail. Inconvenient assume, a preciser dans le README : le depot contient du code applicatif qui n'est pas de vous.

---

## Semaine 1 - Playwright : socle et transfert depuis Cypress

Objectif : ecrire des tests Playwright corrects sans documentation permanente, et diagnostiquer un echec en moins de 5 minutes.

- [ ] **J1 - Installation et premier contact.**
  - Installer Playwright dans `playwright/` (`npm init playwright@latest`), **epingler la version**, lancer les tests d'exemple, lire `playwright.config.ts` (projets, baseURL, timeouts, reporters).
  - Demarrer le RWA (`yarn dev` : front sur le port 3000, API sur le port 3001), recuperer les comptes de test avec `yarn list:dev:users` (mot de passe `s3cret`, defini dans `.env`).
  - Premier test : connexion d'un utilisateur, verification de l'arrivee sur le fil des transactions.
  - Journal : la liste des differences avec Cypress qui vous ont surpris. Ce texte servira en entretien.
- [ ] **J2 - Localisateurs et assertions.**
  - Localisateurs : `getByRole`, `getByLabel`, `getByTestId`, `filter()`, chainage, `nth()`.
  - **Le mode strict, formule correctement** : une action Playwright sur un localisateur qui correspond a plusieurs elements echoue. Avec Cypress, `cy.get()` represente une collection et le comportement depend ensuite de la commande ; selectionner le premier element demande normalement `.first()`. Ne dites pas "Cypress prend le premier", c'est faux et un intervieweur qui connait Cypress le relevera.
  - Les assertions web-first (`expect(locator).toBeVisible()`) reessaient jusqu'au delai maximum. Comparer avec `expect(await locator.count())` qui, lui, ne reessaie pas. Verifiez par vous-meme que c'est bien la cause d'instabilite la plus frequente dans votre suite, au lieu de le tenir pour acquis.
  - Exercice : reecrire 3 tests d'interface de `cypress/tests/ui/` en Playwright, sans regarder la version Cypress pendant l'ecriture.
- [ ] **J3 - Outillage de diagnostic.**
  - `npx playwright test --ui` : execution pas a pas, voyage dans le temps, selecteur interactif.
  - Trace viewer : activer `trace: 'on-first-retry'`, provoquer un echec, lire la chronologie, les captures avant/apres action, le reseau, la console.
  - `npx playwright codegen http://localhost:3000` : a tester pour savoir ce qu'il vaut, et pourquoi son resultat brut n'est pas livrable.
  - `--debug` et le mode pas a pas. Depuis la version 1.59, `--debug=cli` fournit un debogueur en ligne de commande et `npx playwright trace` ouvre une trace sans interface graphique, utile quand la trace vient d'une machine distante.
  - **Livrable : `docs/diagnostic.md`**, la procedure de diagnostic d'un echec en 4 etapes. Document donnable a une equipe.
  - *Extension* : `npx playwright cli` (integre en 1.62), le pilote de navigateur en ligne de commande utilise par les agents. A relier au J2 de la semaine 5.
- [ ] **J4 - Fixtures et architecture.**
  - Fixtures : le mecanisme d'injection de dependances des tests. Difference avec `beforeEach` : une fixture est paresseuse (elle ne s'execute que si le test la demande), typee, et composable.
  - Ecrire une fixture `loggedInPage` qui fournit une page deja authentifiee.
  - Page objects : des classes qui exposent des localisateurs, pas des actions qui assertent. Regle a tenir : un page object ne contient jamais de `expect`.
  - Combiner : fixtures qui fournissent les page objects.
- [ ] **J5 - Authentification et etat.**
  - `storageState` : se connecter une fois, sauvegarder cookies et stockage local, reutiliser. Mesurer le gain sur la suite complete.
  - Le projet `setup` et les dependances entre projets (`dependencies`) : le patron officiel pour authentifier une fois avant tous les tests.
  - Depuis la version 1.61, `page.localStorage` et `page.sessionStorage` lisent et ecrivent le stockage de la page (`setItem`, `getItem`, `items`). Le RWA stocke son jeton d'authentification dans le stockage local : c'est le moyen le plus court de verifier ou de forcer un etat de session.
  - **Perimetre a annoncer clairement** : cette semaine ne couvre que l'authentification locale. Le RWA embarque aussi des modes Auth0, Okta, Cognito et Google (`cypress/tests/ui-auth-providers/`), qui dependent de comptes externes et de secrets. Ne laissez personne croire que votre suite couvre ces quatre fournisseurs.
  - *Extension* : deux contextes navigateur en parallele (utilisateur A envoie une demande de paiement, utilisateur B la recoit).
- [ ] **J6 - Reseau.**
  - `page.route()` : intercepter, modifier, simuler une reponse d'API. Simuler une erreur 500 du backend et verifier le message affiche. Formulation juste : cette injection est **difficile a reproduire proprement a la main** (il faut un proxy, les outils de developpement ou un serveur bouchon) ; Playwright la rend deterministe, versionnable et executable en CI.
  - `page.waitForResponse()`, et pourquoi attendre un element visible est preferable dans la plupart des cas.
  - **Bilan de semaine** : au moins 15 tests couvrant connexion, creation de transaction, fil de transactions, notifications. Noter le temps d'execution total sur un seul navigateur.
  - *Extension* : les fichiers HAR (enregistrement de trafic reseau), `routeFromHAR`, et depuis la version 1.60 `tracing.startHar()` / `tracing.stopHar()` utilisables avec `await using`.

**Critere de reussite :** expliquer a l'oral comment Playwright attend l'actionnabilite et les assertions, pourquoi les temporisations fixes sont fragiles dans **les deux** outils, et dans quels cas une attente explicite de reponse, d'URL ou d'evenement reste legitime. Formuler la question comme "Playwright n'a pas besoin de `cy.wait()`" serait une simplification fausse : Cypress a aussi des attentes automatiques, et `cy.wait()` designe deux choses differentes (temporisation fixe et attente d'un alias reseau).

---

## Semaine 2 - Playwright avance : parallelisme, donnees, stabilite

Objectif : passer d'une collection de tests a une suite industrialisable.

- [ ] **J1 - Parallelisme et isolation des donnees.** La journee la plus formatrice du programme. Ne visez pas la solution parfaite, visez la comprehension du probleme.
  - **Le probleme, precisement** : le backend utilise `lowdb` avec un chemin de fichier **code en dur** dans `backend/database.ts` (`path.join(__dirname, "../data/database.json")`). Ce n'est pas configurable par variable d'environnement.
  - Consequence a bien saisir : des identifiants uniques par test evitent les collisions **logiques**, mais n'empechent ni les ecritures concurrentes sur le meme fichier, ni les lectures pendant une mutation. Et `POST /testData/seed` remplace l'etat **global** : il ne doit jamais etre appele pendant qu'un autre worker travaille.
  - **Socle** : mettre en serie tout scenario qui modifie la base, paralleliser les tests en lecture seule, interdire tout reseed depuis un test parallele.
  - **Documenter l'option avancee sans forcement l'implementer** : pour isoler reellement, il faut rendre le chemin de la base configurable, copier `database-seed.json` par worker, et demarrer une paire front/backend par worker. **Changer seulement le port backend ne suffit pas**, puisque toutes les instances liraient encore le meme fichier. Le front lit `VITE_BACKEND_PORT`, donc chaque navigateur devrait aussi pointer vers le bon backend.
  - `fullyParallel`, `test.describe.serial`, `test.describe.configure`.
  - *Extension* : implementer reellement l'isolation par worker (patch du backend + configuration). C'est une demi-journee a une journee de travail, pas une heure.
- [ ] **J2 - Tests d'API avec Playwright.**
  - Le contexte de requete (`request` fixture) : Playwright appelle HTTP sans navigateur.
  - Tests d'API sur le backend (`http://localhost:3001`) : `/login`, `/transactions`, `/bankAccounts`.
  - **GraphQL, avec le bon perimetre** : le RWA expose `/graphql` uniquement pour les comptes bancaires, avec trois operations : `listBankAccount`, `createBankAccount`, `deleteBankAccount`. Ce n'est pas une seconde API generale. Tester ces trois operations, le contexte utilisateur, et le cas des erreurs GraphQL renvoyees dans une reponse HTTP 200 (le piege classique du test d'API GraphQL : le code de retour ne suffit pas a decider si l'appel a echoue).
  - **Le patron le plus rentable** : preparer l'etat via l'API, verifier via l'interface. Mesurez le gain sur votre suite plutot que de reprendre un ordre de grandeur.
- [ ] **J3 - Donnees de test.**
  - Le mecanisme de seed : `yarn db:seed:dev` restaure `database-seed.json`, et l'API expose `POST /testData/seed`. **Attention** : les routes `/testData` ne sont montees que si `NODE_ENV` vaut `test` ou `development`.
  - Construire des fabriques (`factories`) qui creent utilisateur, compte bancaire, transaction. **Les routes n'ont pas les memes contraintes** : `POST /users` est ouvert (pas d'authentification), tandis que `GET /users`, `/bankAccounts` et `/transactions` exigent une session authentifiee. La couche de donnees doit donc gerer la session ou le jeton, ce n'est pas "un simple appel API".
  - Regle a formaliser : un test ne depend jamais d'une donnee creee par un autre test.
  - Question a trancher et a documenter : remise a zero complete entre chaque test (lent, sur) ou donnees uniques par test (rapide, exigeant) ?
- [ ] **J4 - Rapports et tracabilite.**
  - `test.step()` : decouper un test en etapes nommees. **A savoir avant la semaine 4** : ces etapes rendent le rapport Playwright lisible, mais **ne deviennent pas automatiquement des etapes Xray** lors d'un import JUnit. Ne construisez pas votre plan de tracabilite sur cette hypothese.
  - Les reporters : `html`, `list`, `blob` (format intermediaire pour fusionner plusieurs fragments), et `junit` (le format retenu **dans cette roadmap** pour l'import Xray ; Xray accepte aussi d'autres formats selon le framework).
  - Etiquettes et annotations : `@smoke`, `@regression`, `test.slow()`, `test.fixme()`.
  - *Extension* : reporter personnalise (`onTestEnd`), et `Reporter.preprocess()` (version 1.62), qui s'execute avant `onBegin` et permet de marquer des tests comme ignores ou exclus. Interessant techniquement, mais de faible valeur pour un poste de Lead QA : a faire seulement si le socle est termine.
- [ ] **J5 - Instabilite (flakiness).**
  - Causes possibles : attente d'un etat non deterministe, donnees partagees, animations, dates et heures, ordre d'execution. **Etablissez votre propre classement sur votre suite** plutot que de reciter un ordre de frequence general.
  - L'API `clock` : figer le temps, avancer l'horloge. Le RWA affiche des dates relatives, terrain d'exercice ideal.
  - `retries` : reessayer masque le probleme sans le resoudre. Detecter les tests instables au lieu de les ignorer.
  - `retryStrategy` (version 1.62) : `'immediate'` rejoue des qu'un worker est libre, `'isolated'` repousse les reessais a la fin, un par un, dans un seul worker. Ce reglage repond directement au probleme du J1 : rejouer immediatement un test en parallele reproduit la collision qui l'a fait echouer. Tester les deux et mesurer.
  - `failOnFlakyTests` : faire echouer la chaine quand un test n'a reussi qu'au deuxieme essai. Decision de Lead QA, a prendre consciemment.
  - Assertions souples (`expect.soft`, et `expect.soft.poll` depuis 1.61) : quand elles aident, quand elles nuisent.
  - Exercice : ecrire 3 tests instables, les stabiliser, documenter chaque cause dans `docs/flakiness.md`.
  - *Extension* : `test.abort()` (version 1.60) pour interrompre un test depuis une fixture ou une route, par exemple pour interdire a un test d'appeler l'endpoint de remise a zero.
- [ ] **J6 - Refactorisation et architecture.**
  - Reprendre la suite : fixtures, page objects, fabriques, etiquettes, projets.
  - **Profil mobile, formule correctement** : le depot fournit un script mobile en 375 x 667 (`cypress:open:mobile`), et `cypress/support/utils.ts` compare la largeur du viewport a un seuil de 414 pixels expose par la configuration Cypress. Ce 414 est un seuil **cote tests**, pas une media query de l'application constatee. Partez du profil 375 x 667 deja utilise par le depot, puis identifiez les vraies ruptures dans le CSS si vous voulez aller plus loin.
  - Mesurer : temps total, temps du plus long test, nombre de tests.
  - **Livrable : `docs/architecture-tests.md`.** C'est le document que vous ouvrirez en entretien.

**Critere de reussite :** la suite tourne sans echec aleatoire sur 5 executions consecutives, et vous savez expliquer precisement pourquoi l'isolation complete n'est pas gratuite sur ce backend.

---

## Semaine 3 - Integration continue avec GitHub Actions

- [ ] **J1 - Premier workflow.**
  - **Lire d'abord `.github/workflows/main.yml`.** Il fait `yarn build:ci`, publie le dossier `build` comme artefact, puis le restaure dans les jobs de test avant `yarn start:ci`.
  - **Le piege a ne pas rater** : `yarn start:ci` ne demarre pas Vite en mode developpement. Il lance `scripts/testServer.ts`, qui sert le contenu **statique** du dossier `build` (`app.use(express.static(path.join(__dirname, "../build")))`), plus l'API. Il faut donc **construire avant** (`yarn build:ci`), sinon la CI sert une application vide et vous perdrez une heure a chercher pourquoi tous les tests echouent.
  - Creer `.github/workflows/playwright.yml` sans toucher au workflow Cypress existant.
  - Attendre explicitement les ports 3000 et 3001. Restaurer `data/database-seed.json` avant chaque job qui possede son propre backend.
  - **Cache** : mettre en cache les dependances du gestionnaire de paquets. **Ne pas mettre en cache les binaires des navigateurs par defaut** : la documentation officielle indique que ce n'est pas recommande, car restaurer le cache coute a peu pres autant que telecharger, et les dependances systeme Linux ne sont pas cachables (`refs/playwright/docs/src/ci.md`, section "Caching browsers"). Si vous voulez tout de meme mesurer, faites-le, mais ne gardez le cache que si le gain est net et reproductible.
- [ ] **J2 - Parallelisation.**
  - `strategy.matrix` sur plusieurs navigateurs (chromium, firefox, webkit).
  - Le decoupage en fragments (`--shard=1/2`), puis `npx playwright merge-reports` pour reconstituer un rapport unique a partir des rapports `blob`. Depuis la version 1.62, l'option `mergeFiles` du reporter HTML fait le regroupement depuis la configuration.
  - **Ordre de grandeur a respecter** : avec une quinzaine de tests et trois navigateurs, la matrice multiplie deja les executions. Ajouter 4 fragments produirait une douzaine de jobs, chacun avec installation, construction, seed et demarrage : la mesure serait dominee par le temps d'amorcage, pas par les tests. **Commencer a 1 fragment, puis 2.** Ne passer a 4 que si le temps d'execution utile domine clairement le demarrage. Savoir dire "le decoupage n'est pas rentable a cette taille" est un meilleur signal de seniorite que d'afficher 12 jobs verts.
- [ ] **J3 - Restitution des resultats.**
  - Artefacts : rapport HTML, traces, videos, captures. **Retention courte et artefacts prives** : une trace est un fichier d'archive qui peut contenir des jetons, des cookies et des donnees personnelles. Ne la publiez pas sur une page accessible publiquement sans l'avoir inspectee.
  - Resume de job (`$GITHUB_STEP_SUMMARY`) : un tableau de resultats directement dans l'interface de l'action. C'est le meilleur rapport qualite/effort de la journee.
  - Commentaire automatique sur la pull request : **ne le faire que si le workflow dispose explicitement de `pull-requests: write`**. Documenter le comportement pour les pull requests venant de forks, ou le jeton est en lecture seule. Et ne jamais executer du code non fiable avec des secrets via `pull_request_target`.
  - *Extension* : publier le rapport sur GitHub Pages. Attention, une URL stable **par execution** n'est pas triviale : il faut une arborescence par identifiant d'execution, une politique d'index et une gestion de retention. Pour un laboratoire, une seule page "derniere execution sur main" suffit.
- [ ] **J4 - Fiabilite de la chaine.**
  - `concurrency` : annuler les executions obsoletes.
  - Filtres par chemin (`paths`) : ne pas tout relancer quand seul le README change.
  - Executions programmees : suite complete la nuit, suite de fumee sur chaque pull request. Formaliser avec les etiquettes de la semaine 2.
  - Secrets et environnements. Ne jamais mettre un identifiant en clair, meme sur une application de demonstration.
- [ ] **J5 - Politique de blocage.**
  - Verifications requises et protection de branche : quels tests bloquent une fusion, lesquels informent seulement. C'est une decision de Lead QA, pas un reglage technique.
  - Cout : minutes de calcul consommees. Un Lead QA doit savoir dire combien coute sa suite.
  - *Extension* : workflows reutilisables (`workflow_call`) et actions composites. Une seule factorisation minimale suffit pour comprendre le mecanisme.
- [ ] **J6 - Consolidation.**
  - Rejouer une execution complete, mesurer, comparer avec la semaine 2.
  - **Livrable : `docs/ci.md`** avec le schema du pipeline, les temps mesures, et la regle de blocage des fusions.
  - Produire et verifier le JUnit XML qui servira en semaine 4. **Le regarder a l'oeil nu** : c'est ce fichier, et lui seul, que Xray recevra.

**Critere de reussite :** une pull request declenche les tests, echoue proprement avec un lien vers la trace, et le resume de job est lisible sans ouvrir d'artefact.

---

## Semaine 4 - Xray et Jira : la gestion de tests

**Contrainte de calendrier, corrigee.** L'essai Xray dure 30 jours. Les semaines 4 a 8 representent 35 jours calendaires : **l'essai ne peut pas couvrir cinq semaines consecutives.** Le plan est donc le suivant :

- Preparer **hors Xray** le projet Jira, les exigences, les cas manuels sur un tableau, le fichier JUnit et les requetes d'import.
- **Activer l'essai au J3 de la semaine 4**, pas avant.
- Concentrer toutes les manipulations qui exigent l'instance entre S4J3 et la fin de la semaine 7.
- **Noter la date et l'heure exactes d'expiration.** Avant cette date, exporter les captures d'ecran, les configurations, les requetes et les resultats necessaires au portfolio.

Jira Cloud est gratuit jusqu'a 10 utilisateurs. Xray n'a pas d'offre gratuite perenne. **Verifier le tarif et les conditions le jour de l'activation** sur la fiche Atlassian Marketplace : le prix depend du palier d'utilisateurs Jira, de l'edition et du mode de facturation. Ne recopiez pas un tarif non date.

Apres expiration : conservez les preuves exportees et continuez avec les rapports Playwright et JUnit en local. Ne changez pas d'outil en cours de sprint. Zephyr Scale en essai n'est pas une alternative gratuite perenne, et Allure TestOps auto-heberge demande de l'infrastructure et de l'exploitation : ce ne sont pas des plans de secours immediats.

- [ ] **J1 - Preparation hors ligne.**
  - Creer le compte Atlassian et le projet Jira (gratuit, sans Xray).
  - Rediger 3 exigences (Stories) precises sur le RWA : connexion, creation de paiement, demande de paiement. Trois suffisent pour apprendre le modele ; la saisie en volume n'apprend rien.
  - Preparer dans un tableau les cas de test manuels correspondants.
  - Preparer les requetes `curl` d'import, sans secrets, et la liste des preuves a capturer.
- [ ] **J2 - Le modele de donnees Xray, sur papier puis dans l'outil.**
  - Installer Xray et demarrer l'essai **a la fin de cette journee ou au debut du J3**.
  - Les types d'issues : **Test** (un cas), **Precondition** (un etat prealable reutilisable), **Test Set** (regroupement statique), **Test Plan** (perimetre d'une campagne), **Test Execution** (campagne executee), **Test Run** (resultat d'un test dans une execution).
  - **Relever dans votre instance** les types de definition de Test reellement disponibles et leur libelle exact, et noter la version et l'edition observees. Le vocabulaire varie entre Cloud et Data Center, et entre versions.
  - Exercice : 3 tests manuels, un Test Set, un Test Plan, une Test Execution manuelle avec saisie des resultats.
  - **A comprendre et ecrire avec vos mots** : la difference entre Test Plan et Test Set. Ces deux notions se ressemblent et sont frequemment melangees ; savoir les distinguer est une question d'entretien classique.
- [ ] **J3 - Import minimal et identite des tests.** Journee experimentale, pas de saisie.
  - Produire un JUnit XML contenant **un seul** test Playwright et l'inspecter.
  - L'importer, puis importer **exactement le meme fichier une seconde fois**. Xray reutilise-t-il le Test ou cree-t-il un doublon ?
  - Puis, **une variable a la fois** : renommer le titre, changer le fichier, changer le projet navigateur. Noter quels champs participent reellement a l'identification.
  - **Ne pas supposer qu'une annotation Playwright est comprise par Xray.** Si une propriete JUnit particuliere est attendue, il faut la produire explicitement, via un reporter ou un post-traitement, et le verifier dans le XML.
- [ ] **J4 - Convention de tracabilite.**
  - Regle : **une cle Xray identifie un scenario logique et reste identique pour Chromium, Firefox et WebKit.** Le navigateur est un *environnement d'execution*, pas un nouveau Test.
  - Mettre la cle dans une annotation Playwright (par exemple `xray-test-key`), puis la convertir explicitement dans la propriete JUnit attendue par votre instance. Mettre la cle dans le titre du test est lisible, mais couple l'identite Jira au texte, et un simple renommage editorial casse la tracabilite.
  - Ajouter un controle qui echoue si une cle est absente, mal formee ou dupliquee.
  - N'ouvrez pas deux options en laissant le choix ouvert : imposez un petit adaptateur, et testez-le.
- [ ] **J5 - Remontee depuis la CI.**
  - Etape GitHub Actions qui envoie le JUnit apres execution, avec les identifiants en secrets. Ne jamais afficher le jeton dans les journaux.
  - Renseigner l'environnement de test pour distinguer les navigateurs.
  - **Regle de volume** : importer uniquement depuis `main`, depuis une execution nocturne, ou depuis un declenchement manuel. Une remontee a chaque commit cree des centaines de Test Executions et rend Jira illisible.
- [ ] **J6 - Tracabilite, restitution, position critique.**
  - Relier 3 Tests a leurs exigences, observer les indicateurs de couverture.
  - Creer un Bug depuis un Test Run en echec et suivre le lien exigence -> test -> defaut dans les deux sens.
  - **Exporter toutes les preuves pour le portfolio.**
  - **Livrable : `docs/gestion-des-tests.md`.** Qu'est-ce qui vit dans Xray, qu'est-ce qui reste dans le code ? Position defendable : le code est la source de verite du **comportement teste** ; Xray est la source de verite de la **couverture des exigences et de l'historique des campagnes**. Dupliquer les etapes d'un test automatise dans Xray est un cout de maintenance pur.
  - Le cas Gherkin pilote depuis Xray : comprendre pourquoi cette approche seduit les equipes metier, et pourquoi elle produit souvent une couche de traduction que personne ne maintient. Avoir un avis argumente sur ce point vous distinguera.

**Critere de reussite :** vous savez expliquer comment Xray identifie un test a l'import, parce que vous l'avez teste, pas parce que vous l'avez lu.

---

## Semaine 5 - IA en QA : outillage, mesure, esprit critique

Objectif : dire, chiffres a l'appui et avec un protocole defendable, ou l'IA fait gagner du temps en QA et ou elle en fait perdre.

- [ ] **J1 - Les agents Playwright.** Documentes depuis la version 1.56 (octobre 2025), livres avec Playwright.
  - `npx playwright init-agents --loop=claude` (boucles : `vscode`, `claude`, `codex`, `opencode`). Les definitions sont ecrites sous `.github/`. **A regenerer a chaque montee de version de Playwright**, sinon les agents travaillent avec un catalogue d'outils perime. Regle d'exploitation a ecrire dans le README.
  - **Planner** : explore l'application, produit un plan en Markdown dans `specs/`.
  - **Generator** : transforme le plan en tests, en verifiant localisateurs et assertions en direct.
  - **Healer** : rejoue les etapes en echec, inspecte l'interface, propose un correctif, relance jusqu'a reussite ou jusqu'aux garde-fous.
  - Le fichier `tests/seed.spec.ts` est l'amorce : le planner l'execute pour obtenir un environnement pret (configuration globale, dependances de projets, fixtures, hooks) et s'en sert comme modele de style. Sur le RWA, il doit contenir l'authentification et les donnees construites en semaine 2. **La qualite du seed determine la qualite de tout ce que les agents produiront ensuite** : c'est le point de levier de la journee.
  - Exercice : planner sur la partie "comptes bancaires", generation, execution.
  - **Mesurer** : temps de generation, nombre de tests produits, nombre corrects du premier coup, temps de relecture et de correction. Le temps de revue est le chiffre que personne ne mesure ; il compte autant que les autres, mais il ne resume pas a lui seul la valeur : qualite des oracles, maintenabilite, faux positifs et reproductibilite comptent aussi.
- [ ] **J2 - Le protocole MCP.**
  - Le serveur MCP Playwright est **livre avec Playwright depuis la version 1.62** (`npx playwright mcp`) ; le paquet `@playwright/mcp` reste disponible pour les clients externes (`claude mcp add playwright npx @playwright/mcp@latest`).
  - Point technique : il privilegie des representations **structurees** de la page, notamment les instantanes d'accessibilite. Le modele recoit une structure texte (`- textbox "What needs to be done?" [ref=e5]`) et agit sur des references d'elements. C'est ce qui le rend fiable et economique en jetons, la ou une approche par vision est couteuse et approximative. **Verifiez la liste des outils exposes par la version que vous installez** avant d'affirmer qu'aucune capture d'ecran n'intervient jamais.
  - Exploration guidee du RWA.
  - Distinguer trois usages souvent confondus : l'IA qui **ecrit du code de test**, l'IA qui **pilote un navigateur en direct**, l'IA qui **analyse des resultats**. Risques et gains differents. Les melanger dans une meme phrase est le signe d'un discours creux.
  - *Extension* : `page.screencast` (version 1.59) et les "recus video" : un agent produit une video annotee, avec chapitres, de ce qu'il a verifie. Usage concret : joindre la preuve visuelle a une pull request pour reduire le temps de relecture humaine.
- [ ] **J3 - Mesurer la qualite des tests generes, avec un protocole qui tient.** Journee la plus importante de la semaine.
  - **Le probleme** : un test genere qui passe ne prouve rien. Une couverture elevee produite par IA cree une illusion de securite, parce que le modele genere a partir de motifs observables, sans connaitre l'intention metier. Pire, **un test genere sur une application boguee fige le bug comme comportement attendu**.
  - **Ce qu'il ne faut pas faire, et pourquoi.** L'idee intuitive est de lancer du test de mutation (introduire automatiquement des defauts dans le code et verifier que les tests echouent) sur les suites Playwright. Ce n'est pas realisable ici : Stryker dispose d'un lanceur **Vitest** officiel, mais pas d'un equivalent Playwright. Passer par un lanceur en ligne de commande obligerait a reconstruire et redemarrer l'application pour chaque mutant, avec seed, demarrage, attente, execution et arret, le tout sur une base de donnees en fichier partage. Le cout explose et les resultats deviennent ininterpretables.
  - **Le protocole realisable, sur Vitest.** Le RWA contient deja Vitest et 9 fichiers de tests unitaires, dont `src/utils/__tests__/transactionUtils.test.ts` pour `src/utils/transactionUtils.ts` (environ 9,5 Ko de logique pure). C'est la cible.
    1. Ecrire **avant tout test** une specification de 8 a 12 comportements et cas limites attendus, sans regarder l'implementation.
    2. Produire deux suites Vitest a partir de cette meme specification, avec le **meme budget de temps** (90 minutes) : une ecrite a la main, une generee par IA.
    3. Conserver le prompt, le modele, la version, les corrections apportees et le temps de revue.
    4. Configurer Stryker avec le lanceur Vitest, `mutate` limite au module choisi. Si les tests n'importent pas directement le module, evaluer l'option `vitest.related: false`.
    5. Comparer : score de mutation, **mutants survivants**, mutants non couverts, temps total, temps de revue, instabilite sur 20 executions, qualite des oracles. Examiner les mutants equivalents a la main.
    6. Executer **au moins trois generations IA** : un modele est stochastique, une seule generation ne mesure rien.
    7. Ne pas generaliser au-dela de ce module, de ce modele et de ce protocole.
  - **Pour les tests Playwright**, mesurer autrement : preparer **avant** les deux suites un jeu fixe de 8 a 12 fautes semees a la main dans des comportements observables du RWA, les injecter une par une, et compter lesquelles chaque suite detecte. Moins automatique, beaucoup plus controlable pour du bout en bout.
  - **Ce que vous gagnez en entretien** : la plupart des candidats disent "l'IA genere des tests moyens". Vous direz "voici mon protocole, voici ses limites, voici les chiffres, et voici ce que je ne peux pas en conclure". C'est un ecart de niveau visible immediatement.
- [ ] **J4 - IA sur le diagnostic.**
  - Analyse d'echecs : donner une trace ou un journal de CI a un modele et lui demander de classer la cause (regression reelle, instabilite, environnement, donnee). Le tri d'echecs en masse est un usage prometteur parce que la sortie est verifiable immediatement. **Mesurez-le sur un corpus reel avant de l'affirmer.**
  - **Le piege de la reparation automatique** : un test qui se repare tout seul peut masquer le defaut qu'il devait detecter. Si un bouton "Payer" disparait a cause d'une regression et que l'agent le remplace par un bouton voisin, le test redevient vert et le bug part en production.
  - **A savoir avant de critiquer** : le healer de Playwright prevoit ce cas. Sa sortie documentee est un test qui passe, **ou un test marque comme ignore s'il estime que la fonctionnalite est cassee**. L'outil sait donc dire "je ne repare pas". Savoir cela vous evite la critique generique que tout le monde recite, et vous permet de poser la vraie question : sur quel critere l'agent tranche-t-il, et que se passe-t-il quand il se trompe dans un sens comme dans l'autre ?
  - **Exercice en deux temps, coeur de la journee.** (a) Renommer un libelle de bouton sans changer le comportement : le healer devrait reparer. (b) Casser reellement le comportement dans `backend/` : le healer devrait refuser et marquer le test comme ignore. Noter les deux resultats. **Trois sorties possibles a evaluer** : correctif valide, faux retablissement qui masque une regression, test ignore.
  - Regle a formaliser : le healer propose un correctif dans une pull request relue par un humain, jamais une modification directe en CI. Et un test qu'un agent a marque comme ignore doit ouvrir un ticket, sinon la suite se vide silencieusement de sa substance.
- [ ] **J5 - IA sur les artefacts non-code.**
  - Revue d'exigences : donner les Stories de la semaine 4 a un modele et demander ambiguites, cas limites non specifies, criteres d'acceptation manquants. Usage a fort rendement, peu pratique, tres valorise par un chef de produit.
  - Generation de donnees de test : valeurs limites, caracteres speciaux, formats internationaux. Le RWA manipule montants et dates.
  - Analyse de risque pour prioriser. **Biais a connaitre** : un modele qui s'appuie sur l'historique des defauts reproduit les angles morts de l'equipe. Un module toujours sous-teste n'a pas d'historique de defauts, donc il parait sur.
  - Traduction de suites : convertir des tests Cypress du RWA en Playwright, mesurer le taux de conversion correcte. Bon rendement, car la verification est mecanique.
- [ ] **J6 - Ecrire votre position.**
  - **Livrable : `docs/ia-en-qa.md`**, 2 pages maximum : ou l'IA gagne (avec vos chiffres et leur protocole), ou elle coute plus qu'elle ne rapporte, et la politique d'equipe que vous mettriez en place.
  - Elements de politique : relecture humaine obligatoire avant fusion ; interdiction de la reparation automatique en CI ; interdiction de l'IA pour ecrire les assertions metier critiques, parce que le modele decrit ce que l'application fait aujourd'hui et non ce qu'elle devrait faire.
  - **Sur l'etiquette `@ai-generated`** : utile pendant l'experimentation, discutable comme categorie durable. Apres revue et maintenance humaine, l'origine du premier brouillon devient moins informative que le proprietaire du test, la date de derniere revue, le risque couvert, le taux d'instabilite et les regressions reellement detectees. Gardez l'etiquette pour la duree de la mesure, pas comme regle de gouvernance permanente.

**Critere de reussite :** repondre a "comment utilisez-vous l'IA en QA ?" pendant 5 minutes, avec un protocole, des chiffres, et une phrase honnete sur ce que vos chiffres ne prouvent pas.

---

## Semaine 6 - API, contrats, et compatibilite

- [ ] **J1 - Tests d'API approfondis.**
  - Completer les tests de la semaine 2 : codes de retour, cas d'erreur, autorisation (un utilisateur peut-il lire les transactions d'un autre ?), pagination (taille de page a 10 dans `.env`).
  - Controles de securite fonctionnelle : acces sans jeton, jeton d'un autre utilisateur, elevation de privileges. Votre experience Docapost est directement reutilisable.
- [ ] **J2 - Validation par schema.**
  - Valider les reponses contre un schema (Zod ou JSON Schema) plutot que champ par champ.
  - Difference entre valider une valeur (test fonctionnel) et valider une forme (test de contrat).
- [ ] **J3 - Pact, cote consommateur.**
  - Le probleme resolu : en microservices, tester de bout en bout demande de deployer tous les services ensemble. Les tests de contrat permettent de tester chaque cote separement.
  - Le consommateur declare ses attentes, ce qui produit un fichier de contrat.
  - **Honnetete a afficher des le depart** : dans le RWA, le front et le backend vivent dans le meme depot et la meme CI. Le benefice organisationnel d'un broker est donc faible ici. Presentez cet exercice comme une **simulation de deux equipes independantes**, chacune versionnee par son SHA Git. C'est un exercice d'apprentissage, pas un gain reel sur ce projet, et le dire renforce votre credibilite au lieu de l'affaiblir.
- [ ] **J4 - Pact, cote fournisseur.**
  - Verification cote fournisseur : le backend rejoue le contrat et prouve qu'il le respecte.
  - Etats fournisseur (`provider states`) : "etant donne qu'un utilisateur avec 3 transactions existe".
  - Broker heberge localement avec Docker.
- [ ] **J5 - Cycle de vie des contrats.**
  - Versionner chaque participant par son SHA Git, publier la **branche** comme concept de premier plan.
  - Declarer un environnement de laboratoire et appeler `record-deployment` apres un deploiement simule.
  - `can-i-deploy --to-environment` seulement apres avoir enregistre les versions deployees ; sans cette matrice de versions, la commande ne demontre rien.
  - **Attention a une erreur repandue** : les tags Pact ne sont plus la facon recommandee de modeliser branches et deploiements. Ils restent supportes pour des cas anciens. Utilisez branches et environnements.
- [ ] **J6 - Compatibilite et migrations.** Remplace l'exercice de classement exhaustif des comportements, de faible rendement.
  - Sujet a plus forte valeur pour 2027 : compatibilite ascendante et descendante d'API, versionnement de schema, migration de donnees, retour arriere, drapeaux de fonctionnalite, verification apres deploiement.
  - Exercice sur le RWA : introduire un changement de schema d'API (ajouter un champ, en renommer un), et determiner quel niveau de test le detecte, et lequel devrait le detecter.
  - **Livrable : `docs/strategie-niveaux-de-test.md`.** Pour les 5 comportements les plus critiques du RWA (pas tous), decider du niveau de test : unitaire, contrat, API, bout en bout. Justifier.
  - Nuances a tenir : un test de contrat verifie une **frontiere** d'integration, mais ne prouve rien sur le systeme deploye de bout en bout. Contre une API externe non cooperative, Pact peut formaliser les attentes du consommateur et tester l'adaptateur local, mais il ne garantit pas que le tiers respectera le contrat sans verification de sa part.

**Critere de reussite :** expliquer en 3 minutes ce qu'un test de contrat verifie a une frontiere d'integration, et ce qu'il ne prouve pas.

---

## Semaine 7 - Performance, accessibilite, tests visuels

- [ ] **J1 - k6, bases.**
  - k6 (Grafana) : scripts en JavaScript, execution en ligne de commande, integration en CI. **Formulation juste** : c'est une alternative orientee code a JMeter, adaptee aux scripts versionnes et relus en pull request. Ne dites pas qu'il a remplace JMeter dans la majorite des equipes, c'est une affirmation de marche que vous ne pouvez pas sourcer.
  - Premier script contre l'API du RWA : connexion puis lecture du fil de transactions.
  - Notions : utilisateurs virtuels, iterations, paliers, et surtout les **seuils** (`thresholds`), qui font echouer l'execution quand ils ne sont pas respectes.
  - **Comparaison avec JMeter** dans le journal : ce qui est mieux, ce qui est moins bien. JMeter reste superieur sur certains protocoles et sur l'interface graphique pour des profils non-developpeurs. Excellent sujet d'entretien pour un profil de votre anciennete.
- [ ] **J2 - Modele de charge et limites du laboratoire.**
  - Definir avant l'execution : profil utilisateur, debit cible, duree, jeu de donnees, seuils.
  - **Modele ouvert contre modele ferme.** `constant-arrival-rate` convient quand les arrivees sont independantes du temps de reponse ; des utilisateurs virtuels constants ou en rampe conviennent a une population bornee qui attend avant l'action suivante. Le choix se fait a partir du modele d'usage, aucun des deux n'est "plus realiste" dans l'absolu. Surveiller `dropped_iterations`.
  - **Socle : un test de fumee et un test de charge court.** Pas cinq profils.
  - Collecter au minimum : latence p95, taux d'erreur, debit, iterations abandonnees, CPU, memoire, occupation de la boucle d'evenements.
  - **Ce que ce laboratoire mesure vraiment** : le backend local, `lowdb`, la journalisation, le processus Node unique et le generateur de charge partagent la meme machine. Un "point de rupture" obtenu ainsi n'est pas attribuable a l'architecture. Un test de performance n'a pas besoin de casser quelque chose pour etre utile : etablir une reference reproductible et detecter une regression est un objectif legitime et suffisant.
  - Restaurer la base apres tout test destructif.
  - *Extension* : recherche de capacite, tests d'endurance et de pic, avec generateur et systeme teste sur des ressources separees.
- [ ] **J3 - Performance percue cote navigateur.**
  - Ce que k6 ne mesure pas : rendu, JavaScript, temps avant interaction. Un serveur rapide peut donner une application lente.
  - Lighthouse CI dans GitHub Actions, avec des budgets qui font echouer la chaine.
  - Core Web Vitals (LCP, INP, CLS) : les definir precisement, savoir ce qui les degrade.
- [ ] **J4 - Accessibilite.**
  - Contexte : la directive europeenne sur l'accessibilite (EAA) est applicable depuis juin 2025, et le RGAA s'impose au secteur public francais. L'accessibilite est passee du souhaitable a l'obligatoire, et peu de QA savent la tester.
  - `@axe-core/playwright` : audit automatique sur les pages du RWA. Traiter les violations.
  - **Limite a annoncer, sans chiffre invente** : les audits automatiques ne couvrent qu'une partie des criteres et **ne prouvent pas la conformite**. Le pourcentage exact depend du referentiel, des pages et de la definition d'un probleme. Completer par : navigation au clavier, focus visible, zoom, formulaires, contrastes a confirmer, et un lecteur d'ecran sur un parcours court. Faire cette passe manuelle sur le parcours de paiement.
  - Les instantanes ARIA (`toMatchAriaSnapshot`) : capturer l'arbre d'accessibilite et detecter ses regressions. Depuis la version 1.60, l'assertion fonctionne sur une `Page` entiere, et l'option `boxes` de `ariaSnapshot()` ajoute les coordonnees de chaque element, ajoutee explicitement pour la consommation par des modeles.
  - Lien a formuler avec precision : les instantanes ARIA et certains outils agentiques exploitent **tous deux des representations structurees fondees sur l'accessibilite**, sans etre le meme artefact ni le meme mecanisme. Un arbre propre ameliore simultanement l'accessibilite reelle, la stabilite des localisateurs `getByRole`, et le travail des agents. Ce lien entre trois sujets apparemment separes est peu connu et fait mouche en entretien.
- [ ] **J5 - Tests visuels, sur un seul parcours.**
  - `expect(page).toHaveScreenshot()`. Depuis la version 1.62, le format WebP est accepte : nommer l'instantane `page.webp` suffit, le format sans perte sert aux images de reference. Gain de place appreciable quand les references sont versionnees.
  - Problemes reels : rendu different selon le systeme d'exploitation (d'ou le conteneur Docker pour generer les references), contenus dynamiques a masquer (`mask`), animations a desactiver, seuils de tolerance.
  - Gestion des images de reference en CI : ou les stocker, comment les mettre a jour sans valider une regression a l'aveugle.
  - **Limiter a un seul parcours.** Sur une interface qui bouge, le cout de maintenance depasse vite le benefice. Savoir dire non a l'extension du perimetre visuel est une decision de Lead QA.
- [ ] **J6 - Integration et synthese.**
  - Assembler dans la chaine, avec la bonne frequence : accessibilite a chaque pull request, visuel sur un perimetre reduit, performance en execution nocturne.
  - Budget de temps : la chaine sur pull request doit rester sous 10 minutes, sinon l'equipe la contourne. Arbitrer et documenter.
  - **Livrable realiste** : une page de synthese en Markdown ou un resume de job compose, pas un tableau de bord unifie. Playwright, axe, Lighthouse et k6 ne produisent pas spontanement un format commun, et construire ce tableau de bord est un projet en soi, sans valeur pour votre objectif.

---

## Semaine 8 - Posture Lead QA

Objectif : transformer 7 semaines de travail technique en systeme de qualite defendable. C'est la semaine qui separe un bon QA automaticien d'un Lead QA.

- [ ] **J1 - Analyse de risque exploitable.** Avant la strategie, le risque.
  - Cartographier les flux critiques du RWA : lesquels font perdre de l'argent, de la confiance ou des donnees s'ils cassent ?
  - Grille impact x probabilite x detectabilite.
  - Couvrir quatre familles : financier, securite, donnees, exploitation.
  - Pour chaque risque : le niveau de test qui le couvre, **et le proprietaire du risque**.
  - **Lister explicitement les risques acceptes.** Un Lead QA qui ne sait pas dire ce qu'il ne teste pas volontairement n'a pas de strategie, il a une liste de souhaits.
- [ ] **J2 - Strategie de test et quality gates.**
  - Strategie en **3 pages maximum** : perimetre, risques, niveaux de test et repartition, criteres d'entree et de sortie, environnements, roles, gestion des anomalies. Un document long est rarement lu ; savoir tenir 3 pages est une competence en soi.
  - Politique de blocage par contexte : pull request, execution nocturne, livraison.
  - Traitement des tests instables : mise en quarantaine **avec proprietaire et date d'expiration obligatoires**, sinon la quarantaine devient un cimetiere.
  - Delai maximal de retour de la chaine, et procedure d'incident quand un defaut echappe en production.
- [ ] **J3 - Testabilite et observabilite.** Le sujet que les QA techniques negligent le plus.
  - Ce que vous demandez aux developpeurs pour rendre le systeme testable : identifiants de correlation, journaux structures, horloge injectable, endpoints d'etat de sante, isolation des donnees, environnements ephemeres, drapeaux de fonctionnalite.
  - Exercice concret : rediger la liste de ce qui manque au RWA pour etre testable proprement. Vous en avez rencontre plusieurs exemples en semaine 2 (chemin de base code en dur) et en semaine 7.
  - **Mini modele de menaces** : actifs, frontieres de confiance, abus d'autorisation, gestion de session, donnees sensibles dans les traces et les videos, dependances et secrets de la CI.
- [ ] **J4 - Metriques et cout.**
  - Metriques qui comptent : defauts echappes en production, taux d'instabilite, delai entre commit et retour, temps moyen de correction d'un test casse, couverture des exigences.
  - Metriques a ne pas transformer en objectif : nombre de tests ecrits, bugs trouves par testeur, pourcentage de couverture de code. Savoir expliquer pourquoi une metrique devient nuisible des qu'elle devient un objectif est un marqueur de seniorite.
  - Indicateurs de flux, jamais de productivite individuelle.
  - Chiffrer le cout de la suite (minutes de CI, temps de maintenance) et ce qu'elle intercepte.
- [ ] **J5 - Pilotage d'equipe et plan 30-60-90.**
  - **Livrable : un plan 30-60-90 jours de prise de poste Lead QA.**
    - *Jours 1 a 30* : cartographier risques, flux critiques, environnements, proprietaires, incidents recents, temps de retour de la CI. **Ne changer aucun quality gate sans mesure de reference.**
    - *Jours 31 a 60* : traiter les deux risques prioritaires, stabiliser les donnees et l'observabilite, formaliser les politiques pull request / nuit / livraison, definir la quarantaine avec proprietaire et echeance.
    - *Jours 61 a 90* : mesurer l'effet sur le temps de retour, les defauts echappes et l'instabilite ; ajuster la repartition des niveaux de test, le cout de la CI et les responsabilites entre QA, developpeurs et produit.
    - Pour chaque action : signal de succes, proprietaire, echeance, risque accepte.
  - Modele de responsabilite QA / developpeurs / produit. Matrice de competences. Accompagnement des developpeurs vers la qualite.
  - Gestion des desaccords sur les quality gates : que faites-vous quand un chef de produit veut livrer avec une verification rouge ?
  - Preparer les reponses aux objections classiques : "les tests nous ralentissent", "la CI est trop longue", "les tests sont toujours rouges", "pourquoi automatiser".
- [ ] **J6 - Portfolio et simulation.**
  - README du depot : ce que le projet demontre, comment le lancer, les chiffres cles mesures. Aller a l'essentiel dans le premier ecran.
  - Nettoyer l'historique, verifier qu'aucun secret n'a fuite, ajouter les badges de statut.
  - Mettre a jour CV et LinkedIn. Votre titre LinkedIn mentionne deja Playwright : a la fin de ce programme, ce sera vrai et defendable.
  - 3 recits courts au format situation, action, resultat : la stabilisation de la suite, la remontee Xray, la mesure de la qualite des tests generes.
  - Faire relire le depot en mode adversarial : "trouve les 10 faiblesses de cette suite de tests".
  - Entrainement au live coding et a la soutenance d'architecture.
  - **Prevoir que cette journee deborde.** Elle contient sept semaines de rattrapage possible ; traitez-la comme un debut, pas comme une fin.

---

## 2. Recapitulatif des livrables

| Semaine | Livrable principal | Ce que cela prouve |
|---|---|---|
| 1 | Suite Playwright de 15 tests + `docs/diagnostic.md` | Autonomie sur Playwright |
| 2 | Architecture de suite + `docs/architecture-tests.md` + `docs/flakiness.md` | Capacite a industrialiser malgre un backend contraignant |
| 3 | Chaine GitHub Actions + `docs/ci.md` | Maitrise CI/CD avec des chiffres mesures |
| 4 | Jira + Xray relies a la CI + `docs/gestion-des-tests.md` | Competence outil demandee explicitement |
| 5 | `docs/ia-en-qa.md` + protocole de mutation sur Vitest | Differenciation forte, esprit critique outille |
| 6 | Pact en CI + `docs/strategie-niveaux-de-test.md` | Vision architecture de test et compatibilite |
| 7 | Performance, accessibilite, visuel integres | Couverture non fonctionnelle |
| 8 | Analyse de risque, strategie, plan 30-60-90, portfolio | Posture Lead QA |

---

## 3. Ce qui n'est pas dans cette roadmap, volontairement

- **Certification ISTQB** : encore demandee dans les grands comptes et les ESN. Le niveau Foundation se prepare en une quinzaine d'heures, en parallele et non a la place de ce programme. Votre experience couvre deja le contenu ; c'est le vocabulaire officiel qu'il faut apprendre.
- **Tests mobiles natifs** (Appium, Maestro) : sujet a part entiere. Votre passe chez Stardust suffit a en parler.
- **Plateformes de tests dans le nuage** (BrowserStack, LambdaTest) : utiles a citer, payantes, sans valeur pedagogique avant d'avoir une suite mature.
- **Outils de test sans code** (Testim, Katalon, Mabl) : a connaitre de nom pour expliquer pourquoi vous ne les recommandez pas dans une equipe qui sait coder.
- **Tests de composants avec Playwright** : bonus si vous prenez de l'avance. Le RWA contient deja 5 tests de composants Cypress (`src/components/*.cy.tsx`). Mais la version 1.62 a change le modele pour une approche par "stories et galeries" : c'est un sujet en mouvement, raison de plus pour attendre sa stabilisation. Savoir dire qu'un sujet est instable est aussi une decision de Lead QA.

---

## 4. Points de vigilance

- **L'essai Xray de 30 jours est la seule contrainte de date.** Activation au S4J3, apres preparation hors ligne. Toutes les manipulations qui exigent l'instance doivent etre terminees avant la fin de la semaine 7. Preuves exportees avant expiration.
- **Le rythme ne laisse aucune marge.** Les semaines 2, 5 et 6 sont les plus denses. En cas de retard, sacrifier dans cet ordre : les extensions de la semaine 7 (visuel avance, profils k6 supplementaires), l'extension Pact fournisseur de la semaine 6, l'extension reporter personnalise de la semaine 2. **Ne jamais sacrifier la semaine 5 ni le J1 de la semaine 8** : ce sont les deux differenciateurs.
- **Le RWA n'est pas une application de production.** Sa base est un fichier JSON, son chemin est code en dur, son front doit etre construit avant d'etre servi en CI. Les limites que vous rencontrerez viennent de l'application, pas de votre travail. Les documenter comme telles est une bonne pratique.
- **Les chiffres de cette roadmap sont des objectifs de mesure, pas des resultats.** Ne reprenez jamais en entretien un chiffre que vous n'avez pas mesure vous-meme.

---

## 5. Ce qui a change apres la revue adversariale

Les corrections retenues, verifiees une par une dans le depot et dans la documentation locale :

**Erreurs factuelles corrigees :**

- Le calendrier Xray etait arithmetiquement faux : 5 semaines font 35 jours, l'essai en dure 30. Activation decalee au S4J3, avec preparation hors ligne.
- `yarn start:ci` ne demarre pas Vite : `scripts/testServer.ts` sert le contenu statique du dossier `build`. Il faut construire avant. Verifie dans le depot.
- Le chemin de la base est code en dur dans `backend/database.ts`. Changer le port backend n'isole donc rien. Verifie dans le code.
- La documentation Playwright deconseille explicitement de mettre en cache les binaires des navigateurs (`refs/playwright/docs/src/ci.md`). La roadmap conseillait l'inverse.
- La comparaison du mode strict avec Cypress etait fausse : `cy.get()` produit une collection, Cypress ne "prend pas le premier".
- Pact : les tags ne sont plus la facon recommandee de modeliser branches et deploiements.
- Le protocole de test de mutation sur des suites Playwright n'etait pas realisable : Stryker a un lanceur Vitest officiel, pas d'equivalent Playwright. Le protocole a ete refait sur `src/utils/transactionUtils.ts`, qui existe bien et possede deja des tests Vitest.
- Plusieurs affirmations trop absolues corrigees : `page.route()` n'est pas "impossible en manuel", k6 n'a pas "remplace JMeter", `constant-arrival-rate` n'est pas "plus proche de la realite" dans l'absolu, Pact n'est pas "inutile" contre une API externe.
- Les chiffres non sources ont ete retires : le pourcentage de couverture d'axe-core, les gains de temps donnes en exemple, les proportions d'equipes ou de candidats.

**Correction structurelle, la plus importante :**

La premiere version promettait entre 253 et 331 heures de travail pour un budget annonce de 170 heures, soit environ le double. D'ou le decoupage socle / extension, et une reduction reelle du perimetre : 3 exigences Xray au lieu de 10, 2 profils k6 au lieu de 5, un seul parcours de tests visuels, 5 comportements a classer en semaine 6 au lieu de tous, 2 fragments de CI au lieu de 4.

**Ajouts de fond pour l'objectif Lead QA :**

La semaine 8 a ete refaite. Elle contenait surtout de la mise en forme de portfolio ; elle contient maintenant l'analyse de risque, les quality gates, la testabilite et l'observabilite, le mini modele de menaces, et un plan 30-60-90 jours de prise de poste. Le J6 de la semaine 6 traite desormais la compatibilite et les migrations, plus utile en 2027 qu'un classement exhaustif des comportements.

**Un point ou la revue etait imprecise :**

La valeur de 414 pixels existe bien dans le depot, mais dans la configuration Cypress, utilisee par `cypress/support/utils.ts` pour decider si le viewport est mobile. Ce n'est donc pas une media query de l'application. La roadmap le formule maintenant exactement ainsi, et retient le profil 375 x 667 deja utilise par le depot.
