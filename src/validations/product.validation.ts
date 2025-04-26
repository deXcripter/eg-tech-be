import Joi from "joi";
import mongoose from "mongoose";

export const productValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Product name is required",
    "any.required": "Product name is required",
  }),

  description: Joi.string().required().trim().min(10).max(5000).messages({
    "string.empty": "Product description is required",
    "string.min": "Description must be at least {#limit} characters long",
    "string.max": "Description cannot exceed {#limit} characters",
    "any.required": "Product description is required",
  }),

  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Product price is required",
  }),

  category: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.empty": "Product category is required",
      "any.invalid": "Invalid category ID format",
      "any.required": "Product category is required",
    }),

  subcategory: Joi.string()
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid subcategory ID format",
    }),

  // specs: Joi.object()
  //   .pattern(
  //     /^[a-zA-Z0-9_]+$/, // Only allow alphanumeric + underscore keys
  //     Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean())
  //   )
  //   // .required()
  //   .messages({
  //     "object.base": "Specifications must be an object",
  //     "any.required": "Product specifications are required",
  //   }),

  specs: Joi.string().required().trim(),

  inStock: Joi.boolean().default(true),

  featured: Joi.boolean().default(false),

  rating: Joi.number().min(0).max(5).default(0).messages({
    "number.min": "Rating cannot be negative",
    "number.max": "Rating cannot exceed 5",
  }),
})
  .min(1)
  .messages({
    "object.min": "Request body cannot be empty",
  })
  .unknown(true);

function createPartialSchema(fullSchema: Joi.ObjectSchema) {
  const schemaKeys = fullSchema.$_terms.keys.reduce(
    (
      acc: { [x: string]: any },
      key: { key: string | number; schema: { optional: () => any } }
    ) => {
      acc[key.key] = key.schema.optional();
      return acc;
    },
    {}
  );

  return Joi.object(schemaKeys).min(1).messages({
    "object.min": "Request body cannot be empty",
  });
}

export const updateProductValidationSchema = createPartialSchema(
  productValidationSchema
);
