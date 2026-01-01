/**
 * Centralize common utility functions for the Tennis Academy Simulator.
 */

const NAMES = {
    children: {
        first: ["Mateo", "Sofía", "Lucas", "Valentina", "Sebastián", "Isabella", "Matías", "Camila", "Benjamín", "Valeria", "Daniel", "Martina", "Julián", "Emma", "Thiago", "Olivia"],
        last: ["García", "Rodríguez", "López", "Martínez", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Díaz"]
    },
    adults: {
        first: ["Carlos", "María", "Roberto", "Ana", "Fernando", "Laura", "Miguel", "Patricia", "José", "Carmen", "Diego", "Lucía", "Pablo", "Rosa", "Andrés", "Elena"],
        last: ["Fernández", "González", "López", "Martínez", "Rodríguez", "Sánchez", "Pérez", "García", "Torres", "Díaz"]
    }
};

/**
 * Generates a random name based on the category.
 * @param {string} category - 'children' or 'adults'
 * @returns {string}
 */
function generateRandomName(category = 'children') {
    const pool = NAMES[category] || NAMES.children;
    const first = pool.first[Math.floor(Math.random() * pool.first.length)];
    const last = pool.last[Math.floor(Math.random() * pool.last.length)];
    return `${first} ${last}`;
}

/**
 * Calculates the overall teacher quality influence.
 * Consolidates logic previously spread across multiple modules.
 */
function calculateTeacherInfluence() {
    if (!window.hiredTeachers || hiredTeachers.length === 0) return 0;

    const avgSkill = hiredTeachers.reduce((sum, t) => sum + t.skill, 0) / hiredTeachers.length;
    const avgPatience = hiredTeachers.reduce((sum, t) => sum + t.patience, 0) / hiredTeachers.length;
    const avgMorale = hiredTeachers.reduce((sum, t) => sum + t.morale, 0) / hiredTeachers.length;

    return Math.floor((avgSkill + avgPatience + avgMorale) / 3);
}

window.academyUtils = {
    generateRandomName,
    calculateTeacherInfluence
};
