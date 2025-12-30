// Módulo de Adultos

// Estado de los adultos
let adultsState = {
    count: 5, // Adultos iniciales
    skillLevels: [], // Nivel individual de cada adulto
    professionalAdults: [], // Adultos profesionales (para competencias)
    satisfaction: 60 // Satisfacción general de adultos (0-100)
};

// Nombres para adultos
const adultFirstNames = ["Carlos", "María", "Roberto", "Ana", "Fernando", "Laura", "Miguel", "Patricia", "José", "Carmen", "Diego", "Lucía", "Pablo", "Rosa", "Andrés", "Elena"];
const adultLastNames = ["Fernández", "González", "López", "Martínez", "Rodríguez", "Sánchez", "Pérez", "García", "Torres", "Díaz"];

// Inicializar niveles de adultos
function initializeAdultsLevels() {
    adultsState.skillLevels = [];
    for (let i = 0; i < adultsState.count; i++) {
        adultsState.skillLevels.push({
            id: i,
            name: generateAdultName(),
            level: Math.floor(Math.random() * 40) + 20, // Nivel inicial entre 20-60
            progressRate: Math.random() * 1.5 + 0.3, // Progresan más lento que niños
            potential: Math.floor(Math.random() * 20) + 60, // Potencial 60-80
            isProfessional: false
        });
    }
}

function generateAdultName() {
    const firstName = adultFirstNames[Math.floor(Math.random() * adultFirstNames.length)];
    const lastName = adultLastNames[Math.floor(Math.random() * adultLastNames.length)];
    return `${firstName} ${lastName}`;
}

// Progresión de adultos
function progressAdultsLevels() {
    if (!window.hiredTeachers || hiredTeachers.length === 0) return;

    const avgSkill = hiredTeachers.reduce((sum, t) => sum + t.skill, 0) / hiredTeachers.length;
    const influence = avgSkill / 100;

    adultsState.skillLevels.forEach(adult => {
        if (adult.level < adult.potential) {
            const progress = influence * adult.progressRate * 1.5;
            adult.level = Math.min(adult.potential, adult.level + progress);
        }

        // Si alcanza nivel 75+, puede volverse profesional
        if (adult.level >= 75 && !adult.isProfessional && Math.random() < 0.1) {
            adult.isProfessional = true;
            adultsState.professionalAdults.push(adult);
            showNotification(`🎾 ${adult.name} ahora compite como adulto profesional`, 'success');
        }
    });
}

// Obtener adultos profesionales para competencias
function getProfessionalAdults() {
    return adultsState.skillLevels.filter(adult => adult.isProfessional);
}

// Obtener top adultos por nivel
function getTopAdults(n = 5) {
    return adultsState.skillLevels
        .sort((a, b) => b.level - a.level)
        .slice(0, n);
}

// Calcular ratio profesor:alumno considerando horarios diferenciados
function calculateTeacherStudentRatio() {
    if (!window.hiredTeachers || hiredTeachers.length === 0) return Infinity;
    
    // Los profesores pueden atender a niños y adultos en horarios diferentes
    // No se suman directamente, se evalúa por separado
    const childrenRatio = childrenState?.count / hiredTeachers.length || 0;
    const adultsRatio = adultsState.count / hiredTeachers.length;
    
    // El peor ratio determina la calidad general
    return Math.max(childrenRatio, adultsRatio);
}

// Actualizar satisfacción de adultos basada en profesores y horarios
function updateAdultsSatisfactionBasedOnTeachers() {
    if (!window.hiredTeachers || hiredTeachers.length === 0) {
        // Sin profesores, la satisfacción cae más rápido (adultos son más exigentes)
        adultsState.satisfaction = Math.max(0, adultsState.satisfaction - 3);
        return;
    }
    
    const avgSkill = hiredTeachers.reduce((sum, t) => sum + t.skill, 0) / hiredTeachers.length;
    const avgPatience = hiredTeachers.reduce((sum, t) => sum + t.patience, 0) / hiredTeachers.length;
    const avgMorale = hiredTeachers.reduce((sum, t) => sum + t.morale, 0) / hiredTeachers.length;
    
    // Los adultos valoran más la habilidad técnica que los niños
    const teacherQuality = (avgSkill * 0.5 + avgPatience * 0.3 + avgMorale * 0.2);
    
    // La satisfacción tiende hacia la calidad de los profesores
    const targetSatisfaction = Math.floor(teacherQuality);
    
    // Los adultos cambian su satisfacción más lentamente que los niños
    if (adultsState.satisfaction < targetSatisfaction) {
        adultsState.satisfaction = Math.min(targetSatisfaction, adultsState.satisfaction + 0.5);
    } else if (adultsState.satisfaction > targetSatisfaction) {
        adultsState.satisfaction = Math.max(targetSatisfaction, adultsState.satisfaction - 0.3);
    }
    
    // Eventos aleatorios que afectan satisfacción de adultos
    if (Math.random() < 0.05) { // 5% de probabilidad
        const events = [
            { change: 5, message: "Clase técnica avanzada muy bien recibida" },
            { change: -3, message: "Demasiados niños en las clases de adultos" },
            { change: 3, message: "Nuevo equipamiento disponible" },
            { change: -5, message: "Horarios incompatibles con trabajo" },
            { change: 4, message: "Torneo interno organizado" },
            { change: -2, message: "Profesores cansados después de clases con niños" },
            { change: 6, message: "Horarios nocturnos bien organizados" }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        adultsState.satisfaction = Math.max(0, Math.min(100, adultsState.satisfaction + event.change));
        
        if (Math.abs(event.change) > 3) {
            showNotification(`Adultos: ${event.message} (${event.change > 0 ? '+' : ''}${event.change}% satisfacción)`, 
                           event.change > 0 ? 'success' : 'warning');
        }
    }
}

// Actualizar conteo de adultos
function updateAdultsCount() {
    const targetAdults = Math.floor(gameState.reputation / 10) + 3; // 3 base + 1 por cada 10% reputación
    
    // La satisfacción afecta la retención de adultos
    if (adultsState.satisfaction < 30 && adultsState.count > 2) {
        // Adultos insatisfechos se van
        if (Math.random() < 0.3) {
            const leavingAdult = adultsState.skillLevels.pop();
            if (leavingAdult) {
                adultsState.count--;
                gameState.adults = adultsState.count;
                showNotification(`${leavingAdult.name} se retiró por insatisfacción`, 'warning');
                updateStats();
            }
        }
    }
    
    if (adultsState.count < targetAdults && Math.random() < 0.2) {
        // Nuevos adultos se inscriben si la satisfacción es decente
        if (adultsState.satisfaction > 40) {
            adultsState.skillLevels.push({
                id: adultsState.skillLevels.length,
                name: generateAdultName(),
                level: Math.floor(Math.random() * 30) + 25,
                progressRate: Math.random() * 1.5 + 0.3,
                potential: Math.floor(Math.random() * 20) + 60,
                isProfessional: false
            });
            adultsState.count++;
            gameState.adults = adultsState.count;
            showNotification('Un nuevo alumno adulto se inscribió', 'success');
            updateStats();
        }
    }
}

// Registro de pro graduado desde el módulo de niños
function registerGraduatedPro(proData) {
    const newAdultPro = {
        id: adultsState.skillLevels.length,
        name: proData.name,
        level: proData.level,
        progressRate: Math.random() * 0.5 + 0.1, // Los pro ya tienen nivel alto, progresan poco
        potential: 100,
        isProfessional: true
    };

    adultsState.skillLevels.push(newAdultPro);
    adultsState.professionalAdults.push(newAdultPro);
    adultsState.count++;
    gameState.adults = adultsState.count;

    console.log(`Pro graduado registrado como adulto: ${proData.name}`);
}

// Exportar funciones
window.adultsModule = {
    adultsState,
    initializeAdultsLevels,
    progressAdultsLevels,
    getProfessionalAdults,
    getTopAdults,
    updateAdultsCount,
    updateAdultsSatisfactionBasedOnTeachers,
    calculateTeacherStudentRatio,
    registerGraduatedPro
};

console.log("Módulo de Adultos cargado");
