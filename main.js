let sortConfig = {
    key: 'fio',
    order: 'asc'
};


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

function sortStudents(students, key, order = 'asc') {
     return students.sort((a, b) => {
        let valA, valB;

        switch (key) {
            case 'fio':
                valA = `${a.surname} ${a.name} ${a.patronomic || ''}`.toLowerCase();
                valB = `${b.surname} ${b.name} ${b.patronomic || ''}`.toLowerCase();
                break;

            case 'faculty':
                valA = (a.faculty || '').toLowerCase();
                valB = (b.faculty || '').toLowerCase();
                break;

            case 'birthDate':
                valA = new Date(a.brDate).getTime();
                valB = new Date(b.brDate).getTime();
                break;

            case 'studyYears':
                valA = Number(a.startYear) || 0;
                valB = Number(b.startYear) || 0;
                break;

            default:
                valA = '';
                valB = '';
        }

        let cmp = 0;
        if (valA < valB) cmp = -1;
        else if (valA > valB) cmp = 1;

        return order === 'desc' ? -cmp : cmp;
    });
}



function renderStudentsTable() {

    const container = document.getElementById('students-container');
    if (!container) return;


    let students = JSON.parse(localStorage.getItem('students')) || [];
    container.innerHTML = '';

    students = applyFilters(students);
    students = sortStudents(students, sortConfig.key, sortConfig.order);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    table.classList.add('students-table');

    const headers = [
        { text: 'ФИО', key: 'fio' },
        { text: 'Факультет', key: 'faculty' },
        { text: 'Дата рождения и возраст', key: 'birthDate' },
        { text: 'Годы обучения', key: 'studyYears' }
    ];

    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.text;
        th.style.cursor = 'pointer';
        th.dataset.sortKey = header.key;

        if (sortConfig.key === header.key) {
            const arrow = sortConfig.order === 'asc' ? ' ⇑' : ' ⇓';
            th.textContent += arrow;
        }

        th.addEventListener('click', () => {
            if (sortConfig.key === header.key) {
                sortConfig.order = sortConfig.order === 'asc' ? 'desc' : 'asc';
            } else {
                sortConfig.key = header.key;
                sortConfig.order = 'asc';
            }
            renderStudentsTable();
        });
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
