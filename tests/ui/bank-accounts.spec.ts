import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

/**
 * Cycle de vie d'un compte bancaire : creation, presence dans la liste,
 * suppression.
 *
 * Deux faits de l'application conditionnent l'ecriture de ce test, et aucun des
 * deux ne se devine depuis l'interface.
 *
 * 1. La suppression est LOGIQUE, pas physique. La ligne reste dans la liste, son
 *    libelle recoit la mention "(Deleted)" et le bouton de suppression disparait
 *    (BankAccountItem.tsx:20-23). Une assertion "la ligne a disparu" serait donc
 *    fausse, alors qu'elle est la premiere que l'on ecrit spontanement.
 * 2. Sur ce formulaire, l'attribut data-test est pose sur la div qui entoure le
 *    champ, pas sur l'input - contrairement au formulaire des parametres, dans la
 *    meme application. Un fill() direct sur ce localisateur echoue ; il faut
 *    descendre jusqu'au champ reellement remplissable.
 */

const USER = {
  username: 'Heath93',
  password: 's3cret',
};

/**
 * Valeurs conformes au schema de validation de l'application
 * (BankAccountForm.tsx:9-18) : numero de routage de 9 caracteres exactement,
 * numero de compte de 9 a 12 chiffres.
 */
const COMPTE = {
  numeroDeRoutage: '987654321',
  numeroDeCompte: '123456789',
};

/**
 * Le nom doit etre unique a chaque EXECUTION du test, et cette unicite ne doit
 * dependre de rien d'autre que d'elle-meme.
 *
 * Pourquoi l'unicite est necessaire : la suppression du RWA est logique, les
 * lignes creees ne disparaissent jamais de la liste, donc un nom fixe ferait
 * echouer la deuxieme execution sur l'assertion d'etat initial.
 *
 * Pourquoi la fonction et non une constante de module : une constante serait
 * evaluee au chargement du fichier, pas au lancement du test. L'unicite
 * dependrait alors de la facon dont le lanceur charge les modules - un detail
 * d'implementation, non documente, qui peut changer sans preavis. Ici elle ne
 * depend de rien.
 *
 * Contrepartie assumee : la base accumule des comptes marques supprimes. Le
 * nettoyage entre executions est le sujet du J3 de la semaine 2.
 */
const nouveauNomDeBanque = () => `Banque de test ${randomUUID().slice(0, 8)}`;

/** Toutes les lignes de la liste des comptes, dont l'identifiant varie. */
const LIGNES_DE_COMPTE = /^bankaccount-list-item-/;

test.beforeEach(async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('Username').fill(USER.username);
  await page.getByLabel('Password').fill(USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByTestId('transaction-list')).toBeVisible();

  await page.getByTestId('sidenav-bankaccounts').click();
  await expect(page).toHaveURL('/bankaccounts');
  await expect(page.getByTestId('bankaccount-list')).toBeVisible();
});

/**
 * L'etiquette @ecrit-en-base n'est pas decorative. Le backend du RWA ecrit dans
 * un fichier JSON unique dont le chemin est code en dur : deux workers qui
 * modifient la base en meme temps se marchent dessus. Un commentaire n'aurait
 * informe que le lecteur du fichier ; une etiquette informe le lanceur, qui peut
 * des aujourd'hui separer les deux populations :
 *   npx playwright test --grep-invert @ecrit-en-base   (parallelisable)
 *   npx playwright test --grep @ecrit-en-base          (a mettre en serie)
 * C'est le point de depart du J1 de la semaine 2.
 */
test(
  'un compte cree apparait dans la liste, puis y est marque supprime',
  {
    tag: '@ecrit-en-base',
  },
  async ({ page }) => {
    const lignes = page.getByTestId(LIGNES_DE_COMPTE);
    const nomDeBanque = nouveauNomDeBanque();
    const ligneCreee = lignes.filter({ hasText: nomDeBanque });

    // Etat de depart affirme explicitement : le compte n'existe pas encore. Sans
    // cette assertion, un test qui passerait grace a une ligne laissee par une
    // execution precedente serait indiscernable d'un test qui passe vraiment.
    await expect(ligneCreee).toHaveCount(0);

    await page.getByTestId('bankaccount-new').click();
    await expect(page).toHaveURL('/bankaccounts/new');

    // Chainage impose par la structure : le conteneur porte l'attribut de test, le
    // champ porte le role. Descendre de l'un a l'autre est plus lisible qu'un
    // selecteur CSS qui viserait l'input a l'aveugle.
    await page.getByTestId('bankaccount-bankName-input').getByRole('textbox').fill(nomDeBanque);
    await page
      .getByTestId('bankaccount-routingNumber-input')
      .getByRole('textbox')
      .fill(COMPTE.numeroDeRoutage);
    await page
      .getByTestId('bankaccount-accountNumber-input')
      .getByRole('textbox')
      .fill(COMPTE.numeroDeCompte);

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(ligneCreee).toHaveCount(1);

    const supprimer = ligneCreee.getByRole('button', { name: 'Delete' });
    await expect(supprimer).toBeVisible();
    await supprimer.click();

    // La ligne survit a sa suppression : c'est le comportement de l'application,
    // pas un defaut du test. Les deux assertions disent ensemble ce que
    // "supprime" signifie ici - une mention ajoutee et une action retiree.
    await expect(ligneCreee).toContainText('(Deleted)');
    await expect(ligneCreee.getByRole('button', { name: 'Delete' })).toHaveCount(0);
  },
);
