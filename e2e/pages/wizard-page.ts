import { type Page, expect } from "@playwright/test";

export type Tone = "Formal" | "Amigável" | "Técnico" | "Persuasivo";

export class WizardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/wizard/step-1");
    await this.page.waitForLoadState("networkidle");
  }

  async continue() {
    await this.page
      .locator("button", { hasText: "Continuar" })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async back() {
    await this.page.locator("button", { hasText: "Voltar" }).click();
    await this.page.waitForLoadState("networkidle");
  }

  // ── Step 1 ────────────────────────────────────────────────────────────────
  async fillStep1(
    companyName: string,
    segment: string,
    openTime = "08:00",
    closeTime = "18:00"
  ) {
    await expect(this.page).toHaveURL(/wizard\/step-1/, { timeout: 10_000 });

    // Nome da empresa (placeholder "Ex: Clínica São Lucas")
    await this.page.locator('input[placeholder*="Clínica"]').fill(companyName);

    // Segmento (Select do Radix UI)
    await this.page
      .locator('[role="combobox"]')
      .first()
      .click();
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: segment })
      .click();

    // Horário abertura
    const selects = this.page.locator('[role="combobox"]');
    await selects.nth(1).click();
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: openTime })
      .click();

    // Horário fechamento
    await selects.nth(2).click();
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: closeTime })
      .click();

    await this.continue();
  }

  // ── Step 2 ────────────────────────────────────────────────────────────────
  async fillStep2(
    products: string,
    priceRange: string,
    differentiator = ""
  ) {
    await expect(this.page).toHaveURL(/wizard\/step-2/, { timeout: 10_000 });

    await this.page
      .locator("textarea")
      .first()
      .fill(products);

    await this.page
      .locator('[role="combobox"]')
      .first()
      .click();
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: priceRange })
      .click();

    if (differentiator) {
      const textareas = this.page.locator("textarea");
      const count = await textareas.count();
      if (count > 1) {
        await textareas.nth(1).fill(differentiator);
      }
    }

    await this.continue();
  }

  // ── Step 3 ────────────────────────────────────────────────────────────────
  async fillStep3(tone: Tone, agentName: string) {
    await expect(this.page).toHaveURL(/wizard\/step-3/, { timeout: 10_000 });

    // Clica no card do tom de voz (pelo texto do label)
    await this.page
      .locator("button", { hasText: tone })
      .first()
      .click();

    // Nome do agente (placeholder "Ex: Lucas")
    const nameInput = this.page.locator('input[placeholder*="Lucas"]');
    await nameInput.clear();
    await nameInput.fill(agentName);

    await this.continue();
  }

  // ── Step 4 ────────────────────────────────────────────────────────────────
  async fillStep4(objectives: string[], leadAction: string) {
    await expect(this.page).toHaveURL(/wizard\/step-4/, { timeout: 10_000 });

    for (const obj of objectives) {
      await this.page
        .locator("button", { hasText: obj })
        .first()
        .click();
    }

    // Ação para lead quente
    await this.page
      .locator("button", { hasText: leadAction })
      .first()
      .click();

    await this.continue();
  }

  // ── Step 5 (opcional) ─────────────────────────────────────────────────────
  async skipStep5() {
    await expect(this.page).toHaveURL(/wizard\/step-5/, { timeout: 10_000 });
    await this.continue();
  }

  async fillStep5(faq = "", restrictions = "", extras = "") {
    await expect(this.page).toHaveURL(/wizard\/step-5/, { timeout: 10_000 });

    const textareas = this.page.locator("textarea");

    if (faq) {
      await this.page.locator("text=FAQ").first().click(); // abre accordion
      await textareas.nth(0).fill(faq);
    }
    if (restrictions) {
      await this.page.locator("text=Restrições").first().click();
      await textareas.nth(1).fill(restrictions);
    }
    if (extras) {
      await this.page.locator("text=Informações").first().click();
      await textareas.nth(2).fill(extras);
    }

    await this.continue();
  }

  // ── Step 6 → Connect ──────────────────────────────────────────────────────
  async submitStep6() {
    await expect(this.page).toHaveURL(/wizard\/step-6/, { timeout: 10_000 });
    // Use selector mais específico: botão verde com texto "Conectar WhatsApp"
    await this.page
      .locator("button.bg-green-500", { hasText: "Conectar WhatsApp" })
      .click();
    // Aguarda sair do step-6 (pode ir para /connect ou /dashboard)
    await this.page.waitForURL(/\/(connect|dashboard)/, { timeout: 20_000 });
  }

  async expectContinueDisabled() {
    await expect(
      this.page.locator("button", { hasText: "Continuar" })
    ).toBeDisabled();
  }
}
