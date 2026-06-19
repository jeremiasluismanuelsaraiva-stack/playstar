async function buscarMusica() {
    const nome = document.getElementById("busca").value;
    const res = await fetch(`/api/buscar?q=${encodeURIComponent(nome)}`);
    const lista = await res.json();
  
    const ul = document.getElementById("resultados");
    ul.innerHTML = "";
  
    lista.forEach(m => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${m.link}" target="_blank">${m.titulo}</a>`;
      ul.appendChild(li);
    });
  }
  