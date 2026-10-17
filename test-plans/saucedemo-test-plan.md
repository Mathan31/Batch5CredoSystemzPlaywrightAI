# SauceDemo Web Application Test Plan

## Application Overview

Five independent, manually executable scenarios for the SauceDemo (Swag Labs) storefront, based on exploration of the login page, inventory catalog, product sorting, cart, and checkout flow. Start every scenario from a fresh browser context with no saved authentication or cart state. Publicly documented demo account: standard_user / secret_sauce. Product names and displayed prices below are observed in the app and may change if test data is updated.

## Test Scenarios

### 1. Login, Catalog, Cart, and Checkout

**Seed:** `.playwright-mcp\seed.spec.ts`

#### 1.1. Successful login opens the inventory catalog

**File:** `test-plans\saucedemo-test-plan.md`

**Steps:**
  1. In a fresh browser context, navigate to https://www.saucedemo.com/.
    - expect: The Swag Labs login page is displayed with Username, Password, and Login controls.
  2. Enter standard_user in Username and secret_sauce in Password, then click Login.
    - expect: Navigation reaches /inventory.html.
    - expect: The Products heading and six inventory products are visible.
    - expect: The cart is initially empty.

#### 1.2. Invalid credentials show a login error without navigating

**File:** `test-plans\saucedemo-test-plan.md`

**Steps:**
  1. In a fresh browser context, navigate to https://www.saucedemo.com/.
    - expect: The login form is visible.
  2. Enter invalid_user in Username and wrong_password in Password, then click Login.
    - expect: The user remains on the login page.
    - expect: An error message states that the username and password do not match any user in the service.
    - expect: The login form remains available to correct and resubmit.

#### 1.3. Sort inventory from lowest to highest price

**File:** `test-plans\saucedemo-test-plan.md`

**Steps:**
  1. In a fresh browser context, sign in using standard_user / secret_sauce.
    - expect: The inventory page displays six products.
  2. Choose Price (low to high) from the Sort products dropdown.
    - expect: Products are ordered by ascending displayed price: Sauce Labs Onesie ($7.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), Test.allTheThings() T-Shirt (Red) ($15.99), Sauce Labs Backpack ($29.99), Sauce Labs Fleece Jacket ($49.99).
    - expect: Products with an equal price remain adjacent; no product is missing.

#### 1.4. Add products to cart and verify cart contents

**File:** `test-plans\saucedemo-test-plan.md`

**Steps:**
  1. In a fresh browser context, sign in using standard_user / secret_sauce.
    - expect: The inventory page is displayed and the cart has no item count.
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart using their Add to cart buttons.
    - expect: Both selected controls change to Remove.
    - expect: The cart badge indicates 2 items.
  3. Open the cart.
    - expect: The cart page lists exactly Sauce Labs Backpack and Sauce Labs Bike Light, each with quantity 1.
    - expect: The displayed item prices are $29.99 and $9.99 respectively.
    - expect: The cart subtotal is not shown yet; Continue Shopping and Checkout controls are available.

#### 1.5. Complete checkout with valid customer details

**File:** `test-plans\saucedemo-test-plan.md`

**Steps:**
  1. In a fresh browser context, sign in using standard_user / secret_sauce and add Sauce Labs Backpack to the cart.
    - expect: The cart badge shows 1.
  2. Open the cart and select Checkout.
    - expect: The checkout information form is displayed.
  3. Enter First Name: Taylor, Last Name: Tester, Postal Code: 10001, then select Continue.
    - expect: The checkout overview lists Sauce Labs Backpack, quantity 1, and item total $29.99.
    - expect: Summary shows item subtotal, tax, and total; the total equals subtotal plus tax.
  4. Select Finish.
    - expect: The order confirmation page displays a thank-you/completion message.
    - expect: A Back Home control is available.
