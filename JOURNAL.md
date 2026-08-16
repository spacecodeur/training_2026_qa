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
- Blocage : WebKit n'a pas démarré sur la machine Fedora/Nobara, seul poste de travail ce jour-là. Cause réelle : le WebKit livré par Playwright est lié à l'ABI d'Ubuntu (`libicu*.so.74`, `libjpeg.so.8`), alors que Fedora fournit un ICU plus récent et un libjpeg-turbo exportant `LIBJPEG_6.2`. Un `dnf install libicu libjpeg-turbo` ne corrige donc rien. Playwright ne supporte officiellement que Debian 12/13 et Ubuntu 22.04/24.04/26.04 (`refs/playwright/docs/src/intro-js.md:308`) et `install-deps` s'appuie sur apt. **Résolu le 2026-08-15**, non par un correctif mais par le changement de poste de travail : sur le PC Debian 13, WebKit 26.5 démarre, rend une page et exécute la suite. La dette "WebKit sera couvert par la CI en semaine 3" est donc annulée ; la matrice multi-navigateurs de S3J2 et le conteneur de S7J5 restent au programme, mais comme couverture voulue et non comme contournement d'un blocage local.
- Mesure : 1 test, mode headless, durées totales rapportées par le lanceur. Machine Fedora/Nobara le 2026-08-14 : chromium seul 966 ms, chromium + firefox en parallèle (3 workers) 1,9 s, application déjà démarrée, WebKit non mesurable. Machine Debian 13 (Intel N200, 4 cœurs, donc 2 workers par défaut) le 2026-08-15 : chromium seul 9,8 s application fraîchement démarrée puis 4,2 s à chaud, webkit seul 9,6 s, les trois navigateurs en parallèle 14,3 s. L'écart 9,8 s / 4,2 s mesure la compilation à la demande de Vite au premier appel, pas un coût de navigateur : une mesure prise juste après `yarn dev` chronomètre l'application et non la suite de tests. Les deux machines ne sont comparables ni en puissance ni en nombre de workers ; la série Debian devient la référence pour la suite du sprint.
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

---

## S1J2 - 2026-08-15 - Localisateurs, mode strict et assertions

- Fait : j'ai créé un dossier d'atelier `tests/lab/` pour les démonstrations, distinct de `tests/ui/` qui contient les tests protégeant l'application. J'y ai travaillé les localisateurs sur le fil des transactions : `getByTestId` avec expression régulière, `first()`, `nth()`, `filter()`, et le chaînage d'un localisateur dans un autre. J'ai réécrit en Playwright 3 tests d'interface de la suite Cypress du RWA : mise à jour du profil, erreurs de validation du formulaire de paramètres, cycle de vie d'un compte bancaire. J'ai mesuré l'écart entre les assertions qui réessaient et celles qui n'évaluent qu'une fois. J'ai posé une étiquette `@ecrit-en-base` sur les deux tests qui modifient la base de données.
- Blocage : j'ai rencontré trois particularités de l'application, toutes invisibles depuis l'interface et trouvées en lisant son code. Premièrement, les deux formulaires du RWA ne posent pas `data-test` au même endroit. Le formulaire des paramètres utilisateur le pose sur la balise `<input>`. Le formulaire des comptes bancaires le pose sur la `<div>` qui entoure le champ. Un `fill()` direct échoue donc sur le formulaire des comptes bancaires, et j'ai ajouté un chaînage vers le champ de saisie. Deuxièmement, les champs du formulaire des paramètres n'ont **aucune étiquette associée** : `element.labels.length` vaut 0, vérifié dans le navigateur. `getByLabel()` et `getByRole('textbox', { name })` sont donc inutilisables sur ces champs, et je suis passé par `getByPlaceholder()`. C'est une dette d'accessibilité du produit, pas une contrainte de l'outil. Troisièmement, la suppression d'un compte bancaire est **logique et non physique** : la ligne reste dans la liste, son libellé reçoit la mention "(Deleted)" et le bouton de suppression disparaît. L'assertion que j'aurais écrite spontanément, "la ligne a disparu", est donc fausse. Point secondaire : je n'ai pas pu dater les deux formulaires pour vérifier l'hypothèse "écrits à des époques différentes", parce que l'historique du RWA a été aplati en un seul commit par la décision du J1 de cloner plutôt que forker.
- Mesure : chromium, mode headless, machine Debian 13 (Intel N200, 4 cœurs, donc 2 workers par défaut), application déjà démarrée et chaude. **Assertions sur le fil des transactions**, une exécution de chaque cas dans un script autonome, après une exécution de chauffe, délai d'assertion laissé à sa valeur par défaut de 5 s. Condition déjà vraie : 24 ms pour la forme qui réessaie, 37 ms pour la forme immédiate ; avec ce protocole je n'observe donc pas de surcoût du réessai, et le mécanisme l'explique - l'assertion vérifie d'abord et ne boucle que si la condition est fausse. Page en cours de chargement : 889 ms pour la forme qui réessaie, qui réussit, contre 459 ms pour la forme immédiate, qui échoue. Condition jamais satisfaite : 5010 ms pour la forme qui réessaie, qui consomme son délai entier, contre 9 ms pour la forme immédiate. C'est le seul cas où le réessai coûte, et cela découle du mécanisme, pas de ces trois relevés. **Résolution d'un localisateur** : moyenne sur 300 résolutions consécutives par forme, après chauffe, deux campagnes. Environ 3 ms par résolution pour les trois formes testées - expression régulière, sélecteur CSS natif, chaîne exacte. L'ordre entre les deux premières s'inverse d'une campagne à l'autre, donc l'écart entre formes est du bruit à ce protocole. Le coût observé est celui de l'aller-retour entre le processus Node et le navigateur, pas celui du moteur de sélection. **Suite complète** : 10 tests répétés 5 fois, soit 50 exécutions en 2,9 min sur 2 workers. 40 réussites et 10 échecs, ces 10 échecs correspondant exactement aux 2 tests alors volontairement rouges. Aucune instabilité observée, ce qui ne prouve pas son absence : 5 répétitions sur un seul navigateur et une machine peu chargée constituent un plancher, pas une preuve. Après conversion de ces deux tests, 9 tests répétés 3 fois, 27 exécutions en 1,2 min, 27 réussites. **Connexion, estimation et non mesure** : le test d'authentification dure 4,5 s et ne fait que se connecter, ce qui sert de valeur approchée du coût de connexion des autres tests. Sur cette base, 50 exécutions représenteraient environ 175 s, à comparer aux 348 s de temps cumulé des deux workers (2,9 min multipliées par 2 workers). L'ordre de grandeur est donc la moitié du temps cumulé, mais je n'ai pas isolé la séquence de connexion elle-même - qui comprend la navigation, la saisie, l'envoi et l'attente du fil, pas seulement la frappe. À confirmer par une mesure directe au J5, journée consacrée à `storageState`, le mécanisme qui enregistre une session authentifiée pour la rejouer sans repasser par le formulaire.
- Temps passé dans cette partie : ~1 h. Le temps est allé beaucoup plus dans l'arbitrage et la vérification que dans l'écriture des tests eux-mêmes : les trois décisions d'outillage, la mise au clair de la comparaison entre Cypress, Selenium et Playwright avec ses sources, et la relecture adversariale des documents ont pesé plus lourd que le code.
- À retenir :
  - ce qui réessaie n'est pas l'assertion mais ce qu'on lui donne : un nombre ne peut pas changer d'avis, un localisateur si. Repère en revue de code : `expect(await ...)` fige, `await expect(...)` observe.
  - "Cypress prend le premier élément" est faux et se fait relever en entretien : `cy.click()` sur plusieurs éléments échoue aussi. C'est **Selenium** qui prend le premier en silence. Cypress porte la règle commande par commande, Playwright la porte sur le localisateur.
  - une suite qui contient des rouges permanents ne peut plus servir à détecter l'instabilité : un test instable et un test connu-rouge portent le même symbole.
  - un test qui affirme ses préconditions est un capteur de dérive d'environnement, pas seulement une vérification fonctionnelle.
  - le bon moment pour durcir une règle d'outillage est celui où elle ne coûte rien à adopter ; ce moment ne revient pas.
  - une démonstration qui repose sur une condition de course doit contrôler cette course, sinon elle devient le problème qu'elle illustre.

### Decisions du jour

| Decision | Pourquoi |
|---|---|
| `playwright/no-nth-methods` en erreur sur `tests/ui/` seulement | la règle interdit aussi `first()`, pas seulement `nth()` ; `tests/lab/` existe pour montrer ces constructions, et « ce dossier a le droit » est une propriété du dossier, à écrire une fois dans la configuration plutôt que quatre fois en commentaire. Zéro erreur à corriger dans `tests/ui/` au moment de l'activation. |
| `npm run lint` devient `eslint . --max-warnings=0` | 27 règles du greffon Playwright étaient en avertissement, donc décoratives : `eslint` sortait avec le code 0 et personne ne les lisait. Vérifié dans les deux sens avec un fichier témoin. |
| Les deux tests volontairement rouges convertis en tests verts | un test rouge en permanence échoue quoi qu'il arrive et n'apprend plus rien ; converti, il devient rouge le jour où le comportement démontré change. Et il rend `--repeat-each` de nouveau exploitable. |
| Étiquette `@ecrit-en-base` sur les tests qui modifient la base | un commentaire informe le lecteur du fichier, une étiquette informe le lanceur : `--grep-invert "@ecrit-en-base"` sépare déjà les tests parallélisables de ceux à mettre en série. Point de départ du J1 de la semaine 2. |
| Nom de compte bancaire généré dans le corps du test, par `randomUUID()` | en constante de module, l'unicité dépendait de la façon dont le lanceur charge les modules - comportement non documenté, donc susceptible de changer sans préavis. Le test passait, mais pour une raison que je ne contrôlais pas. |
| `tests/lab/` reste exécuté par défaut | un dossier qui ne tourne jamais pourrit : dans trois mois ses localisateurs seraient périmés et personne ne le saurait. 13 s d'exécution pour garantir que la documentation reste vraie. |
| `getByPlaceholder()` retenu pour le formulaire des paramètres | ni `getByLabel()` ni `getByRole('textbox', { name })` ne peuvent fonctionner faute de nom accessible ; le placeholder désigne un texte réellement visible et cassera si le libellé change, ce qui est le signal recherché. À remplacer par `getByLabel()` le jour où les étiquettes manquantes seront ajoutées. |
