// Minimal YAML subset parser. Zero dependencies, on purpose.
//
// Supports exactly what the product config files in this repo use:
//   maps, nested maps, lists of scalars, lists of maps, quoted and bare
//   scalars, numbers, booleans, null, full-line and trailing comments.
//
// Deliberately NOT supported: anchors, aliases, block scalars, flow
// collections, multi-document files, tabs. If a config file ever needs one of
// those, the config file is doing too much.

function stripComment(s) {
  let inS = false, inD = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD && (i === 0 || /\s/.test(s[i - 1]))) {
      return s.slice(0, i);
    }
  }
  return s;
}

function scalar(raw) {
  const s = raw.trim();
  if (s === '') return null;
  if ((s.startsWith('"') && s.endsWith('"') && s.length > 1) ||
      (s.startsWith("'") && s.endsWith("'") && s.length > 1)) {
    return s.slice(1, -1);
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function tokenize(text) {
  const out = [];
  text.split('\n').forEach((line, n) => {
    if (line.includes('\t')) throw new Error(`yaml-lite: tab on line ${n + 1}; use spaces`);
    const noComment = stripComment(line);
    if (noComment.trim() === '') return;
    out.push({ indent: noComment.length - noComment.trimStart().length, raw: noComment.trimEnd(), line: n + 1 });
  });
  return out;
}

function parseBlock(toks, i, indent) {
  if (i >= toks.length) return [null, i];
  if (toks[i].raw.trimStart().startsWith('- ') || toks[i].raw.trim() === '-') {
    return parseList(toks, i, indent);
  }
  return parseMap(toks, i, indent);
}

function parseList(toks, i, indent) {
  const arr = [];
  while (i < toks.length && toks[i].indent === indent) {
    const body = toks[i].raw.trimStart();
    if (!body.startsWith('- ') && body !== '-') break;
    const inline = body === '-' ? '' : body.slice(2).trim();
    const childIndent = indent + 2;
    if (inline === '') {
      const [v, ni] = parseBlock(toks, i + 1, toks[i + 1] ? toks[i + 1].indent : childIndent);
      arr.push(v); i = ni;
    } else if (/^[A-Za-z0-9_$.-]+:(\s|$)/.test(inline)) {
      // list item that is itself a map: synthesise its first line at child indent
      const virtual = [{ indent: childIndent, raw: ' '.repeat(childIndent) + inline, line: toks[i].line }];
      let j = i + 1;
      while (j < toks.length && toks[j].indent > indent) { virtual.push(toks[j]); j++; }
      const [v] = parseMap(virtual, 0, childIndent);
      arr.push(v); i = j;
    } else {
      arr.push(scalar(inline)); i++;
    }
  }
  return [arr, i];
}

function parseMap(toks, i, indent) {
  const obj = {};
  while (i < toks.length && toks[i].indent === indent) {
    const body = toks[i].raw.trimStart();
    if (body.startsWith('- ')) break;
    const m = body.match(/^([^:]+):(?:\s+(.*))?$/);
    if (!m) throw new Error(`yaml-lite: cannot parse line ${toks[i].line}: ${body}`);
    const key = m[1].trim();
    const rest = (m[2] || '').trim();
    if (rest !== '') { obj[key] = scalar(rest); i++; continue; }
    const next = toks[i + 1];
    if (next && next.indent > indent) {
      const [v, ni] = parseBlock(toks, i + 1, next.indent);
      obj[key] = v; i = ni;
    } else if (next && next.indent === indent && next.raw.trimStart().startsWith('- ')) {
      const [v, ni] = parseList(toks, i + 1, indent);
      obj[key] = v; i = ni;
    } else { obj[key] = null; i++; }
  }
  return [obj, i];
}

export function parseYaml(text) {
  const toks = tokenize(text);
  if (!toks.length) return {};
  const [v, end] = parseBlock(toks, 0, toks[0].indent);
  // Fail loudly. Silently dropping the tail of a config file is the worst
  // possible failure for a system that makes decisions from config.
  if (end < toks.length) {
    throw new Error(`yaml-lite: unconsumed content from line ${toks[end].line}: "${toks[end].raw.trim()}" — a key at the same indent as a list is not valid here`);
  }
  return v;
}
