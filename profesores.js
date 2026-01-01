// Módulo de Profesores

// Base de datos de profesores abstractos
const teachersDatabase = [
    { id: 1, name: "Carlos Rodríguez", age: 45, experience: 20, skill: 85, patience: 90, salary: 850, progressRate: 0.5, behavior: 70 },
    { id: 2, name: "María González", age: 28, experience: 8, skill: 75, patience: 70, salary: 650, progressRate: 2.5, behavior: 60 },
    { id: 3, name: "Luis Fernández", age: 52, experience: 30, skill: 90, patience: 95, salary: 950, progressRate: 0.3, behavior: 85 },
    { id: 4, name: "Ana Martínez", age: 24, experience: 3, skill: 65, patience: 60, salary: 500, progressRate: 3.0, behavior: 50 },
    { id: 5, name: "Roberto Silva", age: 38, experience: 15, skill: 80, patience: 85, salary: 750, progressRate: 1.0, behavior: 75 },
    { id: 6, name: "Laura López", age: 31, experience: 10, skill: 72, patience: 75, salary: 680, progressRate: 2.0, behavior: 65 },
    { id: 7, name: "Miguel Ángel", age: 48, experience: 25, skill: 88, patience: 92, salary: 900, progressRate: 0.4, behavior: 80 },
    { id: 8, name: "Sofía Herrera", age: 26, experience: 5, skill: 68, patience: 65, salary: 520, progressRate: 2.8, behavior: 55 },
    { id: 9, name: "Diego Castillo", age: 41, experience: 18, skill: 82, patience: 88, salary: 780, progressRate: 0.8, behavior: 72 },
    { id: 10, name: "Valeria Torres", age: 29, experience: 7, skill: 70, patience: 72, salary: 620, progressRate: 2.3, behavior: 62 },
    { id: 11, name: "Javier Romero", age: 55, experience: 32, skill: 92, patience: 96, salary: 950, progressRate: 0.2, behavior: 90 },
    { id: 12, name: "Camila Vargas", age: 22, experience: 2, skill: 60, patience: 55, salary: 480, progressRate: 3.2, behavior: 45 },
    { id: 13, name: "Andrés Molina", age: 35, experience: 12, skill: 78, patience: 80, salary: 700, progressRate: 1.3, behavior: 68 },
    { id: 14, name: "Natalia Ortega", age: 33, experience: 11, skill: 76, patience: 78, salary: 690, progressRate: 1.5, behavior: 66 },
    { id: 15, name: "Ricardo Soto", age: 43, experience: 19, skill: 84, patience: 87, salary: 820, progressRate: 0.6, behavior: 74 },
    { id: 16, name: "Isabel Cruz", age: 27, experience: 6, skill: 67, patience: 68, salary: 550, progressRate: 2.6, behavior: 58 },
    { id: 17, name: "Fernando Mendoza", age: 50, experience: 28, skill: 89, patience: 94, salary: 940, progressRate: 0.35, behavior: 82 },
    { id: 18, name: "Paula Ríos", age: 25, experience: 4, skill: 64, patience: 62, salary: 500, progressRate: 2.9, behavior: 52 },
    { id: 19, name: "Sergio Navarro", age: 39, experience: 16, skill: 81, patience: 86, salary: 770, progressRate: 0.9, behavior: 71 },
    { id: 20, name: "Lucía Ramírez", age: 30, experience: 9, skill: 73, patience: 74, salary: 660, progressRate: 2.1, behavior: 64 }
];

// Profesores contratados (inicialmente 2)
let hiredTeachers = [
    { ...teachersDatabase[3], hired: true, monthsWorked: 6, morale: 50 }, // Ana Martínez - $500
    { ...teachersDatabase[6], hired: true, monthsWorked: 3, morale: 50 }  // Miguel Ángel - $900
];

// Renderizar profesores actuales
function renderCurrentTeachers() {
    const container = document.getElementById('current-teachers');
    container.innerHTML = '';

    hiredTeachers.forEach(teacher => {
        const card = createTeacherCard(teacher, true);
        container.appendChild(card);
    });
}

// Renderizar profesores disponibles
function renderAvailableTeachers() {
    const container = document.getElementById('available-teachers');
    container.innerHTML = '';

    // Filtrar profesores que no están contratados
    const availableTeachers = teachersDatabase.filter(t => {
        const isHired = hiredTeachers.find(ht => ht.id === t.id);
        return !isHired;
    });

    availableTeachers.forEach(teacher => {
        const card = createTeacherCard(teacher, false);
        container.appendChild(card);
    });
}

// Crear tarjeta de profesor
function createTeacherCard(teacher, isHired) {
    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.innerHTML = `
        <div class="teacher-header">
            <span class="teacher-name">${teacher.name}</span>
            <span class="teacher-age">${teacher.age} años</span>
        </div>
        <div class="teacher-stats">
            <div class="stat">
                <span class="stat-label">Experiencia:</span>
                <span class="stat-value">${teacher.experience} años</span>
            </div>
            <div class="stat">
                <span class="stat-label">Habilidad:</span>
                <span class="stat-value">${Math.floor(teacher.skill)}/100</span>
            </div>
            <div class="stat">
                <span class="stat-label">Paciencia:</span>
                <span class="stat-value">${Math.floor(teacher.patience)}/100</span>
            </div>
            <div class="stat">
                <span class="stat-label">Salario recomendado:</span>
                <span class="stat-value">$${teacher.salary}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => showTeacherDetails(teacher, isHired));
    return card;
}

// Mostrar detalles del profesor en modal
function showTeacherDetails(teacher, isHired) {
    const modal = document.getElementById('teacher-modal');
    const nameElement = document.getElementById('modal-teacher-name');
    const detailsElement = document.querySelector('.teacher-details');
    const actionsElement = document.querySelector('.modal-actions');

    nameElement.textContent = teacher.name;

    detailsElement.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>Edad:</strong> ${teacher.age} años<br>
            <strong>Experiencia:</strong> ${teacher.experience} años<br>
            <strong>Salario recomendado:</strong> $${teacher.salary}/mes
            ${isHired ? `<br><strong>Ánimo:</strong> ${Math.floor(teacher.morale)}%` : ''}
        </div>
        
        <div style="margin-bottom: 10px;">
            <strong>Habilidad</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${teacher.skill}%"></div>
            </div>
        </div>
        
        <div style="margin-bottom: 10px;">
            <strong>Paciencia</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${teacher.patience}%"></div>
            </div>
        </div>
        
        <div style="margin-bottom: 10px;">
            <strong>Capacidad de explicación</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${teacher.patience * 0.9}%"></div>
            </div>
        </div>
        
        <div style="margin-bottom: 10px;">
            <strong>Calidad de peloteo</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${teacher.skill * (teacher.age < 35 ? 1.1 : 0.95)}%"></div>
            </div>
        </div>
        
        ${isHired ? `
        <div style="margin-bottom: 10px;">
            <strong>Ánimo</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${teacher.morale}%; background: ${teacher.morale < 30 ? '#dc3545' : teacher.morale < 60 ? '#ffc107' : '#28a745'}"></div>
            </div>
        </div>
        ` : ''}
        
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
            <small style="color: #666;">
                ${teacher.age < 35 ?
            "🌟 Joven con gran potencial de progreso. Excelente para peloteos dinámicos." :
            "🎓 Experimentado y paciente. Ideal para clases técnicas y niños."}
            </small>
        </div>
    `;

    if (isHired) {
        actionsElement.innerHTML = `
            <div class="action-buttons-modal">
                <button class="btn-action btn-train" onclick="trainTeacher(${teacher.id})">
                    Capacitar ($500)
                </button>
                <button class="btn-action btn-fire" onclick="fireTeacher(${teacher.id})">
                    Despedir
                </button>
            </div>
        `;
    } else {
        actionsElement.innerHTML = `
            <div class="action-buttons-modal">
                <button class="btn-action btn-hire" onclick="hireTeacher(${teacher.id})">
                    Contratar
                </button>
                <button class="btn-action btn-negotiate" onclick="negotiateSalary(${teacher.id})">
                    Negociar Salario
                </button>
            </div>
        `;
    }

    modal.classList.add('show');
}

// Contratar profesor
function hireTeacher(teacherId) {
    const teacher = teachersDatabase.find(t => t.id === teacherId);
    const alreadyHired = hiredTeachers.find(t => t.id === teacherId);

    if (alreadyHired) {
        showNotification('Este profesor ya está contratado', 'error');
        return;
    }

    if (teacher && gameState.money >= teacher.salary) {
        teacher.hired = true;
        teacher.monthsWorked = 0;
        teacher.morale = 50; // Ánimo inicial
        hiredTeachers.push({ ...teacher });
        gameState.money -= teacher.salary;
        gameState.teachers = hiredTeachers.length;

        // Aumentar reputación por contratar buen profesor
        const reputationGain = Math.floor(teacher.skill / 20) + Math.floor(teacher.patience / 25);
        gameState.reputation = Math.min(100, gameState.reputation + reputationGain);

        updateStats();
        renderCurrentTeachers();
        renderAvailableTeachers();
        closeModal();

        showNotification(`${teacher.name} ha sido contratado. +${reputationGain}% reputación`, 'success');
    } else {
        showNotification('No tienes suficiente dinero', 'error');
    }
}

// Despedir profesor
function fireTeacher(teacherId) {
    const teacher = hiredTeachers.find(t => t.id === teacherId);
    if (teacher) {
        hiredTeachers = hiredTeachers.filter(t => t.id !== teacherId);
        const originalTeacher = teachersDatabase.find(t => t.id === teacherId);
        originalTeacher.hired = false;
        gameState.teachers = hiredTeachers.length;

        // Perder reputación por despedir
        const reputationLoss = Math.floor(teacher.skill / 30) + 2;
        gameState.reputation = Math.max(0, gameState.reputation - reputationLoss);

        updateStats();
        renderCurrentTeachers();
        renderAvailableTeachers();
        closeModal();

        showNotification(`${teacher.name} ha sido despedido. -${reputationLoss}% reputación`, 'warning');
    }
}

// Capacitar profesor
function trainTeacher(teacherId) {
    const teacher = hiredTeachers.find(t => t.id === teacherId);
    if (teacher && gameState.money >= 500) {
        gameState.money -= 500;
        teacher.skill = Math.min(100, teacher.skill + 5);
        teacher.patience = Math.min(100, teacher.patience + 3);
        teacher.morale = Math.min(100, teacher.morale + 10); // Aumenta ánimo

        // Ganar reputación por invertir en capacitación
        gameState.reputation = Math.min(100, gameState.reputation + 2);

        updateStats();
        renderCurrentTeachers();
        closeModal();

        showNotification(`${teacher.name} ha sido capacitado. +2% reputación`, 'success');
    } else {
        showNotification('No tienes suficiente dinero', 'error');
    }
}

// Negociar salario
function negotiateSalary(teacherId) {
    const teacher = teachersDatabase.find(t => t.id === teacherId);
    if (!teacher) return;

    const modal = document.getElementById('teacher-modal');
    const detailsElement = document.querySelector('.teacher-details');
    const actionsElement = document.querySelector('.modal-actions');

    // Mostrar interfaz de negociación
    detailsElement.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>${teacher.name}</strong><br>
            <strong>Salario recomendado:</strong> $${teacher.salary}/mes<br>
            <strong>Comportamiento:</strong> ${teacher.behavior}/100<br>
            <small style="color: #666;">
                ${teacher.behavior > 70 ? "😊 Muy flexible para negociar" :
            teacher.behavior > 50 ? "😐 Moderadamente flexible" :
                "😠 Poca flexibilidad para negociar"}
            </small>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="salary-input"><strong>Oferta de salario:</strong></label>
            <input type="number" id="salary-input" value="${teacher.salary}" 
                   min="1000" max="10000" step="100" 
                   style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        
        <div id="negotiation-result" style="margin-bottom: 15px; padding: 10px; border-radius: 5px; display: none;">
        </div>
    `;

    actionsElement.innerHTML = `
        <div class="action-buttons-modal">
            <button class="btn-action btn-hire" onclick="submitSalaryOffer(${teacher.id})">
                Enviar Oferta
            </button>
            <button class="btn-action" onclick="showTeacherDetails(teachersDatabase.find(t => t.id === ${teacher.id}), false)" 
                    style="background: #6c757d;">
                Cancelar
            </button>
        </div>
    `;
}

// Enviar oferta salarial
function submitSalaryOffer(teacherId) {
    const teacher = teachersDatabase.find(t => t.id === teacherId);
    const offeredSalary = parseInt(document.getElementById('salary-input').value);
    const resultDiv = document.getElementById('negotiation-result');

    // Calcular probabilidad de aceptación basada en el comportamiento y la oferta
    const salaryDifference = teacher.salary - offeredSalary;
    const maxReduction = (teacher.behavior / 100) * teacher.salary * 0.5; // Máximo 50% de reducción basado en comportamiento
    const minimumAcceptable = Math.floor(teacher.salary - maxReduction);

    if (offeredSalary > teacher.salary) {
        // Si ofrece más, siempre acepta
        teacher.salary = offeredSalary;
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#d4edda';
        resultDiv.style.color = '#155724';
        resultDiv.innerHTML = '✅ ¡Aceptó tu oferta! Está muy contento con el salario.';

        setTimeout(() => {
            hireTeacher(teacherId);
        }, 1500);
    } else if (offeredSalary >= minimumAcceptable) {
        // Acepta si la oferta es igual o mayor al mínimo aceptable
        const acceptanceChance = 1 - ((teacher.salary - offeredSalary) / maxReduction) * 0.5;

        if (Math.random() < acceptanceChance) {
            teacher.salary = offeredSalary;
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#d4edda';
            resultDiv.style.color = '#155724';
            resultDiv.innerHTML = '✅ Aceptó tu oferta después de pensarlo.';

            setTimeout(() => {
                hireTeacher(teacherId);
            }, 1500);
        } else {
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#f8d7da';
            resultDiv.style.color = '#721c24';
            resultDiv.innerHTML = `❌ Rechazó tu oferta. Pide al menos $${minimumAcceptable}.`;
        }
    } else {
        // Oferta demasiado baja
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#f8d7da';
        resultDiv.style.color = '#721c24';
        resultDiv.innerHTML = `❡ Oferta demasiado baja. No aceptaría menos de $${minimumAcceptable}.`;
    }
}

// Progresión mensual de profesores
function progressTeachers() {
    hiredTeachers.forEach(teacher => {
        teacher.monthsWorked++;

        // Los jóvenes progresan más rápido
        const progressAmount = teacher.progressRate * (teacher.age < 35 ? 1.5 : 1);
        teacher.skill = Math.min(100, teacher.skill + progressAmount * 0.1);
        teacher.patience = Math.min(100, teacher.patience + progressAmount * 0.05);

        // El ánimo tiende a estabilizarse
        if (teacher.morale > 50) {
            teacher.morale = Math.max(50, teacher.morale - 1);
        } else if (teacher.morale < 50) {
            teacher.morale = Math.min(50, teacher.morale + 1);
        }

        // Actualizar en la base de datos
        const dbTeacher = teachersDatabase.find(t => t.id === teacher.id);
        if (dbTeacher) {
            dbTeacher.skill = teacher.skill;
            dbTeacher.patience = teacher.patience;
        }
    });
}

// Evento: profesor comete un error
function teacherMakesMistake(teacher) {
    teacher.morale = Math.max(0, teacher.morale - 20);
    const reputationLoss = Math.floor(Math.random() * 8) + 5;
    gameState.reputation = Math.max(0, gameState.reputation - reputationLoss);
    showNotification(`${teacher.name} cometió un error grave. -${reputationLoss}% reputación`, 'error');

    // Si el ánimo es muy bajo, puede renunciar
    if (teacher.morale < 20 && Math.random() < 0.5) {
        teacherResigns(teacher);
    }
}

// Profesor renuncia
function teacherResigns(teacher) {
    hiredTeachers = hiredTeachers.filter(t => t.id !== teacher.id);
    const originalTeacher = teachersDatabase.find(t => t.id === teacher.id);
    originalTeacher.hired = false;
    gameState.teachers = hiredTeachers.length;

    const reputationLoss = Math.floor(teacher.skill / 20) + 3;
    gameState.reputation = Math.max(0, gameState.reputation - reputationLoss);

    updateStats();
    renderCurrentTeachers();
    renderAvailableTeachers();

    showNotification(`${teacher.name} renunció por bajo ánimo. -${reputationLoss}% reputación`, 'warning');
}

// Exportar funciones para usar en otros módulos
window.teachersModule = {
    teachersDatabase,
    hiredTeachers,
    renderCurrentTeachers,
    renderAvailableTeachers,
    progressTeachers,
    teacherMakesMistake
};
