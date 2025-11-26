
    // ========== MÁSCARAS AUTOMÁTICAS ==========
    document.getElementById('cad-telefone').addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      e.target.value = v
        ? '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + (v.length > 7 ? '-' + v.slice(7) : '')
        : '';
    });

    document.getElementById('cad-cpf').addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      e.target.value = v
        ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : '';
    });

    document.getElementById('cad-cep').addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 8) v = v.slice(0, 8);
      e.target.value = v
        ? v.replace(/(\d{5})(\d{3})/, '$1-$2')
        : '';
    });

    // ========== BUSCA CEP ==========
    document.getElementById('cad-cep').addEventListener('blur', buscarCEP);
    document.getElementById('cad-cep').addEventListener('keyup', e => e.key === 'Enter' && buscarCEP());

    function buscarCEP() {
      const cep = document.getElementById('cad-cep').value.replace(/\D/g, '');
      if (cep.length !== 8) return;

      const el = document.getElementById('cad-cep');
      el.classList.add('carregando');

      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(r => r.json())
        .then(data => {
          if (data.erro) throw 'CEP não encontrado';
          document.getElementById('cad-logradouro').value = data.logradouro || '';
          document.getElementById('cad-bairro').value = data.bairro || '';
          document.getElementById('cad-cidade').value = data.localidade || '';
          document.getElementById('cad-uf').value = data.uf || '';
          document.getElementById('cad-numero').focus();
        })
        .catch(() => {
          alert('❌ CEP não encontrado. Verifique e tente novamente.');
          ['cad-logradouro', 'cad-bairro', 'cad-cidade', 'cad-uf'].forEach(id => {
            document.getElementById(id).value = '';
          });
        })
        .finally(() => el.classList.remove('carregando'));
    }

    // ========== VALIDAÇÃO ==========
    function validarCPF(c) {
      c = c.replace(/\D/g, '');
      if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
      let s = 0;
      for (let i = 0; i < 9; i++) s += parseInt(c[i]) * (10 - i);
      let d1 = 11 - (s % 11);
      if (d1 > 9) d1 = 0;
      s = 0;
      for (let i = 0; i < 10; i++) s += parseInt(c[i]) * (11 - i);
      let d2 = 11 - (s % 11);
      if (d2 > 9) d2 = 0;
      return d1 === parseInt(c[9]) && d2 === parseInt(c[10]);
    }

    function calcularIdade(dataNasc) {
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
      return idade;
    }

    function validarTelefone(t) {
      const d = t.replace(/\D/g, '');
      return d.length >= 10 && d.length <= 11;
    }

    // ========== CADASTRO ==========
    document.getElementById('btn-cadastrar').addEventListener('click', function () {
      // Limpa erros anteriores
      ['cad-cpf', 'cad-data-nasc'].forEach(id =>
        document.getElementById(id)?.classList.remove('input-error')
      );

      // Pega valores
      const email = document.getElementById('cad-email').value;
      const tel = document.getElementById('cad-telefone').value;
      const cpf = document.getElementById('cad-cpf').value;
      const nasc = document.getElementById('cad-data-nasc').value;
      const senha = document.getElementById('cad-senha').value;
      const conf = document.getElementById('cad-confirmar-senha').value;

      // ✅ 1º: validar se a senha é FORTE
      if (!validarSenhaForte(senha)) {
        document.getElementById('cad-senha').classList.add('input-error');
        alert("🔒 Sua senha deve ter:\n• Pelo menos 8 caracteres\n• 1 letra maiúscula\n• 1 letra minúscula\n• 1 número\n• 1 símbolo (!@#$%&*)");
        return;
      }

      if (senha !== conf) {
        alert("🔒 As senhas não coincidem.");
        return;
      }

      // Validação
      if (!email || !tel || !cpf || !nasc || !senha || !conf) {
        alert("⚠️ Preencha todos os campos.");
        return;
      }

      if (!validarTelefone(tel)) {
        alert("📱 Telefone inválido. Use (11) 99999-9999.");
        return;
      }

      if (!validarCPF(cpf)) {
        document.getElementById('cad-cpf').classList.add('input-error');
        alert("📛 CPF inválido.");
        return;
      }

      const idade = calcularIdade(nasc);
      if (idade < 18) {
        document.getElementById('cad-data-nasc').classList.add('input-error');
        alert("🚫 Você deve ter pelo menos 18 anos para se cadastrar.");
        return;
      }

      // Verifica e-mail duplicado
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      if (usuarios.some(u => u.email === email)) {
        alert("📧 Este e-mail já está cadastrado.");
        return;
      }

      // Cria usuário
      const nome = email.split('@')[0]
        .split('.')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');

      const novo = {
        email,
        senha,
        telefone: tel,
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento: nasc,
        nome,
        dataCadastro: new Date().toISOString(),

        // ✅ DADOS DE ENDEREÇO — ADICIONADOS AQUI (COPIE TUDO ABAIXO)
        cep: document.getElementById('cad-cep').value || '',
        logradouro: document.getElementById('cad-logradouro').value || '',
        numero: document.getElementById('cad-numero').value || '',
        complemento: document.getElementById('cad-complemento').value || '',
        bairro: document.getElementById('cad-bairro').value || '',
        cidade: document.getElementById('cad-cidade').value || '',
        uf: document.getElementById('cad-uf').value || ''
      };

      // Salva
      usuarios.push(novo);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert(`🎉 Bem-vindo(a), ${nome}!\nCadastro realizado com sucesso!`);
      window.location.href = '/pages/login.html';
    });

    // ========== TOGGLE SENHA ==========
    function togglePass(idInput, idIcon) {
      const input = document.getElementById(idInput);
      const icon = document.getElementById(idIcon).querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      }
    }

    document.getElementById('toggle-senha').onclick = () => togglePass('cad-senha', 'toggle-senha');
    document.getElementById('toggle-confirmar-senha').onclick = () => togglePass('cad-confirmar-senha', 'toggle-confirmar-senha');

    // Validação de senha forte
    function validarSenhaForte(senha) {
      const temMinimo = senha.length >= 8;
      const temMaiuscula = /[A-Z]/.test(senha);
      const temMinuscula = /[a-z]/.test(senha);
      const temNumero = /\d/.test(senha);
      const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);

      return temMinimo && temMaiuscula && temMinuscula && temNumero && temEspecial;
    }

    // ✅ Função para mostrar dicas em tempo real (opcional, mas incrível!)
    function atualizarFeedbackSenha() {
      const senha = document.getElementById('cad-senha').value;
      const feedback = document.getElementById('feedback-senha');
      if (!feedback) return;

      const regras = [
        { ok: senha.length >= 8, texto: "Pelo menos 8 caracteres" },
        { ok: /[A-Z]/.test(senha), texto: "Uma letra maiúscula" },
        { ok: /[a-z]/.test(senha), texto: "Uma letra minúscula" },
        { ok: /\d/.test(senha), texto: "Um número" },
        { ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha), texto: "Um símbolo (!@#$%&*)" }
      ];

      feedback.innerHTML = `
        <small style="display: block; margin-top: 5px; font-size: 0.85rem;">
            ${regras.map(r =>
        `<span style="color: ${r.ok ? '#27ae60' : '#e74c3c'}">
                    ${r.ok ? '✅' : '❌'} ${r.texto}
                </span><br>`
      ).join('')}
        </small>
    `;
    }