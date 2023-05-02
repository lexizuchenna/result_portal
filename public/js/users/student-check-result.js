const tokenForm = document.getElementById("token-form");
const token = document.getElementById("token-input");
const submitBtn = document.getElementById("submit-btn");

let result;

const checkResult = (form, username) => {
  const url = `${window.location.protocol}//${window.location.host}/users/student/check-result`;

  const formData = new FormData(form);

  const data = {
    term: formData.get("term"),
    session: formData.get("session"),
    username,
  };

  if (data.term === "Select Term" || data.session === "Select Session") {
    return Toastify({
      text: "Check Details",
      duration: 8000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#dc3545" },
    }).showToast();
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "......";

  return axios
    .post(url, data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      const { data } = res;

      result = data;

      tokenForm.style.visibility = "visible";
      tokenForm.style.height = "inherit";
    })
    .catch((err) => {
      const { response } = err;

      if (response.status === 404 || response.status === 500) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Check Result";

        return Toastify({
          text: response.data,
          duration: 8000,
          destination: "",
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
          style: { background: "#dc3545" },
        }).showToast();
      }
    });
};

token.addEventListener("input", (event) => {
  const value = event.target.value;
  const cursorPosition = event.target.selectionStart;
  const key = event.data;

  // Remove any existing dashes from the value
  const sanitizedValue = value.replace(/-/g, "");

  // Insert a dash after every fourth character
  let formattedValue = sanitizedValue.replace(/(.{4})(?!$)/g, "$1-");

  // Update the input field value based on the key pressed
  if (key === null && cursorPosition > 0) {
    // backspace key pressed
    formattedValue =
      formattedValue.slice(0, cursorPosition - 1) +
      formattedValue.slice(cursorPosition);
  } else if (
    cursorPosition < formattedValue.length &&
    (key === null || key === "")
  ) {
    // delete key pressed
    formattedValue =
      formattedValue.slice(0, cursorPosition) +
      formattedValue.slice(cursorPosition + 1);
  }

  // Update the input field value with the formatted value
  event.target.value = formattedValue;

  // Restore the cursor position
  let newCursorPosition = cursorPosition;
  if (key === null && cursorPosition > 0) {
    newCursorPosition--;
  } else if (
    cursorPosition < formattedValue.length &&
    (key === null || key === "")
  ) {
    // don't change cursor position
  } else {
    newCursorPosition += formattedValue.length - value.length;
  }
  event.target.setSelectionRange(newCursorPosition, newCursorPosition);
});

// Set the max length of the input field to 14
token.maxLength = 14;

const viewResult = () => {
  const url = `${window.location.protocol}//${window.location.host}/results/student/view/${result.resultId}`;

  const newToken = token.value.split("-").join("");

  if (newToken !== result.token) {
    return Toastify({
      text: "Incorrect Token",
      duration: 8000,
      destination: "",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#dc3545" },
    }).showToast();
  }

  window.location.href = url;
};
