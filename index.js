const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const calendar = document.getElementById("calendar");
const taskModal = document.getElementById("taskModal");
const taskTextarea = document.getElementById("taskTextarea");
const modalTitle = document.getElementById("modalTitle");
const editBtn = document.getElementById("editBtn");
const editFooter = document.getElementById("editFooter");

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

    let html = `<table class="table table-bordered text-center">
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
    generateCalendar(yearSelect.value, monthSelect.value);
}


function editDay(year, month, day) {
    if(taskModal.style.display ==="none")
    {
    taskModal.style.display ="block"
    currentDate = `${year}-${month+1}-${day}`;
    modalTitle.textContent = currentDate;
    taskTextarea.value = localStorage.getItem(currentDate) || "";
    taskTextarea.readOnly = true;
    editBtn.style.display = "inline-block";
    }
   
    editFooter.className="d-none";
}

function closeModal() {
    taskModal.style.display = "none";
}

function enableEdit() {
    taskTextarea.readOnly = false;
    editBtn.style.display = "none";
    editFooter.className = "d-flex justify-content-between w-100";
}

function cancelEdit() {
    const answer=confirm("Are you sure you want to discard your changes?")
    if(answer)
    {
    taskTextarea.value = localStorage.getItem(currentDate) || "";
    taskTextarea.readOnly = true;
    editBtn.style.display = "inline-block";
    editFooter.className ="d-none";
    }
}

function saveTask() {
    localStorage.setItem(currentDate, taskTextarea.value);
    taskTextarea.readOnly = true;
    editBtn.style.display = "inline-block";
    editFooter.className="d-none";
}