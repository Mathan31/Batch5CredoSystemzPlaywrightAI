// spec: test-plans/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

class LoginPage {
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
  }

  async signIn(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

class InventoryPage {
  readonly productItems;
  readonly productNames;
  readonly productPrices;
  readonly sortProducts;

  constructor(page: Page) {
    this.productItems = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortProducts = page.getByTestId('product-sort-container');
  }
}

test.describe('Login, Catalog, Cart, and Checkout', () => {
  test('Sort inventory from lowest to highest price', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Sign in and verify that the inventory contains six products.
    await page.goto('https://www.saucedemo.com/');
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.productItems).toHaveCount(6);

    // 2. Sort by ascending price and verify the complete ordered product and price lists.
    await inventoryPage.sortProducts.selectOption('lohi');
    await expect(inventoryPage.productNames).toHaveText([
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ]);
    await expect(inventoryPage.productPrices).toHaveText([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);
  });
});
