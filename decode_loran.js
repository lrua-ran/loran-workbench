const fs = require('fs');
const b64 = fs.readFileSync('C:/Users/86130/WorkBuddy/2026-08-05-23-10-10/loran_b64.txt', 'utf8').trim();
console.log('Base64 length:', b64.length);
console.log('Length mod 4:', b64.length % 4);

// Add padding if needed
let padded = b64;
while (padded.length % 4 !== 0) padded += '=';

const raw = Buffer.from(padded, 'base64');
const text = raw.toString('utf8');

try {
  const d = JSON.parse(text);
  console.log('Keys:', Object.keys(d));
  console.log('News:', (d.news||[]).length);
  console.log('Todos:', (d.todos||[]).length);
  console.log('English:', (d.english||[]).length);
  console.log('Funds:', (d.funds||[]).length);
  console.log('Books:', (d.books||[]).length);
  console.log('Collect:', (d.collect||[]).length);
  console.log('Poems:', (d.poems||[]).length);
  console.log('Transactions:', (d.transactions||[]).length);
  console.log('Finance:', JSON.stringify(d.finance));

  console.log('\n=== News ===');
  (d.news||[]).forEach(n => {
    console.log('  [' + n.id + '] ' + (n.title||'').substring(0,60));
    console.log('       link: ' + n.link);
    console.log('       source: ' + n.source + '  time: ' + n.time);
  });

  console.log('\n=== Todos ===');
  (d.todos||[]).forEach(t => {
    console.log('  [' + t.id + '] ' + t.text + ' (done=' + t.done + ', created=' + t.created + ')');
  });

  console.log('\n=== English ===');
  (d.english||[]).forEach(e => {
    console.log('  ctx: ' + (e.ctx||'').substring(0,50));
    console.log('  hint: ' + e.hint);
    console.log('  score: ' + e.score + ', userAnswer: "' + (e.userAnswer||'') + '"');
  });

  console.log('\n=== Funds ===');
  (d.funds||[]).forEach(f => {
    console.log('  [' + f.code + '] ' + (f.name||'').substring(0,40));
    console.log('       amt:' + f.amount + ' gain:' + f.gain + ' daily:' + f.daily);
  });

  console.log('\n=== Books ===');
  (d.books||[]).forEach(b => {
    console.log('  "' + b.title + '" by ' + b.author + ' | page ' + b.current + '/' + b.total);
  });

  console.log('\n=== Finance ===');
  console.log('  budget:', d.finance?.budget, 'spent:', d.finance?.spent);

  console.log('\n=== Transactions ===');
  (d.transactions||[]).forEach(t => {
    console.log('  [' + t.cat + '] ' + t.name + ' -' + t.amt + ' (' + t.date + ')');
  });

  console.log('\n=== Collect ===');
  (d.collect||[]).forEach(c => {
    console.log('  [' + c.kindLabel + '] ' + (c.title||'').substring(0,50));
    console.log('       ' + (c.summary||'').substring(0,80));
  });

  console.log('\n=== Poems ===');
  (d.poems||[]).forEach(p => {
    console.log('  ' + (p.t||'').substring(0,30) + ' ... ' + p.s + ' | ' + p.ctx);
  });
} catch(e) {
  console.log('Parse error:', e.message);
  // Show the problematic area
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || 0);
  if (pos > 0) {
    console.log('Text around error:', JSON.stringify(text.substring(pos-20, pos+20)));
  } else {
    console.log('Text[1740:1780]:', JSON.stringify(text.substring(1740, 1780)));
  }
  // Try partial parse
  console.log('\nAttempting partial parse...');
  const newsEnd = text.indexOf('],"english"');
  if (newsEnd > 0) {
    console.log('News section found at:', newsEnd);
    console.log('News text:', text.substring(0, Math.min(newsEnd, 200)));
  }
}
