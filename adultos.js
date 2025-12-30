// Módulo de Adultos

// Estado de los adultos
let adultsState = {
    count: 5, // Adultos iniciales
    skillLevels: [], // Nivel individual de cada adulto
    professionalAdults: [] // Adultos profesionales (para competencias)
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

// Actualizar conteo de adultos
function updateAdultsCount() {
    const targetAdults = Math.floor(gameState.reputation / 10) + 3; // 3 base + 1 por cada 10% reputación

    if (adultsState.count < targetAdults && Math.random() < 0.3) {
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

// Exportar funciones
window.adultsModule = {
    adultsState,
    initializeAdultsLevels,
    progressAdultsLevels,
    getProfessionalAdults,
    getTopAdults,
    updateAdultsCount
};

console.log("Módulo de Adultos cargado");
