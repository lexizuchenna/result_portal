const moment = require("moment");

const formatDate = (date) => {
    return moment(date, "DD-MM-YYYY, h: mm").format("DD-MM-YYYY, h: mm");
};

const addNumbers = (num1, num2, num3, num4) => {
    return parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4);
};

const checkGrade = (num1, num2, num3, num4) => {
    let total =
        parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4);
    if (total >= 85) {
        return "E";
    } else if (total >= 79) {
        return "G";
    } else if (total >= 65) {
        return "S";
    } else if (total <= 64) {
        return "NI";
    } else if ((total = 0 || total === "" || !total)) {
        return "NA";
    }
};
const checkRemark = (num1, num2, num3, num4, num5) => {
    let total =
        parseInt(num1) +
        parseInt(num2) +
        parseInt(num3) +
        parseInt(num4) +
        parseInt(num5);
    if (total >= 85) {
        return "Excellent";
    } else if (total >= 79) {
        return "Good";
    } else if (total >= 65) {
        return "Satisfactory";
    } else {
        return "Needs Improvement";
    }
};

const ifCond = (arg1, arg2, options) => {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
};

const ifArray = (arr1, arr2) => {
    arr2.map((arr) => {
        // return `<div>${arr}</div>`;
        arr1.map((array) => {
            if (array.className === arr) {
                //   return `
                //   <form
                //   action="/users/admin/add-message"
                //   method="post"
                //   style="margin-bottom: 10px;"
                // >
                //   <ul class="tasks-list">
                //     <li class="tasks-item">
                //       <div class="card task-card">

                //         <div class="card-input">
                //           <input
                //             type="checkbox"
                //             name="{{this.resultId}}"
                //             id="task-{{this.resultId}}"
                //             class="result"
                //           />

                //           <label for="task-1" class="task-label">
                //             <a href="{{host}} {{this.resultLink}}" target="_blank">Click here to
                //               view result</a>
                //           </label>
                //         </div>
                //         <div>
                //           <div class="card-badge cyan radius-pill">{{this.name}}</div>

                //           <div class="card-badge orange radius-pill">{{this.teacher}}</div>
                //         </div>

                //         <ul class="card-meta-list">

                //           <li>
                //             <div class="meta-box icon-box">
                //               <span>
                //                 <input type="text" placeholder="message" name="message" />
                //                 <input
                //                   type="text"
                //                   value="{{this.resultId}}"
                //                   name="resultId"
                //                   style="display: none;"
                //                 />
                //               </span>
                //             </div>
                //           </li>

                //           <li>
                //             <div class="card-badge green" style="margin-bottom: 5px;">
                //               <button type="submit" class="green">Send</button>
                //             </div>
                //             <div class="card-badge blue">
                //               <a
                //                 style="color: #fff;"
                //                 href="/users/admin/result/{{this.resultId}}"
                //               >Edit</a>
                //             </div>
                //           </li>

                //         </ul>

                //       </div>
                //     </li>
                //   </ul>
                // </form>
                //   `
                return arr.name;
            }
        });
    });
};

const capitalize = (word) => {
    return word.toUpperCase();
};

const ifTrue = (arg1, arg2) => {
    if (arg1 === arg2) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    formatDate,
    addNumbers,
    checkGrade,
    checkRemark,
    ifCond,
    ifArray,
    ifTrue,
    capitalize,
};
