import { test, expect, type Page } from "@playwright/test";
import { percent, type Score } from "../../lib/model";
const next = (p: Page) =>
  p.getByRole("button", { name: "下一题", exact: true });
const start = (p: Page) => p.getByRole("button", { name: "开始决策" });
const answer = (p: Page, i: number) => p.locator(".answers button").nth(i);
async function fits(p: Page) {
  expect(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
}
test("two options: keyboard answers, backtracking, change the winner and restart", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 940 });
  await page.goto("/");
  await expect(page.getByText("演示模式", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /学习与生活/ }).press("Enter");
  await start(page).press("Enter");
  await expect(next(page)).toBeDisabled();
  await answer(page, 0).press("Space");
  await expect(answer(page, 0)).toBeFocused();
  expect(
    await answer(page, 0).evaluate((el) => getComputedStyle(el).outlineStyle),
  ).toBe("solid");
  await next(page).press("Enter");
  await page.getByRole("button", { name: "上一题" }).press("Enter");
  await expect(answer(page, 0)).toHaveAttribute("aria-pressed", "true");
  await next(page).press("Enter");
  await answer(page, 0).click();
  await next(page).click();
  await answer(page, 0).click();
  await page.getByRole("button", { name: "揭晓结果" }).click();
  await expect(page.locator(".winners")).toHaveText("休息一下");
  await page.getByRole("button", { name: "修改答案" }).click();
  await answer(page, 1).click();
  await next(page).click();
  await next(page).click();
  await page.getByRole("button", { name: "揭晓结果" }).click();
  await expect(page.locator(".winners")).toHaveText("继续学习");
  await expect(page.locator(".scorerow strong").first()).toHaveText("66.7%");
  await page.getByRole("button", { name: "重新开始" }).click();
  await expect(page.locator("#prompt")).toHaveValue("");
});
test("four long options on mobile: tie, zero, animation at final frame, replay and skip", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await fits(page);
  await page.locator("#prompt").fill("出发前需要反复考虑的一个问题".repeat(6));
  await page.getByRole("button", { name: "添加选项" }).click();
  await page.getByRole("button", { name: "添加选项" }).click();
  const names = ["甲", "乙", "丙", "丁"].map(
    (letter) => letter + "很长的中文候选选项".repeat(3),
  );
  for (const [i, name] of names.entries())
    await page
      .getByRole("textbox", { name: "选项 " + String.fromCharCode(65 + i) })
      .fill(name);
  await start(page).click();
  await fits(page);
  for (let i = 0; i < 2; i++) {
    await answer(page, i).click();
    await next(page).click();
  }
  await answer(page, 2).click();
  const response = page.waitForResponse((r) =>
    r.url().endsWith("/api/explain"),
  );
  await page.getByRole("button", { name: "揭晓结果" }).click();
  const { rows }: { rows: Score[] } = await (await response).json();
  await expect(page.locator(".winners strong")).toHaveCount(3);
  await fits(page);
  await expect(page.locator(".scorerow strong")).toHaveText([
    "33.3%",
    "33.3%",
    "33.3%",
    "0%",
  ]);
  const film = page.locator(".film");
  await expect(film.getByText("3 项并列推荐", { exact: true })).toBeVisible();
  for (const row of rows) {
    await expect(
      film
        .getByText(row.rank + ". " + row.name, { exact: true })
        .locator("..")
        .getByText(percent(row.index) + "%", { exact: true }),
    ).toBeVisible({ timeout: 10000 });
  }
  await page.getByRole("button", { name: "跳过动画" }).click();
  await expect(film.getByText("揭晓完成")).toBeVisible();
  await page.getByRole("button", { name: "重播动画" }).click();
  await expect(film.getByText("3 项并列推荐", { exact: true })).toBeAttached();
});
test("input validation, accessible guide, and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "使用说明" }).press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "帮我想选项" }).click();
  await expect(page.locator("#prompt")).toBeFocused();
  await expect(page.getByText("请填一下这里")).toHaveCount(1);
  await page.getByRole("button", { name: /晚饭吃什么/ }).click();
  await page.getByRole("textbox", { name: "选项 B" }).fill(" 汤面 ");
  await start(page).click();
  await expect(page.getByText("这个选项已经出现过了")).toBeVisible();
  await page.getByRole("button", { name: /晚饭吃什么/ }).click();
  await start(page).click();
  for (let i = 0; i < 3; i++) {
    await answer(page, 0).click();
    await page
      .getByRole("button", { name: i === 2 ? "揭晓结果" : "下一题" })
      .click();
  }
  await expect(page.locator(".winners strong")).toHaveCount(3);
  await expect(page.locator(".film")).toHaveCount(0);
});

test("prompt-only start produces editable options before quiz; supplement keeps typed choices", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.locator("#prompt").fill("晚饭吃什么？");
  await page.getByRole("button", { name: "帮我想选项" }).press("Enter");
  await expect(start(page)).toBeVisible();
  await expect(page.locator(".idea-note")).toContainText("演示模式");
  await expect(page.locator(".optionrow input")).toHaveCount(3);
  await page.getByRole("textbox", { name: "选项 A" }).fill("自己包饺子");
  await page.getByRole("button", { name: "删除选项 B" }).click();
  await page.getByRole("button", { name: "帮我补充选项" }).click();
  await expect(page.locator(".optionrow input")).toHaveCount(4);
  await expect(page.getByRole("textbox", { name: "选项 A" })).toHaveValue(
    "自己包饺子",
  );
  await fits(page);
  await start(page).press("Enter");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: /自己包饺子/ }).click();
    await page
      .getByRole("button", {
        name: i === 2 ? "揭晓结果" : "下一题",
        exact: true,
      })
      .click();
  }
  await expect(page.locator(".winners")).toHaveText("自己包饺子");
});
