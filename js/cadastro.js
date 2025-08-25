document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form-cadastro');

  const criarErro = (elemento, mensagem) => {
    // Remove erro antigo, se existir
    const erroAntigo = elemento.nextElementSibling;
    if (erroAntigo && erroAntigo.classList.contains('erro-msg')) {
      erroAntigo.remove();
    }

    // Cria mensagem de erro
    const msgErro = document.createElement('div');
    msgErro.classList.add('erro-msg');
    msgErro.textContent = mensagem;
    elemento.insertAdjacentElement('afterend', msgErro);
  };

  const limparErros = () => {
    document.querySelectorAll('.erro-msg').forEach(el => el.remove());
  };

  form.addEventListener('submit', function(event) {
    limparErros();

    let valido = true;

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmarSenha = form['confirmar-senha'].value;

    if (nome === '') {
      criarErro(form.nome, 'Por favor, preencha o nome.');
      valido = false;
    }

    if (email === '') {
      criarErro(form.email, 'Por favor, preencha o e-mail.');
      valido = false;
    } else {
      // validação simples do email
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        criarErro(form.email, 'Digite um e-mail válido.');
        valido = false;
      }
    }

    if (senha.length < 6) {
      criarErro(form.senha, 'Senha deve ter pelo menos 6 caracteres.');
      valido = false;
    }

    if (senha !== confirmarSenha) {
      criarErro(form['confirmar-senha'], 'As senhas não coincidem.');
      valido = false;
    }

    if (!valido) {
      event.preventDefault();
    }
  });
});





