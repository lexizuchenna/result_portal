// Home Route
module.exports = {
  viewHome: async (req, res) => {
    try {
      return res.render("public/home", {
        layout: "home",
        active: "active",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .render("errors/500", { layout: error, error: error.message });
    }
  },
  viewAbout: async (req, res) => {
    try {
      return res.render("public/about", {
        layout: "home",
        props: {
          state: "home",
        },
        active: "active",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .render("errors/500", { layout: error, error: error.message });
    }
  },
};
