const form = document.getElementById("details-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const term = data.get("term");
  const session = data.get("session");

  if (term === "Select Term") {
    return Toastify({
      text: "select term",
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

  if (session === "Select Session") {
    return Toastify({
      text: "select session",
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

  const url = `${window.location.protocol}//${window.location.host}/users/teacher/result-session?term=${term}&session=${session}`;

  console.log(term, session);

  window.location.href = url;
});
