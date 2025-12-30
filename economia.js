// Módulo de Economía

// Estado de la economía
let economyState = {
    weeklyFee: {
        children: 100, // $100 por semana por niño
        adults: 150    // $150 por semana por adulto
    },
    weeklyBudget: {
        income: 0,
        expenses: 0,
        balance: 0
    },
    currentBudget: {
        income: 0,
        expenses: 0,
        balance: 0
    },
    transactions: [], // Diario de movimientos
    weekNumber: 1
};

// Calcular presupuesto semanal
function calculateWeeklyBudget() {
    const income = (gameState.children * economyState.weeklyFee.children) + 
                  (gameState.adults * economyState.weeklyFee.adults);
    const expenses = hiredTeachers.reduce((sum, t) => sum + (t.salary / 4), 0); // Salarios semanales
    const balance = income - expenses;
    
    economyState.weeklyBudget = { income, expenses, balance };
    return economyState.weeklyBudget;
}

// Calcular presupuesto actual (acumulado del mes)
function calculateCurrentBudget() {
    const weeksInMonth = Math.ceil(timeModule.gameTime.day / 7);
    const income = economyState.weeklyBudget.income * weeksInMonth;
    const expenses = economyState.weeklyBudget.expenses * weeksInMonth;
    const balance = income - expenses;
    
    economyState.currentBudget = { income, expenses, balance };
    return economyState.currentBudget;
}

// Agregar transacción al diario
function addTransaction(description, amount, type) {
    const transaction = {
        date: `${timeModule.gameTime.day}/${timeModule.gameTime.month}/${timeModule.gameTime.year}`,
        week: economyState.weekNumber,
        description,
        amount,
        type, // 'income' o 'expense'
        balance: gameState.money
    };
    
    economyState.transactions.unshift(transaction);
    
    // Mantener solo las últimas 50 transacciones
    if (economyState.transactions.length > 50) {
        economyState.transactions = economyState.transactions.slice(0, 50);
    }
}

// Modificar cuota de niños
function setChildrenFee(newFee) {
    const oldFee = economyState.weeklyFee.children;
    economyState.weeklyFee.children = newFee;
    
    // Afectar reputación según el cambio
    if (newFee < 50) {
        gameState.reputation = Math.max(0, gameState.reputation - 10);
        showNotification("Cuota muy baja. Los padres dudan de la calidad. -10% reputación", 'error');
    } else if (newFee < 80) {
        gameState.reputation = Math.max(0, gameState.reputation - 5);
        showNotification("Cuota baja. Algunos padres sospechan. -5% reputación", 'warning');
    } else if (newFee > 200) {
        gameState.reputation = Math.max(0, gameState.reputation - 8);
        showNotification("Cuota muy alta. Los padres la consideran excesiva. -8% reputación", 'warning');
    } else if (newFee > 150) {
        gameState.reputation = Math.max(0, gameState.reputation - 3);
        showNotification("Cuota alta. Algunos padres se quejan. -3% reputación", 'warning');
    } else if (newFee >= 80 && newFee <= 150) {
        gameState.reputation = Math.min(100, gameState.reputation + 2);
        showNotification("Cuota justa. Los padres están contentos. +2% reputación", 'success');
    }
    
    addTransaction(`Cambio cuota niños: $${oldFee} → $${newFee}/semana`, 0, 'info');
    updateEconomyDisplay();
    updateStats();
}

// Modificar cuota de adultos
function setAdultsFee(newFee) {
    const oldFee = economyState.weeklyFee.adults;
    economyState.weeklyFee.adults = newFee;
    
    // Afectar reputación según el cambio
    if (newFee < 80) {
        gameState.reputation = Math.max(0, gameState.reputation - 8);
        showNotification("Cuota muy baja. Se percibe como de baja calidad. -8% reputación", 'error');
    } else if (newFee < 120) {
        gameState.reputation = Math.max(0, gameState.reputation - 4);
        showNotification("Cuota baja. Adultos dudan de la calidad. -4% reputación", 'warning');
    } else if (newFee > 250) {
        gameState.reputation = Math.max(0, gameState.reputation - 10);
        showNotification("Cuota muy alta. Los adultos la consideran abusiva. -10% reputación", 'error');
    } else if (newFee > 200) {
        gameState.reputation = Math.max(0, gameState.reputation - 5);
        showNotification("Cuota alta. Algunos adultos se quejan. -5% reputación", 'warning');
    } else if (newFee >= 120 && newFee <= 200) {
        gameState.reputation = Math.min(100, gameState.reputation + 2);
        showNotification("Cuota justa. Los adultos están satisfechos. +2% reputación", 'success');
    }
    
    addTransaction(`Cambio cuota adultos: $${oldFee} → $${newFee}/semana`, 0, 'info');
    updateEconomyDisplay();
    updateStats();
}

// Procesar pagos semanales
function processWeeklyPayments() {
    const childrenIncome = gameState.children * economyState.weeklyFee.children;
    const adultsIncome = gameState.adults * economyState.weeklyFee.adults;
    const totalIncome = childrenIncome + adultsIncome;
    
    gameState.money += totalIncome;
    
    addTransaction(`Cuotas semanales (${gameState.children} niños, ${gameState.adults} adultos)`, totalIncome, 'income');
    showNotification(`Recibido $${totalIncome} en cuotas semanales`, 'success');
    
    economyState.weekNumber++;
    calculateWeeklyBudget();
    calculateCurrentBudget();
    updateEconomyDisplay();
    updateStats();
}

// Pagar salarios semanales
function payWeeklySalaries() {
    const totalSalaries = hiredTeachers.reduce((sum, t) => sum + (t.salary / 4), 0);
    
    if (gameState.money >= totalSalaries) {
        gameState.money -= totalSalaries;
        addTransaction(`Salarios semanales (${hiredTeachers.length} profesores)`, -totalSalaries, 'expense');
        showNotification(`Pagado $${totalSalaries} en salarios semanales`, 'info');
    } else {
        showNotification(`No tienes suficiente dinero para pagar los salarios ($${totalSalaries})`, 'error');
        // Penalización por no pagar
        gameState.reputation = Math.max(0, gameState.reputation - 15);
        hiredTeachers.forEach(t => t.morale = Math.max(0, t.morale - 20));
    }
    
    calculateWeeklyBudget();
    calculateCurrentBudget();
    updateEconomyDisplay();
    updateStats();
}

// Mostrar panel de economía
function showEconomyPanel() {
    // Crear panel si no existe
    if (!document.getElementById('economy-panel')) {
        const panel = document.createElement('aside');
        panel.id = 'economy-panel';
        panel.className = 'economy-panel';
        panel.innerHTML = `
            <h3 style="padding: 20px; margin: 0; color: #333; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                <span>Economía</span>
                <span class="close-economy" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
            </h3>
            <div style="padding: 20px; max-height: calc(100vh - 80px); overflow-y: auto;">
                <div class="budget-section">
                    <h4>Presupuesto Semanal</h4>
                    <div class="budget-item">
                        <span>Ingresos:</span>
                        <span id="weekly-income">$0</span>
                    </div>
                    <div class="budget-item">
                        <span>Gastos:</span>
                        <span id="weekly-expenses">$0</span>
                    </div>
                    <div class="budget-item balance">
                        <span>Balance:</span>
                        <span id="weekly-balance">$0</span>
                    </div>
                </div>
                
                <div class="budget-section">
                    <h4>Presupuesto Actual (Mes)</h4>
                    <div class="budget-item">
                        <span>Ingresos:</span>
                        <span id="current-income">$0</span>
                    </div>
                    <div class="budget-item">
                        <span>Gastos:</span>
                        <span id="current-expenses">$0</span>
                    </div>
                    <div class="budget-item balance">
                        <span>Balance:</span>
                        <span id="current-balance">$0</span>
                    </div>
                </div>
                
                <div class="fees-section">
                    <h4>Cuotas Semanales</h4>
                    <div class="fee-item">
                        <label>Niños:</label>
                        <div style="display: flex; align-items: center;">
                            <input type="number" id="children-fee" value="100" min="0" max="500" step="10">
                            <button onclick="setChildrenFee(parseInt(document.getElementById('children-fee').value))" 
                                    style="margin-left: 10px; padding: 5px 10px;">Cambiar</button>
                        </div>
                    </div>
                    <div class="fee-item">
                        <label>Adultos:</label>
                        <div style="display: flex; align-items: center;">
                            <input type="number" id="adults-fee" value="150" min="0" max="500" step="10">
                            <button onclick="setAdultsFee(parseInt(document.getElementById('adults-fee').value))" 
                                    style="margin-left: 10px; padding: 5px 10px;">Cambiar</button>
                        </div>
                    </div>
                </div>
                
                <div class="transactions-section">
                    <h4>Diario de Movimientos</h4>
                    <div id="transactions-list" class="transactions-list">
                        <!-- Las transacciones aparecerán aquí -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Event listeners
        panel.querySelector('.close-economy').addEventListener('click', () => {
            panel.classList.remove('show');
        });
    }
    
    const panel = document.getElementById('economy-panel');
    panel.classList.toggle('show');
    updateEconomyDisplay();
}

// Actualizar display de economía
function updateEconomyDisplay() {
    if (!document.getElementById('economy-panel')) return;
    
    calculateWeeklyBudget();
    calculateCurrentBudget();
    
    // Actualizar presupuestos
    document.getElementById('weekly-income').textContent = `$${economyState.weeklyBudget.income}`;
    document.getElementById('weekly-expenses').textContent = `$${economyState.weeklyBudget.expenses}`;
    document.getElementById('weekly-balance').textContent = `$${economyState.weeklyBudget.balance}`;
    
    document.getElementById('current-income').textContent = `$${economyState.currentBudget.income}`;
    document.getElementById('current-expenses').textContent = `$${economyState.currentBudget.expenses}`;
    document.getElementById('current-balance').textContent = `$${economyState.currentBudget.balance}`;
    
    // Actualizar cuotas
    document.getElementById('children-fee').value = economyState.weeklyFee.children;
    document.getElementById('adults-fee').value = economyState.weeklyFee.adults;
    
    // Actualizar transacciones
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    economyState.transactions.slice(0, 20).forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 12px; color: #666;">${transaction.date} - Semana ${transaction.week}</span>
                <span style="font-weight: bold; color: ${transaction.type === 'income' ? '#28a745' : transaction.type === 'expense' ? '#dc3545' : '#17a2b8'}">
                    ${transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}$${Math.abs(transaction.amount)}
                </span>
            </div>
            <div style="font-size: 14px;">${transaction.description}</div>
        `;
        transactionsList.appendChild(item);
    });
}

// Exportar funciones
window.economyModule = {
    economyState,
    calculateWeeklyBudget,
    calculateCurrentBudget,
    setChildrenFee,
    setAdultsFee,
    processWeeklyPayments,
    payWeeklySalaries,
    showEconomyPanel,
    updateEconomyDisplay,
    addTransaction
};

console.log("Módulo de Economía cargado");
