// Módulo de Eventos

// Sistema de eventos aleatorios
// Sistema de eventos aleatorios con pesos
function triggerRandomEvent() {
    const events = [
        {
            title: "Padre satisfecho recomienda la escuela",
            description: "Un padre está muy contento y trae a sus amigos",
            weight: 15,
            effect: () => {
                gameState.reputation = Math.min(100, gameState.reputation + 3);
                // Asegurar consistencia en el conteo de alumnos
                gameState.children += 2;
                if (window.childrenModule) {
                    for(let i=0; i<2; i++) {
                        childrenModule.childrenState.skillLevels.push({
                            id: childrenModule.childrenState.skillLevels.length,
                            name: academyUtils.generateRandomName('children'),
                            level: Math.floor(Math.random() * 20) + 10,
                            progressRate: Math.random() * 2 + 0.5,
                            potential: Math.floor(Math.random() * 30) + 70
                        });
                    }
                    childrenModule.childrenState.count = gameState.children;
                }
                gameState.students = gameState.children + gameState.adults;
                showNotification("¡+2 nuevos alumnos por recomendación! +3% reputación", 'success');
            }
        },
        {
            title: "Torneo local exitoso",
            description: "Tu escuela organiza un torneo comunitario",
            weight: 12,
            effect: () => {
                gameState.reputation = Math.min(100, gameState.reputation + 5);
                gameState.money += 1000;
                showNotification("¡Torneo exitoso! +5% reputación, +$1000", 'success');
            }
        },
        {
            title: "Festival deportivo escolar",
            description: "Tu escuela participa en el festival deportivo local",
            weight: 12,
            effect: () => {
                gameState.reputation = Math.min(100, gameState.reputation + 2);
                gameState.children += 1;
                if (window.childrenModule) {
                    childrenModule.childrenState.skillLevels.push({
                        id: childrenModule.childrenState.skillLevels.length,
                        name: academyUtils.generateRandomName('children'),
                        level: Math.floor(Math.random() * 20) + 10,
                        progressRate: Math.random() * 2 + 0.5,
                        potential: Math.floor(Math.random() * 30) + 70
                    });
                    childrenModule.childrenState.count = gameState.children;
                }
                gameState.students = gameState.children + gameState.adults;
                showNotification("¡Festival deportivo exitoso! +2% reputación, +1 alumno", 'success');
            }
        },
        {
            title: "Donación de equipamiento",
            description: "Una empresa dona material deportivo",
            weight: 8,
            effect: () => {
                gameState.money += 500;
                if (window.childrenModule) {
                    childrenState.satisfaction = Math.min(100, childrenState.satisfaction + 5);
                }
                showNotification("¡Donación recibida! +$500, +5% satisfacción niños", 'success');
            }
        },
        {
            title: "Exalumno campeón",
            description: "Un exalumno de tu escuela ganó un torneo importante",
            weight: 5,
            effect: () => {
                gameState.reputation = Math.min(100, gameState.reputation + 6);
                gameState.money += 2000;
                showNotification("¡Exalumno campeón! +6% reputación, +$2000 adicionales", 'success');
            }
        },
        {
            title: "¡Profesor destacado!",
            description: "Uno de tus profesores dio una clase excepcional",
            weight: 10,
            effect: () => {
                const gain = Math.floor(Math.random() * 5) + 3;
                gameState.reputation = Math.min(100, gameState.reputation + gain);
                showNotification(`¡Excelente clase! +${gain}% reputación`, 'success');
            }
        },
        {
            title: "Artículo en periódico",
            description: "Tu escuela fue mencionada positivamente en un artículo",
            weight: 8,
            effect: () => {
                const gain = Math.floor(Math.random() * 8) + 4;
                gameState.reputation = Math.min(100, gameState.reputation + gain);
                showNotification(`¡Publicidad positiva! +${gain}% reputación`, 'success');
            }
        },
        // Eventos negativos (reducidos según MD)
        {
            title: "Error del profesor",
            description: "Un profesor cometió un error en una clase",
            weight: 10,
            effect: () => {
                if (hiredTeachers.length > 0) {
                    const randomTeacher = hiredTeachers[Math.floor(Math.random() * hiredTeachers.length)];
                    randomTeacher.morale = Math.max(0, randomTeacher.morale - 10);
                    gameState.reputation = Math.max(0, gameState.reputation - 2);
                    showNotification(`${randomTeacher.name} cometió un error leve. -2% reputación`, 'warning');
                }
            }
        },
        {
            title: "Quejas de padres",
            description: "Algunos padres se quejaron del método de enseñanza",
            weight: 10,
            effect: () => {
                const loss = Math.floor(Math.random() * 3) + 1; // -1% a -3% según MD
                gameState.reputation = Math.max(0, gameState.reputation - loss);
                showNotification(`Quejas de padres. -${loss}% reputación`, 'warning');
            }
        },
        {
            title: "Problema en las canchas",
            description: "Problema menor en las canchas",
            weight: 5,
            effect: () => {
                gameState.money = Math.max(0, gameState.money - 300);
                gameState.reputation = Math.max(0, gameState.reputation - 2);
                showNotification("Problema en canchas: -$300, -2% reputación", 'warning');
            }
        },
        {
            title: "Profesor ausente",
            description: "Un profesor no pudo asistir hoy",
            weight: 5,
            effect: () => {
                if (window.childrenModule) {
                    childrenState.satisfaction = Math.max(0, childrenState.satisfaction - 3);
                }
                showNotification("Profesor ausente. -3% satisfacción niños", 'info');
            }
        },
        // Nuevos eventos especiales
        {
            title: "Fiesta en el bar",
            description: "Los socios organizan una fiesta exitosa",
            weight: 8,
            condition: () => window.improvementsModule && window.improvementsModule.improvementsState.facilities.bar.level > 0,
            effect: () => {
                gameState.money += 800;
                gameState.reputation = Math.min(100, gameState.reputation + 5);
                if (window.sociosModule) {
                    sociosModule.sociosState.satisfaction = Math.min(100, sociosModule.sociosState.satisfaction + 10);
                }
                showNotification("¡Fiesta en el bar! +$800, +5% reputación, +10% satisfacción socios", 'success');
            }
        },
        {
            title: "Torneo de verano en piscina",
            description: "Evento acuático atrae a muchas familias",
            weight: 6,
            condition: () => window.improvementsModule && window.improvementsModule.improvementsState.facilities.pool.level > 0,
            effect: () => {
                gameState.children += 3;
                gameState.adults += 2;
                gameState.students = gameState.children + gameState.adults;
                gameState.reputation = Math.min(100, gameState.reputation + 4);
                showNotification("¡Torneo de verano! +3 niños, +2 adultos, +4% reputación", 'success');
            }
        },
        {
            title: "Socio VIP recomienda el club",
            description: "Un socio influyente trae a sus amigos",
            weight: 5,
            condition: () => window.sociosModule && window.sociosModule.sociosState.count > 0,
            effect: () => {
                if (window.sociosModule) {
                    for(let i=0; i<3; i++) {
                        const newSocio = {
                            id: sociosModule.sociosState.members.length,
                            name: (() => {
                                const names = ['Carlos', 'María', 'Luis', 'Ana', 'Roberto', 'Laura', 'Diego', 'Sofía', 'Javier', 'Valeria'];
                                const surnames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'];
                                return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
                            })(),
                            joinDate: Date.now(),
                            satisfaction: 80,
                            membershipType: 'premium'
                        };
                        sociosModule.sociosState.members.push(newSocio);
                    }
                    sociosModule.sociosState.count += 3;
                    gameState.money += 1000;
                }
                showNotification("¡Socio VIP trae 3 nuevos socios premium! +$1000", 'success');
            }
        },
        {
            title: "Clase especial en canchas nuevas",
            description: "Las múltiples canchas permiten un evento grande",
            weight: 7,
            condition: () => window.improvementsModule && window.improvementsModule.improvementsState.facilities.courts.courtsCount >= 3,
            effect: () => {
                gameState.children += 5;
                gameState.students = gameState.children + gameState.adults;
                gameState.money += 1500;
                gameState.reputation = Math.min(100, gameState.reputation + 6);
                showNotification("¡Clase especial! +5 niños, +$1500, +6% reputación", 'success');
            }
        }
    ];

    // Probabilidad de que ocurra algún evento (40% cada ciclo de tiempo)
    if (Math.random() < 0.4) {
        // Filtrar eventos que cumplen las condiciones
        const availableEvents = events.filter(event => 
            !event.condition || event.condition()
        );
        
        if (availableEvents.length > 0) {
            const totalWeight = availableEvents.reduce((sum, e) => sum + e.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const event of availableEvents) {
                if (random < event.weight) {
                    event.effect();
                    break;
                }
                random -= event.weight;
            }
        }
        updateStats();
    }
}

console.log("Módulo de Eventos cargado");
