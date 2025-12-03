document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LÓGICA DE TROCA (SWAP) DE ORIGEM E DESTINO ---
    const inputOrigem = document.getElementById('origem');
    const inputDestino = document.getElementById('destino');
    const swapButton = document.querySelector('.icon-swap');

    if (swapButton) {
        swapButton.addEventListener('click', () => {
            console.log('Troca de Origem/Destino acionada.');
            const tempValue = inputOrigem.value;
            inputOrigem.value = inputDestino.value;
            inputDestino.value = tempValue;
            // Foca na origem após a troca para continuar a navegação
            inputOrigem.focus(); 
        });

        // Suporte a teclado já estava bom
        swapButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                swapButton.click();
            }
        });
    }

    // --- 2. LÓGICA DO CONTROLE NUMÉRICO (STEPPERS) ---
    const steppers = document.querySelectorAll('.numeric-control');
    const MAX_QUARTOS = 5;
    const MAX_PESSOAS = 10;
    const MIN_VALUE = 1;

    steppers.forEach(control => {
        const input = control.querySelector('input');
        const stepUp = control.querySelector('.step-up');
        const stepDown = control.querySelector('.step-down');

        let maxValue = 0;
        if (input.id === 'quartos') {
            maxValue = MAX_QUARTOS;
        } else if (input.id === 'pessoas') {
            maxValue = MAX_PESSOAS;
        }

        const updateValue = (increment) => {
            let currentValue = parseInt(input.value) || MIN_VALUE;
            let newValue = currentValue + increment;

            if (newValue < MIN_VALUE) {
                newValue = MIN_VALUE;
            } else if (maxValue > 0 && newValue > maxValue) {
                newValue = maxValue;
            }

            input.value = newValue;
            // Adiciona feedback visual para acessibilidade (opcional, mas recomendado)
            input.setAttribute('aria-valuenow', newValue); 
        };

        stepUp.addEventListener('click', () => updateValue(1));
        stepDown.addEventListener('click', () => updateValue(-1));
    });
    
    // --- 3. LÓGICA DO CARROSSEL DE PROMOÇÕES (MELHORIA DE UX/SWIPE) ---
    const carrossel = document.getElementById('carrossel');
    const promoGrid = document.getElementById('promoGrid');
    const btnPrev = carrossel ? carrossel.querySelector('.btn-carrossel.prev') : null;
    const btnNext = carrossel ? carrossel.querySelector('.btn-carrossel.next') : null;

    if (promoGrid && btnPrev && btnNext) {
        // Função para calcular a distância de rolagem baseada no primeiro card
        const getScrollDistance = () => {
            const firstCard = promoGrid.querySelector('.promo-card');
            if (firstCard) {
                // Obtém o estilo computado para o gap
                const style = window.getComputedStyle(promoGrid);
                const gap = parseInt(style.gap) || 24; 
                return firstCard.offsetWidth + gap;
            }
            return 324; // Fallback
        };

        const handleScroll = (direction) => {
            const scrollDistance = getScrollDistance();
            const scrollByAmount = direction === 'next' ? scrollDistance : -scrollDistance;
            
            promoGrid.scrollBy({
                left: scrollByAmount,
                behavior: 'smooth'
            });
        };

        btnNext.addEventListener('click', () => handleScroll('next'));
        btnPrev.addEventListener('click', () => handleScroll('prev'));
        
        // --- Adição para navegação por SWIPE (Mobile UX) ---
        let isDragging = false;
        let startPos = 0;
        let scrollLeft = 0;
        
        promoGrid.addEventListener('mousedown', (e) => {
            if (window.innerWidth < 768) return; // Evita conflito em desktop com o scroll padrão
            isDragging = true;
            // Remove a classe de transição CSS para rolagem instantânea durante o arrasto
            promoGrid.style.scrollBehavior = 'auto'; 
            startPos = e.pageX - promoGrid.offsetLeft;
            scrollLeft = promoGrid.scrollLeft;
        });

        promoGrid.addEventListener('mouseup', () => {
            isDragging = false;
            // Restaura a transição smooth após o arrasto
            promoGrid.style.scrollBehavior = 'smooth'; 
        });

        promoGrid.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - promoGrid.offsetLeft;
            const walk = (x - startPos) * 1.5; // Ajuste a sensibilidade (1.5x mais rápido)
            promoGrid.scrollLeft = scrollLeft - walk;
        });

        // Adiciona eventos de touch para dispositivos móveis
        promoGrid.addEventListener('touchstart', (e) => {
             startPos = e.touches[0].pageX - promoGrid.offsetLeft;
             scrollLeft = promoGrid.scrollLeft;
             promoGrid.style.scrollBehavior = 'auto';
        }, {passive: true});

        promoGrid.addEventListener('touchend', () => {
             promoGrid.style.scrollBehavior = 'smooth';
        });

        promoGrid.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const x = e.touches[0].pageX - promoGrid.offsetLeft;
                const walk = (x - startPos) * 1.5;
                promoGrid.scrollLeft = scrollLeft - walk;
            }
        }, {passive: true});
    }

    // --- 4. LÓGICA DE AUTOCOMPLETAR/SUGESTÕES (MELHORIA DE ACESSIBILIDADE) ---
    const CIDADES_MOCK = [
        { nome: 'SÃO PAULO', sigla: 'SP' },
        { nome: 'RIO DE JANEIRO', sigla: 'RJ' },
        { nome: 'SALVADOR', sigla: 'BA' },
        { nome: 'FORTALEZA', sigla: 'CE' },
        { nome: 'RECIFE', sigla: 'PE' },
        { nome: 'CURITIBA', sigla: 'PR' },
        { nome: 'BELO HORIZONTE', sigla: 'MG' },
        { nome: 'BRASÍLIA', sigla: 'DF' }
    ];

    function setupAutocomplete(inputElement) {
        const inputWrapper = inputElement.closest('.input-wrapper');
        const suggestionsUL = document.getElementById(inputElement.getAttribute('aria-controls'));
        if (!suggestionsUL) return;

        let selectedIndex = -1;
        
        const filterSuggestions = (query) => {
            suggestionsUL.innerHTML = ''; 
            selectedIndex = -1; // Reseta a seleção ao digitar
            
            const filtered = CIDADES_MOCK.filter(cidade => 
                cidade.nome.toLowerCase().includes(query.toLowerCase())
            );

            if (query.length > 0 && filtered.length > 0) {
                filtered.forEach((cidade, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${cidade.nome}, ${cidade.sigla}`;
                    li.setAttribute('role', 'option');
                    li.setAttribute('id', `${inputElement.id}-option-${index}`);
                    
                    li.addEventListener('click', () => {
                        inputElement.value = cidade.nome;
                        suggestionsUL.style.display = 'none';
                        inputElement.setAttribute('aria-expanded', 'false');
                        inputElement.focus();
                    });
                    suggestionsUL.appendChild(li);
                });
                suggestionsUL.style.display = 'block';
                inputElement.setAttribute('aria-expanded', 'true');
                inputElement.setAttribute('aria-activedescendant', '');
            } else {
                suggestionsUL.style.display = 'none';
                inputElement.setAttribute('aria-expanded', 'false');
            }
        };
        
        // --- Novo: Lógica de Navegação por Teclado (Setas para cima/baixo) ---
        inputElement.addEventListener('keydown', (e) => {
            const options = suggestionsUL.querySelectorAll('li[role="option"]');
            
            if (options.length === 0 || suggestionsUL.style.display === 'none') return;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex < options.length - 1) ? selectedIndex + 1 : 0;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : options.length - 1;
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    options[selectedIndex].click(); // Simula o clique
                }
                return;
            } else if (e.key === 'Escape') {
                suggestionsUL.style.display = 'none';
                inputElement.setAttribute('aria-expanded', 'false');
                return;
            }
            
            // Atualiza a seleção
            options.forEach(opt => opt.classList.remove('active-select'));
            if (selectedIndex >= 0) {
                const activeOption = options[selectedIndex];
                activeOption.classList.add('active-select');
                
                // Atualiza o ARIA para leitores de tela
                inputElement.setAttribute('aria-activedescendant', activeOption.id);
                
                // Garante que o item esteja visível na lista
                activeOption.scrollIntoView({ block: 'nearest' });
            }
        });


        inputElement.addEventListener('input', (e) => filterSuggestions(e.target.value));
        
        // Esconder sugestões ao clicar fora
        document.addEventListener('click', (e) => {
            if (!inputWrapper.contains(e.target) && !suggestionsUL.contains(e.target)) {
                suggestionsUL.style.display = 'none';
                inputElement.setAttribute('aria-expanded', 'false');
            }
        });
        
        inputElement.addEventListener('focus', (e) => {
            if (e.target.value.length > 0) {
                filterSuggestions(e.target.value);
            }
        });
    }

    // Aplica o autocomplete para Origem e Destino
    setupAutocomplete(inputOrigem);
    setupAutocomplete(inputDestino);

    // --- 5. LÓGICA DE PLACEHOLDER PARA DATE PICKER ---
    const inputEntrada = document.getElementById('entrada');
    const inputSaida = document.getElementById('saida');

    // Manteve a simulação de data, mas adicionou a remoção do readonly
    [inputEntrada, inputSaida].forEach(input => {
         // Em ambientes móveis, o input type="date" é melhor que readonly
         if (window.innerWidth < 768) {
             input.setAttribute('type', 'date');
             input.removeAttribute('readonly');
         } else {
             // Mantém o readonly no desktop para simular o DatePicker customizado
             input.addEventListener('click', () => {
                 console.log(`Simulando abertura do DatePicker para: ${input.id}`);
                 if (input.id === 'entrada' && !input.value) {
                     input.value = '10/01/2026'; 
                 } else if (input.id === 'saida' && !input.value) {
                     input.value = '20/01/2026';
                 }
             });
         }
    });

});