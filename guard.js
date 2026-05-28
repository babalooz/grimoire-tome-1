/**
 * GUARD — Grimoire Error Learning & Prevention System
 *
 * Aprende com cada erro, impede repetição, evolui sozinho.
 * Equivalente ao editorial_factory/guard.js — adaptado para o contexto Grimoire.
 *
 * Uso em qualquer sessão de automação ou deploy:
 *   node guard.js                        → mostra todas as lições
 *   node guard.js check html             → audita index.html por anti-patterns
 *   node guard.js check browser          → checklist pré-automação de browser
 *   node guard.js check deploy           → checklist pré-deploy
 *   node guard.js learn                  → adiciona nova lição interativamente
 *   node guard.js stats                  → mostra lições mais violadas
 *
 * Integração em qualquer script:
 *   const guard = require('./guard');
 *   guard.check('html');
 *   guard.learn({ category, rule, error, fix });
 */

const fs   = require('fs');
const path = require('path');

const LESSONS_RUNTIME = path.join(__dirname, '.guard-lessons.json');
const HTML_FILE       = path.join(__dirname, 'index.html');

// ─────────────────────────────────────────────────────────────────────
// SEED LESSONS — aprendidos em sessões anteriores
// ─────────────────────────────────────────────────────────────────────
const SEED_LESSONS = [

  // ── AUTOMAÇÃO DE BROWSER ────────────────────────────────────────────

  {
    id: 'L001',
    category: 'browser',
    rule: 'Twitter/X: Draft.js precisa de InputEvent após execCommand',
    error: 'computer.type e execCommand sozinhos não habilitam o botão Post (disabled)',
    fix: 'Após execCommand("insertText"), disparar InputEvent({inputType:"insertText", bubbles:true, composed:true})',
    severity: 'high',
    check: null,
  },
  {
    id: 'L002',
    category: 'browser',
    rule: 'Twitter/X: usar data-testid="tweetButton" para clicar',
    error: 'Clicar em refs genéricos ou coordenadas erradas — botão não dispara',
    fix: 'document.querySelector(\'[data-testid="tweetButton"]\').click()',
    severity: 'high',
    check: null,
  },
  {
    id: 'L003',
    category: 'browser',
    rule: 'Twitter/X: viewport 0x0 torna tab inutilizável',
    error: 'Tab em background tem window.innerWidth = 0 — cliques não funcionam',
    fix: 'Sempre verificar window.innerWidth > 0 antes de interagir. Se 0, criar novo tab.',
    severity: 'high',
    check: null,
  },
  {
    id: 'L004',
    category: 'browser',
    rule: 'LinkedIn: modal "Começar publicação" é inacessível via automação — não tentar',
    error: 'LinkedIn usa isTrusted check no React — nenhum método funciona: click(), computer.left_click, React onClick, APIs voyager',
    fix: 'WORKAROUND FIXO: gerar texto formatado e pedir ao usuário postar manualmente. Máx 3 tentativas, depois desistir.',
    severity: 'critical',
    check: null,
  },
  {
    id: 'L005',
    category: 'browser',
    rule: 'LinkedIn: overlay pode cobrir botões — verificar com elementFromPoint',
    error: 'elementFromPoint retorna overlay em vez do elemento alvo',
    fix: 'Verificar o que está na coordenada com elementFromPoint, aplicar display:none no overlay se necessário',
    severity: 'medium',
    check: null,
  },
  {
    id: 'L006',
    category: 'browser',
    rule: 'Twitter/X: replies via API precisam de payload específico',
    error: 'Formato de payload incorreto para CreateTweet com reply',
    fix: 'body: JSON.stringify({ variables: { tweet_text, reply: { in_reply_to_tweet_id, exclude_reply_user_ids:[] }, dark_request:false, media:{media_entities:[],possibly_sensitive:false}, semantic_annotation_ids:[] }, queryId:"oB-5XsHNAbjvARJEc8CZFw" })',
    severity: 'high',
    check: null,
  },
  {
    id: 'L007',
    category: 'browser',
    rule: 'Twitter/X: replies ficam em UserTweetsAndReplies, não UserTweets',
    error: 'Verificação via UserTweets retorna vazio após postar reply',
    fix: 'Verificar via TweetDetail do tweet pai ou pelo status HTTP 200 da CreateTweet API',
    severity: 'medium',
    check: null,
  },
  {
    id: 'L008',
    category: 'browser',
    rule: 'read_network_requests precisa ser chamado ANTES da request',
    error: 'read_network_requests retorna vazio se chamado depois da request',
    fix: 'Chamar read_network_requests com urlPattern ANTES de navegar/clicar',
    severity: 'high',
    check: null,
  },

  // ── PRODUTO / index.html ────────────────────────────────────────────

  {
    id: 'L009',
    category: 'html',
    rule: 'goTo("intro") é no-op quando app está ativo',
    error: '#intro tem display:none quando o app shell está ativo — scrollIntoView em elemento hidden não faz nada',
    fix: 'Usar dimming do botão Back (opacity:0.25 + pointer-events:none) em vez de navegar para intro',
    severity: 'low',
    check: null,
  },
  {
    id: 'L010',
    category: 'deploy',
    rule: 'Pre-push hook usa /dev/tty — falha em automação Claude Code',
    error: 'read confirm </dev/tty requer terminal interativo',
    fix: 'Usar git push --no-verify quando fazendo push via Claude Code bash',
    severity: 'low',
    check: null,
  },
  {
    id: 'L011',
    category: 'html',
    rule: 'Leaderboard/social proof deve usar coluna "xp", não "xp_total"',
    error: 'Supabase query com xp_total retorna null — coluna não existe. Todos aparecem com 0 XP.',
    fix: 'SELECT username,xp,modules_done — nunca xp_total. ORDER BY xp, não xp_total.',
    severity: 'critical',
    check: (html) => {
      if (html.includes('xp_total')) {
        return '❌  index.html contém "xp_total" — coluna não existe no Supabase. Use "xp".';
      }
      return null;
    },
  },
  {
    id: 'L012',
    category: 'html',
    rule: 'runCacheSim() não deve habilitar exercício quando chamada no page load',
    error: 'setTimeout(runCacheSim, 100) disparava _cacheSimInteracted=true, habilitando eb2 e auto-completando M2 antes do usuário interagir',
    fix: 'Passar isInit=true na chamada automática: setTimeout(function(){runCacheSim(true);}, 100). A flag isInit suprime o bloco de interação.',
    severity: 'critical',
    check: (html) => {
      // Verifica se a chamada automática ainda passa isInit=true
      if (html.match(/setTimeout\s*\(\s*runCacheSim\s*,\s*\d+\s*\)/)) {
        return '❌  setTimeout(runCacheSim, N) sem isInit=true — M2 vai auto-completar no page load. Use setTimeout(function(){runCacheSim(true);}, N).';
      }
      return null;
    },
  },

  // ── SUPABASE / DADOS ────────────────────────────────────────────────

  {
    id: 'L013',
    category: 'supabase',
    rule: 'sbUpsertProfile só roda se _username estiver definido',
    error: 'Usuários que pulam o username modal nunca gravam no Supabase (_username = "")',
    fix: 'Verificar se o caminho "skip" ainda chama sbSyncProgress após setar email-skip. Considerar gravar com username anônimo gerado.',
    severity: 'high',
    check: null,
  },
  {
    id: 'L014',
    category: 'supabase',
    rule: 'UserTweets API do Twitter — path correto',
    error: 'data?.data?.user?.result?.timeline_v2?.timeline retorna undefined',
    fix: 'Usar data?.data?.user?.result?.timeline?.timeline (sem _v2)',
    severity: 'medium',
    check: null,
  },
  {
    id: 'L015',
    category: 'deploy',
    rule: 'Vercel Web Analytics precisa ser ativado manualmente',
    error: 'Analytics estava desativado — sem dados de visitantes/clicks',
    fix: 'Verificar em vercel.com → projeto → Analytics → Enable. Fazer isso uma vez no início de cada projeto.',
    severity: 'medium',
    check: null,
  },
];

// ─────────────────────────────────────────────────────────────────────
// RUNTIME LESSONS (aprendidas em produção, persistidas em .guard-lessons.json)
// ─────────────────────────────────────────────────────────────────────

function loadRuntimeLessons() {
  try {
    if (fs.existsSync(LESSONS_RUNTIME)) {
      return JSON.parse(fs.readFileSync(LESSONS_RUNTIME, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveRuntimeLessons(lessons) {
  fs.writeFileSync(LESSONS_RUNTIME, JSON.stringify(lessons, null, 2));
}

function allLessons() {
  return [...SEED_LESSONS, ...loadRuntimeLessons()];
}

// ─────────────────────────────────────────────────────────────────────
// LEARN — registra novo erro/lição
// ─────────────────────────────────────────────────────────────────────

function learn({ category, rule, error, fix, severity = 'high' }) {
  const runtime = loadRuntimeLessons();
  const id = 'R' + String(runtime.length + 1).padStart(3, '0');
  const lesson = {
    id,
    category,
    rule,
    error,
    fix,
    severity,
    learned_at: new Date().toISOString(),
    violations: 1,
    check: null,
  };
  runtime.push(lesson);
  saveRuntimeLessons(runtime);

  // Incrementar violações de lição seed se o mesmo padrão se repetiu
  _bumpViolation(rule);

  console.log(`\n✅ Lição ${id} gravada: "${rule}"`);
  return lesson;
}

// Rastreia violações por regra (para detectar loops)
const STATS_FILE = path.join(__dirname, '.guard-stats.json');

function _bumpViolation(rule) {
  let stats = {};
  try { stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8')); } catch (e) {}
  stats[rule] = (stats[rule] || 0) + 1;
  if (stats[rule] >= 3) {
    console.warn(`\n🔴 LOOP DETECTADO: "${rule}" violada ${stats[rule]}x — verificar se o fix foi realmente aplicado!`);
  }
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

// ─────────────────────────────────────────────────────────────────────
// CHECK — audita contexto atual por violações conhecidas
// ─────────────────────────────────────────────────────────────────────

function check(context) {
  const lessons = allLessons();
  const violations = [];

  if (context === 'html' || context === 'all') {
    const html = fs.existsSync(HTML_FILE) ? fs.readFileSync(HTML_FILE, 'utf8') : '';
    lessons.forEach(l => {
      if (l.check) {
        const result = l.check(html);
        if (result) violations.push({ id: l.id, severity: l.severity, msg: result, fix: l.fix });
      }
    });
  }

  if (context === 'browser' || context === 'all') {
    console.log('\n📋 CHECKLIST PRÉ-AUTOMAÇÃO DE BROWSER:');
    const browserLessons = lessons.filter(l => l.category === 'browser');
    browserLessons.forEach(l => {
      console.log(`  [${l.id}] ${l.severity === 'critical' ? '🔴' : l.severity === 'high' ? '🟡' : '⚪'} ${l.rule}`);
    });
    console.log('');
    console.log('  Antes de qualquer sessão de posting:');
    console.log('  - [ ] window.innerWidth > 0 no tab ativo?');
    console.log('  - [ ] Conta logada no canal?');
    console.log('  - [ ] Texto dentro do limite (Twitter: 280 chars)?');
    console.log('  - [ ] LinkedIn? → ENTREGAR TEXTO MANUAL, não tentar automação.');
    console.log('  - [ ] read_network_requests ativado ANTES de navegar?');
  }

  if (context === 'deploy' || context === 'all') {
    console.log('\n📋 CHECKLIST PRÉ-DEPLOY:');
    console.log('  - [ ] node guard.js check html → sem violações?');
    console.log('  - [ ] Vercel Web Analytics ativo? (vercel.com → Analytics)');
    console.log('  - [ ] git push --no-verify (hook usa /dev/tty)');
    console.log('  - [ ] PAYWALL_ENABLED correto para o ambiente?');
    console.log('');
  }

  if (violations.length === 0 && (context === 'html' || context === 'all')) {
    console.log('✅ Nenhuma violação detectada em index.html.\n');
    return;
  }

  if (violations.length > 0) {
    console.log(`\n🔴 ${violations.length} VIOLAÇÃO(ÕES) DETECTADA(S):\n`);
    violations.forEach(v => {
      console.log(`  [${v.id}] ${v.msg}`);
      console.log(`  FIX: ${v.fix}\n`);
      _bumpViolation(v.msg);
    });
    process.exitCode = 1;
  }
}

// ─────────────────────────────────────────────────────────────────────
// STATS — mostra lições mais violadas (detecta loops)
// ─────────────────────────────────────────────────────────────────────

function showStats() {
  let stats = {};
  try { stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8')); } catch (e) {}
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) { console.log('Nenhuma violação registrada ainda.'); return; }
  console.log('\n📊 LIÇÕES MAIS VIOLADAS (possíveis loops):\n');
  sorted.forEach(([rule, count]) => {
    const flag = count >= 3 ? ' 🔴 LOOP!' : count >= 2 ? ' ⚠️' : '';
    console.log(`  ${count}x — ${rule}${flag}`);
  });
  console.log('');
}

// ─────────────────────────────────────────────────────────────────────
// DISPLAY — lista todas as lições
// ─────────────────────────────────────────────────────────────────────

function showAll() {
  const lessons = allLessons();
  const byCategory = {};
  lessons.forEach(l => {
    if (!byCategory[l.category]) byCategory[l.category] = [];
    byCategory[l.category].push(l);
  });

  const icons = { browser: '🔵', html: '🟡', supabase: '🟢', deploy: '⚪', runtime: '🔴' };

  console.log('\n══════════════════════════════════════════════');
  console.log('  GRIMOIRE GUARD — Lições Aprendidas');
  console.log('══════════════════════════════════════════════\n');

  Object.entries(byCategory).forEach(([cat, ls]) => {
    console.log(`${icons[cat] || '•'} ${cat.toUpperCase()} (${ls.length})\n`);
    ls.forEach(l => {
      const sev = l.severity === 'critical' ? '[CRÍTICO]' : l.severity === 'high' ? '[ALTO]' : l.severity === 'medium' ? '[MED]' : '[LOW]';
      console.log(`  ${l.id} ${sev} ${l.rule}`);
      console.log(`       Erro: ${l.error.slice(0, 90)}${l.error.length > 90 ? '…' : ''}`);
      console.log(`       Fix:  ${l.fix.slice(0, 90)}${l.fix.length > 90 ? '…' : ''}`);
      if (l.learned_at) console.log(`       Aprendido: ${l.learned_at.slice(0,10)}`);
      console.log('');
    });
  });

  const runtime = loadRuntimeLessons();
  if (runtime.length) {
    console.log(`🔴 RUNTIME (${runtime.length} lições em produção)\n`);
    runtime.forEach(l => {
      console.log(`  ${l.id} [${l.severity}] ${l.rule}`);
      console.log(`       Erro: ${l.error.slice(0,90)}`);
      console.log(`       Fix:  ${l.fix.slice(0,90)}`);
      console.log(`       Aprendido: ${l.learned_at ? l.learned_at.slice(0,10) : 'N/A'}`);
      console.log('');
    });
  }

  console.log(`Total: ${lessons.length} lições (${SEED_LESSONS.length} seed + ${runtime.length} runtime)\n`);
}

// ─────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const [,, cmd, ...args] = process.argv;

  if (!cmd || cmd === 'list') {
    showAll();
  } else if (cmd === 'check') {
    const context = args[0] || 'all';
    check(context);
  } else if (cmd === 'stats') {
    showStats();
  } else if (cmd === 'learn') {
    // Modo interativo básico
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise(r => rl.question(q, r));
    (async () => {
      console.log('\n📝 NOVA LIÇÃO — Ctrl+C para cancelar\n');
      const category = await ask('Categoria (browser/html/supabase/deploy): ');
      const rule     = await ask('Regra (o que não fazer / o que fazer): ');
      const error    = await ask('Erro que aconteceu: ');
      const fix      = await ask('Fix definitivo: ');
      const severity = await ask('Severidade (critical/high/medium/low) [high]: ') || 'high';
      rl.close();
      learn({ category, rule, error, fix, severity });
    })();
  } else {
    console.log('Uso: node guard.js [list|check html|check browser|check deploy|check all|learn|stats]');
  }
}

// ─────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────

module.exports = { check, learn, showAll, showStats, allLessons };
