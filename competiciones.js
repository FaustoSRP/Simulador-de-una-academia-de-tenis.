// Módulo de Competiciones

// Estado de las competiciones
let competitionsState = {
    availableTournaments: [],
    participatingTournaments: [],
    history: [],
    trophies: {
        gold: 0,
        silver: 0,
        bronze: 0
    }
};

// Tipos de torneos disponibles (niños)
const tournamentTypes = [
    {
        id: 'local',
        name: 'Torneo Local',
        minLevel: 20,
        difficulty: 1,
        entryFee: 100,
        rewardMoney: 500,
        rewardReputation: 5,
        minParticipants: 2,
        category: 'children'
    },
    {
        id: 'interclub',
        name: 'Interclub',
        minLevel: 35,
        difficulty: 2,
        entryFee: 250,
        rewardMoney: 1500,
        rewardReputation: 10,
        minParticipants: 3,
        category: 'children'
    },
    {
        id: 'regional',
        name: 'Campeonato Regional',
        minLevel: 50,
        difficulty: 3,
        entryFee: 500,
        rewardMoney: 3000,
        rewardReputation: 15,
        minParticipants: 4,
        category: 'children'
    },
    {
        id: 'national',
        name: 'Campeonato Nacional',
        minLevel: 70,
        difficulty: 4,
        entryFee: 1000,
        rewardMoney: 10000,
        rewardReputation: 25,
        minParticipants: 5,
        category: 'children'
    }
];

// Tipos de torneos de adultos
const adultTournamentTypes = [
    {
        id: 'beginners_cup',
        name: 'Copa de Principiantes',
        minLevel: 25,
        difficulty: 0.5,
        entryFee: 50,
        rewardMoney: 300,
        rewardReputation: 3,
        minParticipants: 2,
        category: 'adults'
    },
    {
        id: 'amateur_league',
        name: 'Liga Amateur Adultos',
        minLevel: 30,
        difficulty: 1,
        entryFee: 150,
        rewardMoney: 800,
        rewardReputation: 4,
        minParticipants: 2,
        category: 'adults'
    },
    {
        id: 'senior_tournament',
        name: 'Torneo Senior',
        minLevel: 50,
        difficulty: 2,
        entryFee: 300,
        rewardMoney: 2000,
        rewardReputation: 8,
        minParticipants: 2,
        category: 'adults'
    },
    {
        id: 'professional_championship',
        name: 'Campeonato Profesional',
        minLevel: 75,
        difficulty: 4,
        entryFee: 800,
        rewardMoney: 8000,
        rewardReputation: 20,
        minParticipants: 1,
        requiresProfessional: true,
        category: 'adults'
    }
];

// Generar torneos disponibles mensualmente
function generateAvailableTournaments() {
    competitionsState.availableTournaments = [];

    // === TORNEOS DE NIÑOS ===
    // Siempre hay torneos locales
    competitionsState.availableTournaments.push({
        ...tournamentTypes[0],
        date: generateTournamentDate(),
        id: `local_${Date.now()}`
    });

    // 60% probabilidad de interclub
    if (Math.random() < 0.6) {
        competitionsState.availableTournaments.push({
            ...tournamentTypes[1],
            date: generateTournamentDate(),
            id: `interclub_${Date.now()}`
        });
    }

    // 30% probabilidad de regional
    if (Math.random() < 0.3 && gameState.reputation >= 40) {
        competitionsState.availableTournaments.push({
            ...tournamentTypes[2],
            date: generateTournamentDate(),
            id: `regional_${Date.now()}`
        });
    }

    // 10% probabilidad de nacional (solo si tienes buena reputación)
    if (Math.random() < 0.1 && gameState.reputation >= 60) {
        competitionsState.availableTournaments.push({
            ...tournamentTypes[3],
            date: generateTournamentDate(),
            id: `national_${Date.now()}`
        });
    }

    // === TORNEOS DE ADULTOS ===
    // 80% probabilidad de copa de principiantes
    if (Math.random() < 0.8 && gameState.adults >= 1) {
        competitionsState.availableTournaments.push({
            ...adultTournamentTypes[0],
            date: generateTournamentDate(),
            id: `beginners_${Date.now()}`
        });
    }
    
    // 70% probabilidad de liga amateur
    if (Math.random() < 0.7 && gameState.adults >= 2) {
        competitionsState.availableTournaments.push({
            ...adultTournamentTypes[1],
            date: generateTournamentDate(),
            id: `amateur_${Date.now()}`
        });
    }

    // 40% probabilidad de torneo senior
    if (Math.random() < 0.4 && gameState.reputation >= 30) {
        competitionsState.availableTournaments.push({
            ...adultTournamentTypes[2],
            date: generateTournamentDate(),
            id: `senior_${Date.now()}`
        });
    }

    // 20% probabilidad de campeonato profesional (requiere adultos profesionales)
    const hasProfessionalAdults = window.adultsModule && adultsModule.getProfessionalAdults().length > 0;
    if (Math.random() < 0.2 && hasProfessionalAdults && gameState.reputation >= 50) {
        competitionsState.availableTournaments.push({
            ...adultTournamentTypes[3],
            date: generateTournamentDate(),
            id: `professional_${Date.now()}`
        });
    }
}

// Generar fecha del torneo
function generateTournamentDate() {
    const daysUntil = Math.floor(Math.random() * 20) + 5; // Entre 5 y 25 días
    return `En ${daysUntil} días`;
}

// Obtener niños elegibles para competir (función movida de niños.js)
function getChildrenForCompetition(minLevel = 30) {
    if (!window.childrenModule || !childrenModule.childrenState) {
        return [];
    }

    return childrenModule.childrenState.skillLevels
        .filter(child => child.level >= minLevel)
        .sort((a, b) => b.level - a.level)
        .slice(0, 5);
}

// Obtener adultos elegibles para competir
function getAdultsForCompetition(minLevel = 30, requireProfessional = false) {
    if (!window.adultsModule || !adultsModule.adultsState) {
        return [];
    }

    let adults = adultsModule.adultsState.skillLevels.filter(adult => adult.level >= minLevel);

    if (requireProfessional) {
        adults = adults.filter(adult => adult.isProfessional);
    }

    return adults.sort((a, b) => b.level - a.level).slice(0, 5);
}

// Inscribir a un torneo
function registerForTournament(tournamentId) {
    const tournament = competitionsState.availableTournaments.find(t => t.id === tournamentId);

    if (!tournament) {
        showNotification("Torneo no encontrado", 'error');
        return false;
    }

    // Verificar dinero
    if (gameState.money < tournament.entryFee) {
        showNotification(`Necesitas $${tournament.entryFee} para inscribirte`, 'error');
        return false;
    }

    let participants;

    // Verificar participantes elegibles según categoría
    if (tournament.category === 'adults') {
        const requirePro = tournament.requiresProfessional || false;
        participants = getAdultsForCompetition(tournament.minLevel, requirePro);
        if (participants.length < tournament.minParticipants) {
            const msg = requirePro
                ? `Necesitas al menos ${tournament.minParticipants} adulto(s) profesional(es) con nivel ${tournament.minLevel}+`
                : `Necesitas al menos ${tournament.minParticipants} adulto(s) con nivel ${tournament.minLevel}+`;
            showNotification(msg, 'error');
            return false;
        }
    } else {
        participants = getChildrenForCompetition(tournament.minLevel);
        if (participants.length < tournament.minParticipants) {
            showNotification(`Necesitas al menos ${tournament.minParticipants} niño(s) con nivel ${tournament.minLevel}+`, 'error');
            return false;
        }
    }

    // Inscribir
    gameState.money -= tournament.entryFee;

    // Mover a torneos participando
    competitionsState.participatingTournaments.push({
        ...tournament,
        participants: participants.slice(0, tournament.minParticipants)
    });

    // Remover de disponibles
    competitionsState.availableTournaments = competitionsState.availableTournaments.filter(t => t.id !== tournamentId);

    showNotification(`¡Inscrito en ${tournament.name}! -$${tournament.entryFee}`, 'success');
    updateStats();

    return true;
}

// Simular resultado del torneo (evento "Torneo infantil" expandido - movido de niños.js)
function simulateTournamentResult(tournament) {
    const participants = tournament.participants;
    const avgLevel = participants.reduce((sum, p) => sum + p.level, 0) / participants.length;

    // Factor de profesores (calidad de entrenamiento)
    let teacherBonus = 0;
    if (window.childrenModule) {
        teacherBonus = childrenModule.calculateTeacherQualityInfluence() / 100;
    }

    // Probabilidad de éxito basada en nivel promedio, dificultad y profesores
    const baseChance = (avgLevel / 100) * (1 + teacherBonus);
    const adjustedChance = baseChance / tournament.difficulty;

    const random = Math.random();
    let result;

    if (random < adjustedChance * 0.3) {
        // 1er lugar
        result = 'gold';
        competitionsState.trophies.gold++;
        gameState.money += tournament.rewardMoney;
        gameState.reputation = Math.min(100, gameState.reputation + tournament.rewardReputation);
        showNotification(`🥇 ¡${participants[0].name} ganó el ${tournament.name}! +$${tournament.rewardMoney}, +${tournament.rewardReputation}% reputación`, 'success');
    } else if (random < adjustedChance * 0.6) {
        // 2do lugar
        result = 'silver';
        competitionsState.trophies.silver++;
        const reward = Math.floor(tournament.rewardMoney * 0.5);
        const repReward = Math.floor(tournament.rewardReputation * 0.6);
        gameState.money += reward;
        gameState.reputation = Math.min(100, gameState.reputation + repReward);
        showNotification(`🥈 ¡Segundo lugar en ${tournament.name}! +$${reward}, +${repReward}% reputación`, 'success');
    } else if (random < adjustedChance * 0.9) {
        // 3er lugar
        result = 'bronze';
        competitionsState.trophies.bronze++;
        const reward = Math.floor(tournament.rewardMoney * 0.25);
        const repReward = Math.floor(tournament.rewardReputation * 0.3);
        gameState.money += reward;
        gameState.reputation = Math.min(100, gameState.reputation + repReward);
        showNotification(`🥉 Tercer lugar en ${tournament.name}. +$${reward}, +${repReward}% reputación`, 'success');
    } else {
        // No ganó
        result = 'none';
        showNotification(`Participación en ${tournament.name}. Buena experiencia para los niños.`, 'info');
    }

    // Agregar al historial
    competitionsState.history.unshift({
        tournament: tournament.name,
        result,
        participants: participants.map(p => p.name),
        date: `Mes ${gameState.month}, Año ${gameState.year}`
    });

    // Mantener solo últimos 20 resultados
    if (competitionsState.history.length > 20) {
        competitionsState.history = competitionsState.history.slice(0, 20);
    }

    updateStats();
}

// Procesar torneos pendientes (llamado cuando pasa tiempo)
function processActiveTournaments() {
    // Simular que un torneo se completa aleatoriamente
    if (competitionsState.participatingTournaments.length > 0 && Math.random() < 0.2) {
        const tournament = competitionsState.participatingTournaments.shift();
        simulateTournamentResult(tournament);
    }
}

// Mostrar panel de competiciones
function showCompetitionsPanel() {
    // Remover panel existente si hay uno
    const existingPanel = document.getElementById('competitions-panel');
    if (existingPanel) {
        existingPanel.remove();
    }

    // Crear panel
    const panel = document.createElement('div');
    panel.id = 'competitions-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 700px;
        max-height: 85vh;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 2000;
        overflow: hidden;
    `;

    // Actualizar torneos disponibles si no hay
    if (competitionsState.availableTournaments.length === 0) {
        generateAvailableTournaments();
    }

    // Top 10 niños
    const top10Children = window.childrenModule ? childrenModule.getTopChildren(10) : [];
    // Top 5 adultos
    const top5Adults = window.adultsModule ? adultsModule.getTopAdults(5) : [];
    // Profesionales (ex-alumnos)
    const professionals = window.childrenModule ? childrenModule.childrenState.professionalPlayers : [];

    // Separar torneos por categoría
    const childTournaments = competitionsState.availableTournaments.filter(t => t.category === 'children');
    const adultTournaments = competitionsState.availableTournaments.filter(t => t.category === 'adults');

    panel.innerHTML = `
        <div style="background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 20px; position: relative;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); 
                           border: none; color: white; font-size: 24px; width: 40px; height: 40px; 
                           border-radius: 50%; cursor: pointer; display: flex; align-items: center; 
                           justify-content: center;">×</button>
            <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
                🏆 Competiciones
                <span style="font-size: 14px; opacity: 0.8;">
                    🥇${competitionsState.trophies.gold} 🥈${competitionsState.trophies.silver} 🥉${competitionsState.trophies.bronze}
                </span>
            </h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">
                Profesionales graduados: ${professionals.length} | Ex-alumnos en el circuito pro
            </p>
        </div>
        
        <div style="padding: 20px; max-height: 500px; overflow-y: auto;">
            
            <!-- TOP 10 NIÑOS -->
            <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #f39c12; padding-bottom: 5px;">
                👶 Top 10 Niños
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px;">
                ${top10Children.length === 0 ? '<p style="color: #666; grid-column: 1/3;">No hay niños registrados</p>' :
            top10Children.map((child, i) => `
                        <div style="background: ${child.level >= 70 ? '#fff3cd' : child.level >= 50 ? '#d4edda' : '#f8f9fa'}; 
                                    padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;
                                    border-left: 3px solid ${child.level >= 70 ? '#ffc107' : child.level >= 50 ? '#28a745' : '#6c757d'};">
                            <span>${i + 1}. ${child.name}</span>
                            <span style="font-weight: bold; color: ${child.level >= 70 ? '#856404' : child.level >= 50 ? '#155724' : '#333'};">
                                Nv. ${Math.floor(child.level)}/${child.potential}
                            </span>
                        </div>
                    `).join('')
        }
            </div>
            
            <!-- TOP 5 ADULTOS -->
            ${top5Adults.length > 0 ? `
                <h3 style="color: #333; border-bottom: 2px solid #17a2b8; padding-bottom: 5px;">
                    👤 Top 5 Adultos
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px;">
                    ${top5Adults.map((adult, i) => `
                        <div style="background: ${adult.isProfessional ? '#cce5ff' : '#f8f9fa'}; 
                                    padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;
                                    border-left: 3px solid ${adult.isProfessional ? '#007bff' : '#6c757d'};">
                            <span>${i + 1}. ${adult.name} ${adult.isProfessional ? '⭐' : ''}</span>
                            <span style="font-weight: bold;">Nv. ${Math.floor(adult.level)}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- TORNEOS DE NIÑOS -->
            <h3 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 5px;">
                🎾 Torneos Infantiles
            </h3>
            ${childTournaments.length === 0 ?
            '<p style="color: #666;">No hay torneos de niños disponibles.</p>' :
            childTournaments.map(t => renderTournamentCard(t, 'children')).join('')
        }
            
            <!-- TORNEOS DE ADULTOS -->
            <h3 style="color: #333; border-bottom: 2px solid #17a2b8; padding-bottom: 5px; margin-top: 20px;">
                🏅 Torneos de Adultos
            </h3>
            ${adultTournaments.length === 0 ?
            '<p style="color: #666;">No hay torneos de adultos disponibles. Necesitas al menos 2 adultos.</p>' :
            adultTournaments.map(t => renderTournamentCard(t, 'adults')).join('')
        }
            
            ${competitionsState.participatingTournaments.length > 0 ? `
                <h3 style="color: #333; margin-top: 20px; border-bottom: 2px solid #4caf50; padding-bottom: 5px;">
                    ✅ Torneos Inscriptos
                </h3>
                ${competitionsState.participatingTournaments.map(t => `
                    <div style="background: #e8f5e9; border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 4px solid #4caf50;">
                        <strong>${t.name}</strong> <span style="font-size: 12px;">(${t.category === 'adults' ? 'Adultos' : 'Niños'})</span>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
                            👥 ${t.participants.map(p => p.name).join(', ')}
                        </div>
                    </div>
                `).join('')}
            ` : ''}
            
            ${competitionsState.history.length > 0 ? `
                <h3 style="color: #333; margin-top: 20px;">📜 Historial</h3>
                ${competitionsState.history.slice(0, 5).map(h => `
                    <div style="background: #f0f0f0; border-radius: 5px; padding: 10px; margin-bottom: 5px; font-size: 14px;">
                        ${getResultEmoji(h.result)} ${h.tournament} - ${h.date}
                    </div>
                `).join('')}
            ` : ''}
        </div>
        
        <div style="padding: 15px; border-top: 1px solid #eee; text-align: right;">
            <button onclick="competitionsModule.generateAvailableTournaments(); competitionsModule.showCompetitionsPanel();" 
                    style="background: #17a2b8; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                🔄 Nuevos Torneos
            </button>
            <button onclick="document.getElementById('competitions-panel').remove()" 
                    style="background: #6c757d; color: white; border: none; padding: 10px 25px; border-radius: 5px; cursor: pointer;">
                Cerrar
            </button>
        </div>
    `;

    document.body.appendChild(panel);
}

// Renderizar tarjeta de torneo
function renderTournamentCard(t, category) {
    const participantType = category === 'adults' ? 'adulto(s)' : 'niño(s)';
    const proLabel = t.requiresProfessional ? ' (Pro requerido)' : '';

    return `
        <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 4px solid ${getTournamentColor(t.difficulty)};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 16px;">${t.name}</strong>${proLabel}
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        📅 ${t.date} | 🎯 Nivel: ${t.minLevel}+ | 👥 Min. ${t.minParticipants} ${participantType}
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        💰 $${t.entryFee} | 🏆 Premio: $${t.rewardMoney} (+${t.rewardReputation}% rep)
                    </div>
                </div>
                <button onclick="competitionsModule.registerForTournament('${t.id}')" 
                        style="background: ${getTournamentColor(t.difficulty)}; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Inscribir
                </button>
            </div>
        </div>
    `;
}

// Obtener color según dificultad del torneo
function getTournamentColor(difficulty) {
    const colors = ['#28a745', '#17a2b8', '#ffc107', '#dc3545'];
    return colors[difficulty - 1] || '#6c757d';
}

// Obtener emoji según resultado
function getResultEmoji(result) {
    const emojis = { gold: '🥇', silver: '🥈', bronze: '🥉', none: '📋' };
    return emojis[result] || '📋';
}

// Exportar módulo
window.competitionsModule = {
    competitionsState,
    generateAvailableTournaments,
    getChildrenForCompetition,
    registerForTournament,
    processActiveTournaments,
    showCompetitionsPanel
};

console.log("Módulo de Competiciones cargado");
