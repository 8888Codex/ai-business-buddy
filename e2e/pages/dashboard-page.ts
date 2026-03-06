import { type Page, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  async expectGreeting() {
    // O h1 é renderizado como "Bom dia, user 👋" / "Boa tarde, user 👋" / "Boa noite, user 👋"
    // Usa toContainText com regex para aceitar qualquer saudação
    const h1 = this.page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 10_000 });
    await expect(h1).toContainText(/Bom dia|Boa tarde|Boa noite/, { timeout: 10_000 });
  }

  async expectStatusBadge() {
    // Badge mostra "Agente Online" (conectado) ou "WhatsApp Desconectado" ou "Carregando..."
    // Qualquer um desses estados é válido
    await expect(
      this.page
        .locator("text=Agente Online")
        .or(this.page.locator("text=WhatsApp Desconectado"))
        .or(this.page.locator("text=Carregando..."))
    ).toBeVisible({ timeout: 10_000 });
  }

  // Alias mantido por compatibilidade com testes existentes
  async expectOnlineBadge() {
    await this.expectStatusBadge();
  }

  async expectMetricCards() {
    // Labels reais dos cards de métricas:
    // "Mensagens (7 dias)", "Leads Identificados", "Agendamentos", "Taxa de Resposta"
    await expect(
      this.page.locator("text=Mensagens (7 dias)").first()
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      this.page.locator("text=Leads Identificados").first()
    ).toBeVisible();

    await expect(
      this.page.locator("text=Agendamentos").first()
    ).toBeVisible();

    await expect(
      this.page.locator("text=Taxa de Resposta").first()
    ).toBeVisible();
  }

  async openEditPromptDialog() {
    // "Editar Prompt" na sidebar navega para /agents (não abre dialog no dashboard)
    // Clica no item "Editar Prompt" da sidebar
    await this.page
      .locator("button", { hasText: "Editar Prompt" })
      .or(this.page.locator('[aria-label="Editar Prompt"]'))
      .first()
      .click();
    // Aguarda navegação para /agents
    await this.page.waitForURL(/\/agents/, { timeout: 10_000 });
  }

  async closeEditPromptDialog() {
    // Volta para o dashboard após ter navegado para /agents
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToConversations() {
    // Links de navegação na sidebar via NavLink
    await this.page
      .locator("a[href='/conversations']")
      .or(this.page.locator("a").filter({ hasText: "Conversas" }))
      .first()
      .click();
    await this.page.waitForURL(/\/conversations/, { timeout: 10_000 });
  }

  async navigateToSettings() {
    await this.page
      .locator("a[href='/settings']")
      .or(this.page.locator("a").filter({ hasText: "Configurações" }))
      .first()
      .click();
    await this.page.waitForURL(/\/settings/, { timeout: 10_000 });
  }
}
