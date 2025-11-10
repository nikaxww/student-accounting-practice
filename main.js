function renderStudentsTable() {

    const container = document.getElementById('students-container');
    if (!container) return;

    container.innerHTML = '';
    const students = JSON.parse(localStorage.getItem('students')) || [];


    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    table.classList.add('students-table');

    const headerRow = document.createElement('tr');
    ['ФИО', 'Факультет', 'ДР и возраст', 'Годы обучения'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.append(th);
    });
    thead.append(headerRow);
    table.append(thead);



    students.forEach(student => {
        const row = document.createElement('tr');

        const td1 = document.createElement('td');
        const patronymic = student.patronomic ? ` ${student.patronomic}` : '';
        td1.textContent = `${student.surname} ${student.name}${patronymic}`;

        const td2 = document.createElement('td');
        td2.textContent = student.faculty;

        const td3 = document.createElement('td');
        const birthDate = new Date(student.brDate);
        const birthStr = birthDate.toLocaleDateString('ru-RU');
        const age = calculateAge(birthDate)
        td3.textContent = `${birthStr} (${age} лет)`;

        const td4 = document.createElement('td');
        td4.textContent = `${student.studyYears} (${student.courseStatus})`;

        row.append(td1, td2, td3, td4);
        tbody.append(row);
    });

    table.append(tbody);
    container.append(table);
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

document.addEventListener('DOMContentLoaded', function() {
    renderStudentsTable();
});
