const deleteEl = (id) => {
  const form = document.createElement("form");
  const input = document.createElement("input");

  form.setAttribute("action", "/users/admin/delete-teacher");
  form.setAttribute("method", "POST");

  input.setAttribute("name", "id");
  input.setAttribute("value", id);
  input.setAttribute("type", "text");
  input.setAttribute("style", "display: none;");

  form.append(input);

  document.querySelector(".main-container").append(form);

  if (confirm("Are you sure you want to delete teacher")) {
    form.submit();
  }
};

const edit = (id) => {
  window.location.href = `/users/teacher/edit-student/${id}`;
};
