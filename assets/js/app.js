/**
 * SS — SUSTENTABILIDADE & SEGURANÇA
 * Módulo Principal: Dados, Autenticação, Proteção LGPD e QR Code
 */

const DB_KEY = 'ss_plataforma_db';
const USER_SESSION_KEY = 'ss_user_session';
const AGENT_SESSION_KEY = 'ss_agent_session';
const ONBOARDING_KEY = 'ss_onboarding_data';

// ── BANCO DE DADOS LOCAL (COM DADOS SEED DE DEMOSTRATIVO) ───────────────────
function initDefaultDB() {
  const now = new Date().toISOString();
  return {
    usuarios: [
      {
        id: 'usr_001',
        nome: 'João da Silva Santos',
        cpf: '123.456.789-00',
        nascimento: '1998-05-14',
        email: 'joao.silva@exemplo.com',
        telefone: '(44) 99887-1122',
        endereco: { cidade: 'Campo Mourão', uf: 'PR', bairro: 'Centro' },
        senha: '123',
        responsavel: null,
        dataCriacao: now
      },
      {
        id: 'usr_002',
        nome: 'Marcos Vinicius de Souza',
        cpf: '987.654.321-99',
        nascimento: '2001-11-20',
        email: 'marcos.souza@exemplo.com',
        telefone: '(44) 99123-4567',
        endereco: { cidade: 'Campo Mourão', uf: 'PR', bairro: 'Jardim Lar Paraná' },
        senha: '123',
        responsavel: null,
        dataCriacao: now
      }
    ],
    veiculos: [
      {
        idSS: 'SS-48291',
        usuarioId: 'usr_001',
        tipo: 'patinete',
        tipoLabel: 'Patinete Elétrico',
        marca: 'Xiaomi',
        modelo: 'Mi Electric Scooter Pro 2',
        cor: 'Preto com detalhes vermelhos',
        chassi: 'SN-XIAO-99812A',
        caracteristicas: 'Adesivo refletor verde no garfo dianteiro',
        status: 'ATIVO', // 'ATIVO' | 'ROUBADO_FURTADO' | 'EM_MANUTENCAO'
        dataCadastro: now,
        detalhesRoubo: null
      },
      {
        idSS: 'SS-A7F29K',
        usuarioId: 'usr_002',
        tipo: 'motocicleta',
        tipoLabel: 'Motocicleta',
        marca: 'Honda',
        modelo: 'CG 160 Start',
        cor: 'Vermelha',
        chassi: '9C2KC1600NR123456',
        caracteristicas: 'Bagageiro traseiro preto reforçado',
        status: 'ROUBADO_FURTADO', // Exemplo demonstrativo de alerta de roubo
        dataCadastro: now,
        detalhesRoubo: {
          dataHora: now,
          localAproximado: 'Av. Irmãos Pereira, Centro, Campo Mourão - PR',
          boletimOcorrencia: 'BO 2026/089421',
          observacoes: 'Subtraído enquanto estacionado próximo à praça central.'
        }
      }
    ],
    certificados: [
      {
        id: 'CERT-SS-001',
        usuarioId: 'usr_001',
        veiculoIdSS: 'SS-48291',
        dataConclusao: now,
        dataValidade: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        scoreQuiz: 5,
        hashValidacao: 'SS-VAL-88274-CMO'
      }
    ],
    agentesAutorizados: [
      { matricula: 'DETRAN-2026', orgao: 'DETRAN-PR', nome: 'Agente Silva', senha: 'detran2026' },
      { matricula: 'PM-190', orgao: 'Polícia Militar', nome: 'Cabo Oliveira', senha: 'pm190' },
      { matricula: 'GM-153', orgao: 'Guarda Municipal', nome: 'Inspetor Carlos', senha: 'guarda2026' },
      { matricula: 'PREF-01', orgao: 'Prefeitura Municipal', nome: 'Fiscal Municipal', senha: 'pref2026' }
    ],
    ocorrenciasAgentes: []
  };
}

export function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const defaultDB = initDefaultDB();
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler DB:', e);
    const defaultDB = initDefaultDB();
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── GERADOR DE IDENTIFICADOR ÚNICO SS ───────────────────────────────────────
export function generateSSId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem 0, O, 1, I para evitar confusão visual
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SS-${code}`;
}

// ── LGPD: CONSULTA PÚBLICA (ESTRITAMENTE SEM DADOS PESSOAIS) ────────────────
export function getPublicVehicleData(idSS) {
  const db = getDB();
  const veiculo = db.veiculos.find(v => v.idSS.toUpperCase() === idSS.toUpperCase());
  if (!veiculo) return null;

  // Retorna APENAS dados do veículo e status de segurança.
  // Protege 100% o nome, CPF, telefone e endereço do proprietário!
  return {
    idSS: veiculo.idSS,
    tipo: veiculo.tipo,
    tipoLabel: veiculo.tipoLabel || veiculo.tipo,
    marca: veiculo.marca,
    modelo: veiculo.modelo,
    cor: veiculo.cor,
    caracteristicas: veiculo.caracteristicas || '',
    status: veiculo.status,
    dataCadastro: veiculo.dataCadastro,
    detalhesRoubo: veiculo.status === 'ROUBADO_FURTADO' ? veiculo.detalhesRoubo : null
  };
}

// ── ÁREA DE AGENTES AUTORIZADOS (DADOS COMPLETOS COM AUDITORIA) ─────────────
export function getAuthorizedVehicleData(idSS) {
  const db = getDB();
  const veiculo = db.veiculos.find(v => v.idSS.toUpperCase() === idSS.toUpperCase());
  if (!veiculo) return null;

  const proprietario = db.usuarios.find(u => u.id === veiculo.usuarioId);
  const certificado = db.certificados.find(c => c.veiculoIdSS === veiculo.idSS);

  return {
    veiculo,
    proprietario: proprietario ? {
      id: proprietario.id,
      nome: proprietario.nome,
      cpf: proprietario.cpf,
      nascimento: proprietario.nascimento,
      telefone: proprietario.telefone,
      email: proprietario.email,
      endereco: proprietario.endereco,
      responsavel: proprietario.responsavel
    } : null,
    certificado: certificado || null
  };
}

// ── SISTEMA DE ALERTA DE ROUBO / FURTO (MEU SS) ─────────────────────────────
export function toggleTheftAlert(idSS, isStolen, alertDetails = null) {
  const db = getDB();
  const vIndex = db.veiculos.findIndex(v => v.idSS === idSS);
  if (vIndex === -1) return false;

  if (isStolen) {
    db.veiculos[vIndex].status = 'ROUBADO_FURTADO';
    db.veiculos[vIndex].detalhesRoubo = {
      dataHora: new Date().toISOString(),
      localAproximado: alertDetails?.local || 'Não informado',
      boletimOcorrencia: alertDetails?.bo || 'Em andamento',
      observacoes: alertDetails?.obs || ''
    };
  } else {
    db.veiculos[vIndex].status = 'ATIVO';
    db.veiculos[vIndex].detalhesRoubo = null;
  }

  saveDB(db);
  return true;
}

// ── AUTENTICAÇÃO DO USUÁRIO ────────────────────────────────────────────────
export function getCurrentUser() {
  const raw = localStorage.getItem(USER_SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    const db = getDB();
    return db.usuarios.find(u => u.id === session.id) || null;
  } catch (e) {
    return null;
  }
}

export function loginUser(identifier, senha) {
  const db = getDB();
  const cleanId = identifier.trim().toLowerCase();
  const cleanCpf = identifier.replace(/\D/g, '');

  const user = db.usuarios.find(u => {
    const uCpf = u.cpf.replace(/\D/g, '');
    return (u.email.toLowerCase() === cleanId || (cleanCpf && uCpf === cleanCpf)) && u.senha === senha;
  });

  if (user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify({ id: user.id, email: user.email }));
    return { success: true, user };
  }
  return { success: false, message: 'E-mail/CPF ou senha incorretos.' };
}

export function logoutUser() {
  localStorage.removeItem(USER_SESSION_KEY);
  window.location.href = 'index.html';
}

// ── AUTENTICAÇÃO DE AGENTES AUTORIZADOS ────────────────────────────────────
export function getCurrentAgent() {
  const raw = localStorage.getItem(AGENT_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function loginAgent(matricula, senha) {
  const db = getDB();
  const agent = db.agentesAutorizados.find(a => 
    a.matricula.toUpperCase() === matricula.trim().toUpperCase() && a.senha === senha
  );

  if (agent) {
    const session = {
      matricula: agent.matricula,
      orgao: agent.orgao,
      nome: agent.nome,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(AGENT_SESSION_KEY, JSON.stringify(session));
    return { success: true, agent: session };
  }
  return { success: false, message: 'Matrícula ou senha institucional incorreta.' };
}

export function logoutAgent() {
  localStorage.removeItem(AGENT_SESSION_KEY);
  window.location.href = 'agentes.html';
}

// ── FLUXO DE ONBOARDING (CADASTRO / CURSO / QUIZ) ───────────────────────────
export function getOnboardingData() {
  const raw = sessionStorage.getItem(ONBOARDING_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function updateOnboardingData(data) {
  const current = getOnboardingData();
  const updated = { ...current, ...data };
  sessionStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated));
  return updated;
}

export function clearOnboardingData() {
  sessionStorage.removeItem(ONBOARDING_KEY);
}

// ── RESOLUÇÃO DO LINK DO QR CODE ───────────────────────────────────────────
export function getQRCodeUrl(idSS) {
  // Constrói URL pública limpa (sem .html) para consulta
  const base = window.location.origin;
  return `${base}/consulta?id=${encodeURIComponent(idSS)}`;
}

// ── NOTIFICAÇÕES TOAST ─────────────────────────────────────────────────────
export function showToast(message, type = 'info', duration = 3800) {
  const old = document.querySelector('.toast-msg');
  if (old) old.remove();

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideToastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── FORMATAÇÕES E MÁSCARAS ─────────────────────────────────────────────────
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
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    input.value = v;
  });
}

export function isUnderAge(birthDateString) {
  if (!birthDateString) return false;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 18;
}

// ── RENDERIZAÇÃO DE HEADER E FOOTER PADRÃO (MOBILE-FIRST) ───────────────────
export function renderHeader(activePage = '') {
  const el = document.getElementById('site-header');
  if (!el) return;

  const currentUser = getCurrentUser();
  const currentAgent = getCurrentAgent();

  el.innerHTML = `
    <div class="header-container">
      <a href="/" class="brand-logo" aria-label="SS Sustentabilidade & Segurança">
        <div class="brand-emblem">SS</div>
        <div class="brand-info">
          <div class="brand-title"><span class="s1">Sustentabilidade</span> & <span class="s2">Segurança</span></div>
          <div class="brand-subtitle">Educação & Identificação</div>
        </div>
      </a>

      <!-- Botão Hambúrguer Animado Touch-Friendly -->
      <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Abrir Menu de Navegação" aria-expanded="false" aria-controls="navLinks">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>

      <!-- Backdrop Escuro para fechar ao tocar fora -->
      <div class="nav-backdrop" id="navBackdrop"></div>

      <!-- Drawer de Navegação Otimizado -->
      <nav class="nav-links" id="navLinks" role="navigation" aria-label="Menu Principal">
        <div class="nav-drawer-header">
          <div class="brand-logo">
            <div class="brand-emblem">SS</div>
            <div class="brand-info">
              <div class="brand-title"><span class="s1">Menu</span> SS</div>
            </div>
          </div>
          <button class="nav-drawer-close" id="navDrawerClose" aria-label="Fechar Menu">✕</button>
        </div>

        <a href="/" class="nav-item ${activePage === 'home' ? 'active' : ''}">
          <span class="nav-icon">🏠</span>Início
        </a>
        <a href="/#proposta" class="nav-item" id="navLinkProposta">
          <span class="nav-icon">🔄</span>O Projeto
        </a>
        <a href="/curso" class="nav-item ${activePage === 'curso' ? 'active' : ''}">
          <span class="nav-icon">📚</span>Curso
        </a>
        <a href="/consulta" class="nav-item ${activePage === 'consulta' ? 'active' : ''}">
          <span class="nav-icon">🔍</span>Consultar
        </a>
        <a href="/palestras" class="nav-item ${activePage === 'palestras' ? 'active' : ''}">
          <span class="nav-icon">🤝</span>Parcerias
        </a>

        <div class="nav-divider"></div>

        ${currentUser ? `
          <a href="/meu-ss" class="nav-item nav-cta ${activePage === 'meu-ss' ? 'active' : ''}">
            <span class="nav-icon">👤</span>Meu SS
          </a>
        ` : `
          <a href="/meu-ss" class="nav-item ${activePage === 'meu-ss' ? 'active' : ''}">
            <span class="nav-icon">🔑</span>Entrar
          </a>
          <a href="/cadastro" class="nav-item nav-cta ${activePage === 'cadastro' ? 'active' : ''}">
            <span class="nav-icon">🚀</span>Cadastrar
          </a>
        `}

        <a href="/agentes" class="nav-item nav-agent ${activePage === 'agentes' ? 'active' : ''}">
          <span class="nav-icon">🚔</span>Agentes
        </a>
      </nav>
    </div>
  `;

  // Intercepta clique em "O Projeto" para rolar suave sem deixar #proposta na barra de URL
  const linkProposta = document.getElementById('navLinkProposta');
  if (linkProposta) {
    linkProposta.addEventListener('click', (e) => {
      const secao = document.getElementById('proposta');
      if (secao) {
        e.preventDefault();
        closeMobileMenu();
        secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', window.location.pathname);
      }
    });
  }

  // Controles do Menu Mobile
  const toggle = document.getElementById('mobileNavToggle');
  const links = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');
  const closeBtn = document.getElementById('navDrawerClose');

  function openMobileMenu() {
    toggle?.classList.add('is-active');
    toggle?.setAttribute('aria-expanded', 'true');
    links?.classList.add('mobile-open');
    backdrop?.classList.add('is-active');
    document.body.classList.add('nav-locked');
  }

  function closeMobileMenu() {
    toggle?.classList.remove('is-active');
    toggle?.setAttribute('aria-expanded', 'false');
    links?.classList.remove('mobile-open');
    backdrop?.classList.remove('is-active');
    document.body.classList.remove('nav-locked');
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      if (links.classList.contains('mobile-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    backdrop?.addEventListener('click', closeMobileMenu);
    closeBtn?.addEventListener('click', closeMobileMenu);

    // Fecha menu ao clicar em qualquer link de navegação
    links.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Fecha ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });
  }
}

export function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;

  el.innerHTML = `
    <div class="footer-container">
      <div class="footer-col">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
          <div class="brand-emblem" style="width:36px; height:36px; font-size:1.1rem;">SS</div>
          <div style="font-family:var(--font-display); font-weight:800; font-size:1.1rem; color:#fff;">
            Sustentabilidade & Segurança
          </div>
        </div>
        <p style="line-height:1.6; margin-bottom:16px;">
          Plataforma de conscientização, educação de trânsito e identificação segura para motociclistas,
          veículos elétricos e autopropelidos.
        </p>
        <div style="display:flex; gap:12px; font-size:1.2rem;">
          <span>🌱</span><span>🛡️</span><span>⚡</span><span>🛵</span><span>🔒</span>
        </div>
      </div>

      <div class="footer-col">
        <h5>Navegação</h5>
        <ul>
          <li><a href="/">Página Inicial</a></li>
          <li><a href="/cadastro">Cadastrar Veículo</a></li>
          <li><a href="/curso">Curso Online & Módulos</a></li>
          <li><a href="/meu-ss">Área do Usuário (Meu SS)</a></li>
          <li><a href="/consulta">Consulta Pública de QR Code</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Institucional</h5>
        <ul>
          <li><a href="/palestras">Palestras Presenciais</a></li>
          <li><a href="/palestras#parcerias">Parcerias com Municípios</a></li>
          <li><a href="/agentes">Área para Agentes Autorizados</a></li>
          <li><a href="/palestras#publicidade">Espaço para Apoiadores</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Privacidade & Segurança</h5>
        <p style="font-size:0.84rem; line-height:1.5; margin-bottom:12px;">
          <strong>Conforme a LGPD (Lei nº 13.709/2018):</strong> O QR Code afixado no veículo NÃO expõe dados pessoais. 
          Identificação protegida com acesso restrito a autoridades validadas.
        </p>
        <span style="display:inline-block; background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:6px; font-size:0.75rem;">
          🔒 Dados Criptografados
        </span>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© ${new Date().getFullYear()} SS — Sustentabilidade & Segurança. Todos os direitos reservados.</div>
      <div style="display:flex; gap:16px;">
        <span>Educação Previne Acidentes</span>
        <span>•</span>
        <span>Tecnologia Gera Segurança</span>
      </div>
    </div>
  `;
}
