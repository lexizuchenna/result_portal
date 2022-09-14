const approval = document.getElementsByClassName("result");
const host = document.getElementById("host").innerText;
for (i = 0; i < approval.length; i++) {
  // console.log(approval[i].getAttribute('name'))
  approval[i].addEventListener("change", (e) => {
    let result = e.target;
    let id = result.getAttribute("name");

    axios
      .post(
        `${host}/users/api/admin/approve`,
        {
          resultId: id,
          approval: result.checked,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  });
}
