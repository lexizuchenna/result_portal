const { check, validationResult } = require("express-validator");

exports.validateUser = [
  check("class").trim().notEmpty().withMessage("Enter Class Name"),
  check("username").notEmpty().withMessage("Enter Username").trim().toLowerCase(),
  check("session").notEmpty().withMessage("Enter Session").trim(),
  check("password")
    .notEmpty()
    .withMessage("Enter Password")
    .isLength({ min: 5 })
    .withMessage("Paswword must be up to Five"),

  check("password2").custom(async (password2, { req }) => {
    const password = req.body.password;
    if (password !== password2) {
      throw new Error("Password does not not match");
    }

    return true;
  }),
  (req, res, next) => {
    let errors = validationResult(req);
    // console.log(errors.array().map((one) => one.msg));
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render("users/registerTeacher", { errors: errors.array() });
    }

    next();
  },
];