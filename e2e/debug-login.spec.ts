import { test, expect } from "@playwright/test";

test.describe("🔍 Debug - Login Flow", () => {
  test.use({ baseURL: "https://funcionario.cognitaai.com.br" });

  test("Diagnóstico completo do login", async ({ page }) => {
    console.log("\n=== DIAGNÓSTICO DE LOGIN ===\n");

    // 1. Navegue para /auth
    console.log("1️⃣ Navegando para /auth...");
    await page.goto("/auth");
    console.log("   ✅ URL após goto:", page.url());

    // 2. Aguarde networkidle
    console.log("\n2️⃣ Aguardando networkidle...");
    await page.waitForLoadState("networkidle");
    console.log("   ✅ Rede inativa");

    // 3. Procure pelo botão "Entrar"
    console.log("\n3️⃣ Procurando botão 'Entrar'...");
    const enterBtn = page.locator("button").filter({ hasText: "Entrar" }).first();
    const isVisible = await enterBtn.isVisible();
    console.log(`   ${isVisible ? "✅" : "❌"} Botão visível:`, isVisible);

    if (isVisible) {
      await enterBtn.click();
      console.log("   ✅ Clicado");
      await page.waitForTimeout(500);
    }

    // 4. Procure pelos inputs de email
    console.log("\n4️⃣ Procurando input de email...");
    const emailInputs = await page.locator('input[type="email"]').count();
    console.log(`   📊 Total de inputs email: ${emailInputs}`);

    const emailInput = page.locator('input[type="email"]').last();
    await emailInput.fill("test@cognita-e2e.com");
    console.log("   ✅ Email preenchido");

    // 5. Procure pelos inputs de password
    console.log("\n5️⃣ Procurando input de password...");
    const passwordInputs = await page.locator('input[type="password"]').count();
    console.log(`   📊 Total de inputs password: ${passwordInputs}`);

    const passwordInput = page.locator('input[type="password"]').last();
    await passwordInput.fill("TestE2E2026@");
    console.log("   ✅ Senha preenchida");

    // 6. Procure pelo botão submit
    console.log("\n6️⃣ Procurando botão submit...");
    const submitBtns = await page.locator('button[type="submit"]').count();
    console.log(`   📊 Total de botões submit: ${submitBtns}`);

    const submitBtn = page.locator('button[type="submit"]').last();
    await submitBtn.click();
    console.log("   ✅ Botão submit clicado");

    // 7. Aguarde redirecionamento
    console.log("\n7️⃣ Aguardando redirecionamento (5s)...");
    try {
      await page.waitForURL(/\/dashboard/, { timeout: 5_000 });
      console.log("   ✅ Redirecionado para /dashboard");
    } catch (err) {
      console.log("   ⏱️ Timeout em 5s");
      console.log("   📍 URL atual:", page.url());

      // Aguarde mais para ver se redireciona
      console.log("\n8️⃣ Aguardando mais 5s...");
      await page.waitForTimeout(5_000);
      console.log("   📍 URL após 5s extra:", page.url());

      // Verifique se há redirecionamento ativo
      if (page.url().includes("/dashboard")) {
        console.log("   ✅ FINALMENTE redirecionado!");
      } else if (page.url().includes("/auth")) {
        console.log("   ❌ Ainda em /auth");
        console.log("   🔍 Verificando resposta do servidor...");

        // Tente verificar o status
        const content = await page.content();
        if (content.includes("erro") || content.includes("error")) {
          console.log("   ⚠️ Há menção a 'erro' na página");
        }
      } else {
        console.log("   ❓ URL inesperada:", page.url());
      }
    }

    // Screenshot final
    await page.screenshot({
      path: "/tmp/debug-login-final.png",
      fullPage: true,
    });
    console.log("\n📸 Screenshot em /tmp/debug-login-final.png");
  });
});
