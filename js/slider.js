document.addEventListener('DOMContentLoaded', () => {
  const banner = document.querySelector('.banner-destaque');
  
  const imagens = [
    "img/bannerdestaque.jpg",
    "img/bannerdestaque2.jpg",
    // mais URLs se quiser
  ];
  
  let indiceAtual = 0;
  
  // Define a imagem inicial logo ao carregar a página
  banner.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
  
  setInterval(() => {
    indiceAtual = (indiceAtual + 1) % imagens.length;
    banner.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
  }, 10000);
});