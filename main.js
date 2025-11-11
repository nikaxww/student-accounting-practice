

function applyFilters(students) {
    const fio = document.getElementById('filter-fio')?.value.trim().toLowerCase() || '';
    const faculty = document.getElementById('filter-faculty')?.value.trim().toLowerCase() || '';
    const startY = document.getElementById('filter-startYear')?.value;
    const endY = document.getElementById('filter-endYear')?.value;

    return students.filter(s => {
        const fullName = `${s.surname} ${s.name} ${s.patronomic || ''}`.toLowerCase();
        const matchFio = !fio || fullName.includes(fio);
        const matchFaculty = !faculty || s.faculty.toLowerCase().includes(faculty);
        const matchStart = !startY || Number(s.startYear) === Number(startY);
        const matchEnd = !endY || (Number(s.startYear) + 4) === Number(endY);
        return matchFio && matchFaculty && matchStart && matchEnd;
    });
}

function createFilters() {
    const container = document.getElementById('students-container');
    if (!container) return;


    const filtersWrapper = document.createElement('div');
    filtersWrapper.classList.add('filters');

    const fields = [
        { id: 'filter-fio', placeholder: 'ФИО', type: 'text' },
        { id: 'filter-faculty', placeholder: 'Факультет', type: 'text' },
        { id: 'filter-startYear', placeholder: 'Год начала', type: 'number' },
        { id: 'filter-endYear', placeholder: 'Год окончания', type: 'number' }
    ];

    fields.forEach(field => {
        const input = document.createElement('input');
        input.id = field.id;
        input.type = field.type;
        input.placeholder = field.placeholder;
        input.classList.add('filter-input');

        input.addEventListener('input', () => renderStudentsTable());

        filtersWrapper.append(input);
    });

    container.before(filtersWrapper);
}

function renderStudentsTable() {

    const container = document.getElementById('students-container');
    if (!container) return;


    let students = JSON.parse(localStorage.getItem('students')) || [];
    container.innerHTML = '';
    students = applyFilters(students);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    table.classList.add('students-table');

    const headerRow = document.createElement('tr');
    ['ФИО', 'Факультет', 'Дата рождения и возраст', 'Годы обучения'].forEach(text => {
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

document.addEventListener('DOMContentLoaded', function () {
    createFilters();
    renderStudentsTable();
});
