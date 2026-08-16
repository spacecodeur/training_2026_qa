import { expect, test } from '@playwright/test';

/**
 * Atelier du J2 : assertions web-first.
 *
 * ATTENTION - ce fichier contient volontairement du code a ne pas reproduire.
 * Il montre ce qui casse, pas ce qu'il faut ecrire. Les tests qui protegent
 * l'application vivent dans tests/ui/.
 *
 * Le decalage n'est pas simule : le fil des transactions est charge par un appel
 * reseau posterieur a la navigation, donc juste apres un goto() les lignes ne
 * sont pas encore dans le DOM. C'est l'application qui fournit la condition de
 * course, pas une temporisation artificielle.
 */

const USER = {
  username: 'Heath93',
  password: 's3cret',
};

const LIGNES_DU_FIL = /^transaction-item-/;

/** Le fil public charge ses transactions par tranches de 10. */
const TAILLE_DE_PAGE = 10;

test.beforeEach(async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('Username').fill(USER.username);
  await page.getByLabel('Password').fill(USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByTestId('transaction-list')).toBeVisible();
});

/** Ralentissement volontaire de la reponse du fil, en millisecondes. */
const LATENCE_SIMULEE = 1000;

/**
 * Un seul test, vert, qui compare les deux formes sur la MEME page au MEME
 * instant - et qui echouerait si elles se mettaient a voir la meme chose.
 *
 * Pourquoi ralentir la reponse plutot que compter sur la lenteur naturelle du
 * chargement : sans cela, la demonstration dependrait de la vitesse de la
 * machine. Sur un poste rapide, les donnees pourraient arriver avant la lecture
 * immediate, et ce test deviendrait lui-meme instable - ce qui serait cocasse
 * dans un fichier consacre a l'instabilite. Forcer la course a se produire, au
 * lieu de l'esperer, est le geste de base du diagnostic.
 */
test('la lecture immediate et l assertion qui reessaie ne voient pas la meme page', async ({
  page,
}) => {
  await page.route('**/transactions/public*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, LATENCE_SIMULEE));
    await route.continue();
  });

  await page.goto('/');

  const lignes = page.getByTestId(LIGNES_DU_FIL);

  // Forme sans reessai : count() interroge le DOM une fois et rend un nombre.
  // Ce nombre est fige ; plus rien ne pourra le corriger.
  const compteImmediat = await lignes.count();

  // Forme qui reessaie : l'assertion recoit le localisateur, donc elle peut le
  // re-evaluer jusqu'a ce que la condition soit vraie ou que le delai expire.
  await expect(lignes).toHaveCount(TAILLE_DE_PAGE);

  // La preuve : les deux n'ont pas observe le meme etat de la page.
  expect(compteImmediat).toBeLessThan(TAILLE_DE_PAGE);
});
