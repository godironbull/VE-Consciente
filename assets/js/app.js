// ================================================
// VE CONSCIENTE — Campo Mourão
// Lógica Principal da Aplicação
// ================================================

const DB_KEY = 've_consciente_db';

// ── Utilitários de banco (localStorage) ──────────────────────────────────────

export function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : { condutores: {}, nextSeq: 1 };
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function saveCondutor(condutor) {
  const db = getDB();
  db.condutores[condutor.id] = condutor;
  saveDB(db);
}

export function getCondutor(id) {
  const db = getDB();
  return db.condutores[id] || null;
}

export function getAllCondutores() {
  const db = getDB();
  return Object.values(db.condutores);
}

export function countCondutores() {
  return Object.keys(getDB().condutores).length;
}

export function generateId() {
  const db = getDB();
  const seq = String(db.nextSeq).padStart(5, '0');
  db.nextSeq++;
  saveDB(db);
  return `CMO-${new Date().getFullYear()}-${seq}`;
}

// ── Dados de sessão (etapas) ──────────────────────────────────────────────────

const SESSION_KEY = 've_session';

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function updateSession(data) {
  const session = getSession();
  const updated = { ...session, ...data };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Toast notifications ───────────────────────────────────────────────────────

export function showToast(msg, type = 'info', duration = 3500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Validação de campos ───────────────────────────────────────────────────────

export function validateField(input, rules = {}) {
  const val = input.value.trim();
  let error = '';

  if (rules.required && !val) error = 'Este campo é obrigatório.';
  else if (rules.minLength && val.length < rules.minLength)
    error = `Mínimo ${rules.minLength} caracteres.`;
  else if (rules.cpf && !validarCPF(val))
    error = 'CPF inválido. Digite apenas os números.';
  else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    error = 'E-mail inválido.';

  const errEl = input.closest('.form-group')?.querySelector('.field-error');
  if (errEl) errEl.textContent = error;
  input.classList.toggle('error', !!error);
  return !error;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  if (rem !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  return rem === parseInt(cpf[10]);
}

// ── Formatar CPF enquanto digita ──────────────────────────────────────────────

export function maskCPF(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
  });
}

export function maskPhone(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
    input.value = v;
  });
}

// ── Barra de progresso ────────────────────────────────────────────────────────

export function renderProgressBar(activeStep) {
  const container = document.getElementById('progress-nav');
  if (!container) return;

  const steps = [
    { n: 1, label: 'Cadastro', page: 'cadastro.html' },
    { n: 2, label: 'Tutorial',  page: 'tutorial.html' },
    { n: 3, label: 'Regras',    page: 'regras.html' },
    { n: 4, label: 'QR Code',   page: 'certificado.html' },
  ];

  const session = getSession();
  const maxDone = session.maxStep || 0;

  let html = '<div class="progress-nav-inner">';
  steps.forEach((step, idx) => {
    const isDone = step.n < activeStep;
    const isActive = step.n === activeStep;
    const circleClass = isDone ? 'done' : isActive ? 'active' : '';
    const labelClass = isDone ? 'done' : isActive ? 'active' : '';
    const icon = isDone ? '✓' : step.n;

    html += `
      <div class="step-item">
        <div class="step-circle ${circleClass}">${icon}</div>
        <span class="step-label ${labelClass}">${step.label}</span>
      </div>`;

    if (idx < steps.length - 1) {
      html += `<div class="step-line ${isDone ? 'done' : ''}"></div>`;
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

// ── Header padrão ─────────────────────────────────────────────────────────────

export function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
    <div class="header-inner">
      <div class="header-logos">
        <div class="logo-badge">
          <span class="icon">🏛️</span>
          <span>Prefeitura de<br>Campo Mourão</span>
        </div>
        <div class="logo-divider"></div>
        <div class="logo-badge">
          <span class="icon">🚔</span>
          <span>DETRAN-PR</span>
        </div>
      </div>
      <div class="header-title">
        <h1>🛴 VE Consciente</h1>
        <p>Programa de Conscientização para Veículos Elétricos</p>
      </div>
      <nav class="header-nav">
        <a href="index.html" class="nav-btn">🏠 Início</a>
        <a href="detran.html" class="nav-btn detran">🔍 DETRAN</a>
      </nav>
    </div>
  `;
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <p>
      <strong>VE Consciente Campo Mourão</strong> — 
      Iniciativa da Prefeitura Municipal em parceria com o DETRAN-PR<br>
      <span style="font-size:0.75rem; opacity:0.6;">
        Este é um programa educativo sem fins lucrativos. 
        Conduzir com segurança é um dever de todos.
      </span>
    </p>
  `;
}
