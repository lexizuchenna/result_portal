const genders = document.querySelectorAll(".gender");
const currentGenderValue = document.querySelector(
  "#current-gender-value"
).value;

genders.forEach((gender) => {
  const value = gender.getAttribute("value");
  if (value === currentGenderValue) {
    gender.setAttribute("selected", "");
  }
});
