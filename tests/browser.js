async page => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const base = page.url().startsWith('https://taskin-ms.github.io/') ? 'https://taskin-ms.github.io' : 'http://127.0.0.1:4173';
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const path of ['/', '/hct/', '/hct/notes/rans-les.html']) {
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({width, height:1000});
      await page.goto(`${base}${path}`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(async img => { img.loading = 'eager'; await img.decode(); })));
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} overflows at ${width}px`);
      check(await page.locator('h1').count() === 1 && await page.locator('h1').isVisible(), `${path} needs one visible main heading`);
      check(await page.evaluate(() => [...document.images].every(img => img.complete && img.naturalWidth)), 'Broken image');
      if (path === '/hct/') {
        check(await page.locator('.guide-section').count() === 6, 'Exactly six major sections');
        check(await page.locator('.guide-sources').count() === 6, 'Sources appear in each section');
        check(await page.locator('#section-03 figure').count() === 3 && await page.locator('#section-04 figure').count() === 1, 'Three canonical visuals and one scaling figure');
        check(await page.locator('figure img:not([alt]), figure img[alt=""]').count() === 0, 'Figures need informative alternatives');
        check(await page.locator('figure figcaption').count() === 4, 'Each figure has a caption');
        check(await page.locator('[data-resource], [data-library-form], [data-presentation], .flow-figure').count() === 0, 'No catalog controls or decorative diagram');
        check(await page.locator('.guide-contents a').count() === 6, 'Six section anchors');
        check(await page.locator('.guide-body math').count() >= 14, 'Math must render');
        check(await page.locator('script[src]:not([src*="/.11ty/"])').count() === 0, 'Guide should not load browser JavaScript (the local preview injects its reload client)');
        if ([1440,390].includes(width)) await page.screenshot({path:`artifacts/guide-${width}.png`, fullPage:true});
      }
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${base}/hct/`);
  await page.keyboard.press('Tab');
  check(await page.evaluate(() => document.activeElement.classList.contains('skip-link')), 'Skip link is first keyboard stop');
  await page.keyboard.press('Enter');
  check(new URL(page.url()).hash === '#main', 'Skip link reaches content');
  await page.locator('.guide-contents a').nth(5).click();
  check(new URL(page.url()).hash === '#section-06', 'Dataset navigation reaches Section 06');
  await page.locator('.guide-notes a').first().click();
  check(page.url().includes('/hct/notes/rans-les.html'), 'Retained derivation is discoverable');
  await page.getByRole('link', {name:'Back to the fieldbook'}).click();
  check(new URL(page.url()).hash === '#section-02', 'Derivation returns to closure');
  const noScript = await page.context().browser().newContext({javaScriptEnabled:false, viewport:{width:390,height:844}});
  const fallback = await noScript.newPage();
  await fallback.goto(`${base}/hct/`);
  check(await fallback.locator('.guide-section').count() === 6 && await fallback.locator('math').count() >= 14, 'Guide and math work without JavaScript');
  await noScript.close();
  await page.emulateMedia({media:'print'});
  check(!(await page.locator('.guide-contents').isVisible()), 'Hide navigation in print');
  for (const sources of await page.locator('.guide-sources').all()) check(await sources.isVisible(), 'Local Sources remain printable');
  await page.pdf({path:'artifacts/hct-field-guide.pdf', format:'A4', printBackground:true});
  await page.emulateMedia({media:'screen'});
  check(errors.length === 0, errors.join(', '));
  console.log('Browser checks passed: six sections, figures, local Sources, desktop/mobile, math, keyboard, anchors, derivation links, no-JS, and print.');
  return {passed:true, widths:[1440,768,390,320], sections:6, figures:4, localSources:6, pageErrors:errors};
}
