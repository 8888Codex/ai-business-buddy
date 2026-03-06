/**
 * Testes do dashboard — autenticado (usa storageState)
 */
import { test, expect } from "./fixtures";

test.describe("Dashboard — autenticado", () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test("dashboard carrega com saudação e badge de status", async ({
    dashboardPage,
  }) => {
    await dashboardPage.expectGreeting();
    await dashboardPage.expectStatusBadge();
  });

  test("cards de métricas estão visíveis", async ({ dashboardPage }) => {
    await dashboardPage.expectMetricCards();
  });

  test("botão Editar Prompt da sidebar navega para /agents", async ({
    page,
    dashboardPage,
  }) => {
    await dashboardPage.openEditPromptDialog();
    await expect(page).toHaveURL(/\/agents/);
    // Volta para dashboard para não afetar outros testes
    await page.goto("/dashboard");
  });

  test("navegação lateral para Conversas funciona", async ({
    page,
    dashboardPage,
  }) => {
    await dashboardPage.navigateToConversations();
    await expect(page).toHaveURL(/\/conversations/);
  });

  test("navegação lateral para Configurações funciona", async ({
    page,
    dashboardPage,
  }) => {
    await dashboardPage.navigateToSettings();
    await expect(page).toHaveURL(/\/settings/);
  });
});
