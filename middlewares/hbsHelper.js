const moment = require('moment')
const formatDate = (date) => {
    return moment(date, 'DD-MM-YYYY, h: mm').format('DD-MM-YYYY, h: mm')
}

const addNumbers = (num1, num2, num3, num4, num5) => {
    return parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4) + parseInt(num5)
}

const checkGrade = (num1, num2, num3, num4, num5) => {
    let total = parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4) + parseInt(num5)
    if(total >= 85) {
        return 'E'
    } else if (total >= 79 ) {
        return 'G'
    } else if (total >= 65 ) {
        return 'S'
    } else if (total >= 55 ) {
        return 'NI'
    } else {
        return 'NA'
    }
}
const checkRemark = (num1, num2, num3, num4, num5) => {
    let total = parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4) + parseInt(num5)
    if(total >= 85) {
        return 'Excellent'
    } else if (total >= 79 ) {
        return 'Good'
    } else if (total >= 65 ) {
        return 'Satisfactory'
    } else  {
        return 'Needs Improvement'
    }
}

const ifCond = (par1, ) => {
    if(par1 === false) {
        return `<ul class="card-meta-list">
        <li>
          <div class="meta-box icon-box">
            <span>
              <input
                type="email"
                placeholder="email"
                name="email"
              />
            </span>
          </div>
        </li>

        <li>
          <div class="card-badge red">
            <a href="">Edit</a>
          </div>
        </li>

      </ul>`
    }
    return `<form
    action="/users/teacher/send-result"
    method="post"
    style="margin-bottom: 10px;"
  >
    <ul class="card-meta-list">
      <li>
        <div class="meta-box icon-box">
          <span>
            <input
              type="email"
              placeholder="email"
              name="email"
            />
            <input
              type="text"
              value="{{host}} {{this.resultLink}}"
              name="link"
              style="display: none;"
            />
            <input
              type="text"
              value="{{this.name}}"
              name="studName"
              style="display: none;"
            />
          </span>
        </div>
      </li>

      <li>
        <div class="card-badge red">
          <button type="submit">Send</button>
        </div>
      </li>

    </ul>
  </form>`
}

module.exports = {
    formatDate, addNumbers, checkGrade, checkRemark, ifCond
}