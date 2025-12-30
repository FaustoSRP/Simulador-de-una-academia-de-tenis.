// Módulo de Eventos

// Sistema de eventos aleatorios
function triggerRandomEvent() {
    const events = [
        {
            title: "¡Profesor destacado!",
            description: "Uno de tus profesores dio una clase excepcional",
            effect: () => {
                const gain = Math.floor(Math.random() * 5) + 3;
                gameState.reputation = Math.min(100, gameState.reputation + gain);
                showNotification(`¡Excelente clase! +${gain}% reputación`, 'success');
            }
        },
        {
            title: "Error del profesor",
            description: "Un profesor cometió un error grave en una clase",
            effect: () => {
                if (hiredTeachers.length > 0) {
                    const randomTeacher = hiredTeachers[Math.floor(Math.random() * hiredTeachers.length)];
                    teachersModule.teacherMakesMistake(randomTeacher);
                }
            }
        },
        {
            title: "Quejas de padres",
            description: "Algunos padres se quejaron del método de enseñanza",
            effect: () => {
                const loss = Math.floor(Math.random() * 5) + 3;
                gameState.reputation = Math.max(0, gameState.reputation - loss);
                showNotification(`Quejas de padres. -${loss}% reputación`, 'warning');
            }
        },
        {
            title: "Artículo en periódico",
            description: "Tu escuela fue mencionada positivamente en un artículo",
            effect: () => {
                const gain = Math.floor(Math.random() * 10) + 5;
                gameState.reputation = Math.min(100, gameState.reputation + gain);
                gameState.children = Math.min(30, gameState.children + Math.floor(Math.random() * 2) + 1);
                showNotification(`¡Publicidad positiva! +${gain}% reputación`, 'success');
            }
        },
        {
            title: "Lesión de alumno",
            description: "Un alumno se lesionó durante una clase",
            effect: () => {
                const loss = Math.floor(Math.random() * 10) + 5;
                gameState.reputation = Math.max(0, gameState.reputation - loss);
                if (gameState.children > 0) {
                    gameState.children--;
                }
                showNotification(`Lesión en clase. -${loss}% reputación, -1 niño`, 'error');
            }
        },
        {
            title: "Patrocinio nuevo",
            description: "Una empresa local quiere patrocinar tu escuela",
            effect: () => {
                const money = Math.floor(Math.random() * 3000) + 2000;
                gameState.money += money;
                gameState.reputation = Math.min(100, gameState.reputation + 3);
                showNotification(`¡Nuevo patrocinio! +$${money}, +3% reputación`, 'success');
            }
        }
    ];
    
    // Probabilidad de evento (30% cada 10 segundos para pruebas)
    if (Math.random() < 0.3) {
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        updateStats();
    }
}

// Sistema de reputación basado en calidad
function updateReputationBasedOnQuality() {
    if (hiredTeachers.length === 0) {
        gameState.reputation = Math.max(0, gameState.reputation - 1);
        return;
    }
    
    const avgSkill = hiredTeachers.reduce((sum, t) => sum + t.skill, 0) / hiredTeachers.length;
    const avgPatience = hiredTeachers.reduce((sum, t) => sum + t.patience, 0) / hiredTeachers.length;
    
    // La reputación tiende hacia el promedio de calidad
    const targetReputation = Math.floor((avgSkill + avgPatience) / 2);
    
    if (gameState.reputation < targetReputation) {
        gameState.reputation = Math.min(targetReputation, gameState.reputation + 1);
    } else if (gameState.reputation > targetReputation) {
        gameState.reputation = Math.max(targetReputation, gameState.reputation - 0.5);
    }
}

console.log("Módulo de Eventos cargado");
