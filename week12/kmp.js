function KMP(source, pattern) {
  const table = createSearchTable(pattern);
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (source[i] === pattern[j]) {
      j++;
    } else {
      let k = j;
      while (k !== 0 && source[i] !== pattern[table[k]]) {
        k = table[k];
      }
      console.log(i, j, k);
      i = i - j + k;
      j = k;
    }

    if (j === pattern.length) {
      return true;
    }
  }

  return false;
}

function createSearchTable(target) {
  const table = [0];
  let k = 0;
  for (let i = 1; i < target.length; i++) {
    if (target[i] === target[k]) {
      k++;
    } else {
      k = 0;
    }
    table[i] = k;
  }
  return table;
}