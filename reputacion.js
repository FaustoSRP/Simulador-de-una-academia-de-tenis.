// Módulo de Reputación
// Este módulo manejará el sistema de reputación de la escuela

// Estado de reputación
let reputationState = {
    currentReputation: 50,
    sponsors: [],
    issues: [],
    trends: [], // Historial de cambios de reputación
    lastUpdate: Date.now()
};

// Sistema de Sponsors
const sponsorTiers = {
    bronze: { 
        name: "Bronce", 
        minReputation: 20, 
        monthlyIncome: 500, 
        reputationBoost: 1,
        color: "#CD7F32"
    },
    silver: { 
        name: "Plata", 
        minReputation: 40, 
        monthlyIncome: 1200, 
        reputationBoost: 2,
        color: "#C0C0C0"
    },
    gold: { 
        name: "Oro", 
        minReputation: 60, 
        monthlyIncome: 2500, 
        reputationBoost: 3,
        color: "#FFD700"
    },
    platinum: { 
        name: "Platino", 
        minReputation: 80, 
        monthlyIncome: 5000, 
        reputationBoost: 5,
        color: "#E5E4E2"
    }
};

// Nombres de sponsors
const sponsorNames = [
    "Wilson Sports", "Head Equipment", "Babolat Tennis", "Yonex Corp",
    "Nike Tennis", "Adidas Sports", "Asics Athletics", "Prince Tennis",
    "Tecnifibre", "Volkl Tennis", "Pacific Sports", "Gamma Sports"
];

// Inicializar sistema de reputación
function initializeReputation() {
    reputationState.currentReputation = gameState.reputation;
    updateSponsors();
    diagnoseIssues();
}

// Actualizar sponsors basados en reputación
function updateSponsors() {
    const currentTier = getCurrentSponsorTier();
    
    // Remover sponsors que ya califican
    reputationState.sponsors = reputationState.sponsors.filter(sponsor => {
        const tier = sponsorTiers[sponsor.tier];
        return reputationState.currentReputation >= tier.minReputation;
    });
    
    // Agregar nuevos sponsors posibles
    Object.entries(sponsorTiers).forEach(([tierKey, tier]) => {
        if (reputationState.currentReputation >= tier.minReputation) {
            // Verificar si ya tenemos un sponsor de este nivel
            const hasTier = reputationState.sponsors.some(s => s.tier === tierKey);
            
            if (!hasTier && Math.random() < 0.3) { // 30% de probabilidad
                const availableNames = sponsorNames.filter(name => 
                    !reputationState.sponsors.some(s => s.name === name)
                );
                
                if (availableNames.length > 0) {
                    reputationState.sponsors.push({
                        name: availableNames[Math.floor(Math.random() * availableNames.length)],
                        tier: tierKey,
                        monthlyIncome: tier.monthlyIncome,
                        contractMonths: Math.floor(Math.random() * 6) + 6, // 6-12 meses
                        startMonth: gameState.month,
                        startYear: gameState.year
                    });
                    
                    showNotification(`🤝 Nuevo sponsor ${tier.name}: ${reputationState.sponsors[reputationState.sponsors.length - 1].name}`, 'success');
                }
            }
        }
    });
}

// Obtener nivel actual de sponsor
function getCurrentSponsorTier() {
    for (const [tierKey, tier] of Object.entries(sponsorTiers)) {
        if (reputationState.currentReputation >= tier.minReputation) {
            return tierKey;
        }
    }
    return null;
}

// Procesar pagos de sponsors (mensual)
function processSponsorPayments() {
    let totalIncome = 0;
    
    reputationState.sponsors.forEach(sponsor => {
        const monthsActive = (gameState.year - sponsor.startYear) * 12 + 
                           (gameState.month - sponsor.startMonth);
        
        if (monthsActive < sponsor.contractMonths) {
            gameState.money += sponsor.monthlyIncome;
            totalIncome += sponsor.monthlyIncome;
        }
    });
    
    if (totalIncome > 0) {
        showNotification(`💰 Recibido $${totalIncome} de sponsors`, 'success');
        
        // Agregar transacción
        if (window.economyModule) {
            economyModule.addTransaction(`Pagos de sponsors (${reputationState.sponsors.length} sponsors)`, totalIncome, 'income');
        }
    }
    
    // Verificar contratos expirados
    checkExpiredContracts();
}

// Verificar contratos expirados
function checkExpiredContracts() {
    const expiredSponsors = reputationState.sponsors.filter(sponsor => {
        const monthsActive = (gameState.year - sponsor.startYear) * 12 + 
                           (gameState.month - sponsor.startMonth);
        return monthsActive >= sponsor.contractMonths;
    });
    
    expiredSponsors.forEach(sponsor => {
        showNotification(`⏰ Contrato con ${sponsor.name} expiró`, 'warning');
    });
    
    // Remover sponsors expirados
    reputationState.sponsors = reputationState.sponsors.filter(sponsor => {
        const monthsActive = (gameState.year - sponsor.startYear) * 12 + 
                           (gameState.month - sponsor.startMonth);
        return monthsActive < sponsor.contractMonths;
    });
}

// Calcular satisfacción general de alumnos
function calculateOverallSatisfaction() {
    let childrenSatisfaction = 0;
    let adultsSatisfaction = 0;
    let totalStudents = 0;
    
    // Satisfacción de niños
    if (window.childrenModule && childrenState.count > 0) {
        childrenSatisfaction = childrenState.satisfaction * childrenState.count;
        totalStudents += childrenState.count;
    }
    
    // Satisfacción de adultos (ahora dinámica)
    if (window.adultsModule && adultsModule && adultsState.count > 0) {
        adultsSatisfaction = adultsState.satisfaction * adultsState.count;
        totalStudents += adultsState.count;
    }
    
    if (totalStudents === 0) return 0;
    
    return Math.floor((childrenSatisfaction + adultsSatisfaction) / totalStudents);
}

// Diagnosticar problemas de la escuela
function diagnoseIssues() {
    reputationState.issues = [];
    
    // Problemas de personal
    if (hiredTeachers.length === 0) {
        reputationState.issues.push({
            type: 'critical',
            title: 'Sin Profesores',
            description: 'No tienes profesores contratados',
            impact: -20,
            solution: 'Contrata profesores inmediatamente'
        });
    } else {
        // Ratio profesor:alumno considerando horarios diferenciados
        let ratioProblem = false;
        let maxRatio = 0;
        
        // Evaluar niños y adultos por separado
        if (window.childrenModule && childrenState?.count > 0) {
            const childrenRatio = childrenState.count / hiredTeachers.length;
            if (childrenRatio > 15) { // Límite más alto por horarios diferenciados
                reputationState.issues.push({
                    type: 'warning',
                    title: 'Ratio Niños:Profesor Alto',
                    description: `1 profesor cada ${childrenRatio.toFixed(1)} niños (mañana)`,
                    impact: -3,
                    solution: 'Considera contratar más profesores para clases de niños'
                });
                ratioProblem = true;
                maxRatio = Math.max(maxRatio, childrenRatio);
            }
        }
        
        if (window.adultsModule && adultsModule.count > 0) {
            const adultsRatio = adultsModule.count / hiredTeachers.length;
            if (adultsRatio > 12) { // Límite un poco menor para adultos
                reputationState.issues.push({
                    type: 'warning',
                    title: 'Ratio Adultos:Profesor Alto',
                    description: `1 profesor cada ${adultsRatio.toFixed(1)} adultos (tarde/noche)`,
                    impact: -4,
                    solution: 'Optimiza horarios o contrata más profesores'
                });
                ratioProblem = true;
                maxRatio = Math.max(maxRatio, adultsRatio);
            }
        }
        
        // Si no hay problemas de ratio, mostrar mensaje positivo
        if (!ratioProblem && hiredTeachers.length > 0) {
            reputationState.issues.push({
                type: 'info',
                title: 'Horarios Optimizados',
                description: 'Buen uso de profesores en horarios diferenciados',
                impact: 2,
                solution: 'Mantén esta organización'
            });
        }
        
        // Moral baja de profesores
        const avgMorale = hiredTeachers.reduce((sum, t) => sum + t.morale, 0) / hiredTeachers.length;
        if (avgMorale < 30) {
            reputationState.issues.push({
                type: 'warning',
                title: 'Moral Baja de Profesores',
                description: `Moral promedio: ${avgMorale.toFixed(0)}% (carga por doble turno)`,
                impact: -8,
                solution: 'Aumenta salarios o reduce carga horaria'
            });
        }
    }
    
    // Problemas financieros
    if (gameState.money < 2000) {
        reputationState.issues.push({
            type: 'critical',
            title: 'Problemas Financieros',
            description: `Solo tienes $${gameState.money}`,
            impact: -10,
            solution: 'Aumenta cuotas o busca sponsors'
        });
    }
    
    // Problemas de satisfacción
    const satisfaction = calculateOverallSatisfaction();
    if (satisfaction < 40) {
        reputationState.issues.push({
            type: 'warning',
            title: 'Satisfacción Baja',
            description: `Satisfacción general: ${satisfaction}%`,
            impact: -6,
            solution: 'Mejora calidad de enseñanza'
        });
    }
    
    // Problemas de infraestructura (simulados)
    if (Math.random() < 0.1) { // 10% de probabilidad
        const infrastructureIssues = [
            { title: 'Canchas en mal estado', impact: -4 },
            { title: 'Equipamiento obsoleto', impact: -3 },
            { title: 'Falta de iluminación nocturna', impact: -5 },
            { title: 'Vestuarios insuficientes', impact: -2 }
        ];
        
        const issue = infrastructureIssues[Math.floor(Math.random() * infrastructureIssues.length)];
        reputationState.issues.push({
            type: 'info',
            title: issue.title,
            description: 'Problema de infraestructura detectado',
            impact: issue.impact,
            solution: 'Realiza mejoras en la escuela'
        });
    }
}

// Mostrar panel de reputación
function showReputationPanel() {
    // Crear panel si no existe
    if (!document.getElementById('reputation-panel')) {
        const panel = document.createElement('aside');
        panel.id = 'reputation-panel';
        panel.className = 'reputation-panel';
        panel.innerHTML = `
            <h3 style="padding: 20px; margin: 0; color: #333; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                <span>Reputación y Gestión</span>
                <span class="close-reputation" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
            </h3>
            <div style="padding: 20px; max-height: calc(100vh - 80px); overflow-y: auto;">
                <!-- Reputación General -->
                <div class="reputation-overview">
                    <h4>Reputación General</h4>
                    <div class="reputation-bar">
                        <div class="reputation-fill" id="reputation-fill"></div>
                        <span class="reputation-text" id="reputation-text">50%</span>
                    </div>
                    <div class="reputation-details">
                        <span>Nivel actual: <strong id="reputation-level">Regular</strong></span>
                        <span>Cambio: <strong id="reputation-change">+0%</strong></span>
                    </div>
                </div>
                
                <!-- Sponsors -->
                <div class="sponsors-section">
                    <h4>Sponsors Activos</h4>
                    <div id="sponsors-list" class="sponsors-list">
                        <!-- Los sponsors aparecerán aquí -->
                    </div>
                </div>
                
                <!-- Satisfacción -->
                <div class="satisfaction-section">
                    <h4>Satisfacción de Alumnos</h4>
                    <div class="satisfaction-grid">
                        <div class="satisfaction-item">
                            <span>Niños:</span>
                            <div class="satisfaction-bar">
                                <div class="satisfaction-fill children" id="children-satisfaction"></div>
                                <span id="children-satisfaction-text">0%</span>
                            </div>
                        </div>
                        <div class="satisfaction-item">
                            <span>Adultos:</span>
                            <div class="satisfaction-bar">
                                <div class="satisfaction-fill adults" id="adults-satisfaction"></div>
                                <span id="adults-satisfaction-text">0%</span>
                            </div>
                        </div>
                        <div class="satisfaction-item">
                            <span>General:</span>
                            <div class="satisfaction-bar">
                                <div class="satisfaction-fill overall" id="overall-satisfaction"></div>
                                <span id="overall-satisfaction-text">0%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Horarios y Optimización -->
                <div class="schedule-section">
                    <h4>Horarios y Optimización</h4>
                    <div id="schedule-info" class="schedule-info">
                        <!-- La información de horarios aparecerá aquí -->
                    </div>
                </div>
                
                <!-- Diagnóstico de Problemas -->
                <div class="issues-section">
                    <h4>Diagnóstico de Problemas</h4>
                    <div id="issues-list" class="issues-list">
                        <!-- Los problemas aparecerán aquí -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Event listeners
        panel.querySelector('.close-reputation').addEventListener('click', () => {
            panel.classList.remove('show');
        });
    }
    
    const panel = document.getElementById('reputation-panel');
    panel.classList.toggle('show');
    updateReputationDisplay();
}

// Actualizar display de reputación
function updateReputationDisplay() {
    if (!document.getElementById('reputation-panel')) return;
    
    // Actualizar reputación general
    const reputationFill = document.getElementById('reputation-fill');
    const reputationText = document.getElementById('reputation-text');
    const reputationLevel = document.getElementById('reputation-level');
    
    reputationFill.style.width = `${reputationState.currentReputation}%`;
    reputationText.textContent = `${reputationState.currentReputation}%`;
    
    // Determinar nivel
    let level = 'Muy Baja';
    if (reputationState.currentReputation >= 80) level = 'Excelente';
    else if (reputationState.currentReputation >= 60) level = 'Muy Buena';
    else if (reputationState.currentReputation >= 40) level = 'Buena';
    else if (reputationState.currentReputation >= 20) level = 'Regular';
    
    reputationLevel.textContent = level;
    
    // Actualizar sponsors
    const sponsorsList = document.getElementById('sponsors-list');
    sponsorsList.innerHTML = '';
    
    if (reputationState.sponsors.length === 0) {
        sponsorsList.innerHTML = '<p style="color: #666; font-style: italic;">No tienes sponsors activos</p>';
    } else {
        reputationState.sponsors.forEach(sponsor => {
            const tier = sponsorTiers[sponsor.tier];
            const sponsorDiv = document.createElement('div');
            sponsorDiv.className = 'sponsor-item';
            sponsorDiv.style.borderLeft = `4px solid ${tier.color}`;
            sponsorDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: ${tier.color}">${tier.name}</strong>
                        <div style="font-size: 12px; color: #666;">${sponsor.name}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: #28a745;">+$${sponsor.monthlyIncome}/mes</div>
                        <div style="font-size: 11px; color: #666;">
                            ${sponsor.contractMonths - ((gameState.year - sponsor.startYear) * 12 + (gameState.month - sponsor.startMonth))} meses restantes
                        </div>
                    </div>
                </div>
            `;
            sponsorsList.appendChild(sponsorDiv);
        });
    }
    
    // Actualizar satisfacción
    const childrenSat = childrenState?.satisfaction || 0;
    const adultsSat = adultsModule?.adultsState?.satisfaction || 60; // Ahora usa la satisfacción dinámica
    const overallSat = calculateOverallSatisfaction();
    
    document.getElementById('children-satisfaction').style.width = `${childrenSat}%`;
    document.getElementById('children-satisfaction-text').textContent = `${childrenSat}%`;
    
    document.getElementById('adults-satisfaction').style.width = `${adultsSat}%`;
    document.getElementById('adults-satisfaction-text').textContent = `${adultsSat}%`;
    
    document.getElementById('overall-satisfaction').style.width = `${overallSat}%`;
    document.getElementById('overall-satisfaction-text').textContent = `${overallSat}%`;
    
    // Actualizar información de horarios
    updateScheduleDisplay();
    
    // Actualizar problemas
    const issuesList = document.getElementById('issues-list');
    issuesList.innerHTML = '';
    
    if (reputationState.issues.length === 0) {
        issuesList.innerHTML = '<p style="color: #28a745; font-weight: bold;">✅ Todo está funcionando correctamente</p>';
    } else {
        reputationState.issues.forEach(issue => {
            const issueDiv = document.createElement('div');
            issueDiv.className = `issue-item ${issue.type}`;
            issueDiv.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span style="font-weight: bold; margin-right: 10px;">
                        ${issue.type === 'critical' ? '🚨' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                        ${issue.title}
                    </span>
                    <span style="color: ${issue.impact < 0 ? '#dc3545' : '#28a745'};">
                        ${issue.impact > 0 ? '+' : ''}${issue.impact}% reputación
                    </span>
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 5px;">${issue.description}</div>
                <div style="font-size: 12px; color: #007bff; font-style: italic;">
                    💡 Solución: ${issue.solution}
                </div>
            `;
            issuesList.appendChild(issueDiv);
        });
    }
}

// Actualizar display de horarios
function updateScheduleDisplay() {
    const scheduleInfo = document.getElementById('schedule-info');
    if (!scheduleInfo) return;
    
    scheduleInfo.innerHTML = '';
    
    if (hiredTeachers.length === 0) {
        scheduleInfo.innerHTML = '<p style="color: #dc3545; font-style: italic;">Sin profesores contratados</p>';
        return;
    }
    
    // Calcular ratios por horario
    const childrenRatio = childrenState?.count ? (childrenState.count / hiredTeachers.length).toFixed(1) : '0.0';
    const adultsRatio = adultsModule?.adultsState?.count ? (adultsModule.adultsState.count / hiredTeachers.length).toFixed(1) : '0.0';
    
    // Crear visualización de horarios
    const scheduleDiv = document.createElement('div');
    scheduleDiv.innerHTML = `
        <div class="schedule-grid">
            <div class="schedule-slot morning">
                <div class="time-slot">🌅 Mañana (Niños)</div>
                <div class="ratio-info">
                    <span class="ratio-number">${childrenRatio}</span>
                    <span class="ratio-label">alumnos/profesor</span>
                </div>
                <div class="status ${childrenRatio > 15 ? 'warning' : 'good'}">
                    ${childrenRatio > 15 ? '⚠️ Sobrecarga' : '✅ Óptimo'}
                </div>
            </div>
            
            <div class="schedule-slot evening">
                <div class="time-slot">🌆 Tarde/Noche (Adultos)</div>
                <div class="ratio-info">
                    <span class="ratio-number">${adultsRatio}</span>
                    <span class="ratio-label">alumnos/profesor</span>
                </div>
                <div class="status ${adultsRatio > 12 ? 'warning' : 'good'}">
                    ${adultsRatio > 12 ? '⚠️ Sobrecarga' : '✅ Óptimo'}
                </div>
            </div>
        </div>
        
        <div class="efficiency-info">
            <strong>Optimización de Recursos:</strong>
            <div style="margin-top: 5px; font-size: 13px; color: #666;">
                • ${hiredTeachers.length} profesor(es) atienden ambos turnos<br>
                • Ahorro de ${(hiredTeachers.length * 2) - hiredTeachers.length} profesor(es) por horarios diferenciados<br>
                • Eficiencia: ${Math.floor((hiredTeachers.length / (hiredTeachers.length * 2)) * 100)}% de uso de personal
            </div>
        </div>
    `;
    
    scheduleInfo.appendChild(scheduleDiv);
}

// Actualizar reputación (llamado desde otros módulos)
function updateReputation(change, reason) {
    const oldReputation = reputationState.currentReputation;
    reputationState.currentReputation = Math.max(0, Math.min(100, reputationState.currentReputation + change));
    gameState.reputation = reputationState.currentReputation;
    
    // Agregar al historial de tendencias
    reputationState.trends.unshift({
        date: new Date().toISOString(),
        oldValue: oldReputation,
        newValue: reputationState.currentReputation,
        change: change,
        reason: reason
    });
    
    // Mantener solo últimas 50 tendencias
    if (reputationState.trends.length > 50) {
        reputationState.trends = reputationState.trends.slice(0, 50);
    }
    
    // Actualizar sponsors si hubo cambio significativo
    if (Math.abs(change) >= 5) {
        updateSponsors();
    }
    
    // Diagnosticar problemas
    diagnoseIssues();
    
    updateStats();
}

// Exportar funciones
window.reputationModule = {
    reputationState,
    initializeReputation,
    updateSponsors,
    processSponsorPayments,
    calculateOverallSatisfaction,
    diagnoseIssues,
    showReputationPanel,
    updateReputationDisplay,
    updateReputation
};

console.log("Módulo de Reputación cargado");
