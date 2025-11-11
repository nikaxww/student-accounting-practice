let students = JSON.parse(localStorage.getItem('students')) || []

function getCourseInfo(startYear) {
    const now = new Date();
    const endYear = startYear + 4;
    if (now >= new Date(endYear, 8, 1)) {
        return { years: `${startYear}–${endYear}`, status: 'закончил' };
    }
    const course = now.getFullYear() - startYear + (now.getMonth() >= 8 ? 1 : 0);
    return {
        years: `${startYear}–${endYear}`,
        status: `${Math.min(4, Math.max(1, course))} курс`
    }
}

function createForm() {
    const form = document.createElement('form')
    const surname = document.createElement('input')
    const name = document.createElement('input')
    const patronomic = document.createElement('input')
    const brDate = document.createElement('input')
    const startYear = document.createElement('input')
    const faculty = document.createElement('input')
    const button = document.createElement('button')
    const errorMessage = document.createElement('div');

    form.classList.add('form')
    surname.classList.add('input')
    name.classList.add('input')
    patronomic.classList.add('input')
    brDate.classList.add('input')
    startYear.classList.add('input')
    faculty.classList.add('input')
    button.classList.add('button')
    errorMessage.classList.add('error-message')

    surname.placeholder = 'Фамилия*'
    name.placeholder = 'Имя*'
    patronomic.placeholder = 'Отчество'
    startYear.placeholder = 'Год начала обучения*'
    faculty.placeholder = 'Факультет*'
    button.textContent = 'Добавить студента'

    button.type = 'submit'
    brDate.type = 'date'
    startYear.type = 'number'
    startYear.min = '2000'

    form.append(surname)
    form.append(name)
    form.append(patronomic)
    form.append(brDate)
    form.append(startYear)
    form.append(faculty)
    form.append(button)
    form.insertBefore(errorMessage, button)

    const container = document.createElement('div');
    container.id = 'students-container';
    document.body.append(form, container);


    function resetErrorStyles() {
        const inputs = [surname, name, brDate, startYear, faculty];
        inputs.forEach(input => {
            input.classList.remove('error');
        });
        errorMessage.textContent = '';
    }

    function errorField(input, hasError) {
        if (hasError) {
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const surnameVal = surname.value.trim()
        const nameVal = name.value.trim()
        const patronomicVal = patronomic.value.trim()
        const brDateVal = brDate.value
        const startYearVal = Number(startYear.value)
        const facultyVal = faculty.value.trim()

        let errors = [];
        resetErrorStyles();

        if (!surnameVal) {
            errors.push('Укажите фамилию.');
            errorField(surname, true);
        } 
        if (!nameVal) {
            errors.push('Укажите имя.');
            errorField(name, true);
        } 
        if (!brDateVal) {
            errors.push('Укажите дату рождения.');
            errorField(brDate, true);
        } else {
            const birthDate = new Date(brDateVal);
            if (isNaN(birthDate.getTime())) {
                errors.push('Некорректная дата рождения.');
                errorField(brDate, true);
            } else if (birthDate > new Date()) {
                errors.push('Дата рождения не может быть в будущем.');
                errorField(brDate, true);
            } else if (birthDate.getFullYear() < 1900) {
                errors.push('Год рождения должен быть не раньше 1900.');
                errorField(brDate, true);
            }
        }
        if (!startYearVal) {
            errors.push('Укажите год начала обучения');
            errorField(startYear, true);
        } else if (startYearVal < 2000 || startYearVal > new Date().getFullYear()) {
            errors.push(`Год должен быть от 2000 до ${new Date().getFullYear()}.`);
            errorField(startYear, true);
        } 
        if (!facultyVal) {
            errors.push('Укажите факультет.');
            errorField(faculty, true);
        }

            if (errors.length > 0) {
                errorMessage.innerHTML = errors.map(error =>
                    `<div class="error-item">• ${error}</div>`
                ).join('');
                return;
            }
        const courseInfo = getCourseInfo(startYearVal);
        const student = {
            surname: surnameVal,
            name: nameVal,
            patronomic: patronomicVal,
            brDate: brDateVal,
            startYear: startYearVal,
            faculty: facultyVal,
            studyYears: courseInfo.years,
            courseStatus: courseInfo.status
        };

        addStudentToArray(student);
        form.reset();
        errorMessage.textContent = '';
        resetErrorStyles(); 
    })

    const inputs = [surname, name, patronomic, brDate, startYear, faculty];
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    return {
        surname,
        name,
        patronomic,
        brDate,
        startYear,
        faculty,
        button
    }
}

function addStudentToArray(student) {

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    console.log(students);


    if (typeof renderStudentsTable === 'function') {
        renderStudentsTable();
    }
}

createForm()
