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

  async open() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async signIn(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

class InventoryPage {
  readonly title;
  readonly productItems;
  readonly cartButton;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
    this.productItems = page.getByTestId('inventory-item');
    this.cartButton = page.getByTestId('shopping-cart-link');
  }
}

test.describe('Login, Catalog, Cart, and Checkout', () => {
  test('Successful login opens the inventory catalog', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. In a fresh browser context, navigate to https://www.saucedemo.com/ and verify the login controls.
    await loginPage.open();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Enter valid credentials, submit the form, and verify the inventory page and initial empty cart.
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.productItems).toHaveCount(6);
    await expect(inventoryPage.cartButton).toBeVisible();
    await expect(inventoryPage.cartButton).not.toContainText(/\d/);
  });
});
