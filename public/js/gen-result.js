const subChild = document.getElementById('sub-child')
const addSubject = document.getElementById('add-subject')



addSubject.addEventListener('click', () => {
    let input = document.createElement('input')
    let lastChild = subChild.lastElementChild
    let newArray = lastChild.getAttribute('id').split('-')
    let number = parseInt(newArray[1])

    input.setAttribute('type', `text`)
    input.setAttribute('id', `sub-${number +1}`)
    input.setAttribute('name', `sub${number +1}`)
    input.setAttribute('placeholder', `Subject...`)
    subChild.append(input)
})