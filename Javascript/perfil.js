const usuario = JSON.parse(usuarioLogado);
document.getElementById('nome').value = usuario.nome || '';
document.getElementById('email').value = usuario.email || '';
document.getElementById('telefone').value = usuario.telefone || '';

document.getElementById('cep').value = usuario.cep || '';
document.getElementById('logradouro').value = usuario.logradouro || '';
document.getElementById('numero').value = usuario.numero || '';
document.getElementById('complemento').value = usuario.complemento || '';
document.getElementById('bairro').value = usuario.bairro || '';
document.getElementById('cidade').value = usuario.cidade || '';
document.getElementById('uf').value = usuario.uf || '';

