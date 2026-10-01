async page => {
  const findings = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/hct/', '/hct/notes/rans-les.html']) {
      await page.goto(`http://127.0.0.1:4173${path}`);
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ path: 'artifacts/axe.min.js' });
      const result = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }));
      findings.push({ path, width, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, message: n.failureSummary })) })) });
    }
  }
  console.log(JSON.stringify(findings));
  if (findings.some(f => f.violations.length)) throw new Error(JSON.stringify(findings.filter(f => f.violations.length)));
}
