const approval = document.getElementsByClassName('result')
for (i = 0; i < approval.length; i++) {
    // console.log(approval[i].getAttribute('name'))
    approval[i].addEventListener('change', (e) => {
        let result = e.target
        let id = result.getAttribute('name')

            axios
            .post(
              `http://localhost:2022/users/api/admin/approve`,
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
                console.log(res)
            })
        
    })
}