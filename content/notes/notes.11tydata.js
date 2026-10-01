export default {
  layout: 'layouts/note.njk',
  tags: 'notes',
  eyebrow: 'Study note',
  meta: ['Research note'],
  eleventyComputed: {
    page_title: data => data.page_title || data.title.replace(/\n/g,' ') + ' | ' + data.site.name,
    description: data => data.description || data.intro,
    permalink: data => data.draft ? false : '/hct/notes/' + data.page.fileSlug + '.html'
  }
};
