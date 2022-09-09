const form = document.getElementById('submit')
const year = document.getElementById('year')
const term = document.getElementById('term')
const subjectsBox = document.getElementById('subjects')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(term.value)
    axios
    .post(
      "http://localhost:2022/users/api/teacher/get-record",
      {
        year: year.value,
        term: term.value
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
        let record = res.data[0]
        let subjects = _.omit(record, ['term', 'year', 'user', '_id', 'createdAt', 'updatedAt', '__v',])

        let subject = document.createElement('div')
        let label = document.createElement('label')
        let input = document.createElement('input')


        subject.setAttribute('class', "input-group subject")
        input.setAttribute('type', 'text')
        input.setAttribute('name', `firstAss`)

        console.log(label)
        console.log(subjects)
        
        for (let keys in subjects) {
        //   subject.appendChild(`<input type="text" name="${subjects}-firstAss" />`)
        // }
        input.setAttribute('name', `${subjects[keys]}-firstAss`)
        
        console.log(subject)
        console.log(input)
        }
      });

})