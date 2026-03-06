import { type Page, expect } from "@playwright/test";

export class ConversationsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/conversations");
    await this.page.waitForLoadState("networkidle");
  }

  async expectPageHeader() {
    await expect(
      this.page.locator("h1", { hasText: "Conversas" })
    ).toBeVisible({ timeout: 10_000 });
  }

  async expectFilterButtonsVisible() {
    // Filtros: Todas, Ativas, Encerradas, Humano
    await expect(
      this.page.locator("button", { hasText: "Todas" }).first()
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      this.page.locator("button", { hasText: "Ativas" }).first()
    ).toBeVisible();
  }

  async expectListAreaVisible() {
    // Aguarda estado de carregamento sumir
    await this.page.waitForTimeout(500);

    // A página renderiza um destes estados (cada um precisa ser testado separadamente)
    const noneFound = this.page.locator("text=Nenhuma conversa encontrada");
    const selectOne = this.page.locator("text=Selecione uma conversa");
    const noAgent = this.page.locator("text=Nenhum agente configurado");
    const hasConvList = this.page.locator('button.filter\\(\\), button[class*="flex items-center gap-3 w-full px-4 py-3"]');

    // Verifica cada estado individualmente
    const isNoneFound = await noneFound.isVisible({ timeout: 8_000 }).catch(() => false);
    const isSelectOne = await selectOne.isVisible({ timeout: 3_000 }).catch(() => false);
    const isNoAgent = await noAgent.isVisible({ timeout: 3_000 }).catch(() => false);

    expect(isNoneFound || isSelectOne || isNoAgent).toBe(true);
  }

  async clickFilterActive() {
    await this.page.locator("button", { hasText: "Ativas" }).first().click();
    // Aguarda o filtro ser aplicado
    await this.page.waitForTimeout(500);
  }

  async clickFilterAll() {
    await this.page.locator("button", { hasText: "Todas" }).first().click();
    await this.page.waitForTimeout(500);
  }
}
