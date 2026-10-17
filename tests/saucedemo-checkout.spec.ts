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
  readonly addBackpackButton;
  readonly cartLink;

  constructor(page: Page) {
    this.addBackpackButton = page.getByTestId('add-to-cart-sauce-labs-backpack');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }
}

class CartPage {
  readonly checkoutButton;

  constructor(page: Page) {
    this.checkoutButton = page.getByTestId('checkout');
  }
}

class CheckoutInformationPage {
  readonly firstNameInput;
  readonly lastNameInput;
  readonly postalCodeInput;
  readonly continueButton;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
  }

  async enterCustomerDetails(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}

class CheckoutOverviewPage {
  readonly itemNames;
  readonly itemQuantities;
  readonly itemPrices;
  readonly subtotal;
  readonly tax;
  readonly total;
  readonly finishButton;

  constructor(page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }
}

class CheckoutCompletePage {
  readonly confirmationMessage;
  readonly backHomeButton;

  constructor(page: Page) {
    this.confirmationMessage = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }
}

test.describe('Login, Catalog, Cart, and Checkout', () => {
  test('Complete checkout with valid customer details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Sign in with valid credentials and add Sauce Labs Backpack.
    await page.goto('https://www.saucedemo.com/');
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await inventoryPage.addBackpackButton.click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // 2. Open the cart, select Checkout, and verify the checkout information form.
    await inventoryPage.cartLink.click();
    const cartPage = new CartPage(page);
    await cartPage.checkoutButton.click();
    const informationPage = new CheckoutInformationPage(page);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(informationPage.firstNameInput).toBeVisible();
    await expect(informationPage.lastNameInput).toBeVisible();
    await expect(informationPage.postalCodeInput).toBeVisible();

    // 3. Enter valid customer details and verify the overview item and arithmetic.
    await informationPage.enterCustomerDetails('Taylor', 'Tester', '10001');
    const overviewPage = new CheckoutOverviewPage(page);
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(overviewPage.itemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(overviewPage.itemQuantities).toHaveText(['1']);
    await expect(overviewPage.itemPrices).toHaveText(['$29.99']);
    await expect(overviewPage.subtotal).toHaveText('Item total: $29.99');
    await expect(overviewPage.tax).toHaveText('Tax: $2.40');
    await expect(overviewPage.total).toHaveText('Total: $32.39');
    const subtotal = Number((await overviewPage.subtotal.textContent())?.match(/\$([\d.]+)/)?.[1]);
    const tax = Number((await overviewPage.tax.textContent())?.match(/\$([\d.]+)/)?.[1]);
    const total = Number((await overviewPage.total.textContent())?.match(/\$([\d.]+)/)?.[1]);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // 4. Finish the order and verify its completion confirmation and Back Home control.
    await overviewPage.finishButton.click();
    const completePage = new CheckoutCompletePage(page);
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(completePage.confirmationMessage).toHaveText('Thank you for your order!');
    await expect(completePage.backHomeButton).toBeVisible();
  });
});
