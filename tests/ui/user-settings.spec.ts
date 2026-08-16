import { expect, test } from '@playwright/test';

/**
 * Parametres utilisateur : mise a jour du profil et validation du formulaire.
 *
 * Choix de localisateur a justifier, parce qu'il s'ecarte de la priorite
 * recommandee : les champs de ce formulaire n'ont AUCUNE etiquette associee
 * (verifie dans le navigateur, element.labels.length vaut 0). Ils portent
 * seulement un placeholder. getByLabel() ne peut donc pas les trouver, et
 * getByRole('textbox', { name }) non plus faute de nom accessible. Reste
 * getByPlaceholder(), qui designe un texte reellement visible par l'utilisateur,
 * ou getByTestId(). Le placeholder est retenu : il casse si le libelle change,
 * ce qui est exactement le signal recherche, et il devra etre remplace par
 * getByLabel() le jour ou les etiquettes manquantes seront ajoutees.
 * L'absence d'etiquette est une dette d'accessibilite notee dans le journal,
 * pas une fatalite du test.
 */

const USER = {
  username: 'Heath93',
  password: 's3cret',
};

/**
 * Valeurs fixes et non aleatoires : ce test doit passer deux fois de suite.
 * Ecrire deux fois les memes valeurs produit deux fois le meme etat.
 */
const PROFIL = {
  prenom: 'Bob',
  nom: 'Ross',
  email: 'bob.ross@example.com',
  telephone: '6155551212',
};

/**
 * Troisieme recopie de la sequence de connexion depuis tests/ui/auth.spec.ts.
 * La duplication n'est plus une commodite, elle est devenue le probleme que la
 * fixture du J4 doit resoudre.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/signin');
  await page.getByLabel('Username').fill(USER.username);
  await page.getByLabel('Password').fill(USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByTestId('transaction-list')).toBeVisible();

  await page.getByTestId('sidenav-user-settings').click();
  await expect(page).toHaveURL('/user/settings');
  await expect(page.getByTestId('user-settings-form')).toBeVisible();
});

/** Voir tests/ui/bank-accounts.spec.ts pour ce que cette etiquette permet. */
test(
  'la mise a jour du profil se reflete dans le menu lateral',
  {
    tag: '@ecrit-en-base',
  },
  async ({ page }) => {
    await page.getByPlaceholder('First Name').fill(PROFIL.prenom);
    await page.getByPlaceholder('Last Name').fill(PROFIL.nom);
    await page.getByPlaceholder('Email').fill(PROFIL.email);
    await page.getByPlaceholder('Phone Number').fill(PROFIL.telephone);

    await page.getByRole('button', { name: 'Save' }).click();

    // Assertion sur l'effet, pas sur l'action : verifier que le champ contient ce
    // que je viens d'y taper ne testerait que le navigateur. Le menu lateral, lui,
    // relit le profil enregistre.
    //
    // Piege du rendu : NavDrawer.tsx:242 affiche `{firstName} {head(lastName)}`,
    // et le head() de lodash applique a une chaine renvoie son premier caractere.
    // L'attendu est donc "Bob R", pas "Bob Ross".
    await expect(page.getByTestId('sidenav-user-full-name')).toHaveText(
      `${PROFIL.prenom} ${PROFIL.nom.charAt(0)}`,
    );
  },
);

test('un champ obligatoire vide affiche son erreur et bloque l enregistrement', async ({
  page,
}) => {
  const prenom = page.getByPlaceholder('First Name');
  const enregistrer = page.getByRole('button', { name: 'Save' });

  // Etat initial capture avant l'action : sans cela, un bouton desactive pour une
  // toute autre raison ferait passer le test pour une bonne raison apparente.
  await expect(enregistrer).toBeEnabled();

  await prenom.clear();

  // Le message vient du schema de validation de l'application
  // (UserSettingsForm.tsx:35), il n'est pas invente ici.
  await expect(page.getByText('Enter a first name')).toBeVisible();
  await expect(enregistrer).toBeDisabled();
});
