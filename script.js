// ======= PocketPilot JS =======

// Grab elements
const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.getElementById('expense-table-body');
const totalSpentEl = document.getElementById('total-spent');
const filterCategory = document.getElementById('filter-category');
const filterDate = document.getElementById('filter-date');
const searchName = document.getElementById('search-name');

// Get expenses from localStorage or initialize
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// ======= Helper Functions =======

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Render the expenses table
function renderExpenses(list = expenses) {
    expenseTableBody.innerHTML = ''; // clear table
    let total = 0;

    list.forEach((expense, index) => {
        total += parseFloat(expense.amount);
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td data-label="Name">${expense.name}</td>
            <td data-label="Amount">$${parseFloat(expense.amount).toFixed(2)}</td>
            <td data-label="Category">${expense.category}</td>
            <td data-label="Date">${expense.date}</td>
            <td data-label="Actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;

        expenseTableBody.appendChild(tr);
    });

    totalSpentEl.textContent = total.toFixed(2);
}

// ======= Add Expense =======
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('expense-name').value.trim();
    const amount = document.getElementById('expense-amount').value.trim();
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    if (!name || !amount || !category || !date) return;

    expenses.push({ name, amount, category, date });
    saveExpenses();
    renderExpenses();

    expenseForm.reset();
});

// ======= Edit & Delete =======
expenseTableBody.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (!index) return;

    if (e.target.classList.contains('delete-btn')) {
        // Delete
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
    } else if (e.target.classList.contains('edit-btn')) {
        // Edit
        const expense = expenses[index];
        document.getElementById('expense-name').value = expense.name;
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('expense-category').value = expense.category;
        document.getElementById('expense-date').value = expense.date;

        // Remove the old entry
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
    }
});

// ======= Filters & Search =======
function applyFilters() {
    let filtered = [...expenses];

    // Category filter
    if (filterCategory.value !== 'all') {
        filtered = filtered.filter(e => e.category === filterCategory.value);
    }

    // Date filter (month)
    if (filterDate.value) {
        filtered = filtered.filter(e => e.date.startsWith(filterDate.value));
    }

    // Search by name
    if (searchName.value.trim() !== '') {
        const term = searchName.value.toLowerCase();
        filtered = filtered.filter(e => e.name.toLowerCase().includes(term));
    }

    renderExpenses(filtered);
}

filterCategory.addEventListener('change', applyFilters);
filterDate.addEventListener('change', applyFilters);
searchName.addEventListener('input', applyFilters);

// ======= Initial Render =======
renderExpenses();