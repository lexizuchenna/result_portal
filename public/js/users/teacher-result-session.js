const viewGenerateResult = (id) => {
  const url = new URL(window.location.href);

  // Get the query parameters from the URL
  const params = new URLSearchParams(url.search);

  // Get a specific query parameter value by its name
  const session = params.get("session");
  const term = params.get("term");

  let newUrl = `${window.location.protocol}//${window.location.host}/users/teacher/generate-result?id=${id}&session=${session}&term=${term}`;

  window.location.href = newUrl;
};

const viewEditResult = (id) => {
  const url = new URL(window.location.href);

  // Get the query parameters from the URL
  const params = new URLSearchParams(url.search);

  // Get a specific query parameter value by its name
  const session = params.get("session");
  const term = params.get("term");

  let newUrl = `${window.location.protocol}//${window.location.host}/users/teacher/edit-result?id=${id}&session=${session}&term=${term}`;

  window.location.href = newUrl;
};
