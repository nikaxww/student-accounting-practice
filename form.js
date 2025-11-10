let students = []

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

    brDate.type = 'date'
    startYear.type = 'number'

    form.append(surname)
    form.append(name)
    form.append(patronomic)
    form.append(brDate)
    form.append(startYear)
    form.append(faculty)
    form.append(button)
    form.append(errorMessage)

    document.body.append(form)

    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const surnameVal = surname.value.trim()
        const nameVal = name.value.trim()
        const patronomicVal = patronomic.value.trim()
        const brDateVal = brDate.value
        const startYearVal = parseInt(startYear.value, 10)
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
        }else if (!facultyVal) {
            message = 'Укажите факультет.';
            isValid = false;
        }

        if (!isValid) {
            errorMessage.textContent = message;
            return;
        }

      const student = {
      surname: surnameVal,
      name: nameVal,
      patronomic: patronomicVal,
      brDate: new Date(brDateVal),
      startYear: startYearVal,
      faculty: facultyVal,
      endYear: startYearVal + 4,
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
    console.log(student);
}

createForm()
