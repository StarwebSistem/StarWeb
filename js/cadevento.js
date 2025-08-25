document.addEventListener('DOMContentLoaded', () => {
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
    alert('Usuário não está logado. Por favor, faça login.');
    return;
  }
  document.getElementById('usuario_id').value = usuarioId;

  window.addEventListener('message', function(event) {
    const data = event.data;
    if (data && data.tipo === 'espacoSelecionado') {
      document.getElementById('espacoevento_id').value = data.id;
    }
  });

  window.selecionarEspacoEvento = function() {
    window.open("pesquisaespaco.html", "PesquisaEspaco", "width=900,height=600");
  };

  window.selecionarCardapio = function() {
    const id = prompt("Digite o ID do Cardápio:");
    if (id && !isNaN(id)) {
      document.getElementById("cardapio_id").value = id;
    } else if (id) {
      alert("Por favor, digite um número válido.");
    }
  };

  window.editarEvento = function() {
    alert("Modo de edição ativado.");
  };

  const form = document.getElementById("eventoForm");
  const imagemInput = document.getElementById("imagemInput");
  const previewContainer = document.getElementById("previewContainer");
  const previewImagem = document.getElementById("previewImagem");

  let imagemCompactadaBlob = null;

  imagemInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const maxWidth = 800;
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            function (blob) {
              if (blob.size > 1024 * 1024) {
                alert("Imagem ainda maior que 1MB mesmo compactada. Escolha outra imagem.");
                imagemInput.value = "";
                previewImagem.src = "";
                previewContainer.style.display = "none";
                imagemCompactadaBlob = null;
              } else {
                imagemCompactadaBlob = blob;
                previewImagem.src = URL.createObjectURL(blob);
                previewContainer.style.display = "block";
              }
            },
            'image/jpeg',
            0.7
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      previewImagem.src = "";
      previewContainer.style.display = "none";
    }
  });

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token não encontrado. Faça login.');
      return;
    }

    if (imagemCompactadaBlob) {
      formData.set("imagem", imagemCompactadaBlob, "imagem.jpg");
    }

    try {
      const response = await fetch("https://meuevento.giize.com/starweb/evento", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          alert('Erro ao gravar evento: ' + (errorData.error || response.statusText));
          console.error('Erro detalhado:', errorData);
        } else {
          const text = await response.text();
          alert('Erro: ' + response.status + ' - ' + response.statusText);
          console.error('Resposta não JSON:', text);
        }
        return;
      }

      const data = contentType.includes('application/json') ? await response.json() : null;
      alert('Evento cadastrado com sucesso!' + (data ? ' ID: ' + data.id : ''));

      form.reset();
      document.getElementById("espacoevento_id").value = '';
      document.getElementById("cardapio_id").value = '';
      document.getElementById("previewContainer").style.display = "none";
      imagemCompactadaBlob = null;

    } catch (error) {
      alert('Erro na comunicação com o servidor.');
      console.error(error);
    }
  });
});
