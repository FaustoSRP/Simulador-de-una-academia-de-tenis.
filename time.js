// Módulo de Tiempo del Juego

// Estado del tiempo
let gameTime = {
    day: 1,
    month: 1,
    year: 1,
    dayOfWeek: 1, // 1 = Lunes, 7 = Domingo
    speed: 1, // Velocidad del tiempo (1 = normal, 2 = rápido, 3 = muy rápido)
    isPaused: false
};

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysOfWeek = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

// Avanzar un día
function nextDay() {
    gameTime.day++;
    gameTime.dayOfWeek++;

    if (gameTime.dayOfWeek > 7) {
        gameTime.dayOfWeek = 1;
    }

    if (gameTime.day > getDaysInMonth(gameTime.month, gameTime.year)) {
        gameTime.day = 1;
        nextMonth();
    }

    // Verificar eventos semanales (cada 7 días)
    if (gameTime.day % 7 === 0) {
        checkWeeklyEvents();
    }

    updateTimeDisplay();
    checkDailyEvents();
}

// Avanzar un mes
function nextMonth() {
    gameTime.month++;

    if (gameTime.month > 12) {
        gameTime.month = 1;
        gameTime.year++;
    }

    gameState.month = gameTime.month;
    gameState.year = gameTime.year;

    checkMonthlyEvents();
}

// Obtener días en el mes
function getDaysInMonth(month, year) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Año bisiesto
    if (month === 2 && isLeapYear(year)) {
        return 29;
    }

    return daysInMonth[month - 1];
}

// Verificar si es año bisiesto
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Actualizar display del tiempo
function updateTimeDisplay() {
    // Crear display si no existe
    if (!document.getElementById('time-display')) {
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'time-display';
        timeDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 20px;
            border-radius: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-weight: bold;
            z-index: 1000;
        `;
        document.body.appendChild(timeDisplay);
    }

    const timeDisplay = document.getElementById('time-display');
    timeDisplay.innerHTML = `
        ${daysOfWeek[gameTime.dayOfWeek - 1]} ${gameTime.day} de ${months[gameTime.month - 1]} del ${gameTime.year}
        <span style="margin-left: 20px; font-size: 12px; color: #666;">
            Velocidad: ${gameTime.speed}x
        </span>
    `;
}

// Eventos diarios
function checkDailyEvents() {
    // Los fines de semana hay más probabilidades de eventos
    const eventChance = gameTime.dayOfWeek > 5 ? 0.4 : 0.2;

    if (Math.random() < eventChance) {
        // Eventos específicos de niños pueden ir aquí
        if (Math.random() < 0.3 && childrenModule) {
            childrenModule.triggerChildEvent();
        }
    }
}

// Eventos semanales (cada 7 días)
function checkWeeklyEvents() {
    // Procesar pagos semanales de alumnos
    if (window.economyModule) {
        economyModule.processWeeklyPayments();
        economyModule.payWeeklySalaries();
    }
    
    // Procesar ingresos de socios
    if (window.sociosModule) {
        sociosModule.processSociosIncome();
        sociosModule.updateSociosCount();
        sociosModule.updateSociosSatisfaction();
    }
}

// Eventos mensuales
function checkMonthlyEvents() {
    // Procesar pagos de sponsors
    if (window.reputationModule) {
        reputationModule.processSponsorPayments();
    }

    // Procesar mantenimiento automático de infraestructura
    if (window.improvementsModule) {
        improvementsModule.performMaintenance();
    }

    // Evento mensual adicional
    showNotification(`Mes ${gameTime.month} completado`, 'info');
}

// Cambiar velocidad del tiempo
function changeSpeed() {
    gameTime.speed = gameTime.speed >= 5 ? 1 : gameTime.speed + 1;
    updateTimeDisplay();

    // Reiniciar intervalo con nueva velocidad
    if (gameTimeInterval) {
        clearInterval(gameTimeInterval);
        startGameTime();
    }
}

// Pausar/reanudar tiempo
function togglePause() {
    gameTime.isPaused = !gameTime.isPaused;

    if (gameTimeInterval) {
        clearInterval(gameTimeInterval);
        gameTimeInterval = null;
    }

    if (!gameTime.isPaused) {
        startGameTime();
        showNotification("Tiempo reanudado", 'info');
    } else {
        showNotification("Tiempo pausado", 'warning');
    }
}

// Iniciar el tiempo del juego
let gameTimeInterval;
function startGameTime() {
    const interval = gameTime.isPaused ? 0 : (5000 / gameTime.speed); // 5 segundos divididos por velocidad

    gameTimeInterval = setInterval(() => {
        if (!gameTime.isPaused) {
            nextDay();
        }
    }, interval);
}

// Exportar funciones
window.timeModule = {
    gameTime,
    nextDay,
    nextMonth,
    changeSpeed,
    togglePause,
    updateTimeDisplay,
    startGameTime
};

console.log("Módulo de Tiempo cargado");
