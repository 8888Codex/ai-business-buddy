/**
 * Testes da página de Agentes — autenticado (usa storageState)
 * IMPORTANTE: Não cria novos agentes nem desconecta WhatsApp existente.
 */
import { test, expect } from "./fixtures";

test.describe("Agents — autenticado", () => {
  test.beforeEach(async ({ agentsPage }) => {
    await agentsPage.goto();
  });

  test("página de agentes carrega com header correto", async ({
    agentsPage,
  }) => {
    await agentsPage.expectPageHeader();
  });

  test("página exibe card de agente ou estado vazio (sem crash)", async ({
    agentsPage,
  }) => {
    await agentsPage.expectAgentCardOrEmptyState();
  });

  test("botão Reconectar WhatsApp abre dialog com QR code (se houver agente)", async ({
    page,
    agentsPage,
  }) => {
    // Verifica se há pelo menos um agente; se não tiver, pula o teste
    const hasReconnectBtn = await page
      .locator("button", { hasText: "Reconectar WhatsApp" })
      .isVisible({ timeout: 15_000 })
      .catch(() => false);

    if (!hasReconnectBtn) {
      test.skip(); // sem agente — estado vazio é válido
      return;
    }

    await agentsPage.clickReconnectWhatsApp();
    await agentsPage.expectReconnectDialogOpen();
    await agentsPage.expectReconnectDialogHasQrOrLoading();

    // Fecha o dialog sem alterar estado do WhatsApp
    await agentsPage.closeDialog();
  });

  test("navegação de volta para dashboard funciona", async ({
    page,
    agentsPage,
  }) => {
    // Usa o link da sidebar para dashboard
    await page
      .locator("a", { hasText: "Dashboard" })
      .or(page.locator('[href="/dashboard"]'))
      .first()
      .click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });
});
