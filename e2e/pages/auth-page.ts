import { type Page, type Locator, expect } from "@playwright/test";

export class AuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/auth");
    await this.page.waitForLoadState("networkidle");
  }

  private get signupTab(): Locator {
    return this.page.locator("button", { hasText: "Criar Conta" }).first();
  }

  private get signinTab(): Locator {
    return this.page.locator("button", { hasText: "Entrar" }).first();
  }

  async switchToSignup() {
    await this.signupTab.click();
  }

  async switchToSignin() {
    await this.signinTab.click();
  }

  async signUp(email: string, password: string) {
    await this.switchToSignup();
    // O form de signup é o primeiro par de inputs
    await this.page.locator('input[type="email"]').first().fill(email);
    await this.page.locator('input[type="password"]').first().fill(password);
    await this.page.locator('button[type="submit"]').first().click();
  }

  async signIn(email: string, password: string) {
    await this.switchToSignin();
    // O form de signin é o último par de inputs (renderizado depois)
    await this.page.locator('input[type="email"]').last().fill(email);
    await this.page.locator('input[type="password"]').last().fill(password);
    await this.page.locator('button[type="submit"]').last().click();
  }

  async expectError(message: string) {
    await expect(
      this.page.locator(`text=${message}`).or(
        this.page.locator('[data-sonner-toast]').filter({ hasText: message })
      )
    ).toBeVisible({ timeout: 8_000 });
  }

  async expectToast(partialText: string) {
    await expect(
      this.page.locator('[data-sonner-toast]').filter({ hasText: partialText })
    ).toBeVisible({ timeout: 8_000 });
  }
}
