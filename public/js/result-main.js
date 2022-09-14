let firstAss = document.getElementsByClassName('firstAss')
let secAss = document.getElementsByClassName('secAss')
let thirdAss = document.getElementsByClassName('thirdAss')
let project = document.getElementsByClassName('project')
let exam = document.getElementsByClassName('exam')
let totals = document.getElementsByClassName('totals')
let average = document.getElementsByClassName('average')

let firstAssTotal = 0
for(i = 0; i < firstAss.length; i++) {
    firstAssTotal = firstAssTotal + parseInt(firstAss[i].innerText)
}

let secAssTotal = 0
for(i = 0; i < secAss.length; i++) {
    secAssTotal = secAssTotal + parseInt(secAss[i].innerText)
}
let thirdAssTotal = 0
for(i = 0; i < thirdAss.length; i++) {
    thirdAssTotal = thirdAssTotal + parseInt(thirdAss[i].innerText)
}

let projectTotal = 0
for(i = 0; i < project.length; i++) {
    projectTotal = projectTotal + parseInt(project[i].innerText)
}

let examsTotal = 0
for(i = 0; i < exam.length; i++) {
    examsTotal = examsTotal + parseInt(exam[i].innerText)
}

let totalTotal = 0
for(i = 0; i < totals.length; i++) {
    totalTotal = totalTotal + parseInt(totals[i].innerText)
}

let averageTotal = 0
for(i = 0; i < average.length; i++) {
    averageTotal = averageTotal + parseInt(average[i].innerText)
}

const subjectAverage = document.getElementById('c-ave')
const classAverage = document.getElementById('cl-ave')
const totalSub = document.getElementById('total-sub').innerText

console.log(totalSub, totals)

const getAverage = (dividend, divisor, element, text) => {
    let quotient = parseInt(dividend) / parseInt(divisor)
    element.innerText = `${quotient}`
}

getAverage(totalTotal, totalSub, subjectAverage, '')
getAverage(averageTotal, totalSub, classAverage, '')


document.getElementById('first-ass-total').innerText = firstAssTotal
document.getElementById('sec-ass-total').innerText = secAssTotal
document.getElementById('third-ass-total').innerText = thirdAssTotal
document.getElementById('project-total').innerText = projectTotal
document.getElementById('exam-total').innerText = examsTotal
document.getElementById('total-total').innerText = totalTotal
document.getElementById('average-total').innerText = averageTotal