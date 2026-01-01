// Estado inicial de socios no-jugadores
let sociosState = {
    count: 0,
    satisfaction: 50,
    weeklyFee: 80, // Cuota semanal de socios
    maxCapacity: 0, // Dependerá de las instalaciones
    members: [] // Lista de socios individuales
};

// Inicializar sistema de socios
function initializeSocios() {
    sociosState.count = 0;
    sociosState.satisfaction = 50;
    updateMaxCapacity();
    updateStats();
}

// Actualizar capacidad máxima basada en instalaciones
function updateMaxCapacity() {
    let capacity = 0;
    
    if (window.improvementsModule) {
        const facilities = window.improvementsModule.improvementsState.facilities;
        
        // El bar y la piscina aumentan la capacidad de socios
        if (facilities.bar.level > 0) {
            capacity += facilities.bar.capacity;
        }
        
        if (facilities.pool.level > 0) {
            capacity += facilities.pool.capacity;
        }
        
        // Las áreas comunes también atraen socios
        if (facilities.lockerRooms.level > 1) {
            capacity += 10;
        }
    }
    
    sociosState.maxCapacity = capacity;
}

// Actualizar número de socios basado en instalaciones y reputación
function updateSociosCount() {
    updateMaxCapacity();
    
    if (sociosState.maxCapacity === 0) {
        // Sin instalaciones para socios, no hay socios
        return;
    }
    
    // La reputación afecta la atracción de socios
    const targetSocios = Math.min(
        sociosState.maxCapacity,
        Math.floor(gameState.reputation / 8) + 2
    );
    
    // Probabilidad base de atraer socios
    let attractionProbability = 0.2; // 20% base
    
    // Mejor reputación aumenta la probabilidad
    if (gameState.reputation > 70) {
        attractionProbability += 0.1;
    }
    
    // Bar y piscina aumentan la atracción
    if (window.improvementsModule) {
        const facilities = window.improvementsModule.improvementsState.facilities;
        if (facilities.bar.level > 0) attractionProbability += 0.15;
        if (facilities.pool.level > 0) attractionProbability += 0.2;
    }
    
    // Atraer nuevos socios
    if (sociosState.count < targetSocios && Math.random() < attractionProbability) {
        const newSocio = {
            id: sociosState.members.length,
            name: generateSocioName(),
            joinDate: Date.now(),
            satisfaction: 70 + Math.floor(Math.random() * 20),
            membershipType: Math.random() < 0.3 ? 'premium' : 'standard'
        };
        
        sociosState.members.push(newSocio);
        sociosState.count++;
        
        showNotification(`¡Nuevo socio: ${newSocio.name}!`, 'success');
        updateStats();
    }
    
    // Socios insatisfechos pueden irse
    if (sociosState.satisfaction < 30 && sociosState.count > 0) {
        if (Math.random() < 0.1) {
            const leavingSocio = sociosState.members.pop();
            if (leavingSocio) {
                sociosState.count--;
                showNotification(`${leavingSocio.name} canceló su membresía`, 'warning');
                updateStats();
            }
        }
    }
}

// Generar nombre de socio
function generateSocioName() {
    const names = ['Carlos', 'María', 'Luis', 'Ana', 'Roberto', 'Laura', 'Diego', 'Sofía', 'Javier', 'Valeria'];
    const surnames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'];
    
    return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
}

// Actualizar satisfacción de socios
function updateSociosSatisfaction() {
    if (sociosState.count === 0) return;
    
    let satisfactionChange = 0;
    
    // Calidad de instalaciones afecta satisfacción
    if (window.improvementsModule) {
        const facilities = window.improvementsModule.improvementsState.facilities;
        
        // Bar bien mantenido = +satisfacción
        if (facilities.bar.level > 0 && facilities.bar.condition > 70) {
            satisfactionChange += 2;
        }
        
        // Piscina limpia = +satisfacción
        if (facilities.pool.level > 0 && facilities.pool.condition > 70) {
            satisfactionChange += 3;
        }
        
        // Mantenimiento deficiente = -satisfacción
        if (facilities.bar.condition < 40 || facilities.pool.condition < 40) {
            satisfactionChange -= 5;
        }
    }
    
    // Eventos aleatorios
    if (Math.random() < 0.05) {
        showNotification('¡Los socios disfrutan del evento especial del club!', 'success');
        satisfactionChange += 5;
    }
    
    sociosState.satisfaction = Math.max(0, Math.min(100, sociosState.satisfaction + satisfactionChange));
}

// Procesar ingresos semanales de socios
function processSociosIncome() {
    if (sociosState.count === 0) return 0;
    
    let weeklyIncome = 0;
    
    sociosState.members.forEach(socio => {
        const fee = socio.membershipType === 'premium' ? 
            sociosState.weeklyFee * 2 : sociosState.weeklyFee;
        weeklyIncome += fee;
    });
    
    // Ingresos extra del bar
    if (window.improvementsModule) {
        const barLevel = window.improvementsModule.improvementsState.facilities.bar.level;
        if (barLevel > 0) {
            const barIncome = window.improvementsModule.improvementsState.facilities.bar.benefits[barLevel - 1]?.incomeBonus || 0;
            weeklyIncome += barIncome;
        }
    }
    
    // Registrar en economía
    if (window.economyModule && weeklyIncome > 0) {
        window.economyModule.addTransaction(`Cuotas de ${sociosState.count} socios`, weeklyIncome, 'income');
        gameState.money += weeklyIncome;
    }
    
    return weeklyIncome;
}

// Mostrar panel de socios
function showSociosPanel() {
    // Crear panel si no existe
    if (!document.getElementById('socios-panel')) {
        const panel = document.createElement('aside');
        panel.id = 'socios-panel';
        panel.className = 'panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>👥 Socios del Club</h2>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="panel-content">
                <div class="socios-stats">
                    <div class="stat-item">
                        <span>Total de Socios:</span>
                        <span id="socios-count">${sociosState.count}</span>
                    </div>
                    <div class="stat-item">
                        <span>Capacidad Máxima:</span>
                        <span id="socios-capacity">${sociosState.maxCapacity}</span>
                    </div>
                    <div class="stat-item">
                        <span>Satisfacción:</span>
                        <span id="socios-satisfaction">${sociosState.satisfaction}%</span>
                    </div>
                    <div class="stat-item">
                        <span>Ingreso Semanal:</span>
                        <span id="socios-income">$${sociosState.count * sociosState.weeklyFee}</span>
                    </div>
                </div>
                <div class="socios-info">
                    <h3>Información</h3>
                    <p>Los socios pagan cuotas semanales por usar las instalaciones sociales del club.</p>
                    <p>Construye un bar y piscina para atraer más socios.</p>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }
    
    updateSociosDisplay();
}

// Actualizar display del panel de socios
function updateSociosDisplay() {
    const panel = document.getElementById('socios-panel');
    if (!panel) return;
    
    document.getElementById('socios-count').textContent = sociosState.count;
    document.getElementById('socios-capacity').textContent = sociosState.maxCapacity;
    document.getElementById('socios-satisfaction').textContent = sociosState.satisfaction + '%';
    
    const weeklyIncome = sociosState.count * sociosState.weeklyFee;
    if (window.improvementsModule) {
        const barLevel = window.improvementsModule.improvementsState.facilities.bar.level;
        if (barLevel > 0) {
            const barIncome = window.improvementsModule.improvementsState.facilities.bar.benefits[barLevel - 1]?.incomeBonus || 0;
            document.getElementById('socios-income').textContent = `$${weeklyIncome + barIncome}`;
        } else {
            document.getElementById('socios-income').textContent = `$${weeklyIncome}`;
        }
    }
}

// Exportar funciones
window.sociosModule = {
    sociosState,
    initializeSocios,
    updateSociosCount,
    updateSociosSatisfaction,
    processSociosIncome,
    showSociosPanel,
    updateSociosDisplay
};

console.log("Módulo de Socios cargado");
