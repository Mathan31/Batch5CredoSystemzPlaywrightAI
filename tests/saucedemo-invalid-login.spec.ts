// spec: test-plans/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

class LoginPage {
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly errorMessage;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
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

test.describe('Login, Catalog, Cart, and Checkout', () => {
  test('Invalid credentials show a login error without navigating', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigate to SauceDemo and verify the login form is visible.
    await loginPage.open();
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Submit invalid credentials and verify the error and login form remain visible.
    await loginPage.signIn('invalid_user', 'wrong_password');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
