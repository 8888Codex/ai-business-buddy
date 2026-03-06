import { type Page, expect } from "@playwright/test";

export class ConnectPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectSaving() {
    await expect(
      this.page.locator("text=Salvando seu agente")
    ).toBeVisible({ timeout: 15_000 });
  }

  async expectWaiting() {
    // Aguarda o estado "waiting" — QR code ou instrução de conexão
    await expect(
      this.page
        .locator("text=Conecte Seu WhatsApp")
        .or(this.page.locator('img[alt="QR Code WhatsApp"]'))
        .or(this.page.locator('[data-testid="qr-code"]'))
    ).toBeVisible({ timeout: 30_000 });
  }

  async expectError(partialMessage?: string) {
    const errorLocator = partialMessage
      ? this.page.locator(`text=${partialMessage}`)
      : this.page.locator("text=Erro ao configurar").or(
          this.page.locator("text=Erro ao gerar")
        );
    await expect(errorLocator).toBeVisible({ timeout: 15_000 });
  }

  async expectConnectScreen() {
    // Verifica que saiu do estado "saving" — chegou em waiting, error ou dashboard
    // O "Salvando seu agente..." texto pode não aparecer se a navegação foi rápida
    // Então esperamos que a URL seja /connect (com qualquer sub-estado) OU /dashboard
    const url = this.page.url();
    if (url.includes("/dashboard")) {
      // Já foi redirecionado para o dashboard — sucesso
      return;
    }

    // Ainda no /connect — aguarda sair do estado "saving"
    await expect(
      this.page.locator("text=Salvando seu agente")
    ).not.toBeVisible({ timeout: 25_000 });
  }
}
