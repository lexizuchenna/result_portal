const viewResult = (id) => {
  let url = `${window.location.protocol}//${window.location.host}/results/teacher/view/${id}`;

  window.location.href = url;
};
const viewEditResult = (id, term, session) => {
  let url = `${window.location.protocol}//${window.location.host}/users/teacher/edit-result/?id=${id}&term=${term}&session=${session}`;

  window.location.href = url;
};
