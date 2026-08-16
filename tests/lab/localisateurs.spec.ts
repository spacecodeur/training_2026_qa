import { expect, test } from '@playwright/test';

/**
 * Atelier du J2 : localisateurs et mode strict.
 *
 * Ce fichier est un banc d'essai, pas une suite de non-regression. Il existe pour
 * montrer un comportement de l'outil ; les tests qui protegent l'application vivent
 * dans tests/ui/. C'est pourquoi il est dans un dossier separe : le jour ou la suite
 * devra tourner en integration continue, ce dossier ne suivra pas.
 *
 * Fait a connaitre sur l'application testee : chaque ligne du fil des transactions
 * porte data-test="transaction-item-<id>", ou l'identifiant change a chaque seed
 * (cypress-realworld-app/src/components/TransactionItem.tsx:84). Un identifiant de
 * test ecrit en dur ne tiendrait donc pas d'une execution a l'autre. getByTestId()
 * acceptant une expression reguliere, il permet de designer la famille entiere.
 *
 * A savoir en lisant ce fichier : first() et nth() y sont utilises librement,
 * alors que la regle eslint playwright/no-nth-methods les interdit dans
 * tests/ui/. Ce n'est pas un oubli, c'est la raison d'etre du dossier. Ne pas
 * recopier ces constructions dans la suite qui protege l'application.
 *
 * Documentation locale : refs/playwright/docs/src/locators.md, section "Strictness".
 */

const USER = {
  username: 'Heath93',
  password: 's3cret',
};

/** Toutes les lignes du fil des transactions, quelle que soit leur quantite. */
const SELECTEUR_LIGNES = /^transaction-item-/;

/**
 * Connexion recopiee depuis tests/ui/auth.spec.ts. La duplication est assumee
 * aujourd'hui : la factorisation par fixture est le sujet du J4.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('Username').fill(USER.username);
  await page.getByLabel('Password').fill(USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByTestId('transaction-list')).toBeVisible();
});

/**
 * Le localisateur correspond a toutes les lignes du fil, et le clic exige une cible
 * unique. Playwright refuse de choisir a ma place et leve une "strict mode violation"
 * qui enumere les elements correspondants.
 *
 * Ce test AFFIRME ce refus au lieu de le subir : il est vert quand Playwright refuse,
 * et il deviendrait rouge si Playwright se mettait un jour a choisir tout seul. Un
 * test qui echoue volontairement, lui, echoue quoi qu'il arrive et n'apprend plus rien.
 *
 * Ce qu'il demontre, et qui n'est pas ce qu'on lit d'habitude : la difference avec
 * Cypress n'est pas que Cypress choisirait le premier element - cy.click() sur
 * plusieurs elements echoue aussi. La difference est que Playwright pose la regle sur
 * le localisateur, une fois pour toutes, alors que Cypress la pose commande par
 * commande : cy.get() suivi de should('exist') passe sans broncher sur 4 elements.
 *
 * Deux echecs a ne pas confondre quand ce message apparait pour de vrai :
 * - "strict mode violation ... resolved to N elements" : le localisateur est trop
 *   large, il faut le restreindre ;
 * - un depassement de delai : le localisateur ne correspond a rien, le probleme est
 *   ailleurs (page non chargee, mauvais attribut, utilisateur non connecte).
 */
test('mode strict : une action sur un localisateur multiple est refusee', async ({ page }) => {
  const lignes = page.getByTestId(SELECTEUR_LIGNES);

  // On capture l'erreur au lieu de la laisser faire echouer le test.
  const erreur = await lignes.click().then(
    () => null,
    (cause: Error) => cause,
  );

  expect(erreur).not.toBeNull();
  expect(erreur?.message).toContain('strict mode violation');
  // Le message enumere les elements trouves : c'est cette partie qu'il faut
  // savoir lire, et c'est elle qui manque quand on se contente d'un test rouge.
  expect(erreur?.message).toMatch(/resolved to \d+ elements/);

  // Le message complet est rattache au rapport HTML, donc consultable sans avoir
  // a casser le test pour le voir.
  await test.info().attach('message du mode strict', {
    body: erreur?.message ?? '',
    contentType: 'text/plain',
  });
});

/**
 * first() : je designe une position, sans rien dire de ce que la ligne contient.
 * Le test reste vert si le fil est entierement reordonne ou si son contenu change,
 * donc il ne protege pas grand-chose : il verifie que "cliquer sur la ligne du haut
 * ouvre une transaction", ce qui est une regle d'interface, pas une regle metier.
 */
test('first() : designer la premiere ligne du fil par sa position', async ({ page }) => {
  const premiere = page.getByTestId(SELECTEUR_LIGNES).first();

  await expect(premiere).toBeVisible();
  await premiere.click();

  await expect(page.getByTestId('transaction-detail-header')).toBeVisible();

  // La page de detail rend elle aussi un transaction-item-<id>
  // (components/TransactionDetail.tsx:125). Le meme localisateur qui violait le mode
  // strict sur le fil correspond ici a un seul element : l'ambiguite depend de la
  // page, pas du localisateur.
  await expect(page.getByTestId(SELECTEUR_LIGNES)).toHaveCount(1);
});

/**
 * nth() : la variante la plus fragile des trois, pour deux raisons cumulees.
 * D'abord l'index part de zero, donc nth(2) designe la TROISIEME ligne - un relecteur
 * doit s'arreter pour en etre sur. Ensuite le test suppose en silence que le fil
 * contient au moins trois lignes ; si le seed change, l'echec sera un depassement de
 * delai qui ne dira rien de la vraie cause.
 *
 * L'assertion de comptage ci-dessous rend cette hypothese explicite : elle transforme
 * un futur echec obscur en un echec qui se lit.
 */
test('nth() : designer la troisieme ligne du fil par sa position', async ({ page }) => {
  const lignes = page.getByTestId(SELECTEUR_LIGNES);

  await expect(lignes.first()).toBeVisible();
  expect(await lignes.count()).toBeGreaterThanOrEqual(3);

  const troisieme = lignes.nth(2);
  await expect(troisieme).toBeVisible();
  await troisieme.click();

  await expect(page.getByTestId('transaction-detail-header')).toBeVisible();
});

/**
 * filter() : je designe un sous-ensemble par ce qu'il signifie, pas par ou il se
 * trouve. L'application ecrit le titre d'une ligne sous la forme
 * "<emetteur> paid <destinataire>" pour un paiement, et "requested" ou "charged" pour
 * une demande (components/TransactionTitle.tsx). Le mot "paid" est donc un critere
 * metier lisible par quelqu'un qui ne connait pas le code.
 *
 * Ce que filter() garantit et que first() ne garantit pas : la ligne obtenue est un
 * paiement. Le .first() final porte alors sur "un paiement quelconque" et non sur
 * "la ligne du haut, quoi qu'elle soit" - c'est toute la difference, et elle survit
 * a un reordonnancement du fil.
 *
 * Ce que filter() ne garantit pas non plus, et qu'il faut savoir dire : l'unicite.
 * Le seed contient 600 transactions pour 20 descriptions distinctes (verifie dans
 * cypress-realworld-app/data/database-seed.json), donc aucun texte affiche n'est
 * unique dans cette application. Restreindre par le sens ne dispense pas de decider
 * ce qu'on fait quand plusieurs lignes satisfont le critere.
 */
test('filter() : designer une ligne par un critere metier', async ({ page }) => {
  const paiements = page.getByTestId(SELECTEUR_LIGNES).filter({ hasText: 'paid' });

  await expect(paiements).not.toHaveCount(0);

  const unPaiement = paiements.first();
  await expect(unPaiement).toContainText('paid');
  await unPaiement.click();

  await expect(page.getByTestId('transaction-detail-header')).toBeVisible();
});
