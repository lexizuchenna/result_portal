// Home Route
const viewHome = (req, res) => {
  res.render('home', {layout: 'home'})
};

module.exports = {
  viewHome
};