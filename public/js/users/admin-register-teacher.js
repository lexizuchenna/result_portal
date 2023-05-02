const subChild = document.getElementById("sub-child");
const addSubject = document.getElementById("add-subject");

addSubject.addEventListener("click", () => {
  let input = document.createElement("input");
  let firstDiv = document.createElement("div");
  let secondDiv = document.createElement("div");
  let thirdDiv = document.createElement("div");
  let label = document.createElement("label");
  let button = document.createElement("button");

  let lastChild = subChild.lastElementChild;
  let lastInput = lastChild.children[1].firstElementChild;

  let newArray = lastInput.getAttribute("id").split("-");
  let number = parseInt(newArray[1]);

  firstDiv.setAttribute("class", "form-group row");

  label.setAttribute("class", "col-sm-12 col-md-2 col-form-label");
  label.innerText = `Subject ${number + 1}`;

  secondDiv.setAttribute("class", "col-sm-12 col-md-10");

  input.setAttribute("type", `text`);
  input.setAttribute("id", `sub-${number + 1}`);
  input.setAttribute("name", `sub${number + 1}`);
  input.setAttribute("placeholder", `Subject...`);
  input.setAttribute("style", `flex: 1;`);
  input.setAttribute("class", `form-control`);

  button.setAttribute("class", "btn btn-danger btn-sm remove");
  button.setAttribute("href", "#");
  button.setAttribute("type", "button");
  button.innerText = "remove";

  thirdDiv.setAttribute("class", "pull-right");
  thirdDiv.setAttribute("style", "margin: 10px auto;");

  thirdDiv.append(button);
  secondDiv.append(input);
  secondDiv.append(thirdDiv);
  firstDiv.append(label);
  firstDiv.append(secondDiv);

  subChild.append(firstDiv);
});
subChild.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    var div = e.target.parentElement.parentElement.parentElement;
    subChild.removeChild(div);
  }
});
