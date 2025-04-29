import Joi from "joi";

export const createHeroSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Hero ID must be a number.",
    "number.integer": "Hero ID must be an integer.",
    "number.positive": "Hero ID must be a positive number.",
    "any.required": "Hero ID is required.",
  }),
  title: Joi.string().trim().required().messages({
    "string.base": "Hero title must be a string.",
    "string.empty": "Hero title cannot be empty.",
    "any.required": "Hero title is required.",
  }),
  highlight: Joi.string().trim().required().messages({
    "string.base": "Hero highlight must be a string.",
    "string.empty": "Hero highlight cannot be empty.",
    "any.required": "Hero highlight is required.",
  }),
  description: Joi.string().trim().required().messages({
    "string.base": "Hero description must be a string.",
    "string.empty": "Hero description cannot be empty.",
    "any.required": "Hero description is required.",
  }),
});

export const updateHeroSchema = Joi.object({
  id: Joi.number().integer().positive().messages({
    "number.base": "Hero ID must be a number.",
    "number.integer": "Hero ID must be an integer.",
    "number.positive": "Hero ID must be a positive number.",
  }),
  title: Joi.string().trim().messages({
    "string.base": "Hero title must be a string.",
    "string.empty": "Hero title cannot be empty.",
  }),
  highlight: Joi.string().trim().messages({
    "string.base": "Hero highlight must be a string.",
    "string.empty": "Hero highlight cannot be empty.",
  }),
  description: Joi.string().trim().messages({
    "string.base": "Hero description must be a string.",
    "string.empty": "Hero description cannot be empty.",
  }),
  image: Joi.string().messages({
    "string.base": "Hero image must be a string.",
    "string.empty": "Hero image cannot be empty.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for updating the hero.",
  });
