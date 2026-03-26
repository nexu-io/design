#!/usr/bin/env node
/**
 * HTML ↔ React pixel-parity checker
 *
 * Compares computed styles between the static HTML prototype and the React app
 * to surface visual inconsistencies automatically.
 *
 * Usage:
 *   node scripts/check-pixel-parity.mjs [--html URL] [--react URL] [--page PAGE]
 *
 * Pages: skills (default), workspace, auth, channels
 */

import { chromium } from 'playwright';

const DEFAULTS = {
  html: 'http://localhost:5178/nexu-product.html',
  react: 'http://localhost:5178',
  page: 'skills',
};

const STYLE_PROPS = [
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'color', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius',
  'boxShadow',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'width', 'maxWidth', 'minWidth', 'height', 'gap',
  'opacity',
  'borderRightColor', 'borderRightWidth', 'borderBottomColor', 'borderBottomWidth',
];

/* ─── Page configurations ─── */

async function clickNthButton(page, n) {
  await page.evaluate((idx) => {
    const btns = document.querySelectorAll('div.space-y-0\\.5 button');
    if (btns[idx]) btns[idx].click();
  }, n);
  await page.waitForTimeout(600);
}

async function expandSidebar(page) {
  const isCollapsed = await page.evaluate(() => {
    const sidebar = document.querySelector('div.shrink-0.border-r');
    return sidebar && sidebar.offsetWidth < 100;
  });
  if (isCollapsed) {
    await page.evaluate(() => {
      const expandBtn = document.querySelector('button[title="Expand sidebar"]');
      if (expandBtn) expandBtn.click();
    });
    await page.waitForTimeout(400);
  }
}

const PAGE_MAP = {
  skills: {
    htmlSetup: async (page) => {
      await page.evaluate(() => { if (typeof showPage === 'function') showPage('skills'); });
      await page.waitForTimeout(600);
    },
    reactUrl: '/openclaw/workspace',
    reactSetup: async (page) => {
      await expandSidebar(page);
      await clickNthButton(page, 2);
    },
    pairs: [
      {
        name: 'page-title',
        description: 'Skills page heading',
        html: { eval: `document.querySelector('#page-skills h1')` },
        react: { eval: `document.querySelector('h1, h2')` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'lineHeight', 'letterSpacing'],
      },
      {
        name: 'page-subtitle',
        description: 'Description text under title',
        html: { eval: `document.querySelector('#page-skills .ws-main p, #page-skills .content-area p')` },
        react: { eval: `(() => { const h = document.querySelector('h1, h2'); return h && h.closest('div')?.parentElement?.querySelector('p'); })()` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'lineHeight'],
      },
      {
        name: 'search-input',
        description: 'Search input field',
        html: { eval: `document.querySelector('#page-skills input')` },
        react: { eval: `document.querySelector('input[placeholder*="搜索"], input[placeholder*="Skills"], input[placeholder*="Search"]')` },
      },
      {
        name: 'skill-card',
        description: 'First skill card',
        html: { eval: `document.querySelector('#page-skills .skill-card, .skill-card')` },
        react: { eval: `document.querySelector('div[class*="rounded-2xl"][class*="border"][class*="p-4"]')` },
        onlyProps: ['backgroundColor', 'borderColor', 'borderRadius', 'boxShadow', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
      },
      {
        name: 'skill-icon',
        description: 'Skill card icon container',
        html: { eval: `document.querySelector('#page-skills .skill-icon, .skill-icon')` },
        react: { eval: `document.querySelector('div[class*="rounded-xl"][class*="flex"][class*="items-center"][class*="justify-center"][class*="mb-"]')` },
        onlyProps: ['width', 'height', 'borderRadius', 'backgroundColor'],
      },
      {
        name: 'skill-name',
        description: 'Skill card name text',
        html: { eval: `document.querySelector('#page-skills .skill-name, .skill-name')` },
        react: { eval: `(() => { const cards = document.querySelectorAll('div[class*="rounded-2xl"]'); for (const c of cards) { const el = c.querySelector('[class*="font-medium"]'); if (el && el.textContent.trim().length > 0 && el.textContent.trim().length < 30) return el; } return null; })()` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'lineHeight'],
      },
      {
        name: 'skill-desc',
        description: 'Skill card description text',
        html: { eval: `document.querySelector('#page-skills .skill-desc, .skill-desc')` },
        react: { eval: `(() => { const cards = document.querySelectorAll('div[class*="rounded-2xl"]'); for (const c of cards) { const els = c.querySelectorAll('p, div'); for (const el of els) { if (el.className.includes('text-text-secondary') || el.className.includes('text-text-tertiary')) return el; } } return null; })()` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'lineHeight'],
      },
      {
        name: 'category-chip',
        description: 'First inactive category tag',
        html: { eval: `document.querySelector('#page-skills #skillTagFilter .tag:not(.tag-brand)')` },
        react: { eval: `(() => { const btns = document.querySelectorAll('button[class*="rounded-full"]'); for (const b of btns) { if (b.className.includes('bg-neutral-100')) return b; } return null; })()` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'borderColor', 'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'backgroundColor'],
      },
      {
        name: 'main-max-width',
        description: 'Main content area max-width',
        html: { eval: `document.querySelector('#page-skills [style*="max-width:960px"], #page-skills .content-area > div')` },
        react: { eval: `document.querySelector('div[class*="max-w-"][class*="960"]')` },
        onlyProps: ['maxWidth', 'paddingLeft', 'paddingRight'],
      },
    ],
  },

  workspace: {
    htmlSetup: async (page) => {
      await page.evaluate(() => { if (typeof showPage === 'function') showPage('workspace'); });
      await page.waitForTimeout(600);
    },
    reactUrl: '/openclaw/workspace',
    reactSetup: async (page) => {
      await expandSidebar(page);
    },
    pairs: [
      {
        name: 'sidebar-width',
        description: 'Sidebar container width',
        html: { eval: `document.querySelector('.ws-sidebar')` },
        react: { eval: `document.querySelector('div.shrink-0.border-r')` },
        onlyProps: ['width', 'backgroundColor'],
      },
      {
        name: 'sidebar-logo',
        description: 'Sidebar logo image height',
        html: { eval: `document.querySelector('.ws-sidebar img[src*="logo"]')` },
        react: { eval: `document.querySelector('img[alt="nexu"][src*="black4"]')` },
        onlyProps: ['height'],
      },
      {
        name: 'sidebar-border-right',
        description: 'Sidebar right border color',
        html: { eval: `document.querySelector('.ws-sidebar')` },
        react: { eval: `document.querySelector('div.shrink-0.border-r')` },
        onlyProps: ['borderRightColor', 'borderRightWidth'],
      },
      {
        name: 'nav-item-active',
        description: 'Active nav item text style',
        html: { eval: `document.querySelector('.ws-sidebar-item.active, .ws-sidebar-item:first-child')` },
        react: { eval: `(() => { const btns = document.querySelectorAll('button[class*="rounded-lg"]'); for (const b of btns) { if (b.className.includes('font-medium') && b.textContent.trim().length > 0 && b.textContent.trim().length < 20) return b; } return null; })()` },
        onlyProps: ['fontSize', 'fontWeight', 'color'],
      },
      {
        name: 'nav-section-label',
        description: 'Section label (NAVIGATION)',
        html: { eval: `document.querySelector('.ws-sidebar-section')` },
        react: { eval: `(() => { const els = document.querySelectorAll('div[class*="uppercase"]'); for (const el of els) { if (el.textContent.trim() === 'Navigation') return el; } return null; })()` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'letterSpacing'],
      },
    ],
  },

  auth: {
    htmlSetup: async (page) => {
      await page.evaluate(() => { if (typeof showPage === 'function') showPage('auth'); });
      await page.waitForTimeout(600);
    },
    reactUrl: '/openclaw/auth',
    pairs: [
      {
        name: 'auth-title',
        description: 'Auth form heading',
        html: { eval: `document.querySelector('#page-auth h2')` },
        react: { eval: `document.querySelector('h2, h1')` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'lineHeight'],
      },
      {
        name: 'auth-logo',
        description: 'Logo in dark panel',
        html: { eval: `document.querySelector('#page-auth img[src*="logo"]')` },
        react: { eval: `document.querySelector('img[src*="logo-white"]')` },
        onlyProps: ['height'],
      },
      {
        name: 'auth-input',
        description: 'Email input field',
        html: { eval: `document.querySelector('#page-auth .input, #page-auth input')` },
        react: { eval: `document.querySelector('input[type="email"], input[type="text"]')` },
        onlyProps: ['fontSize', 'borderColor', 'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'backgroundColor'],
      },
      {
        name: 'auth-submit',
        description: 'Primary submit button',
        html: { eval: `document.querySelector('#page-auth .btn-primary')` },
        react: { eval: `document.querySelector('button[type="submit"], form button')` },
        onlyProps: ['fontSize', 'fontWeight', 'color', 'backgroundColor', 'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
      },
    ],
  },

  channels: {
    htmlSetup: async (page) => {
      await page.evaluate(() => { if (typeof showPage === 'function') showPage('channels'); });
      await page.waitForTimeout(600);
    },
    reactUrl: '/openclaw/channels',
    pairs: [
      {
        name: 'page-heading',
        description: 'Channels page heading',
        html: { eval: `document.querySelector('#page-channels h2')` },
        react: { eval: `document.querySelector('h2, h1, [class*="text-\\\\[20px\\\\]"]')` },
        onlyProps: ['fontSize', 'fontWeight', 'color'],
      },
      {
        name: 'platform-card',
        description: 'First platform/channel card',
        html: { eval: `document.querySelector('.platform-card')` },
        react: { eval: `document.querySelector('div[class*="rounded-"][class*="border"][class*="bg-surface"]')` },
        onlyProps: ['backgroundColor', 'borderColor', 'borderRadius', 'boxShadow', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
      },
    ],
  },
};

/* ─── Core logic ─── */

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULTS };
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const val = args[i + 1];
    if (key && val && key in config) config[key] = val;
  }
  return config;
}

function normalizeColor(val) {
  if (!val) return val;
  return val.replace(/\s+/g, '').toLowerCase();
}

function normalizePx(val) {
  if (!val) return val;
  return val.replace(/(\d+\.\d+)px/g, (_, n) => `${Math.round(parseFloat(n))}px`);
}

function normalizeValue(prop, val) {
  if (!val || val === 'none' || val === 'auto') return val;
  let v = val;
  if (['color', 'backgroundColor', 'borderColor'].includes(prop)) {
    v = normalizeColor(v);
  }
  v = normalizePx(v);
  return v;
}

async function extractStylesFromEval(page, evalStr, props) {
  return page.evaluate(
    ({ code, props }) => {
      try {
        const el = eval(code);
        if (!el) return null;
        const cs = getComputedStyle(el);
        const styles = {};
        for (const p of props) styles[p] = cs[p] || '';
        return {
          tagName: el.tagName.toLowerCase(),
          className: (el.className?.toString() || '').slice(0, 120),
          textContent: (el.textContent?.trim() || '').slice(0, 60),
          rect: el.getBoundingClientRect().toJSON(),
          styles,
        };
      } catch (e) {
        return null;
      }
    },
    { code: evalStr, props },
  );
}

function compareStyles(htmlData, reactData, pair) {
  const diffs = [];
  if (!htmlData) {
    diffs.push({ property: '*', issue: 'HTML not found', severity: 'major' });
    return diffs;
  }
  if (!reactData) {
    diffs.push({ property: '*', issue: 'React not found', severity: 'major' });
    return diffs;
  }

  const checkProps = pair.onlyProps || STYLE_PROPS;

  for (const prop of checkProps) {
    const hv = normalizeValue(prop, htmlData.styles[prop]);
    const rv = normalizeValue(prop, reactData.styles[prop]);
    if (hv === rv) continue;
    if (!hv && !rv) continue;
    if (hv === 'none' && !rv) continue;
    if (!hv && rv === 'none') continue;

    const sev = classifySeverity(prop, hv, rv);
    if (sev === 'skip') continue;

    diffs.push({ property: prop, html: hv, react: rv, severity: sev });
  }

  if (!pair.onlyProps || pair.onlyProps.includes('width') || pair.onlyProps.includes('height')) {
    const wd = Math.abs((htmlData.rect?.width || 0) - (reactData.rect?.width || 0));
    if (wd > 4 && (!pair.onlyProps || pair.onlyProps.includes('width'))) {
      diffs.push({ property: 'bounding-width', html: `${Math.round(htmlData.rect.width)}px`, react: `${Math.round(reactData.rect.width)}px`, severity: wd > 16 ? 'major' : 'minor' });
    }
    const hd = Math.abs((htmlData.rect?.height || 0) - (reactData.rect?.height || 0));
    if (hd > 4 && (!pair.onlyProps || pair.onlyProps.includes('height'))) {
      diffs.push({ property: 'bounding-height', html: `${Math.round(htmlData.rect.height)}px`, react: `${Math.round(reactData.rect.height)}px`, severity: hd > 16 ? 'major' : 'minor' });
    }
  }

  return diffs;
}

function classifySeverity(prop, hv, rv) {
  const hNum = parseFloat(hv);
  const rNum = parseFloat(rv);

  if (prop === 'fontWeight') {
    if (!isNaN(hNum) && !isNaN(rNum) && Math.abs(hNum - rNum) >= 100) return 'major';
    return 'skip';
  }

  if (prop === 'fontSize' || prop === 'lineHeight') {
    if (!isNaN(hNum) && !isNaN(rNum)) {
      const d = Math.abs(hNum - rNum);
      if (d <= 1) return 'skip';
      if (d <= 2) return 'minor';
      return 'major';
    }
  }

  if (prop === 'letterSpacing') {
    if ((hv === 'normal' && rv === '0px') || (hv === '0px' && rv === 'normal')) return 'skip';
  }

  if (['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap'].includes(prop)) {
    if (!isNaN(hNum) && !isNaN(rNum)) {
      const d = Math.abs(hNum - rNum);
      if (d <= 1) return 'skip';
      if (d <= 4) return 'minor';
      return 'major';
    }
  }

  if (prop === 'borderRadius') {
    if (!isNaN(hNum) && !isNaN(rNum)) {
      if (hNum >= 99 && rNum >= 99) return 'skip';
      const d = Math.abs(hNum - rNum);
      if (d <= 2) return 'skip';
      if (d <= 4) return 'minor';
      return 'major';
    }
  }

  if (prop === 'opacity') {
    if (!isNaN(hNum) && !isNaN(rNum) && Math.abs(hNum - rNum) < 0.05) return 'skip';
  }

  if (['color', 'backgroundColor', 'borderColor'].includes(prop)) {
    if (colorsClose(hv, rv)) return 'skip';
    return 'major';
  }

  if (prop === 'boxShadow') {
    const hNone = !hv || hv === 'none';
    const rNone = !rv || rv === 'none';
    if (hNone && rNone) return 'skip';
    if (hNone !== rNone) return 'major';
    return 'minor';
  }

  if (['width', 'maxWidth', 'minWidth', 'height'].includes(prop)) {
    if (hv === rv) return 'skip';
    if ((hv === 'auto' || hv === 'none') && (rv === 'auto' || rv === 'none')) return 'skip';
    if (!isNaN(hNum) && !isNaN(rNum)) {
      const d = Math.abs(hNum - rNum);
      if (d <= 2) return 'skip';
      if (d <= 8) return 'minor';
      return 'major';
    }
  }

  return 'major';
}

function colorsClose(a, b) {
  const parse = (s) => {
    const m = s.match(/rgba?\((\d+),(\d+),(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  };
  const ra = parse(a);
  const rb = parse(b);
  if (ra && rb) return Math.abs(ra[0] - rb[0]) + Math.abs(ra[1] - rb[1]) + Math.abs(ra[2] - rb[2]) <= 15;
  return false;
}

function icon(sev) {
  return sev === 'major' ? '🔴' : '🟡';
}

/* ─── Main ─── */

async function main() {
  const config = parseArgs();
  const pageCfg = PAGE_MAP[config.page];

  if (!pageCfg) {
    console.error(`Unknown page: ${config.page}. Available: ${Object.keys(PAGE_MAP).join(', ')}`);
    process.exit(1);
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   HTML ↔ React Pixel-Parity Checker                ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  Page:    ${config.page}`);
  console.log(`  HTML:    ${config.html}`);
  console.log(`  React:   ${config.react}${pageCfg.reactUrl}`);
  console.log(`  Checks:  ${pageCfg.pairs.length} element pairs`);
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let exitCode = 0;

  try {
    const htmlPage = await context.newPage();
    const reactPage = await context.newPage();

    process.stdout.write('  Loading HTML prototype... ');
    await htmlPage.goto(config.html, { waitUntil: 'networkidle', timeout: 15000 });
    await pageCfg.htmlSetup(htmlPage);
    await htmlPage.waitForTimeout(300);
    console.log('done');

    process.stdout.write('  Loading React app... ');
    await reactPage.goto(`${config.react}${pageCfg.reactUrl}`, { waitUntil: 'networkidle', timeout: 15000 });
    if (pageCfg.reactSetup) await pageCfg.reactSetup(reactPage);
    await reactPage.waitForTimeout(500);
    console.log('done');
    console.log('');

    let totalDiffs = 0;
    let majorCount = 0;
    let passCount = 0;
    let notFound = 0;

    for (const pair of pageCfg.pairs) {
      const htmlData = await extractStylesFromEval(htmlPage, pair.html.eval, pair.onlyProps || STYLE_PROPS);
      const reactData = await extractStylesFromEval(reactPage, pair.react.eval, pair.onlyProps || STYLE_PROPS);

      const diffs = compareStyles(htmlData, reactData, pair);
      const majors = diffs.filter(d => d.severity === 'major');
      const minors = diffs.filter(d => d.severity === 'minor');

      const isNotFound = diffs.some(d => d.issue);
      if (!isNotFound) {
        totalDiffs += diffs.length;
        majorCount += majors.length;
      }

      if (diffs.length === 0 && htmlData && reactData) {
        passCount++;
        console.log(`  ✅ ${pair.name} — ${pair.description}`);
      } else if (isNotFound) {
        notFound++;
        const msg = diffs.find(d => d.issue);
        console.log(`  ⬜ ${pair.name} — ${msg.issue}`);
      } else {
        const sym = majors.length ? '❌' : '⚠️';
        console.log(`  ${sym} ${pair.name} — ${pair.description}`);
        if (htmlData) console.log(`     HTML:  <${htmlData.tagName}> "${htmlData.textContent}"`);
        if (reactData) console.log(`     React: <${reactData.tagName}> "${reactData.textContent}"`);
        for (const d of diffs) {
          console.log(`     ${icon(d.severity)} ${d.property}: ${d.html || '–'} → ${d.react || '–'}`);
        }
      }
    }

    console.log('');
    console.log('  ─────────────────────────────────────────────');
    console.log(`  ✅ Pass: ${passCount}  ❌ Major: ${majorCount}  ⚠️ Minor: ${totalDiffs - majorCount}  ⬜ N/A: ${notFound}`);

    if (majorCount > 0) {
      console.log('');
      console.log('  ⚠️  Major visual diffs — use html-to-react-pixel-perfect skill.');
      exitCode = 1;
    } else if (totalDiffs > 0) {
      console.log('');
      console.log('  Minor diffs only — may be acceptable.');
    } else if (notFound === 0) {
      console.log('');
      console.log('  🎉 Pixel-perfect parity!');
    }
    console.log('');

    await htmlPage.screenshot({ path: `scripts/screenshot-${config.page}-html.png`, fullPage: false });
    await reactPage.screenshot({ path: `scripts/screenshot-${config.page}-react.png`, fullPage: false });
    console.log(`  Screenshots: scripts/screenshot-${config.page}-html.png, scripts/screenshot-${config.page}-react.png`);
    console.log('');
  } catch (err) {
    console.error('  Error:', err.message);
    exitCode = 1;
  } finally {
    await browser.close();
  }

  process.exit(exitCode);
}

main();
