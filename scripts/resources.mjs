const topics = ['theory','frontier','data','aero','math'];
export function compareResources(a,b) {
  const topicOrder = topics.indexOf(a.topic)-topics.indexOf(b.topic);
  if(topicOrder) return topicOrder;
  if(a.topic === 'frontier') {
    const newestFirst = (Number.parseInt(b.year)||0)-(Number.parseInt(a.year)||0);
    if(newestFirst) return newestFirst;
  }
  if(a.topic === 'theory') {
    const booksFirst = Number(b.format === 'book')-Number(a.format === 'book');
    if(booksFirst) return booksFirst;
  }
  return a.title.localeCompare(b.title,'en') || a.id.localeCompare(b.id,'en');
}
