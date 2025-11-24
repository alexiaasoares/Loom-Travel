const usuario = JSON.parse(usuarioLogado);
document.getElementById('nome').value = usuario.nome || '';
document.getElementById('email').value = usuario.email || '';
document.getElementById('telefone').value = usuario.telefone || '';