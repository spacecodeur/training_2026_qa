import { test, expect } from '@playwright/test';

/**
 * Compte issu du seed versionne du RWA (data/database-seed.json), donc stable.
 * Mot de passe commun a tous les comptes : SEED_DEFAULT_USER_PASSWORD dans .env.
 * Ce couple sera remplace par une fabrique de donnees au J3 de la semaine 2.
 */
const USER = {
  username: 'Heath93',
  password: 's3cret',
};

test('un utilisateur se connecte et arrive sur le fil des transactions', async ({ page }) => {
  await page.goto('/signin');

  // getByLabel cible le champ par son libelle visible, comme le ferait un utilisateur.
  // A noter : un champ de type "password" n'a pas de role ARIA, donc getByRole()
  // ne peut pas le trouver - c'est le cas d'usage typique de getByLabel.
  await page.getByLabel('Username').fill(USER.username);
  await page.getByLabel('Password').fill(USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('sidenav-username')).toHaveText(`@${USER.username}`);
  await expect(page.getByTestId('transaction-list')).toBeVisible();
});
