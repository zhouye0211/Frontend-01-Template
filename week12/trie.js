class Trie {
  constructor() {
    this.root = Object.create(null);
  }

  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node[c]) {
        node[c] = Object.create(null);
      }
      node = node[c];
    }
    if (!('$' in node)) {
      node['$'] = 0;
    }
    node['$']++;
  }
}

function randomWord(length) {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 3 + 'a'.charCodeAt());
  }
  return s;
}

const trie = new Trie();
for (let i = 0; i < 100; i++) {
  trie.insert(randomWord(10));
}