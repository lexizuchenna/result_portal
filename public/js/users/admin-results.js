const modal = document.getElementById("modal-1");
const remove = document.getElementById("remove-modal");

const viewResult = (id) => {
  let url = `${window.location.protocol}//${window.location.host}/results/admin/view/${id}`;

  window.location.href = url;
};
const editResult = (id) => {
  let url = `${window.location.protocol}//${window.location.host}/users/admin/result/${id}`;

  window.location.href = url;
};
const deleteResult = (id) => {
  const form = document.createElement("form");
  const input = document.createElement("input");

  form.setAttribute("action", "/users/admin/delete-result");
  form.setAttribute("method", "POST");

  input.setAttribute("name", "id");
  input.setAttribute("value", id);
  input.setAttribute("type", "text");
  input.setAttribute("style", "display: none;");

  form.append(input);
  document.querySelector(".main-container").append(form);

  if (confirm("Are you sure u want to deleteresult")) {
    form.submit();
  }
};
const approveResult = (id) => {
  modal.click();

  let url = `${window.location.protocol}//${window.location.host}/users/api/admin/approve`;

  axios
    .post(
      url,
      {
        id,
        check: true,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      const { data } = res;

      if (data.approved) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("success-show").style.display = "block";

        const el = document.getElementById(data.resultId);
        el.remove();

        setTimeout(() => {
          remove.click();
        }, 1500);
      }
    });
};

const generalCheck = document.getElementById("general-check");
const checkBoxes = document.querySelectorAll(".check-box");

// Add change event listener to the general check checkbox
generalCheck.addEventListener("change", () => {
  checkBoxes.forEach((checkBox) => {
    checkBox.checked = generalCheck.checked;
  });
});

// Add change event listener to the check-box checkboxes
checkBoxes.forEach((checkBox) => {
  checkBox.addEventListener("change", () => {
    const allChecked = [...checkBoxes].every((checkBox) => checkBox.checked);
    generalCheck.checked = allChecked;
  });
});
