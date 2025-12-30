// Módulo de Niños

// Estado de los niños
let childrenState = {
    count: 10, // Niños iniciales
    satisfaction: 70, // Satisfacción general (0-100)
    complaints: 0, // Número de quejas acumuladas
    talents: [], // Niños con talento especial
    averageLevel: 25, // Nivel promedio de los niños (0-100)
    skillLevels: [], // Nivel individual de cada niño
    professionalPlayers: [] // Ex-alumnos que se volvieron profesionales
};

// Inicializar niveles de niños
function initializeChildrenLevels() {
    childrenState.skillLevels = [];
    for (let i = 0; i < childrenState.count; i++) {
        childrenState.skillLevels.push({
            id: i,
            name: generateChildName(),
            level: Math.floor(Math.random() * 30) + 10, // Nivel inicial entre 10-40
            progressRate: Math.random() * 2 + 0.5, // Tasa de progreso individual
            potential: Math.floor(Math.random() * 30) + 70 // Potencial máximo 70-100
        });
    }
    updateAverageLevel();
}

// Generar nombre de niño
const childFirstNames = ["Mateo", "Sofía", "Lucas", "Valentina", "Sebastián", "Isabella", "Matías", "Camila", "Benjamín", "Valeria", "Daniel", "Martina", "Julián", "Emma", "Thiago", "Olivia"];
const childLastNames = ["García", "Rodríguez", "López", "Martínez", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Díaz"];

function generateChildName() {
    const firstName = childFirstNames[Math.floor(Math.random() * childFirstNames.length)];
    const lastName = childLastNames[Math.floor(Math.random() * childLastNames.length)];
    return `${firstName} ${lastName}`;
}

// Calcular calidad de clase basada en ratio profesor:alumno
function calculateClassQuality() {
    const totalStudents = childrenState.count + gameState.adults;
    const teacherCount = hiredTeachers.length;

    if (teacherCount === 0 || totalStudents === 0) {
        return 0; // Sin profesores o sin alumnos = calidad 0
    }

    const ratio = teacherCount / totalStudents;
    const normalRatio = 0.25; // Ratio normal especificado

    // Calcular calidad basada en el ratio
    let ratioQuality;
    if (ratio >= normalRatio) {
        // Ratio igual o mejor que el normal
        ratioQuality = Math.min(100, (ratio / normalRatio) * 50);
    } else {
        // Ratio peor que el normal
        ratioQuality = (ratio / normalRatio) * 50;
    }

    return Math.floor(ratioQuality);
}

// Calcular influencia de calidad de profesores
function calculateTeacherQualityInfluence() {
    if (hiredTeachers.length === 0) {
        return 0;
    }

    const avgSkill = hiredTeachers.reduce((sum, t) => sum + t.skill, 0) / hiredTeachers.length;
    const avgPatience = hiredTeachers.reduce((sum, t) => sum + t.patience, 0) / hiredTeachers.length;
    const avgMorale = hiredTeachers.reduce((sum, t) => sum + t.morale, 0) / hiredTeachers.length;

    // Combinar habilidades, paciencia y ánimo
    const teacherQuality = (avgSkill + avgPatience + avgMorale) / 3;

    return Math.floor(teacherQuality);
}

// Actualizar nivel promedio de los niños
function updateAverageLevel() {
    if (childrenState.skillLevels.length === 0) {
        childrenState.averageLevel = 0;
        return;
    }

    const totalLevel = childrenState.skillLevels.reduce((sum, child) => sum + child.level, 0);
    childrenState.averageLevel = Math.floor(totalLevel / childrenState.skillLevels.length);
}

// Progresión semanal de los niños
function progressChildrenLevels() {
    const classQuality = calculateClassQuality();
    const teacherQuality = calculateTeacherQualityInfluence();
    const totalInfluence = (classQuality + teacherQuality) / 2;

    childrenState.skillLevels.forEach(child => {
        if (child.level < child.potential) {
            // Progresión basada en influencias y tasa individual
            const progress = (totalInfluence / 100) * child.progressRate * 2;
            child.level = Math.min(child.potential, child.level + progress);
        }
    });

    updateAverageLevel();

    // Eventos especiales de progreso
    if (Math.random() < 0.1) { // 10% de probabilidad
        const talentedChild = childrenState.skillLevels.find(c => c.level > 70 && Math.random() < 0.3);
        if (talentedChild) {
            showNotification(`¡${talentedChild.name} muestra un progreso excepcional!`, 'success');
            gameState.reputation = Math.min(100, gameState.reputation + 2);
        }
    }
}

// Actualizar número de niños basado en reputación
function updateChildrenCount() {
    const targetChildren = Math.floor(gameState.reputation / 5) + 5; // 5 niños base + 1 por cada 5% de reputación

    if (childrenState.count < targetChildren) {
        // Nuevos niños se inscriben
        const newChildren = Math.min(3, targetChildren - childrenState.count);
        for (let i = 0; i < newChildren; i++) {
            childrenState.skillLevels.push({
                id: childrenState.skillLevels.length,
                name: generateChildName(),
                level: Math.floor(Math.random() * 20) + 10, // Nivel inicial 10-30
                progressRate: Math.random() * 2 + 0.5,
                potential: Math.floor(Math.random() * 30) + 70
            });
        }
        childrenState.count += newChildren;
        showNotification(`${newChildren} niño(s) nuevo(s) se inscribieron en la escuela`, 'success');

        // Posibilidad de que sea un niño talentoso
        if (Math.random() < 0.1) {
            const talentName = generateTalentName();
            childrenState.talents.push({
                name: talentName,
                skill: Math.floor(Math.random() * 30) + 70,
                age: Math.floor(Math.random() * 10) + 6
            });
            showNotification(`¡${talentName} es un niño con gran talento!`, 'success');
        }
    } else if (childrenState.count > targetChildren && childrenState.complaints > 0) {
        // Niños se van por mal servicio
        const leavingChildren = Math.min(2, childrenState.count - targetChildren);
        // Remover niños aleatoriamente
        for (let i = 0; i < leavingChildren; i++) {
            if (childrenState.skillLevels.length > 0) {
                const randomIndex = Math.floor(Math.random() * childrenState.skillLevels.length);
                childrenState.skillLevels.splice(randomIndex, 1);
            }
        }
        childrenState.count -= leavingChildren;
        showNotification(`${leavingChildren} niño(s) se retiraron de la escuela`, 'warning');
    }

    gameState.children = childrenState.count;
    updateAverageLevel();
    updateStats();
}

// Generar nombre de niño talentoso
const firstNames = ["Mateo", "Sofía", "Lucas", "Valentina", "Sebastián", "Isabella", "Matías", "Camila", "Benjamín", "Valeria"];
const lastNames = ["García", "Rodríguez", "López", "Martínez", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Díaz"];

function generateTalentName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

// Eventos específicos de niños
function triggerChildEvent() {
    const events = [
        {
            title: "Cumpleaños de niño",
            description: "Es el cumpleaños de uno de los niños",
            effect: () => {
                childrenState.satisfaction = Math.min(100, childrenState.satisfaction + 5);
                showNotification("¡Felicitar al niño por su cumpleaños! +5% satisfacción", 'success');
            }
        },
        {
            title: "Progreso destacado",
            description: "Un niño muestra gran progreso",
            effect: () => {
                gameState.reputation = Math.min(100, gameState.reputation + 2);
                showNotification("¡Un niño muestra gran progreso! +2% reputación", 'success');
            }
        },
        {
            title: "Queja de padres",
            description: "Los padres de un niño se quejan",
            effect: () => {
                childrenState.complaints++;
                childrenState.satisfaction = Math.max(0, childrenState.satisfaction - 10);
                gameState.reputation = Math.max(0, gameState.reputation - 3);
                showNotification("Queja de padres recibida. -3% reputación", 'warning');

                // Si hay muchas quejas, niños se van
                if (childrenState.complaints >= 3) {
                    const leavingChildren = Math.floor(Math.random() * 3) + 1;
                    childrenState.count = Math.max(0, childrenState.count - leavingChildren);
                    gameState.children = childrenState.count;
                    showNotification(`${leavingChildren} niño(s) se retiraron por las quejas`, 'error');
                    childrenState.complaints = 0; // Resetear quejas
                }
            }
        },
        {
            title: "Clase especial",
            description: "Se organiza una clase especial para niños",
            effect: () => {
                if (gameState.money >= 200) {
                    gameState.money -= 200;
                    childrenState.satisfaction = Math.min(100, childrenState.satisfaction + 15);
                    // Boost temporal en progresión
                    childrenState.skillLevels.forEach(child => {
                        child.level = Math.min(child.potential, child.level + 2);
                    });
                    updateAverageLevel();
                    showNotification("Clase especial organizada. +15% satisfacción, +2 nivel todos", 'success');
                } else {
                    showNotification("No tienes dinero para la clase especial", 'error');
                }
            }
        },
        {
            title: "Problema de disciplina",
            description: "Un niño presenta problemas de disciplina",
            effect: () => {
                childrenState.satisfaction = Math.max(0, childrenState.satisfaction - 5);
                if (hiredTeachers.length > 0) {
                    const teacher = hiredTeachers[Math.floor(Math.random() * hiredTeachers.length)];
                    teacher.morale = Math.max(0, teacher.morale - 5);
                }
                showNotification("Problema de disciplina en clase. -5% satisfacción", 'warning');
            }
        }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    updateStats();
}

// Clases especiales para niños
function organizeSpecialClass() {
    if (gameState.money >= 200) {
        gameState.money -= 200;
        childrenState.satisfaction = Math.min(100, childrenState.satisfaction + 15);
        updateStats();
        showNotification("Clase especial organizada para los niños. +15% satisfacción", 'success');
    } else {
        showNotification("Necesitas $200 para organizar una clase especial", 'error');
    }
}

// Obtener estado actual de los niños
function getChildrenStatus() {
    return {
        count: childrenState.count,
        satisfaction: childrenState.satisfaction,
        complaints: childrenState.complaints,
        talents: childrenState.talents.length,
        averageLevel: childrenState.averageLevel,
        classQuality: calculateClassQuality(),
        teacherQuality: calculateTeacherQualityInfluence(),
        monthlyIncome: childrenState.count * 100 // $100 por niño al mes
    };
}

// Actualizar satisfacción basada en profesores
function updateSatisfactionBasedOnTeachers() {
    if (hiredTeachers.length === 0) {
        childrenState.satisfaction = Math.max(0, childrenState.satisfaction - 2);
        return;
    }

    const avgPatience = hiredTeachers.reduce((sum, t) => sum + t.patience, 0) / hiredTeachers.length;
    const avgMorale = hiredTeachers.reduce((sum, t) => sum + t.morale, 0) / hiredTeachers.length;

    // La satisfacción tiende hacia el promedio de paciencia y ánimo de los profesores
    const targetSatisfaction = Math.floor((avgPatience + avgMorale) / 2);

    if (childrenState.satisfaction < targetSatisfaction) {
        childrenState.satisfaction = Math.min(targetSatisfaction, childrenState.satisfaction + 1);
    } else if (childrenState.satisfaction > targetSatisfaction) {
        childrenState.satisfaction = Math.max(targetSatisfaction, childrenState.satisfaction - 0.5);
    }
}

// Obtener niños para competencias (basado en nivel)
function getChildrenForCompetition() {
    return childrenState.skillLevels
        .filter(child => child.level >= 30) // Mínimo nivel 30 para competir
        .sort((a, b) => b.level - a.level) // Ordenar por nivel (mayor primero)
        .slice(0, 5); // Top 5 para competencias
}

// Obtener top N niños ordenados por nivel
function getTopChildren(n = 10) {
    return childrenState.skillLevels
        .sort((a, b) => b.level - a.level)
        .slice(0, n);
}

// Verificar si algún niño talentoso se gradúa a profesional
function checkProfessionalGraduation() {
    // Solo verificar niños con nivel 90+ y que sean talentosos
    const potentialPros = childrenState.skillLevels.filter(child =>
        child.level >= 90 && childrenState.talents.some(t => t.name === child.name)
    );

    potentialPros.forEach(child => {
        // 50% de probabilidad de graduarse a profesional
        if (Math.random() < 0.5) {
            // Crear jugador profesional
            const professional = {
                name: child.name,
                level: Math.floor(child.level),
                graduatedYear: gameState.year,
                graduatedMonth: gameState.month,
                lastDonationMonth: 0
            };

            childrenState.professionalPlayers.push(professional);

            // Remover de la escuela
            childrenState.skillLevels = childrenState.skillLevels.filter(c => c.name !== child.name);
            childrenState.talents = childrenState.talents.filter(t => t.name !== child.name);
            childrenState.count = Math.max(0, childrenState.count - 1);
            gameState.children = childrenState.count;

            // Gran boost de reputación
            gameState.reputation = Math.min(100, gameState.reputation + 10);

            showNotification(`🌟 ¡${child.name} se ha graduado como PROFESIONAL! +10% reputación`, 'success');
            updateAverageLevel();
            updateStats();
        }
    });
}

// Procesar beneficios de jugadores profesionales (donaciones y reputación)
function processProfessionalBenefits() {
    if (childrenState.professionalPlayers.length === 0) return;

    childrenState.professionalPlayers.forEach(pro => {
        // Cada profesional tiene 5% de posibilidad de dar un boost de reputación
        if (Math.random() < 0.05) {
            gameState.reputation = Math.min(100, gameState.reputation + 2);
            showNotification(`📰 ${pro.name} menciona tu escuela en una entrevista. +2% reputación`, 'success');
        }

        // Cada profesional tiene 3% de posibilidad de hacer una donación (máx 1 vez cada 3 meses)
        if (Math.random() < 0.03 && (gameState.month - pro.lastDonationMonth >= 3 || gameState.year > pro.graduatedYear)) {
            const donation = Math.floor(Math.random() * 1500) + 500; // $500 - $2000
            gameState.money += donation;
            pro.lastDonationMonth = gameState.month;
            showNotification(`💰 ${pro.name} donó $${donation} a la escuela`, 'success');
            updateStats();
        }
    });
}

// Exportar funciones
window.childrenModule = {
    childrenState,
    updateChildrenCount,
    triggerChildEvent,
    organizeSpecialClass,
    getChildrenStatus,
    updateSatisfactionBasedOnTeachers,
    progressChildrenLevels,
    getChildrenForCompetition,
    getTopChildren,
    checkProfessionalGraduation,
    processProfessionalBenefits,
    calculateClassQuality,
    calculateTeacherQualityInfluence,
    initializeChildrenLevels
};

console.log("Módulo de Niños cargado");
