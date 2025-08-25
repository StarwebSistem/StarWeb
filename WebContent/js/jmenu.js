document.querySelectorAll('.submenu-parent > a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const parent = this.parentElement;
    parent.classList.toggle('active');

    // Atualiza aria-expanded para acessibilidade
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
  });
});