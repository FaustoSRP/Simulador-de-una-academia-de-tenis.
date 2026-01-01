// Estado del juego
let gameState = {
    money: 5000, // Reducido de 10000 a 5000 para balancear con nuevos salarios
    reputation: 50,
    students: 3,
    teachers: 2,
    adults: 1,
    week: 1,
    children: 2,
    events: []
};

// Historial de eventos
let eventHistory = [];

// Actualizar estadísticas en pantalla
function updateStats() {
    document.getElementById('money').textContent = `$${gameState.money.toLocaleString()}`;
    document.getElementById('reputation').textContent = `${gameState.reputation}%`;
    document.getElementById('students').textContent = gameState.children + gameState.adults;
    document.getElementById('teachers').textContent = hiredTeachers.length;
}

// Cerrar modal
function closeModal() {
    document.getElementById('teacher-modal').classList.remove('show');
}

// Mostrar notificación
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Agregar al historial de eventos
    addToEventHistory(message, type);

    setTimeout(() => {
        notification.remove();
    }, 5000); // 5 segundos como solicitaste
}

// Agregar evento al historial
function addToEventHistory(message, type) {
    const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    eventHistory.unshift({
        message,
        type,
        timestamp
    });

    // Mantener solo los últimos 20 eventos
    if (eventHistory.length > 20) {
        eventHistory = eventHistory.slice(0, 20);
    }

    // Actualizar panel de eventos si está visible
    updateEventPanel();
}

// Actualizar panel de eventos
function updateEventPanel() {
    const eventsPanel = document.getElementById('events-panel');
    if (!eventsPanel) return;

    const eventList = eventsPanel.querySelector('.event-list');
    if (!eventList) return;

    eventList.innerHTML = '';

    eventHistory.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.style.cssText = `
            padding: 10px;
            margin-bottom: 10px;
            background: ${event.type === 'success' ? '#d4edda' : event.type === 'error' ? '#f8d7da' : event.type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            border-left: 4px solid ${event.type === 'success' ? '#28a745' : event.type === 'error' ? '#dc3545' : event.type === 'warning' ? '#ffc107' : '#17a2b8'};
            border-radius: 5px;
            font-size: 14px;
        `;

        eventItem.innerHTML = `
            <div style="font-weight: bold; color: #666; font-size: 12px;">${event.timestamp}</div>
            <div style="margin-top: 3px;">${event.message}</div>
        `;

        eventList.appendChild(eventItem);
    });
}

// Actualizar reputación basada en calidad
function updateReputationBasedOnQuality() {
    if (hiredTeachers.length === 0) {
        if (window.reputationModule) {
            reputationModule.updateReputation(-0.5, 'Sin profesores');
        }
        return;
    }

    const avgSkill = hiredTeachers.reduce((sum, t) => sum + t.skill, 0) / hiredTeachers.length;
    const avgPatience = hiredTeachers.reduce((sum, t) => sum + t.patience, 0) / hiredTeachers.length;
    const avgMorale = hiredTeachers.reduce((sum, t) => sum + t.morale, 0) / hiredTeachers.length;

    const quality = (avgSkill + avgPatience + avgMorale) / 3;

    if (quality > 70) {
        if (window.reputationModule) {
            reputationModule.updateReputation(3, 'Alta calidad de enseñanza');
        }
    } else if (quality > 50) {
        if (window.reputationModule) {
            reputationModule.updateReputation(1.5, 'Calidad aceptable');
        }
    } else if (quality < 30) {
        if (window.reputationModule) {
            reputationModule.updateReputation(-1, 'Baja calidad de enseñanza');
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    updateStats();
    teachersModule.renderCurrentTeachers();
    teachersModule.renderAvailableTeachers();

    // Inicializar niveles de niños
    childrenModule.initializeChildrenLevels();

    // Inicializar niveles de adultos
    if (window.adultsModule) {
        adultsModule.initializeAdultsLevels();
    }

    // Inicializar reputación
    if (window.reputationModule) {
        reputationModule.initializeReputation();
    }

    // Inicializar tiempo del juego si está disponible
    if (window.timeModule) {
        timeModule.updateTimeDisplay();
        timeModule.startGameTime();
    }

    // Botón de Profesores
    document.getElementById('btn-teachers').addEventListener('click', function () {
        const panel = document.getElementById('teachers-panel');
        panel.classList.toggle('show');
    });

    // Tabs del panel de profesores
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const tabName = this.dataset.tab;
            document.getElementById(`${tabName}-teachers`).classList.add('active');
        });
    });

    // Cerrar modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    // Cerrar modal al hacer clic fuera
    document.getElementById('teacher-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Botón de Eventos
    document.getElementById('btn-events').addEventListener('click', function () {
        const panel = document.getElementById('events-panel');
        if (panel) {
            panel.classList.toggle('show');
            updateEventPanel();
        }
    });

    // Botón de Economía
    document.getElementById('btn-economy').addEventListener('click', function () {
        economyModule.showEconomyPanel();
    });

    // Botón de Reputación
    document.getElementById('btn-reputation').addEventListener('click', function () {
        if (window.reputationModule) {
            reputationModule.showReputationPanel();
        } else {
            showNotification('Módulo de Reputación no disponible', 'error');
        }
    });

    // Botón de Mejoras
    document.getElementById('btn-improvements').addEventListener('click', function () {
        if (window.improvementsModule) {
            improvementsModule.showImprovementsPanel();
        } else {
            showNotification('Módulo de Mejoras no disponible', 'error');
        }
    });

    // Botón de Competiciones
    document.getElementById('btn-competitions').addEventListener('click', function () {
        if (window.competitionsModule) {
            competitionsModule.showCompetitionsPanel();
        } else {
            showNotification('Módulo de Competiciones no disponible', 'error');
        }
    });

    // Botón de Pausa
    document.getElementById('btn-pause').addEventListener('click', function () {
        if (window.timeModule) {
            timeModule.togglePause();
            // Actualizar texto del botón
            this.innerHTML = timeModule.gameTime.isPaused ? 
                '<span class="btn-icon">▶️</span><span class="btn-text">Reanudar</span>' : 
                '<span class="btn-icon">⏸️</span><span class="btn-text">Pausar</span>';
        }
    });

    // Atajos de teclado para tiempo
    document.addEventListener('keydown', function (e) {
        if (e.key === ' ') {
            e.preventDefault();
            if (window.timeModule) {
                timeModule.togglePause();
            }
        } else if (e.key === '+' || e.key === '=') {
            if (window.timeModule) {
                timeModule.changeSpeed();
            }
        }
    });

    // Simular paso del tiempo
    setInterval(() => {
        // No ejecutar eventos si el juego está pausado
        if (window.timeModule && timeModule.gameTime.isPaused) {
            return;
        }

        teachersModule.progressTeachers();
        updateReputationBasedOnQuality();
        triggerRandomEvent();
        if (window.childrenModule) {
            childrenModule.updateChildrenCount();
            childrenModule.updateSatisfactionBasedOnTeachers();
            childrenModule.progressChildrenLevels();
            childrenModule.checkProfessionalGraduation(); // Verificar graduación a profesional
            childrenModule.processProfessionalBenefits(); // Donaciones y menciones de profesionales
        }
        // Procesar adultos
        if (window.adultsModule) {
            adultsModule.progressAdultsLevels();
            adultsModule.updateAdultsCount();
            adultsModule.updateAdultsSatisfactionBasedOnTeachers(); // Nueva actualización dinámica
        }
        // Procesar competiciones activas
        if (window.competitionsModule) {
            competitionsModule.processActiveTournaments();
        }
        teachersModule.renderCurrentTeachers();
        updateStats();
    }, 10000); // Cada 10 segundos para pruebas
});

// Efectos de sonido simulados
function playClickSound() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// Inicializar efectos
playClickSound();
