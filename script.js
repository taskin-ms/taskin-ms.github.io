export function matchesResource(resource, { q = '', topic = 'all', format = 'all' } = {}) {
  const text = [resource.title, resource.authors, resource.search, ...(resource.tags || [])].filter(Boolean).join(' ').toLowerCase();
  return (topic === 'all' || resource.topic === topic)
    && (format === 'all' || resource.format === format)
    && q.trim().toLowerCase().split(/\s+/).every(word => text.includes(word));
}

if (typeof document !== 'undefined') {
  const presentation = document.querySelector('[data-presentation]');
  const setPresentation = enabled => {
    document.documentElement.classList.toggle('presentation', enabled);
    presentation?.setAttribute('aria-pressed', String(enabled));
    if (presentation) presentation.querySelector('[data-mode-label]').textContent = enabled ? 'Presentation on' : 'Presentation mode';
  };
  try { setPresentation(localStorage.getItem('hct-presentation') === 'true'); } catch { /* Storage is optional. */ }
  if (presentation) {
    presentation.hidden = false;
    presentation.addEventListener('click', () => {
      const enabled = !document.documentElement.classList.contains('presentation');
      setPresentation(enabled);
      try { localStorage.setItem('hct-presentation', String(enabled)); } catch { /* Mode still works without storage. */ }
    });
  }
  const library = document.querySelector('[data-library]');
  if (library) {
    const form = document.querySelector('[data-library-form]');
    const query = form.elements.q;
    const format = form.elements.format;
    const topicButtons = [...document.querySelectorAll('[data-topic-filter]')];
    const rows = [...library.querySelectorAll('[data-resource]')];
    const sections = [...library.querySelectorAll('[data-library-section]')];
    const status = document.querySelector('[data-results]');
    const empty = document.querySelector('[data-empty]');
    const resetButtons = [...document.querySelectorAll('[data-reset]')];
    let topic = 'all';
    const update = (writeURL = true) => {
      let count = 0;
      for (const row of rows) {
        row.hidden = !matchesResource(row.dataset, { q: query.value, topic, format: format.value });
        if (!row.hidden) count++;
      }
      for (const section of sections) section.hidden = ![...section.querySelectorAll('[data-resource]')].some(row => !row.hidden);
      for (const button of topicButtons) button.setAttribute('aria-pressed', String(button.dataset.topicFilter === topic));
      status.textContent = `${count} ${count === 1 ? 'resource' : 'resources'} ${count === rows.length ? 'available' : `of ${rows.length}`}`;
      empty.hidden = count !== 0;
      resetButtons[0].hidden = !(query.value.trim() || topic !== 'all' || format.value !== 'all');
      if (writeURL) {
        const url = new URL(location.href);
        url.hash = '';
        for (const [key, value] of Object.entries({ q: query.value.trim(), topic, format: format.value })) {
          if (value && value !== 'all') url.searchParams.set(key, value); else url.searchParams.delete(key);
        }
        try { history.replaceState(null, '', url); } catch { /* Filtering remains usable on restricted hosts. */ }
      }
    };
    const readURL = () => {
      const params = new URLSearchParams(location.search);
      query.value = params.get('q') || '';
      topic = topicButtons.some(button => button.dataset.topicFilter === params.get('topic')) ? params.get('topic') : 'all';
      format.value = [...format.options].some(option => option.value === params.get('format')) ? params.get('format') : 'all';
      // Reading-path anchors must remain visible, even after a previous search.
      if (location.hash && library.querySelector(`[id="${CSS.escape(location.hash.slice(1))}"]`)) { query.value = ''; topic = 'all'; format.value = 'all'; }
      update(false);
    };
    form.hidden = false;
    document.querySelector('[data-topic-controls]').hidden = false;
    form.addEventListener('submit', event => { event.preventDefault(); update(); });
    query.addEventListener('input', () => update());
    format.addEventListener('change', () => update());
    topicButtons.forEach(button => button.addEventListener('click', () => { topic = button.dataset.topicFilter; update(); }));
    resetButtons.forEach(button => button.addEventListener('click', () => { query.value = ''; topic = 'all'; format.value = 'all'; update(); query.focus(); }));
    addEventListener('popstate', readURL);
    addEventListener('hashchange', () => { readURL(); document.getElementById(location.hash.slice(1))?.scrollIntoView(); });
    readURL();
  }
}
﻿
