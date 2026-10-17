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
  readonly cartLink;
  readonly addBackpackButton;
  readonly addBikeLightButton;
  readonly removeBackpackButton;
  readonly removeBikeLightButton;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.addBackpackButton = page.getByTestId('add-to-cart-sauce-labs-backpack');
    this.addBikeLightButton = page.getByTestId('add-to-cart-sauce-labs-bike-light');
    this.removeBackpackButton = page.getByTestId('remove-sauce-labs-backpack');
    this.removeBikeLightButton = page.getByTestId('remove-sauce-labs-bike-light');
  }
}

class CartPage {
  readonly items;
  readonly itemNames;
  readonly itemQuantities;
  readonly itemPrices;
  readonly continueShoppingButton;
  readonly checkoutButton;

  constructor(page: Page) {
    this.items = page.locator('.cart_item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }
}

test.describe('Login, Catalog, Cart, and Checkout', () => {
  test('Add products to cart and verify cart contents', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Sign in using the standard user and verify the cart is initially empty.
    await page.goto('https://www.saucedemo.com/');
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.cartLink).not.toContainText(/\d/);

    // 2. Add Backpack and Bike Light and verify the add controls change to Remove and the badge shows two.
    await inventoryPage.addBackpackButton.click();
    await inventoryPage.addBikeLightButton.click();
    await expect(inventoryPage.removeBackpackButton).toBeVisible();
    await expect(inventoryPage.removeBikeLightButton).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // 3. Open the cart and verify the exact products, quantities, prices, and available actions.
    await inventoryPage.cartLink.click();
    const cartPage = new CartPage(page);
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(cartPage.itemQuantities).toHaveText(['1', '1']);
    await expect(cartPage.itemPrices).toHaveText(['$29.99', '$9.99']);
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
