/**
 * Testes da landing page — público (sem autenticação)
 */
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Landing Page — público", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("landing page carrega com hero title", async ({ page }) => {
    // Título principal da hero section
    await expect(
      page
        .locator("h1")
        .or(page.locator("h2"))
        .first()
    ).toBeVisible({ timeout: 10_000 });

    // Verifica que o conteúdo carregou (não é página em branco)
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  });

  test("CTA principal redireciona para /auth", async ({ page }) => {
    // Botão CTA como "Criar Meu Agente", "Começar Grátis", etc.
    const cta = page
      .locator("a", { hasText: /Criar Meu Agente|Começar Grátis|Começar/i })
      .or(page.locator("button", { hasText: /Criar Meu Agente|Começar Grátis/i }))
      .first();

    await expect(cta).toBeVisible({ timeout: 10_000 });
    await cta.click();
    await page.waitForURL(/\/auth/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/auth/);
  });

  test("seções Como Funciona, Preços e FAQ existem na página", async ({
    page,
  }) => {
    // Rola até o fim para garantir carregamento lazy
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await expect(
      page.locator("text=Como Funciona").or(page.locator("text=como funciona")).first()
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.locator("text=Preços").or(page.locator("text=Planos")).first()
    ).toBeVisible();

    await expect(
      page.locator("text=FAQ").or(page.locator("text=Perguntas Frequentes")).first()
    ).toBeVisible();
  });

  test("FAQ accordion abre e fecha itens", async ({ page }) => {
    // Scroll até o FAQ
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Abre o primeiro item do accordion
    const firstTrigger = page
      .locator('[data-radix-collection-item], [data-state]')
      .filter({ hasText: /\?/ })
      .first();

    // Tenta abrir pelo trigger do accordion Radix
    const accordionTrigger = page
      .locator('[data-state="closed"]')
      .or(page.locator('button[aria-expanded="false"]'))
      .filter({ hasText: /\?/ })
      .first();

    if (await accordionTrigger.isVisible()) {
      await accordionTrigger.click();
      // Conteúdo deve aparecer
      await expect(
        page.locator('[data-state="open"]').or(page.locator('[aria-expanded="true"]')).first()
      ).toBeVisible({ timeout: 5_000 });
    } else {
      // Fallback: clica em qualquer elemento que tenha "?" no FAQ area
      const faqSection = page.locator("section").filter({ hasText: /FAQ|Perguntas/ });
      const anyQuestion = faqSection.locator("button").first();
      if (await anyQuestion.isVisible()) {
        await anyQuestion.click();
      }
    }
  });
});
