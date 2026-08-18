#!/usr/bin/env node
// Marketing OS engine. Zero dependencies.
//
// Product-neutral by construction (Constitution Article 9): every product fact
// is read from products/<slug>/, and nothing about 时令食谱 appears in this file.
//
// Usage:
//   node lib/mos.mjs validate    <slug> [campaign_id]
//   node lib/mos.mjs judge       <campaign_id>
//   node lib/mos.mjs build       <campaign_id>
//   node lib/mos.mjs report      <campaign_id>
//   node lib/mos.mjs dryrun      <slug> <campaign_id>
//   node lib/mos.mjs new-product <slug>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseYaml } from './yaml-lite.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const readYaml = f => parseYaml(fs.readFileSync(f, 'utf8'));
const exists = f => fs.existsSync(f);
const writeOut = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

const RUBRIC = [
  { key: 'revenue_potential', weight: 0.30 },
  { key: 'evidence',          weight: 0.25 },
  { key: 'cost',              weight: 0.15 },
  { key: 'speed_to_learn',    weight: 0.10 },
  { key: 'reversibility',     weight: 0.10 },
  { key: 'brand_risk',        weight: 0.10 },
];

const log = [];
const say = (...a) => { const s = a.join(' '); log.push(s); console.log(s); };

// ---------------------------------------------------------------- validate
function validate(slug, campaignId) {
  const findings = [];
  const fail = (code, msg) => findings.push({ level: 'FAIL', code, msg });
  const warn = (code, msg) => findings.push({ level: 'WARN', code, msg });
  const pass = (code, msg) => findings.push({ level: 'PASS', code, msg });

  // --- product config
  const pdir = p('products', slug);
  for (const f of ['product.yaml', 'brand.yaml', 'channels.yaml']) {
    if (!exists(path.join(pdir, f))) fail('CFG-01', `missing products/${slug}/${f}`);
  }
  if (findings.some(f => f.level === 'FAIL')) return { findings, ok: false };

  const product = readYaml(path.join(pdir, 'product.yaml'));
  const brand = readYaml(path.join(pdir, 'brand.yaml'));
  const channels = readYaml(path.join(pdir, 'channels.yaml'));
  pass('CFG-01', `product config loaded for "${slug}"`);

  if (product.north_star) pass('CON-01', `north star declared: ${product.north_star}`);
  else fail('CON-01', 'product.yaml declares no north_star (Article 1)');

  // --- phase gate (Article 11)
  const live = (channels.channels || []).filter(c => c.connected === true);
  if (channels.phase === 1 && live.length) {
    fail('CON-11', `phase 1 but ${live.length} channel(s) marked connected:true — live publishing is blocked`);
  } else {
    pass('CON-11', `phase ${channels.phase} gate holds: ${(channels.channels || []).length} channel(s), 0 connected`);
  }

  // --- unverified but load-bearing facts
  const assumed = [];
  const walk = (o, trail) => {
    if (!o || typeof o !== 'object') return;
    if (typeof o.status === 'string' && !/^(confirmed|resolved|active)/.test(o.status)) assumed.push(`${trail} (${o.status})`);
    for (const [k, v] of Object.entries(o)) if (v && typeof v === 'object') walk(v, trail ? `${trail}.${k}` : k);
  };
  walk(product, '');
  if (assumed.length) warn('EVI-01', `${assumed.length} product fact(s) not confirmed: ${assumed.slice(0, 6).join(', ')}${assumed.length > 6 ? ' …' : ''}`);

  if (!campaignId) return { findings, ok: !findings.some(f => f.level === 'FAIL'), product, brand, channels };

  // --- campaign
  const cdir = p('campaigns', campaignId);
  if (!exists(path.join(cdir, 'campaign.yaml'))) { fail('CMP-01', `missing campaigns/${campaignId}/campaign.yaml`); return { findings, ok: false }; }
  const camp = readYaml(path.join(cdir, 'campaign.yaml'));
  pass('CMP-01', `campaign ${campaignId} loaded`);

  // Article 4 — traceability
  const required = ['campaign_id', 'hypothesis', 'primary_metric', 'success_threshold', 'kill_threshold', 'decision_date', 'parent_experiment'];
  for (const k of required) {
    if (camp[k] === undefined || camp[k] === null || camp[k] === '') fail('CON-04', `campaign missing required field: ${k} (Article 4)`);
  }
  if (!findings.some(f => f.code === 'CON-04')) pass('CON-04', 'all Article 4 traceability fields present');

  // Article 3 — banned metrics
  const banned = readJson(p('rules', 'banned-metrics.json'));
  const pm = String(camp.primary_metric || '').toLowerCase().trim();
  // Match on whole tokens, never on bare substrings. "er" inside "paid_conversions"
  // is not an engagement-rate metric, and a matcher that thinks so is worse than none.
  const hits = (name, list) => list.some(m => name === m ||
    new RegExp(`(^|[^a-z0-9])${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`).test(name));
  const tiers = { 1: banned.tier_1_metrics, 2: banned.tier_2_metrics, 3: banned.tier_3_metrics };
  const tier = Object.entries(tiers).find(([, list]) => hits(pm, list));
  if (tier) {
    pass('CON-03', `primary_metric "${camp.primary_metric}" is Tier ${tier[0]} — allowed`);
  } else if (hits(pm, banned.banned_as_primary_metric)) {
    fail('CON-03', `primary_metric "${camp.primary_metric}" is a banned vanity metric (Article 3)`);
  } else {
    warn('CON-03', `primary_metric "${camp.primary_metric}" is not in the Tier 1-3 registry; confirm it is not a vanity metric`);
  }
  const li = camp.leading_indicators || [];
  if (li.length && !camp.primary_metric) fail('CON-03', 'leading indicators declared with no primary metric');
  else if (li.length) pass('CON-03b', `${li.length} leading indicator(s), each subordinate to the primary metric`);

  // Article 10 — kill discipline
  if (camp.success_threshold && camp.kill_threshold && camp.decision_date) {
    pass('CON-10', `kill discipline set: decide on ${camp.decision_date}`);
  }

  // --- approvals
  const adir = p('outputs', 'approvals');
  let pending = 0;
  if (exists(adir)) {
    for (const f of fs.readdirSync(adir).filter(f => f.includes(campaignId))) {
      const t = fs.readFileSync(path.join(adir, f), 'utf8');
      const m = t.match(/^decision:\s*(\w+)/m);
      const blocking = /^blocking:\s*true/m.test(t);
      if (m && m[1].toUpperCase() === 'PENDING') { pending++; if (blocking) fail('APP-01', `blocking approval PENDING: ${f}`); else warn('APP-01', `non-blocking approval PENDING: ${f}`); }
    }
  }
  if (!pending) pass('APP-01', 'no pending approvals block this campaign');

  // --- content manifest
  const mf = path.join(cdir, 'content', 'manifest.json');
  if (exists(mf)) {
    const man = readJson(mf);
    const ids = man.assets.map(a => a.content_id);
    const dupes = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dupes.length) fail('CNT-01', `duplicate content_id: ${[...new Set(dupes)].join(', ')}`);
    else pass('CNT-01', `${ids.length} assets, all content_ids unique`);

    const byId = Object.fromEntries((channels.channels || []).map(c => [c.id, c]));
    for (const a of man.assets) {
      const ch = byId[a.channel];
      if (!ch) { fail('CNT-02', `${a.content_id}: unknown channel "${a.channel}"`); continue; }
      const limits = [['caption_max_chars', 'caption'], ['title_max_chars', 'title'], ['description_max_chars', 'description'], ['post_max_chars', 'post'], ['body_max_chars', 'body']];
      for (const [lim, field] of limits) {
        if (ch[lim] && a[field] && [...a[field]].length > ch[lim]) {
          fail('CNT-02', `${a.content_id}: ${field} is ${[...a[field]].length} chars, limit ${ch[lim]}`);
        }
      }
      if (!a.hook_family) warn('CNT-03', `${a.content_id}: no hook_family, results will not be diagnosable`);
    }
    if (!findings.some(f => f.code === 'CNT-02')) pass('CNT-02', 'every asset is within its platform limits');

    // brand: banned phrases
    const bp = brand.banned_phrases || [];
    for (const a of man.assets) {
      const blob = JSON.stringify(a).toLowerCase();
      for (const phrase of bp) if (blob.includes(String(phrase).toLowerCase())) fail('BRD-01', `${a.content_id}: contains banned phrase "${phrase}"`);
    }
    if (!findings.some(f => f.code === 'BRD-01')) pass('BRD-01', `no banned phrases (${bp.length} checked) across ${ids.length} assets`);

    // one hypothesis, many surfaces
    const claims = new Set(man.assets.map(a => a.claim_id).filter(Boolean));
    if (claims.size > 1) fail('CNT-04', `assets test ${claims.size} different claims; a campaign must test exactly one (content.md)`);
    else if (claims.size === 1) pass('CNT-04', `all assets test one claim: ${[...claims][0]}`);
  } else {
    warn('CNT-01', 'no content manifest yet');
  }

  return { findings, ok: !findings.some(f => f.level === 'FAIL'), product, brand, channels, campaign: camp };
}

// ------------------------------------------------------------------- judge
function judge(campaignId) {
  const inFile = p('campaigns', campaignId, 'judge-input.json');
  const input = readJson(inFile);
  const scored = input.positions.map(pos => {
    let weighted = 0;
    const cells = RUBRIC.map(r => {
      const s = pos.scores[r.key];
      if (typeof s !== 'number' || s < 0 || s > 10) throw new Error(`${pos.id}: score "${r.key}" must be 0-10, got ${s}`);
      if (!pos.reasoning || !pos.reasoning[r.key]) throw new Error(`${pos.id}: score "${r.key}" has no reasoning — void per judge.md`);
      weighted += s * r.weight;
      return { dimension: r.key, weight: r.weight, score: s, contribution: +(s * r.weight).toFixed(2), reasoning: pos.reasoning[r.key] };
    });
    return { ...pos, cells, weighted: +weighted.toFixed(2) };
  });
  scored.sort((a, b) => b.weighted - a.weighted);
  const out = {
    campaign_id: campaignId,
    rubric: RUBRIC,
    rubric_source: 'rules/constitution.md Article 6',
    generated_by: 'lib/mos.mjs judge',
    ranking: scored.map((s, i) => ({ rank: i + 1, id: s.id, label: s.label, source: s.source, weighted: s.weighted, disqualifiers: s.disqualifiers || [] })),
    positions: scored,
  };
  writeOut(p('campaigns', campaignId, 'judge-scores.json'), JSON.stringify(out, null, 2));
  return out;
}

// ------------------------------------------------------------------- build
function utm(base, { source, medium, campaign, content, term }) {
  const u = new URL(base);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', campaign);
  u.searchParams.set('utm_content', content);
  if (term) u.searchParams.set('utm_term', term);
  return u.toString();
}

function build(campaignId) {
  const camp = readYaml(p('campaigns', campaignId, 'campaign.yaml'));
  const slug = camp.product;
  const channels = readYaml(p('products', slug, 'channels.yaml'));
  const man = readJson(p('campaigns', campaignId, 'content', 'manifest.json'));
  const byId = Object.fromEntries((channels.channels || []).map(c => [c.id, c]));
  const base = channels.tracking.base_url;

  const entries = man.assets.map((a, i) => {
    const ch = byId[a.channel];
    const dest = a.landing_path ? new URL(a.landing_path, base).toString() : base;
    const link = utm(dest, {
      source: ch.utm_source, medium: ch.utm_medium,
      campaign: campaignId, content: a.content_id, term: a.hook_family,
    });
    const attribution = ch.link_in_bio_only
      ? 'DEGRADED — no clickable link on this surface. UTM only works if it is the live bio link while this asset is up.'
      : (ch.id === 'xiaohongshu' ? 'NONE — external links restricted. Measure branded search and direct traffic instead.' : 'CLEAN — link is clickable and carries UTM.');
    return {
      content_id: a.content_id,
      campaign_id: campaignId,
      product: slug,
      channel: a.channel,
      channel_name: ch.name,
      claim_id: a.claim_id,
      hook_family: a.hook_family,
      status: 'queued',
      phase: channels.phase,
      publish_blocked_by: channels.phase === 1 ? 'Constitution Article 11 — Phase 1 is generate-and-queue only. Approval H8 required per channel.' : null,
      destination_url: link,
      attribution_quality: attribution,
      sequence: i + 1,
      payload: a,
      human_action_required: `Post manually on ${ch.name}. Set the bio link to the destination URL above if the channel is bio-link-only.`,
    };
  });

  for (const e of entries) writeOut(p('outputs', 'queue', campaignId, `${e.content_id}.json`), JSON.stringify(e, null, 2));

  // human publish sheet
  const groups = {};
  for (const e of entries) (groups[e.channel_name] ||= []).push(e);
  let md = `# Publish queue — ${campaignId}\n\n`;
  md += `Product: **${slug}**  ·  Phase: **${channels.phase} (generate-and-queue only)**  ·  Assets: **${entries.length}**\n\n`;
  md += `> Nothing here has been published. Nothing here can be published by the OS.\n> Every entry is \`status: queued\` and blocked by Constitution Article 11.\n\n`;
  for (const [name, list] of Object.entries(groups)) {
    md += `## ${name} (${list.length})\n\n| # | content_id | hook family | attribution | destination |\n|---|---|---|---|---|\n`;
    for (const e of list) md += `| ${e.sequence} | \`${e.content_id}\` | ${e.hook_family} | ${e.attribution_quality.split(' —')[0]} | \`${e.destination_url}\` |\n`;
    md += '\n';
  }
  writeOut(p('outputs', 'queue', campaignId, 'queue.md'), md);

  // empty results table, created at launch so results have somewhere to land
  const header = 'content_id,channel,hook_family,claim_id,published_at,clicks,signups,activations,paid_conversions,revenue_usd,notes\n';
  const rows = entries.map(e => `${e.content_id},${e.channel},${e.hook_family},${e.claim_id},,,,,,,\n`).join('');
  writeOut(p('analytics', `${campaignId}-tracking.csv`), header + rows);

  return { entries, channelsUsed: Object.keys(groups).length };
}


// --------------------------------------------------------- score-prospects
// Buyer-fit rubric. Mirrors the founder's stated criteria: does seasonal
// information reduce procurement waste, drive menu decisions, improve margin,
// improve turnover. Executability is scored separately so a perfect-fit
// prospect you cannot reach does not outrank a good-fit prospect you can.
const FIT_RUBRIC = [
  { key: 'waste_reduction', weight: 0.30 },
  { key: 'menu_decision',   weight: 0.25 },
  { key: 'margin',          weight: 0.25 },
  { key: 'turnover',        weight: 0.20 },
];
const EXEC_RUBRIC = [
  { key: 'reachable',       weight: 0.50 },
  { key: 'personalization', weight: 0.50 },
];
const FIT_SHARE = 0.7;

function scoreProspects(campaignId) {
  const dir = p('campaigns', campaignId, 'prospects');
  const pool = readJson(path.join(dir, 'pool.json'));
  const scored = pool.prospects.map(x => {
    const sc = (rubric) => rubric.reduce((acc, r) => {
      const v = x.scores[r.key];
      if (typeof v !== 'number' || v < 0 || v > 3) throw new Error(`${x.id}: "${r.key}" must be 0-3, got ${v}`);
      return acc + v * r.weight;
    }, 0);
    const fit = (sc(FIT_RUBRIC) / 3) * 10;
    const exec = (sc(EXEC_RUBRIC) / 3) * 10;
    const total = fit * FIT_SHARE + exec * (1 - FIT_SHARE);
    return { ...x, fit: +fit.toFixed(2), exec: +exec.toFixed(2), total: +total.toFixed(2) };
  });
  scored.sort((a, b) => b.total - a.total);
  scored.forEach((x, i) => { x.rank = i + 1; x.tier = i < 20 ? 'top20' : 'pool'; });

  const out = { campaign_id: campaignId, generated_by: 'lib/mos.mjs score-prospects',
    fit_rubric: FIT_RUBRIC, exec_rubric: EXEC_RUBRIC, fit_share: FIT_SHARE,
    pool_size: scored.length, top20: scored.slice(0, 20).map(x => ({ rank: x.rank, id: x.id, name: x.name, city: x.city, type: x.business_type, total: x.total, fit: x.fit, exec: x.exec })),
    prospects: scored };
  writeOut(path.join(dir, 'scored.json'), JSON.stringify(out, null, 2));

  let md = `# Prospect pool — ${campaignId}\n\n`;
  md += `Pool: **${scored.length}** verified businesses. Scored on buyer fit (70%) and executability (30%).\n\n`;
  md += `Fit = does seasonal information reduce their produce waste, drive their menu, improve margin, improve turnover.\n`;
  md += `Exec = can we actually reach them, and do we have one true detail to open with.\n\n`;
  md += `## Top 20\n\n| # | Business | City | Type | Total | Fit | Exec |\n|---|---|---|---|---|---|---|\n`;
  for (const x of scored.slice(0, 20)) md += `| ${x.rank} | ${x.name} | ${x.city} | ${x.business_type} | **${x.total}** | ${x.fit} | ${x.exec} |\n`;
  md += `\n## Remainder of pool (${Math.max(0, scored.length - 20)})\n\n| # | Business | City | Total | Why not top 20 |\n|---|---|---|---|---|\n`;
  for (const x of scored.slice(20)) md += `| ${x.rank} | ${x.name} | ${x.city} | ${x.total} | ${x.why_not || '-'} |\n`;
  writeOut(path.join(dir, 'ranked.md'), md);
  return out;
}

// ------------------------------------------------------------- new-product
function newProduct(slug) {
  const dir = p('products', slug);
  if (exists(dir)) throw new Error(`products/${slug} already exists`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'product.yaml'),
`slug: ${slug}
name_native: TODO
url: TODO
verification_status: unverified
identity:
  one_liner:
    value: TODO
    status: unknown
stage:
  lifecycle:
    value: TODO
    status: unknown
monetization:
  current_model:
    value: none confirmed
    status: unknown
constraints:
  cash_budget_usd_phase_1: 0
  can_publish_live: false
north_star: sustainable revenue
primary_metrics_allowed:
  - revenue
  - paid_conversions
  - signups
  - activated_users
open_questions:
  - id: Q1
    question: TODO
    owner: human
`);
  fs.writeFileSync(path.join(dir, 'brand.yaml'),
`slug: ${slug}
positioning:
  statement: TODO
  status: unknown
  change_gate: H7
voice:
  register: TODO
do:
  - TODO
do_not:
  - TODO
banned_phrases:
  - TODO
`);
  fs.writeFileSync(path.join(dir, 'channels.yaml'),
`slug: ${slug}
phase: 1
tracking:
  base_url: TODO
  utm_medium_default: organic_social
channels:
  - id: tiktok
    name: TikTok
    connected: false
    utm_source: tiktok
    utm_medium: organic_social
    caption_max_chars: 2200
    link_in_bio_only: true
`);
  return dir;
}

// ------------------------------------------------------------------ report
function fmtFindings(findings) {
  const icon = { PASS: '✅', WARN: '⚠️ ', FAIL: '❌' };
  return findings.map(f => `${icon[f.level]} ${f.level.padEnd(4)} [${f.code}] ${f.msg}`).join('\n');
}

function dryrun(slug, campaignId) {
  const started = process.env.MOS_RUN_TS || 'unset';
  say(`# Marketing OS — dry run`);
  say(`product=${slug} campaign=${campaignId} run_ts=${started}`);
  say('');
  say('── Stage 1/4 · validate ─────────────────────────────');
  const findingsExtra = [];
  const v = validate(slug, campaignId);
  say(fmtFindings(v.findings));
  const fails = v.findings.filter(f => f.level === 'FAIL');
  say('');
  say('── Stage 2/4 · judge (rubric, Article 6) ────────────');
  // A campaign may inherit its decision from the campaign it supersedes rather
  // than re-running the council. That is legitimate and must not be an error.
  if (exists(p('campaigns', campaignId, 'judge-input.json'))) {
    const j = judge(campaignId);
    for (const r of j.ranking) say(`  #${r.rank}  ${String(r.weighted).padStart(5)}  ${r.id.padEnd(4)} ${r.label}${r.disqualifiers.length ? '  [DQ: ' + r.disqualifiers.join('; ') + ']' : ''}`);
  } else {
    const inherited = v.campaign && (v.campaign.supersedes || v.campaign.inherits_decision_from);
    if (inherited && exists(p('campaigns', inherited, 'judge-scores.json'))) {
      const prev = readJson(p('campaigns', inherited, 'judge-scores.json'));
      say(`  no judge input — decision inherited from ${inherited}`);
      say(`  inherited winner: ${prev.ranking[0].id} (${prev.ranking[0].weighted}) ${prev.ranking[0].label}`);
      say(`  ${prev.ranking.filter(r => r.disqualifiers.length).length} of ${prev.ranking.length} positions carried disqualifiers`);
    } else {
      say('  no judge input and no inherited decision — this campaign has no recorded rationale');
      findingsExtra.push({ level: 'WARN', code: 'JDG-01', msg: 'campaign has neither judge-input.json nor an inherited decision (Article 5)' });
    }
  }
  say('');
  say('── Stage 3/4 · build queue ──────────────────────────');
  const b = build(campaignId);
  say(`  ${b.entries.length} assets queued across ${b.channelsUsed} channels`);
  say(`  all entries status=queued, publish blocked by Article 11`);
  const clean = b.entries.filter(e => e.attribution_quality.startsWith('CLEAN')).length;
  const degraded = b.entries.filter(e => e.attribution_quality.startsWith('DEGRADED')).length;
  const none = b.entries.filter(e => e.attribution_quality.startsWith('NONE')).length;
  say(`  attribution: ${clean} clean / ${degraded} degraded / ${none} none`);
  say('');
  say('── Stage 4/4 · verdict ──────────────────────────────');
  const all = v.findings.concat(findingsExtra);
  say(`  FAIL=${fails.length}  WARN=${all.filter(f => f.level === 'WARN').length}  PASS=${all.filter(f => f.level === 'PASS').length}`);
  say(fails.length ? '  RESULT: BLOCKED — fix the failures above before launch.' : '  RESULT: LAUNCH-READY (pending human publish, Phase 1 gate holds)');
  const out = `\`\`\`\n${log.join('\n')}\n\`\`\`\n`;
  writeOut(p('outputs', `dry-run-${campaignId}.md`), `# Dry run log — ${campaignId}\n\nGenerated by \`node lib/mos.mjs dryrun ${slug} ${campaignId}\`.\n\n${out}`);
  return fails.length ? 1 : 0;
}

// --------------------------------------------------------------------- cli
const [cmd, a1, a2] = process.argv.slice(2);
try {
  switch (cmd) {
    case 'validate': { const v = validate(a1, a2); console.log(fmtFindings(v.findings)); process.exit(v.ok ? 0 : 1); }
    case 'judge': { const j = judge(a1); console.log(JSON.stringify(j.ranking, null, 2)); break; }
    case 'build': { const b = build(a1); console.log(`queued ${b.entries.length} assets`); break; }
    case 'score-prospects': { const r = scoreProspects(a1); console.log(`scored ${r.pool_size} prospects; top 20 written to campaigns/${a1}/prospects/ranked.md`); console.table(r.top20); break; }
    case 'dryrun': process.exit(dryrun(a1, a2));
    case 'new-product': console.log('scaffolded ' + newProduct(a1)); break;
    default:
      console.log('commands: validate <slug> [campaign] | judge <campaign> | score-prospects <campaign> | build <campaign> | dryrun <slug> <campaign> | new-product <slug>');
      process.exit(2);
  }
} catch (e) { console.error('ERROR: ' + e.message); process.exit(1); }
