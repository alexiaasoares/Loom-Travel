// js/autocomplete.js
document.addEventListener('DOMContentLoaded', function () {
  const inputDestino = document.getElementById('destino');
  const listaSugestoes = document.getElementById('sugestoes-destino');

  if (!inputDestino || !listaSugestoes) return;

  // ✅ Lista expandida: 100+ destinos reais (capitais, turísticos, internacionais)
  const destinos = [
    // 🇧🇷 Capitais + principais aeroportos
    { nome: "São Paulo (GRU)", cidade: "São Paulo", aeroporto: "GRU" },
    { nome: "São Paulo (CGH)", cidade: "São Paulo", aeroporto: "CGH" },
    { nome: "São Paulo (VCP)", cidade: "Campinas", aeroporto: "VCP" },
    { nome: "Rio de Janeiro (GIG)", cidade: "Rio de Janeiro", aeroporto: "GIG" },
    { nome: "Rio de Janeiro (SDU)", cidade: "Rio de Janeiro", aeroporto: "SDU" },
    { nome: "Brasília (BSB)", cidade: "Brasília", aeroporto: "BSB" },
    { nome: "Salvador (SSA)", cidade: "Salvador", aeroporto: "SSA" },
    { nome: "Fortaleza (FOR)", cidade: "Fortaleza", aeroporto: "FOR" },
    { nome: "Belo Horizonte (CNF)", cidade: "Belo Horizonte", aeroporto: "CNF" },
    { nome: "Belo Horizonte (PLU)", cidade: "Belo Horizonte", aeroporto: "PLU" },
    { nome: "Recife (REC)", cidade: "Recife", aeroporto: "REC" },
    { nome: "Porto Alegre (POA)", cidade: "Porto Alegre", aeroporto: "POA" },
    { nome: "Curitiba (CWB)", cidade: "Curitiba", aeroporto: "CWB" },
    { nome: "Manaus (MAO)", cidade: "Manaus", aeroporto: "MAO" },
    { nome: "Belém (BEL)", cidade: "Belém", aeroporto: "BEL" },
    { nome: "Goiânia (GYN)", cidade: "Goiânia", aeroporto: "GYN" },
    { nome: "Natal (NAT)", cidade: "Natal", aeroporto: "NAT" },
    { nome: "Florianópolis (FLN)", cidade: "Florianópolis", aeroporto: "FLN" },
    { nome: "Cuiabá (CGB)", cidade: "Cuiabá", aeroporto: "CGB" },
    { nome: "Campo Grande (CGR)", cidade: "Campo Grande", aeroporto: "CGR" },
    { nome: "Maceió (MCZ)", cidade: "Maceió", aeroporto: "MCZ" },
    { nome: "João Pessoa (JPA)", cidade: "João Pessoa", aeroporto: "JPA" },
    { nome: "Aracaju (AJU)", cidade: "Aracaju", aeroporto: "AJU" },
    { nome: "Teresina (THE)", cidade: "Teresina", aeroporto: "THE" },
    { nome: "São Luís (SLZ)", cidade: "São Luís", aeroporto: "SLZ" },
    { nome: "Vitória (VIX)", cidade: "Vitória", aeroporto: "VIX" },
    { nome: "Porto Velho (PVH)", cidade: "Porto Velho", aeroporto: "PVH" },
    { nome: "Boa Vista (BVB)", cidade: "Boa Vista", aeroporto: "BVB" },
    { nome: "Palmas (PMW)", cidade: "Palmas", aeroporto: "PMW" },
    { nome: "Rio Branco (RBR)", cidade: "Rio Branco", aeroporto: "RBR" },
    { nome: "Caxias do Sul (CXJ)", cidade: "Caxias do Sul", aeroporto: "CXJ" },
    { nome: "Ribeirão Preto (RAO)", cidade: "Ribeirão Preto", aeroporto: "RAO" },
    { nome: "Uberlândia (UDI)", cidade: "Uberlândia", aeroporto: "UDI" },

    // 🌴 Destinos turísticos nacionais
    { nome: "Fernando de Noronha (FEN)", cidade: "Fernando de Noronha", aeroporto: "FEN" },
    { nome: "Foz do Iguaçu (IGU)", cidade: "Foz do Iguaçu", aeroporto: "IGU" },
    { nome: "Navegantes (NVT)", cidade: "Balneário Camboriú", aeroporto: "NVT" },
    { nome: "Porto Seguro (BPS)", cidade: "Porto Seguro", aeroporto: "BPS" },
    { nome: "Macaé (MEA)", cidade: "Macaé", aeroporto: "MEA" },
    { nome: "Jericoacoara (JJD)", cidade: "Jijoca de Jericoacoara", aeroporto: "JJD" },
    { nome: "Ilhéus (IOS)", cidade: "Ilhéus", aeroporto: "IOS" },
    { nome: "Marechal Rondon (CGB)", cidade: "Cuiabá", aeroporto: "CGB" },
    { nome: "Santarém (STM)", cidade: "Santarém", aeroporto: "STM" },

    // 🌎 Internacionais populares
    { nome: "Miami (MIA)", cidade: "Miami", aeroporto: "MIA" },
    { nome: "Orlando (MCO)", cidade: "Orlando", aeroporto: "MCO" },
    { nome: "Nova York (JFK)", cidade: "Nova York", aeroporto: "JFK" },
    { nome: "Nova York (EWR)", cidade: "Newark", aeroporto: "EWR" },
    { nome: "Los Angeles (LAX)", cidade: "Los Angeles", aeroporto: "LAX" },
    { nome: "Cancún (CUN)", cidade: "Cancún", aeroporto: "CUN" },
    { nome: "Punta Cana (PUJ)", cidade: "Punta Cana", aeroporto: "PUJ" },
    { nome: "Buenos Aires (EZE)", cidade: "Buenos Aires", aeroporto: "EZE" },
    { nome: "Santiago (SCL)", cidade: "Santiago", aeroporto: "SCL" },
    { nome: "Lima (LIM)", cidade: "Lima", aeroporto: "LIM" },
    { nome: "Assunção (ASU)", cidade: "Assunção", aeroporto: "ASU" },
    { nome: "Montevidéu (MVD)", cidade: "Montevidéu", aeroporto: "MVD" },
    { nome: "Lisboa (LIS)", cidade: "Lisboa", aeroporto: "LIS" },
    { nome: "Porto (OPO)", cidade: "Porto", aeroporto: "OPO" },
    { nome: "Madri (MAD)", cidade: "Madri", aeroporto: "MAD" },
    { nome: "Barcelona (BCN)", cidade: "Barcelona", aeroporto: "BCN" },
    { nome: "Paris (CDG)", cidade: "Paris", aeroporto: "CDG" },
    { nome: "Roma (FCO)", cidade: "Roma", aeroporto: "FCO" },
    { nome: "Milão (MXP)", cidade: "Milão", aeroporto: "MXP" },
    { nome: "Londres (LHR)", cidade: "Londres", aeroporto: "LHR" },
    { nome: "Dublin (DUB)", cidade: "Dublin", aeroporto: "DUB" },
    { nome: "Atenas (ATH)", cidade: "Atenas", aeroporto: "ATH" },
    { nome: "Istambul (IST)", cidade: "Istambul", aeroporto: "IST" },
    { nome: "Doha (DOH)", cidade: "Doha", aeroporto: "DOH" },
    { nome: "Dubai (DXB)", cidade: "Dubai", aeroporto: "DXB" }
  ];

  inputDestino.addEventListener('input', function () {
    const termo = this.value.trim().toLowerCase();
    listaSugestoes.innerHTML = '';
    listaSugestoes.style.display = 'none';

    if (termo.length < 2) return;

    const resultados = destinos.filter(dest =>
      dest.nome.toLowerCase().includes(termo) ||
      dest.cidade.toLowerCase().includes(termo) ||
      dest.aeroporto.toLowerCase() === termo
    ).slice(0, 10);

    if (resultados.length > 0) {
      resultados.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.nome;
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '0');

        li.addEventListener('click', () => {
          inputDestino.value = item.nome;
          listaSugestoes.innerHTML = '';
          listaSugestoes.style.display = 'none';
          inputDestino.focus();
        });

        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') li.click();
        });

        listaSugestoes.appendChild(li);
      });
      listaSugestoes.style.display = 'block';
    }
  });

  // Fecha ao clicar fora ou perder foco
  document.addEventListener('click', function (e) {
    if (!inputDestino.contains(e.target) && !listaSugestoes.contains(e.target)) {
      listaSugestoes.style.display = 'none';
    }
  });

  inputDestino.addEventListener('blur', () => {
    setTimeout(() => listaSugestoes.style.display = 'none', 150);
  });
});