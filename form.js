let students = []

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
    form.append(errorMessage)

    document.body.append(form)

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const surnameVal = surname.value.trim()
        const nameVal = name.value.trim()
        const patronomicVal = patronomic.value.trim()
        const brDateVal = brDate.value
        const startYearVal = Number(startYear.value)
        const facultyVal = faculty.value.trim()

        let isValid = true
        let message = ''

        if (!surnameVal) {
            message = 'Укажите фамилию.'
            isValid = false
        } else if (!nameVal) {
            message = 'Укажите имя.'
            isValid = false;
        } else if (!brDateVal) {
            message = 'Укажите дату рождения.'
            isValid = false;
        } else if (!startYear) {
            message = 'Укажите год начала обучения'
            isValid = false;
        } else if (!facultyVal) {
            message = 'Укажите факультет.';
            isValid = false;
        } else if (startYearVal < 2000 || startYearVal > new Date().getFullYear()) {
                message = `Год должен быть от 2000 до ${new Date().getFullYear()}.`;
                isValid = false;
            }

        if (!isValid) {
            errorMessage.textContent = message;
            return;
        }
        const courseInfo = getCourseInfo(startYearVal);
        const student = {
            surname: surnameVal,
            name: nameVal,
            patronomic: patronomicVal,
            brDate: new Date(brDateVal),
            faculty: facultyVal,
            studyYears: courseInfo.years,
            courseStatus: courseInfo.status
        };

        addStudentToArray(student);
        form.reset();
        errorMessage.textContent = '';

    })

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
    console.log(students);
}

createForm()
