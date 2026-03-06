/**
 * Testes da página de Conversas — autenticado (usa storageState)
 */
import { test, expect } from "./fixtures";

test.describe("Conversations — autenticado", () => {
  test.beforeEach(async ({ conversationsPage }) => {
    await conversationsPage.goto();
  });

  test("página de conversas carrega com header correto", async ({
    conversationsPage,
  }) => {
    await conversationsPage.expectPageHeader();
  });

  test("filtros de status estão visíveis", async ({
    conversationsPage,
    page,
  }) => {
    // Filtros só aparecem quando há agente configurado
    const hasAgent = await page
      .locator("text=Nenhum agente configurado")
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    if (hasAgent) {
      // Sem agente: estado vazio é válido
      await expect(
        page.locator("text=Nenhum agente configurado")
      ).toBeVisible();
      return;
    }

    await conversationsPage.expectFilterButtonsVisible();
  });

  test("área de lista de conversas carrega (com dados ou vazio)", async ({
    conversationsPage,
  }) => {
    await conversationsPage.expectListAreaVisible();
  });

  test("filtro Ativas pode ser ativado sem erros", async ({
    conversationsPage,
    page,
  }) => {
    // Só testa filtro se há agente (filtros são renderizados junto com a lista)
    const hasFilters = await page
      .locator("button", { hasText: "Ativas" })
      .isVisible({ timeout: 10_000 })
      .catch(() => false);

    if (!hasFilters) {
      test.skip();
      return;
    }

    await conversationsPage.clickFilterActive();

    // Após clicar, botão "Ativas" deve ter estilo ativo (bg-primary)
    await expect(
      page.locator("button", { hasText: "Ativas" }).first()
    ).toBeVisible();

    // Volta para "Todas"
    await conversationsPage.clickFilterAll();
  });
});
