/**
 * script.js — Portfólio de Alanis Quintana Teixeira
 *
 * Funcionalidades:
 *  1. Alternância de tema claro/escuro (persiste via localStorage)
 *  2. Menu hambúrguer responsivo para mobile
 *  3. Destaque do link ativo na navbar com base na página atual
 *  4. Validação de formulário de contato com feedback inline
 *  5. Simulação de envio (loading → sucesso → reset)
 */

/* ==========================================
   INICIALIZAÇÃO — aguarda o DOM estar pronto
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHamburger();
  highlightActiveNavLink();
  initContactForm();
});

/* ==========================================
   1. TEMA CLARO / ESCURO
   O tema é aplicado em <html> por um script inline no <head>
   (antes de qualquer renderização) para evitar FOUC.
   Aqui apenas registramos o clique para alternar e persistir.
   ========================================== */
function initTheme() {
  // Alvo é <html> (document.documentElement), não <body>,
  // pois o script inline do <head> já usa documentElement.
  const root     = document.documentElement;
  const btnTheme = document.getElementById('btn-theme');
  if (!btnTheme) return;

  // Alterna tema ao clicar no botão ☀️/🌙
  btnTheme.addEventListener('click', () => {
    root.classList.toggle('dark-theme');

    // Persiste a escolha do usuário
    const isDark = root.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

/* ==========================================
   2. MENU HAMBÚRGUER (MOBILE)
   Abre/fecha o menu de navegação em telas pequenas.
   A classe .open é adicionada tanto no menu quanto
   no botão (para animar o ícone hambúrguer → X).
   ========================================== */
function initHamburger() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  // Abre ou fecha o menu ao clicar no botão hambúrguer
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    // Acessibilidade: informa leitores de tela sobre o estado
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
}

/* ==========================================
   3. DESTAQUE DO LINK ATIVO NA NAVBAR
   Compara o href de cada link com o nome do
   arquivo da página atual e adiciona .active.
   ========================================== */
function highlightActiveNavLink() {
  // Extrai apenas o nome do arquivo da URL (ex: "formacao.html")
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

/* ==========================================
   4. FORMULÁRIO DE CONTATO
   Intercepta o submit, valida os campos e
   exibe erros inline. Se válido, simula envio.
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return; // Formulário só existe em contato.html

  // Valida ao submeter
  form.addEventListener('submit', (e) => {
    e.preventDefault();       // Bloqueia o envio real do navegador
    clearAllErrors(form);     // Remove mensagens de erro anteriores

    const isValid = validateForm(form);
    if (isValid) {
      simulateSubmit(form);   // Apenas se todos os campos forem válidos
    }
  });

  // Limpa o erro de um campo individualmente ao usuário começar a digitar
  form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
  });
}

/**
 * Valida todos os campos obrigatórios do formulário.
 * @param {HTMLFormElement} form
 * @returns {boolean} true somente se todos os campos passarem na validação
 */
function validateForm(form) {
  let isValid = true;

  // ── Nome: obrigatório, mínimo 2 caracteres ──
  const nameField = form.querySelector('#nome');
  if (!nameField.value.trim() || nameField.value.trim().length < 2) {
    showFieldError(nameField, 'Por favor, informe seu nome completo (mínimo 2 caracteres).');
    isValid = false;
  }

  // ── E-mail: obrigatório e formato válido via regex ──
  const emailField = form.querySelector('#email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailField.value.trim()) {
    showFieldError(emailField, 'Por favor, informe seu e-mail.');
    isValid = false;
  } else if (!emailRegex.test(emailField.value.trim())) {
    showFieldError(emailField, 'Informe um e-mail válido (ex: nome@dominio.com).');
    isValid = false;
  }

  // ── Mensagem: obrigatória, mínimo 10 caracteres ──
  const msgField = form.querySelector('#mensagem');
  if (!msgField.value.trim()) {
    showFieldError(msgField, 'Por favor, escreva sua mensagem.');
    isValid = false;
  } else if (msgField.value.trim().length < 10) {
    showFieldError(msgField, 'A mensagem deve ter pelo menos 10 caracteres.');
    isValid = false;
  }

  return isValid;
}

/**
 * Marca um campo como inválido e exibe a mensagem de erro abaixo dele.
 * @param {HTMLElement} field  — o input/textarea com problema
 * @param {string}      message — texto de erro a exibir
 */
function showFieldError(field, message) {
  field.classList.add('error');
  const errorEl = field.closest('.form-group')?.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

/**
 * Remove o estado de erro de um campo específico.
 * @param {HTMLElement} field
 */
function clearFieldError(field) {
  field.classList.remove('error');
  const errorEl = field.closest('.form-group')?.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

/**
 * Remove todos os erros do formulário e esconde o feedback anterior.
 * @param {HTMLFormElement} form
 */
function clearAllErrors(form) {
  form.querySelectorAll('.form-input, .form-textarea').forEach(clearFieldError);

  const feedback = form.querySelector('#form-feedback');
  if (feedback) {
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }
}

/**
 * Simula o envio do formulário:
 *  1. Desabilita o botão e mostra "Enviando..."
 *  2. Após 1,5 s, exibe mensagem de sucesso e reseta o formulário
 *  3. Após mais 5 s, remove a mensagem de sucesso
 * @param {HTMLFormElement} form
 */
function simulateSubmit(form) {
  const submitBtn = form.querySelector('#btn-submit');
  const feedback  = form.querySelector('#form-feedback');

  // Estado de carregamento
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Enviando...';

  // Simula latência de rede (1500 ms)
  setTimeout(() => {
    // Restaura o botão
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Enviar Mensagem';

    // Exibe mensagem de sucesso
    if (feedback) {
      feedback.className   = 'form-feedback success';
      feedback.textContent = '✓ Mensagem enviada com sucesso! Entrarei em contato em breve.';
    }

    // Reseta todos os campos do formulário
    form.reset();

    // Remove o feedback de sucesso após 5 segundos
    setTimeout(() => {
      if (feedback) {
        feedback.className   = 'form-feedback';
        feedback.textContent = '';
      }
    }, 5000);

  }, 1500);
}
