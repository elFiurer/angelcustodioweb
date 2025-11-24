// elecciones.js

document.addEventListener('DOMContentLoaded', function () {

    // ====================================================================
    // DATOS DE LOS PARTIDOS POLÍTICOS
    // ====================================================================
    const partidos = [
        {
            id: 1,
            nombre: "Ser Custodiano es cuidar, respetar y progresar",
            siglas: "JUVENTUD CON PROPÓSITO",
            color: "#3B82F6", // Azul
            candidato: "juventud",
            foto: "imagen/juventud.jpg",
            propuestas: [
                "Implementar áreas de estudio recreativas",
                "Mejorar la conectividad WiFi en todo el colegio",
                "Organizar torneos deportivos interaulas mensuales",
                "Crear un programa de tutorías entre estudiantes"
            ]
        },
        {
            id: 2,
            nombre: "Nuestra Escencia es Liderar, nuestra Fuerza eres Tú",
            siglas: "FUERZA CUSTODIANA",
            color: "#EF4444", // Rojo
            candidato: "Carlos Pérez",
            foto: "imagen/osito.jpg",
            propuestas: [
                "Implementar máquinas expendedoras saludables",
                "Crear espacios verdes y áreas de relajación",
                "Establecer un día cultural mensual",
                "Mejorar la infraestructura deportiva"
            ]
        },
        {
            id: 3,
            nombre: "Voto en blanco",
            siglas: "VOTO EN BLANCO",
            color: "#10B981", // Verde
            candidato: "voto en blanco",
            foto: "imagen/votoenblanco.jpg",
            propuestas: [

                "Cuando no sabes por quien votar, vota en blanco",
            ]
        },
        {
            id: 4,
            nombre: "Voto Viciado",
            siglas: "VOTO VICIADO",
            color: "#F59E0B", // Amarillo/Naranja
            candidato: "voto viciado",
            foto: "imagen/viciado.jpg",
            propuestas: [
                "Cuando no apoyas a ningun candidato y quieres anular tu voto, vota viciado",

            ]
        }
    ];

    // ====================================================================
    // SISTEMA DE ALMACENAMIENTO LOCAL
    // ====================================================================
    function getVotes() {
        const votes = localStorage.getItem('elecciones_votos');
        if (votes) {
            return JSON.parse(votes);
        } else {
            // Inicializar votos
            const initialVotes = {};
            partidos.forEach(partido => {
                initialVotes[partido.id] = 0;
            });
            localStorage.setItem('elecciones_votos', JSON.stringify(initialVotes));
            return initialVotes;
        }
    }

    function saveVote(partidoId) {
        const votes = getVotes();
        votes[partidoId] = (votes[partidoId] || 0) + 1;
        localStorage.setItem('elecciones_votos', JSON.stringify(votes));
        return votes;
    }

    function hasVoted() {
        return localStorage.getItem('ha_votado') === 'true';
    }

    function markAsVoted() {
        localStorage.setItem('ha_votado', 'true');
    }

    // ====================================================================
    // RENDERIZAR PARTIDOS
    // ====================================================================
    function renderPartidos() {
        const container = document.getElementById('parties-container');
        container.innerHTML = '';

        partidos.forEach(partido => {
            const card = document.createElement('div');
            card.className = 'party-card bg-white rounded-xl shadow-lg overflow-hidden';
            card.innerHTML = `
                <div class="h-3" style="background-color: ${partido.color}"></div>
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <img src="${partido.foto}" alt="${partido.candidato}" 
                             class="w-20 h-20 rounded-full mr-4 border-4" 
                             style="border-color: ${partido.color}">
                        <div>
                            <h3 class="text-xl font-bold" style="color: ${partido.color}">${partido.siglas}</h3>
                            <p class="text-gray-600 text-sm">${partido.nombre}</p>
                            <p class="text-gray-800 font-semibold mt-1">${partido.candidato}</p>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h4 class="font-bold text-gray-800 mb-2 flex items-center">
                            <i class="fas fa-list-ul mr-2" style="color: ${partido.color}"></i>
                            Propuestas:
                        </h4>
                        <ul class="space-y-2">
                            ${partido.propuestas.map(propuesta => `
                                <li class="text-sm text-gray-700 flex items-start">
                                    <i class="fas fa-check-circle mt-1 mr-2 text-green-500 flex-shrink-0"></i>
                                    <span>${propuesta}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <button onclick="scrollToVote(${partido.id})" 
                            class="vote-btn w-full py-3 rounded-lg text-white font-bold hover:opacity-90 transition"
                            style="background-color: ${partido.color}">
                        <i class="fas fa-vote-yea mr-2"></i>¡Votar por ${partido.siglas}!
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // ====================================================================
    // RENDERIZAR OPCIONES DE VOTO
    // ====================================================================
    function renderVoteOptions() {
        const container = document.getElementById('vote-options');
        container.innerHTML = '';

        partidos.forEach(partido => {
            const option = document.createElement('label');
            option.className = 'flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition h-full';
            // En la función renderVoteOptions()
            option.innerHTML = `
    <input type="radio" name="vote" value="${partido.id}" class="mb-3 w-5 h-5" required>
    
    <img src="${partido.foto}" 
         alt="${partido.candidato}" 
         class="rounded-full mb-3 object-cover" 
         style="width: 100px; height: 100px;">
         
    <div class="text-center">
        <p class="font-bold text-base" style="color: ${partido.color}">${partido.siglas}</p>
        <p class="text-gray-600 text-sm mt-1">${partido.nombre}</p>
        <p class="text-xs font-semibold text-gray-800 mt-2">${partido.candidato}</p>
    </div>
`;
            container.appendChild(option);
        });
    }

    // ====================================================================
    // RENDERIZAR RESULTADOS EN TIEMPO REAL
    // ====================================================================
    function renderResults() {
        const votes = getVotes();
        const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

        document.getElementById('total-votes').textContent = totalVotes;

        // Calcular porcentajes y ordenar por votos
        const results = partidos.map(partido => ({
            ...partido,
            votes: votes[partido.id] || 0,
            percentage: totalVotes > 0 ? ((votes[partido.id] || 0) / totalVotes * 100).toFixed(1) : 0
        })).sort((a, b) => b.votes - a.votes);

        const container = document.getElementById('results-container');
        container.innerHTML = '';

        results.forEach((partido, index) => {
            const resultCard = document.createElement('div');
            resultCard.className = 'bg-white rounded-lg shadow-md p-6';
            resultCard.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <span class="text-2xl font-bold mr-3" style="color: ${partido.color}">
                            ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                        </span>
                        <div>
                            <p class="font-bold text-lg" style="color: ${partido.color}">${partido.siglas}</p>
                            <p class="text-sm text-gray-600">${partido.candidato}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-3xl font-bold" style="color: ${partido.color}">${partido.percentage}%</p>
                        <p class="text-sm text-gray-500">${partido.votes} votos</p>
                    </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div class="progress-bar h-full rounded-full transition-all duration-1000" 
                         style="width: ${partido.percentage}%; background-color: ${partido.color}"></div>
                </div>
            `;
            container.appendChild(resultCard);
        });
    }

   
    // ====================================================================
    // MANEJAR VOTACIÓN (MODO URNA ELECTRÓNICA)
    // ====================================================================
    const voteForm = document.getElementById('vote-form');
    const voteMessage = document.getElementById('vote-message');

    voteForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Validar que haya seleccionado algo
        const selectedVote = document.querySelector('input[name="vote"]:checked');
        if (!selectedVote) {
            showMessage('Por favor selecciona una opción antes de votar.', 'error');
            return;
        }

        // 2. Obtener datos y Guardar voto
        const partidoId = parseInt(selectedVote.value);
        saveVote(partidoId);

        // 3. Actualizar resultados en pantalla
        renderResults();

        // 4. Mostrar mensaje de éxito
        showMessage('¡Voto registrado! La pantalla se reiniciará en 3 segundos...', 'success');

        // 5. REINICIAR AUTOMÁTICAMENTE
        setTimeout(() => {
            // Limpiar formulario (quitar los puntitos)
            voteForm.reset();
            
            // Ocultar el mensaje de éxito
            voteMessage.classList.add('hidden');

            // Quitar el color azul de la opción seleccionada
            document.querySelectorAll('#vote-options label').forEach(label => {
                label.classList.remove('border-blue-500', 'bg-blue-50');
            });

            // Subir la pantalla suavemente para el siguiente alumno
            document.getElementById('vote-form').scrollIntoView({ behavior: 'smooth', block: 'center' });

        }, 3000); // Espera 3 segundos
    });

    function showMessage(message, type) {
        voteMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-yellow-100', 'text-yellow-800');

        if (type === 'success') {
            voteMessage.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            voteMessage.classList.add('bg-red-100', 'text-red-800');
        } else if (type === 'warning') {
            voteMessage.classList.add('bg-yellow-100', 'text-yellow-800');
        }

        voteMessage.textContent = message;
        voteMessage.classList.remove('hidden');
    }

    // ====================================================================
    // FUNCIÓN PARA SCROLL A VOTACIÓN
    // ====================================================================
    window.scrollToVote = function (partidoId) {
        const radioButton = document.querySelector(`input[name="vote"][value="${partidoId}"]`);
        if (radioButton) {
            radioButton.checked = true;
            radioButton.closest('label').classList.add('border-blue-500', 'bg-blue-50');
        }
        document.getElementById('vote-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

   
    

    // ====================================================================
    // INICIALIZACIÓN
    // ====================================================================
    renderPartidos();
    renderVoteOptions();
    renderResults();

    // Actualizar resultados cada 5 segundos
    setInterval(renderResults, 5000);

});
