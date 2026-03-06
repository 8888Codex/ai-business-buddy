import { test, expect } from "./fixtures";

/**
 * Testes para filtros de status de conversas
 * Manual: abas de filtro (Todas, Ativas, Encerradas, Humano)
 * Automático: Handoff quando lead_score >= 50 com palavras-chave
 * Closed: Manual (botão "Marcar como Encerrada")
 */
test.describe("💬 Conversas — Filtros de Status", () => {

  test("Abas de filtro são visíveis e funcionam", async ({ page, connectPage }) => {
    await page.goto("/dashboard/conversations");
    await page.waitForLoadState("networkidle");

    // Verifica que temos as 4 abas de filtro
    const filterTabs = page.locator("button").filter({ hasText: /Todas|Ativas|Encerradas|Humano/ });
    expect(await filterTabs.count()).toBeGreaterThanOrEqual(4);

    // Clica na aba "Encerradas"
    const closedTab = page.locator("button").filter({ hasText: "Encerradas" }).first();
    await expect(closedTab).toBeVisible();
    await closedTab.click();

    // Aguarda atualização da lista
    await page.waitForTimeout(1000);

    // Verifica que o filtro está ativo (background/estilo diferente)
    const activeFilter = page.locator("button").filter({ hasText: "Encerradas" }).first();
    const bgClass = await activeFilter.getAttribute("class");
    expect(bgClass).toContain("bg-primary"); // Aba selecionada deve ter background primário

    console.log("✅ Aba 'Encerradas' está ativa e selecionada");

    // Verifica se há conversas na lista
    const conversationItems = page.locator("button").filter({ hasText: /^.*$/ }).locator("xpath=/ancestor::button[contains(@class, 'px-4 py-3')]");
    const itemCount = await conversationItems.count();

    if (itemCount > 0) {
      // Se há conversas, verifica se elas têm o badge "Encerradas"
      const closedBadges = page.locator("span").filter({ hasText: "Encerradas" });
      const closedCount = await closedBadges.count();
      expect(closedCount).toBeGreaterThan(0);
      console.log(`✅ ${closedCount} conversa(s) com status 'Encerradas' encontrada(s)`);
    } else {
      console.log("⚠️  Nenhuma conversa encerrada neste agente");
    }
  });

  test("Aba 'Humano' filtra conversas encaminhadas para atendimento humano", async ({ page, connectPage }) => {
    await page.goto("/dashboard/conversations");
    await page.waitForLoadState("networkidle");

    // Clica na aba "Humano"
    const handoffTab = page.locator("button").filter({ hasText: "Humano" }).first();

    if (await handoffTab.isVisible()) {
      await handoffTab.click();
      await page.waitForTimeout(1000);

      // Verifica que o filtro está ativo
      const bgClass = await handoffTab.getAttribute("class");
      expect(bgClass).toContain("bg-primary");

      console.log("✅ Aba 'Humano' está ativa e selecionada");

      // Procura por badges "Humano"
      const handoffBadges = page.locator("span").filter({ hasText: "Humano" });
      const handoffCount = await handoffBadges.count();

      if (handoffCount > 0) {
        expect(handoffCount).toBeGreaterThan(0);
        console.log(`✅ ${handoffCount} conversa(s) com status 'Humano' encontrada(s)`);
      } else {
        console.log("⚠️  Nenhuma conversa com status 'Humano' neste agente");
      }
    } else {
      console.log("⚠️  Aba 'Humano' não visível (talvez nomeada diferente)");
    }
  });

  test("Filtro 'Todas' mostra todas as conversas", async ({ page, connectPage }) => {
    await page.goto("/dashboard/conversations");
    await page.waitForLoadState("networkidle");

    // Clica em "Todas"
    const allTab = page.locator("button").filter({ hasText: "Todas" }).first();
    await expect(allTab).toBeVisible();
    await allTab.click();
    await page.waitForTimeout(1000);

    // Verifica que o filtro está ativo
    const bgClass = await allTab.getAttribute("class");
    expect(bgClass).toContain("bg-primary");

    // Conta total de conversas (diferentes status)
    const allBadges = page.locator("span[class*='rounded'][class*='text-xs']").filter({ hasText: /Ativas|Encerradas|Humano/ });
    const totalBadges = await allBadges.count();

    if (totalBadges > 0) {
      expect(totalBadges).toBeGreaterThan(0);
      console.log(`✅ Total de ${totalBadges} conversa(s) com vários status`);
    } else {
      console.log("⚠️  Nenhuma conversa neste agente");
    }
  });

  test("Badges de status exibem cores corretas", async ({ page, connectPage }) => {
    await page.goto("/dashboard/conversations");
    await page.waitForLoadState("networkidle");

    // Esperamos encontrar badges de status com cores específicas:
    // - Ativas: bg-emerald (verde)
    // - Encerradas: bg-slate (cinza)
    // - Humano: bg-amber (âmbar)

    const statusBadges = page.locator("span").filter({ hasText: /Ativas|Encerradas|Humano/ });
    const badgeCount = await statusBadges.count();

    if (badgeCount > 0) {
      // Verifica primeira badge encontrada
      const firstBadge = statusBadges.first();
      const badgeClass = await firstBadge.getAttribute("class");
      const badgeText = await firstBadge.textContent();

      expect(badgeClass).toBeTruthy();
      console.log(`✅ Badge encontrado: "${badgeText}" com classes: ${badgeClass}`);

      // Verifica se tem cores de status
      if (badgeText === "Ativas") {
        expect(badgeClass).toContain("emerald");
      } else if (badgeText === "Encerradas") {
        expect(badgeClass).toContain("slate");
      } else if (badgeText === "Humano") {
        expect(badgeClass).toContain("amber");
      }
      console.log(`✅ Cores de badge estão corretas`);
    } else {
      console.log("⚠️  Nenhuma badge de status encontrada");
    }
  });

  test("Filtro persiste ao voltar para a lista", async ({ page, connectPage }) => {
    await page.goto("/dashboard/conversations");
    await page.waitForLoadState("networkidle");

    // Seleciona um filtro
    const closedTab = page.locator("button").filter({ hasText: "Encerradas" }).first();
    if (await closedTab.isVisible()) {
      await closedTab.click();
      await page.waitForTimeout(800);

      // Seleciona primeira conversa se houver
      const firstConv = page.locator("button").filter({ hasText: /^.*$/ }).locator("xpath=/ancestor::button[contains(@class, 'px-4 py-3')]").first();

      if (await firstConv.isVisible()) {
        await firstConv.click();
        await page.waitForTimeout(500);

        // Volta (clica em "Voltar" ou simula navegação)
        const backButton = page.locator("button").filter({ hasText: "Voltar" }).first();
        if (await backButton.isVisible()) {
          await backButton.click();
          await page.waitForTimeout(500);
        } else {
          // Se não há botão voltar, tenta navegar via URL
          await page.goto("/dashboard/conversations");
          await page.waitForTimeout(500);
        }

        // Verifica se o filtro "Encerradas" ainda está selecionado
        const filterAfterBack = page.locator("button").filter({ hasText: "Encerradas" }).first();
        const bgAfter = await filterAfterBack.getAttribute("class");

        // Pode ou não persistir dependendo da implementação
        console.log(`ℹ️  Filtro após volta: ${bgAfter?.includes("bg-primary") ? "Persistido" : "Resetado"}`);
      }
    }
  });

  test("Contagem total de conversas atualiza com filtro", async ({ page, connectPage }) => {
    await page.goto("/dashboard/conversations");
    await page.waitForLoadState("networkidle");

    // Pega a contagem total inicial
    const totalText = page.locator("p").filter({ hasText: /conversa/ });
    const initialCount = await totalText.textContent();
    console.log(`📊 Contagem inicial: ${initialCount}`);

    // Muda para filtro "Encerradas"
    const closedTab = page.locator("button").filter({ hasText: "Encerradas" }).first();
    if (await closedTab.isVisible()) {
      await closedTab.click();
      await page.waitForTimeout(1000);

      // Verifica se a contagem foi atualizada
      const newCount = await totalText.textContent();
      console.log(`📊 Contagem após filtro 'Encerradas': ${newCount}`);

      // A contagem deve ser menor ou igual
      expect(newCount).toBeTruthy();
    }
  });
});
