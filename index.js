const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const calendar = document.getElementById("calendar");
const taskModal = document.getElementById("taskModal");
const modalTitle = document.getElementById("modalTitle");

let currentDate = null;

const currentYear = new Date().getFullYear();
for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
}
yearSelect.value = currentYear;
monthSelect.value = new Date().getMonth();


function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthKey = `${year}-${month+1}`; // month+1 保持 1~12
    const monthTotal = parseFloat(localStorage.getItem(monthKey)) || 0;
    document.getElementById("Montlytotal").innerHTML = monthTotal.toFixed(2);

    let html = `<table class="custom-calendar text-center">
        <thead>
            <tr>
                <th>Su</th><th>Mo</th><th>Tu</th><th>We</th>
                <th>Th</th><th>Fr</th><th>Sa</th>
            </tr>
        </thead>
        <tbody><tr>`;

    for (let i = 0; i < firstDay; i++) html += "<td></td>";

    for (let d = 1; d <= daysInMonth; d++) {
        if ((firstDay + d - 1) % 7 === 0) html += "</tr><tr>";

        const isToday = year == new Date().getFullYear() &&
                        month == new Date().getMonth() &&
                        d == new Date().getDate();
        const className = isToday ? "today" : "";

        html += `<td class="${className}" ondblclick="editDay(${year}, ${month}, ${d})">${d}</td>`;
    }

    html += "</tr></tbody></table>";
    calendar.innerHTML = html;

}


generateCalendar(currentYear, new Date().getMonth());


yearSelect.onchange = monthSelect.onchange = function () {
    generateCalendar(Number(yearSelect.value), Number(monthSelect.value));
}


function editDay(year, month, day) {
    if(taskModal.style.display ==="none")
    {
    taskModal.style.display ="block"
    currentDate = `${year}-${month+1}-${day}`;
    modalTitle.textContent = currentDate;
    loadExpenses(currentDate);

    }
}

function closeModal() {
    saveExpenses();
    taskModal.style.display = "none";
}


function addRow() {
    const body = document.getElementById("expenseBody");
    const row = document.createElement("tr");

    row.innerHTML = `
         <td><input type="text" class="form-control desc"></td>
                    <td><input type="number" class="form-control price" step="0.01" oninput="updateTotal()"></td>
                    <td>
                        <button class="btn btn-danger" onclick="removeRow(this)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
    `;

    body.appendChild(row);
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll(".price").forEach(input => {
        const v = parseFloat(input.value) || 0;
        total += v;
    });
    document.getElementById("totalPrice").textContent = total.toFixed(2);
}


function removeRow(btn) {
    btn.closest("tr").remove();
    updateTotal();
}


function loadExpenses(currentDate) {
    const tableBody = document.getElementById("expenseBody");
    tableBody.innerHTML = ""; // clear table

    const data = JSON.parse(localStorage.getItem(currentDate)) || [];

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="form-control desc" value="${item.desc}"></td>
            <td><input type="number" class="form-control price" step="0.01" value="${item.price}"
                oninput="updateTotal()"></td>
            <td>
                <button class="btn btn-danger" onclick="removeRow(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateTotal();
    
}

function saveExpenses() {

    const rows = document.querySelectorAll("#expenseBody tr");
    let data = [];

    rows.forEach(row => {
        const desc = row.querySelector(".desc").value.trim();
        const price = parseFloat(row.querySelector(".price").value) || 0;

        if (desc !== "" || price > 0) {
            data.push({ desc, price});
        }
    }
);

    localStorage.setItem(currentDate, JSON.stringify(data));
    updateMonthTotal();

}



function calculateMonthTotal(year, month) {
    // month: 1~12
    let total = 0;
    const daysInMonth = new Date(year, month, 0).getDate(); // month = 1~12

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month}-${day}`; // 月份直接用 1~12
        const data = JSON.parse(localStorage.getItem(dateKey)) || [];
        data.forEach(item => total += parseFloat(item.price) || 0);
    }

    return total;
}

function updateMonthTotal() {
    const [year, month] = currentDate.split("-"); // month 1~12
    const monthKey = `${year}-${month}`;          // 保持一致
    const total = calculateMonthTotal(Number(year), Number(month));

    localStorage.setItem(monthKey, total.toFixed(2));
    document.getElementById("Montlytotal").innerHTML = total.toFixed(2);
}



