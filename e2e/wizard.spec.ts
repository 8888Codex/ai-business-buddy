/**
 * Testes do wizard — autenticado (usa storageState)
 */
import { test, expect } from "./fixtures";

test.describe("Wizard — autenticado", () => {
  test("wizard completo: preenche 6 steps e chega na tela de conexão", async ({
    page,
    wizardPage,
    connectPage,
  }) => {
    await wizardPage.goto();

    // Step 1 — dados da empresa
    await wizardPage.fillStep1(
      "Clínica São Lucas",
      "Saúde/Clínicas",
      "08:00",
      "18:00"
    );

    // Step 2 — produtos e preço
    await wizardPage.fillStep2(
      "Consultas médicas, exames laboratoriais e de imagem. Especialidades: clínica geral, pediatria e cardiologia.",
      "R$ 100 - 500"
    );

    // Step 3 — personalidade
    await wizardPage.fillStep3("Amigável", "Sofia");

    // Step 4 — missão
    await wizardPage.fillStep4(["Vender", "Agendar"], "Notificar meu WhatsApp");

    // Step 5 — pular (opcional)
    await wizardPage.skipStep5();

    // Step 6 — revisar prompt e conectar
    // O botão "Conectar WhatsApp" navega para /connect que processa a criação do agente
    await wizardPage.submitStep6();

    // Aceita: /connect (qualquer estado: saving/waiting/error) OU /dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(connect|dashboard)/);

    // Se chegou no connect: verifica que passou do estado "saving"
    if (currentUrl.includes("/connect")) {
      await connectPage.expectConnectScreen();
    }
  });

  test("voltar entre steps funciona corretamente", async ({
    page,
    wizardPage,
  }) => {
    await wizardPage.goto();

    // Preenche step 1 e avança
    await wizardPage.fillStep1("Empresa Teste", "Serviços");

    // Está no step 2
    await expect(page).toHaveURL(/wizard\/step-2/);

    // Volta para step 1
    await wizardPage.back();
    await expect(page).toHaveURL(/wizard\/step-1/);
  });

  test("step 1 sem nome da empresa exibe erro de toast", async ({
    page,
    wizardPage,
  }) => {
    await wizardPage.goto();
    await expect(page).toHaveURL(/wizard\/step-1/, { timeout: 10_000 });

    // Tenta continuar sem preencher o nome
    await page.locator("button", { hasText: "Continuar" }).click();

    // Toast de erro deve aparecer (mensagem: "Informe o nome da empresa")
    await expect(
      page.locator('[data-sonner-toast]').first()
    ).toBeVisible({ timeout: 8_000 });

    // Permanece no step 1
    await expect(page).toHaveURL(/wizard\/step-1/);
  });
});
