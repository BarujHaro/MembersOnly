const { body } = require("express-validator");

const validateMessage = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 150 }).withMessage("Title must have 3 to 150 characters")
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-':,.!?()]+$/)
    .withMessage("Title contains invalid characters"),

  body("text")
    .trim()
    .notEmpty().withMessage("Message text is required")
    .isLength({ min: 5, max: 2000 })
    .withMessage("Message must be between 5 and 2000 characters")
    .escape()
];

module.exports = validateMessage;