// Módulo de Mejoras de Infraestructura

// Estado de las mejoras
let improvementsState = {
    facilities: {
        courts: {
            level: 1,
            maxLevel: 5,
            condition: 60,
            capacity: 20,
            costPerLevel: [0, 2000, 4500, 9000, 18000, 35000],
            benefits: [
                { satisfaction: 0, reputation: 0, capacity: 20, attractionBonus: 0 },
                { satisfaction: 5, reputation: 2, capacity: 30, attractionBonus: 0.03 },
                { satisfaction: 10, reputation: 5, capacity: 42, attractionBonus: 0.06 },
                { satisfaction: 15, reputation: 8, capacity: 55, attractionBonus: 0.09 },
                { satisfaction: 20, reputation: 12, capacity: 68, attractionBonus: 0.12 },
                { satisfaction: 25, reputation: 15, capacity: 80, attractionBonus: 0.15 }
            ]
        },
        lighting: {
            level: 1,
            maxLevel: 4,
            condition: 50,
            nightCapacity: 0,
            costPerLevel: [0, 1500, 3500, 7500, 15000],
            benefits: [
                { nightCapacity: 0, satisfaction: 0, reputation: 0, attractionBonus: 0 },
                { nightCapacity: 12, satisfaction: 8, reputation: 3, attractionBonus: 0.04 },
                { nightCapacity: 25, satisfaction: 15, reputation: 6, attractionBonus: 0.08 },
                { nightCapacity: 38, satisfaction: 22, reputation: 10, attractionBonus: 0.12 },
                { nightCapacity: 50, satisfaction: 30, reputation: 15, attractionBonus: 0.16 }
            ]
        },
        equipment: {
            level: 1,
            maxLevel: 5,
            condition: 70,
            quality: 50,
            costPerLevel: [0, 1000, 2500, 5500, 11000, 20000],
            benefits: [
                { quality: 50, satisfaction: 0, reputation: 0, attractionBonus: 0 },
                { quality: 60, satisfaction: 5, reputation: 2, attractionBonus: 0.02 },
                { quality: 70, satisfaction: 10, reputation: 5, attractionBonus: 0.04 },
                { quality: 80, satisfaction: 15, reputation: 8, attractionBonus: 0.06 },
                { quality: 90, satisfaction: 20, reputation: 12, attractionBonus: 0.08 },
                { quality: 100, satisfaction: 25, reputation: 15, attractionBonus: 0.10 }
            ]
        },
        lockerRooms: {
            level: 1,
            maxLevel: 4,
            condition: 40,
            capacity: 15,
            comfort: 30,
            costPerLevel: [0, 2500, 5500, 11000, 20000],
            benefits: [
                { capacity: 15, comfort: 50, satisfaction: 0, reputation: 0, attractionBonus: 0 },
                { capacity: 30, comfort: 65, satisfaction: 8, reputation: 3, attractionBonus: 0.03 },
                { capacity: 45, comfort: 80, satisfaction: 15, reputation: 6, attractionBonus: 0.06 },
                { capacity: 62, comfort: 90, satisfaction: 20, reputation: 10, attractionBonus: 0.09 },
                { capacity: 80, comfort: 100, satisfaction: 25, reputation: 15, attractionBonus: 0.12 }
            ]
        },
        parking: {
            level: 0,
            maxLevel: 3,
            condition: 0,
            spaces: 0,
            costPerLevel: [4000, 5250, 10500],
            benefits: [
                { spaces: 12, satisfaction: 8, reputation: 3, attractionBonus: 0.05 },
                { spaces: 30, satisfaction: 18, reputation: 7, attractionBonus: 0.10 },
                { spaces: 50, satisfaction: 30, reputation: 12, attractionBonus: 0.15 }
            ]
        },
        bar: {
            level: 0,
            maxLevel: 3,
            condition: 0,
            capacity: 0,
            costPerLevel: [3000, 6000, 12000],
            benefits: [
                { capacity: 20, satisfaction: 10, reputation: 5, attractionBonus: 0.08, incomeBonus: 500 },
                { capacity: 40, satisfaction: 20, reputation: 10, attractionBonus: 0.15, incomeBonus: 1000 },
                { capacity: 60, satisfaction: 30, reputation: 15, attractionBonus: 0.22, incomeBonus: 1500 }
            ]
        },
        pool: {
            level: 0,
            maxLevel: 2,
            condition: 0,
            capacity: 0,
            costPerLevel: [6000, 12000],
            benefits: [
                { capacity: 30, satisfaction: 15, reputation: 8, attractionBonus: 0.12, familyAttraction: true },
                { capacity: 60, satisfaction: 30, reputation: 15, attractionBonus: 0.20, familyAttraction: true }
            ]
        }
    },
    maintenanceCosts: {
        courts: 150,
        lighting: 80,
        equipment: 100,
        lockerRooms: 100,
        parking: 42,
        bar: 150,
        pool: 200
    },
    lastMaintenance: Date.now()
};

// Lista de problemas de infraestructura
const infrastructureProblems = [
    {
        id: 'courts_poor',
        facility: 'courts',
        condition: '< 30',
        title: 'Canchas en mal estado',
        description: 'Las canchas necesitan reparación urgente',
        impact: -4,
        solution: 'Reparar canchas (Nivel 2+)'
    },
    {
        id: 'lighting_none',
        facility: 'lighting',
        level: 1,
        title: 'Sin iluminación nocturna',
        description: 'No se pueden usar las canchas de noche',
        impact: -5,
        solution: 'Instalar sistema de iluminación'
    },
    {
        id: 'equipment_old',
        facility: 'equipment',
        condition: '< 40',
        title: 'Equipamiento obsoleto',
        description: 'Las raquetas y pelotas están desgastadas',
        impact: -3,
        solution: 'Actualizar equipamiento'
    },
    {
        id: 'lockers_insufficient',
        facility: 'lockerRooms',
        capacity: '< 20',
        title: 'Vestuarios insuficientes',
        description: 'No hay espacio para todos los alumnos',
        impact: -2,
        solution: 'Ampliar vestuarios'
    },
    {
        id: 'parking_none',
        facility: 'parking',
        level: 0,
        title: 'Sin estacionamiento',
        description: 'Los alumnos tienen dificultades para estacionar',
        impact: -3,
        solution: 'Construir estacionamiento'
    }
];

// Obtener problemas actuales de infraestructura
function getCurrentInfrastructureProblems() {
    return infrastructureProblems.filter(problem => {
        const facility = improvementsState.facilities[problem.facility];

        if (problem.condition) {
            const threshold = parseInt(problem.condition.replace(/[^\d]/g, ''));
            const operator = problem.condition.includes('<') ? '<' : '>';
            return operator === '<' ? facility.condition < threshold : facility.condition > threshold;
        }

        if (problem.level !== undefined) {
            return facility.level === problem.level;
        }

        if (problem.capacity) {
            const threshold = parseInt(problem.capacity.replace(/[^\d]/g, ''));
            const operator = problem.capacity.includes('<') ? '<' : '>';
            return operator === '<' ? facility.capacity < threshold : facility.capacity > threshold;
        }

        return false;
    });
}

// Realizar mejora de infraestructura
function performImprovement(facilityName) {
    const facility = improvementsState.facilities[facilityName];

    if (facility.level >= facility.maxLevel) {
        showNotification(`${getFacilityDisplayName(facilityName)} ya está en el nivel máximo`, 'warning');
        return false;
    }

    const cost = facility.costPerLevel[facility.level + 1];

    if (gameState.money < cost) {
        showNotification(`Necesitas $${cost} para mejorar ${getFacilityDisplayName(facilityName)}`, 'error');
        return false;
    }

    // Realizar mejora
    gameState.money -= cost;
    facility.level++;
    facility.condition = Math.min(100, facility.condition + 30);

    // Aplicar beneficios
    const benefits = facility.benefits[facility.level];
    applyImprovementBenefits(facilityName, benefits);

    // Registrar transacción
    if (window.economyModule) {
        economyModule.addTransaction(`Mejora: ${getFacilityDisplayName(facilityName)} Nivel ${facility.level}`, -cost, 'expense');
    }

    // Actualizar reputación
    if (window.reputationModule) {
        reputationModule.updateReputation(benefits.reputation || 0, `Mejora de ${getFacilityDisplayName(facilityName)}`);
    }

    showNotification(`✅ ${getFacilityDisplayName(facilityName)} mejorado a Nivel ${facility.level}`, 'success');
    updateStats();
    updateImprovementsDisplay();

    return true;
}

// Aplicar beneficios de mejora
function applyImprovementBenefits(facilityName, benefits) {
    // Actualizar capacidades y condiciones
    const facility = improvementsState.facilities[facilityName];

    if (benefits.capacity !== undefined) {
        facility.capacity = benefits.capacity;
    }

    if (benefits.nightCapacity !== undefined) {
        facility.nightCapacity = benefits.nightCapacity;
    }

    if (benefits.quality !== undefined) {
        facility.quality = benefits.quality;
    }

    if (benefits.comfort !== undefined) {
        facility.comfort = benefits.comfort;
    }

    if (benefits.spaces !== undefined) {
        facility.spaces = benefits.spaces;
    }

    // Actualizar satisfacción de alumnos
    if (window.childrenModule && benefits.satisfaction) {
        childrenState.satisfaction = Math.min(100, childrenState.satisfaction + benefits.satisfaction * 0.3);
    }

    if (window.adultsModule && benefits.satisfaction) {
        adultsModule.adultsState.satisfaction = Math.min(100, adultsModule.adultsState.satisfaction + benefits.satisfaction * 0.2);
    }
}

// Mantenimiento de infraestructura
function performMaintenance() {
    let totalCost = 0;

    Object.entries(improvementsState.facilities).forEach(([facilityName, facility]) => {
        if (facility.level > 0) {
            const cost = improvementsState.maintenanceCosts[facilityName];
            totalCost += cost;

            // Mejorar condición con mantenimiento
            facility.condition = Math.min(100, facility.condition + 10);
        }
    });

    if (totalCost > 0) {
        gameState.money -= totalCost;

        if (window.economyModule) {
            economyModule.addTransaction('Mantenimiento de infraestructura', -totalCost, 'expense');
        }

        showNotification(`🔧 Mantenimiento realizado: -$${totalCost}`, 'info');
        updateStats();
    }

    improvementsState.lastMaintenance = Date.now();
}

// Obtener nombre descriptivo de la instalación
function getFacilityDisplayName(facilityName) {
    const names = {
        courts: 'Canchas',
        lighting: 'Iluminación',
        equipment: 'Equipamiento',
        lockerRooms: 'Vestuarios',
        parking: 'Estacionamiento',
        bar: 'Bar',
        pool: 'Piscina'
    };
    return names[facilityName] || facilityName;
}

// Mostrar panel de mejoras
function showImprovementsPanel() {
    // Crear panel si no existe
    if (!document.getElementById('improvements-panel')) {
        const panel = document.createElement('aside');
        panel.id = 'improvements-panel';
        panel.className = 'improvements-panel';
        panel.innerHTML = `
            <h3 style="padding: 20px; margin: 0; color: #333; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                <span>Mejoras de Infraestructura</span>
                <span class="close-improvements" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
            </h3>
            <div style="padding: 20px; max-height: calc(100vh - 80px); overflow-y: auto;">
                <!-- Estado Actual -->
                <div class="current-status">
                    <h4>Estado Actual de la Infraestructura</h4>
                    <div id="facilities-status" class="facilities-grid">
                        <!-- Estado de cada instalación aparecerá aquí -->
                    </div>
                </div>
                
                <!-- Problemas Detectados -->
                <div class="infrastructure-problems">
                    <h4>Problemas Detectados</h4>
                    <div id="problems-list" class="problems-list">
                        <!-- Los problemas aparecerán aquí -->
                    </div>
                </div>
                
                <!-- Mantenimiento -->
                <div class="maintenance-section">
                    <h4>Mantenimiento</h4>
                    <div class="maintenance-info">
                        <p>Costo mensual de mantenimiento: <strong id="maintenance-cost">$0</strong></p>
                        <p>Último mantenimiento: <strong id="last-maintenance">Nunca</strong></p>
                        <button id="perform-maintenance-btn" class="btn btn-primary">Realizar Mantenimiento</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Event listeners
        panel.querySelector('.close-improvements').addEventListener('click', () => {
            panel.classList.remove('show');
        });

        panel.querySelector('#perform-maintenance-btn').addEventListener('click', () => {
            performMaintenance();
        });
    }

    const panel = document.getElementById('improvements-panel');
    panel.classList.toggle('show');
    updateImprovementsDisplay();
}

// Actualizar display de mejoras
function updateImprovementsDisplay() {
    if (!document.getElementById('improvements-panel')) return;

    // Actualizar estado de instalaciones
    const facilitiesStatus = document.getElementById('facilities-status');
    facilitiesStatus.innerHTML = '';

    Object.entries(improvementsState.facilities).forEach(([facilityName, facility]) => {
        const facilityDiv = document.createElement('div');
        facilityDiv.className = 'facility-card';

        const displayName = getFacilityDisplayName(facilityName);
        const conditionColor = facility.condition > 70 ? '#28a745' : facility.condition > 40 ? '#ffc107' : '#dc3545';
        const canUpgrade = facility.level < facility.maxLevel && gameState.money >= facility.costPerLevel[facility.level + 1];

        facilityDiv.innerHTML = `
            <div class="facility-header">
                <h5>${displayName}</h5>
                <span class="facility-level">Nivel ${facility.level}/${facility.maxLevel}</span>
            </div>
            <div class="facility-stats">
                <div class="stat-item">
                    <span>Condición:</span>
                    <div class="condition-bar">
                        <div class="condition-fill" style="width: ${facility.condition}%; background: ${conditionColor};"></div>
                        <span class="condition-text">${facility.condition}%</span>
                    </div>
                </div>
                ${getFacilitySpecificStats(facilityName, facility)}
            </div>
            <div class="facility-actions">
                ${canUpgrade ? `
                    <button class="btn btn-success btn-sm upgrade-btn" data-facility="${facilityName}">
                        Mejorar a Nivel ${facility.level + 1} ($${facility.costPerLevel[facility.level + 1]})
                    </button>
                ` : facility.level >= facility.maxLevel ? `
                    <span class="max-level">✅ Nivel Máximo</span>
                ` : `
                    <span class="insufficient-funds">💰 Insuficiente</span>
                `}
            </div>
        `;

        facilitiesStatus.appendChild(facilityDiv);
    });

    // Agregar event listeners a los botones de mejora
    document.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const facilityName = e.target.dataset.facility;
            performImprovement(facilityName);
        });
    });

    // Actualizar problemas detectados
    const problemsList = document.getElementById('problems-list');
    const currentProblems = getCurrentInfrastructureProblems();

    problemsList.innerHTML = '';

    if (currentProblems.length === 0) {
        problemsList.innerHTML = '<p style="color: #28a745; font-weight: bold;">✅ No hay problemas de infraestructura</p>';
    } else {
        currentProblems.forEach(problem => {
            const problemDiv = document.createElement('div');
            problemDiv.className = 'problem-item';
            problemDiv.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span style="font-weight: bold; margin-right: 10px;">🔧 ${problem.title}</span>
                    <span style="color: #dc3545;">-${Math.abs(problem.impact)}% reputación</span>
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 5px;">${problem.description}</div>
                <div style="font-size: 12px; color: #007bff; font-style: italic;">
                    💡 Solución: ${problem.solution}
                </div>
            `;
            problemsList.appendChild(problemDiv);
        });
    }

    // Actualizar información de mantenimiento
    let totalMaintenanceCost = 0;
    Object.entries(improvementsState.maintenanceCosts).forEach(([facility, cost]) => {
        if (improvementsState.facilities[facility].level > 0) {
            totalMaintenanceCost += cost;
        }
    });

    document.getElementById('maintenance-cost').textContent = `$${totalMaintenanceCost}`;

    const lastMaintenance = improvementsState.lastMaintenance;
    const timeSinceMaintenance = Date.now() - lastMaintenance;
    const daysSinceMaintenance = Math.floor(timeSinceMaintenance / (1000 * 60 * 60 * 24));

    document.getElementById('last-maintenance').textContent =
        daysSinceMaintenance === 0 ? 'Hoy' :
            daysSinceMaintenance === 1 ? 'Ayer' :
                `Hace ${daysSinceMaintenance} días`;
}

// Obtener estadísticas específicas de cada instalación
function getFacilitySpecificStats(facilityName, facility) {
    switch (facilityName) {
        case 'courts':
            return `<div class="stat-item"><span>Capacidad:</span> ${facility.capacity} alumnos</div>`;
        case 'lighting':
            return `<div class="stat-item"><span>Capacidad nocturna:</span> ${facility.nightCapacity} alumnos</div>`;
        case 'equipment':
            return `<div class="stat-item"><span>Calidad:</span> ${facility.quality}%</div>`;
        case 'lockerRooms':
            return `
                <div class="stat-item"><span>Capacidad:</span> ${facility.capacity} personas</div>
                <div class="stat-item"><span>Comodidad:</span> ${facility.comfort}%</div>
            `;
        case 'parking':
            return `<div class="stat-item"><span>Espacios:</span> ${facility.spaces} vehículos</div>`;
        case 'bar':
            return `
                <div class="stat-item"><span>Capacidad:</span> ${facility.capacity} personas</div>
                <div class="stat-item"><span>Ingresos extra:</span> $${facility.benefits[facility.level - 1]?.incomeBonus || 0}/semana</div>
            `;
        case 'pool':
            return `
                <div class="stat-item"><span>Capacidad:</span> ${facility.capacity} personas</div>
                <div class="stat-item"><span>Atractivo familiar:</span> ${facility.benefits[facility.level - 1]?.familyAttraction ? 'Sí' : 'No'}</div>
            `;
        default:
            return '';
    }
}

// Obtener bono de atracción de instalaciones
function getAttractionBonus(facilityName) {
    const facility = improvementsState.facilities[facilityName];
    if (facility && facility.level > 0 && facility.benefits[facility.level - 1]) {
        return facility.benefits[facility.level - 1].attractionBonus || 0;
    }
    return 0;
}

// Exportar funciones
window.improvementsModule = {
    improvementsState,
    getCurrentInfrastructureProblems,
    performImprovement,
    performMaintenance,
    showImprovementsPanel,
    updateImprovementsDisplay,
    getAttractionBonus
};

console.log("Módulo de Mejoras de Infraestructura cargado");
