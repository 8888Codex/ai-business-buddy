import { type Page, expect } from "@playwright/test";

export class AgentsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/agents");
    await this.page.waitForLoadState("networkidle");
  }

  async expectPageHeader() {
    await expect(
      this.page.locator("h1", { hasText: "Meus Agentes" })
    ).toBeVisible({ timeout: 10_000 });
  }

  async expectAgentCardOrEmptyState() {
    // Aguarda o loading sumir
    await expect(
      this.page.locator('[class*="animate-spin"]').first()
    ).not.toBeVisible({ timeout: 15_000 });

    // Pode ter agente ou estado vazio — ambos são válidos
    const hasAgent = await this.page
      .locator("text=Agente ativo")
      .or(this.page.locator("text=WhatsApp desconectado"))
      .or(this.page.locator("text=Nenhum agente criado"))
      .isVisible({ timeout: 5_000 });

    expect(hasAgent).toBe(true);
  }

  async expectAtLeastOneAgentCard() {
    // Botão "Reconectar WhatsApp" só aparece quando há agentes
    await expect(
      this.page.locator("button", { hasText: "Reconectar WhatsApp" }).first()
    ).toBeVisible({ timeout: 15_000 });
  }

  async clickReconnectWhatsApp() {
    await this.page
      .locator("button", { hasText: "Reconectar WhatsApp" })
      .first()
      .click();
  }

  async expectReconnectDialogOpen() {
    // O dialog "Reconectar WhatsApp" deve abrir
    await expect(
      this.page.locator('[role="dialog"]').filter({ hasText: "Reconectar WhatsApp" })
    ).toBeVisible({ timeout: 10_000 });
  }

  async expectReconnectDialogHasQrOrLoading() {
    // O dialog deve mostrar loading OU a área do QR code (img ou loader dentro do dialog)
    const dialog = this.page.locator('[role="dialog"]').filter({ hasText: "Reconectar WhatsApp" });

    // Aguarda sair do estado inicial (loading pode aparecer primeiro)
    await expect(dialog).toBeVisible({ timeout: 10_000 });

    // Verifica que o conteúdo do dialog tem algo relacionado ao QR/conectar
    const hasContent = await dialog
      .locator(
        'img[alt="QR Code WhatsApp"], [class*="animate-spin"], text=Gerando QR code, text=Escaneie o código, text=Erro ao gerar'
      )
      .isVisible({ timeout: 10_000 });

    expect(hasContent).toBe(true);
  }

  async closeDialog() {
    await this.page.keyboard.press("Escape");
    await expect(
      this.page.locator('[role="dialog"]')
    ).not.toBeVisible({ timeout: 5_000 });
  }
}
