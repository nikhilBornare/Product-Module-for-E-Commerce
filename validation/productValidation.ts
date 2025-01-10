import Joi from "joi";

// Define validation schema for a single product
const singleProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .required()
        .messages({
            "string.empty": "Product name is required.",
            "string.min": "Product name must be at least 3 characters long.",
            "string.pattern.base": "Product name must only contain letters, numbers, and spaces.",
        }),

    brand: Joi.string().required().messages({
        "string.empty": "Brand is required.",
    }),

    seller: Joi.string().required().messages({
        "string.empty": "Seller is required.",
    }),

    product_description: Joi.string()
        .min(10)
        .optional()
        .messages({
            "string.min": "Product description must be at least 10 characters long.",
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Price must be a number.",
            "number.min": "Price cannot be negative.",
            "any.required": "Price is required.",
        }),

    discount: Joi.number()
        .min(0)
        .max(100)
        .optional()
        .messages({
            "number.base": "Discount must be a number between 0 and 100.",
            "number.min": "Discount cannot be negative.",
            "number.max": "Discount cannot be more than 100.",
        }),

    ratings: Joi.number()
        .min(0)
        .max(5)
        .required()
        .messages({
            "number.base": "Ratings must be a number between 0 and 5.",
            "number.min": "Ratings cannot be less than 0.",
            "number.max": "Ratings cannot be more than 5.",
            "any.required": "Ratings is required.",
        }),

    cod_availability: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "COD availability must be true or false.",
            "any.required": "COD availability is required.",
        }),

    total_stock_availability: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Total stock availability must be a number.",
            "number.min": "Total stock cannot be negative.",
            "any.required": "Total stock availability is required.",
        }),

    category: Joi.string()
        .required()
        .valid('electronics', 'clothing', 'others') // Example of possible categories
        .messages({
            "string.empty": "Category is required.",
            "any.only": "Category must be one of 'electronics', 'clothing', or 'others'."
        }),

    isFeatured: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Featured status must be true or false.",
            "any.required": "Featured status is required.",
        }),

    isActive: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Active status must be true or false.",
            "any.required": "Active status is required.",
        }),

    variants: Joi.array()
        .items(Joi.string().trim().min(1))
        .when('category', {
            is: 'electronics',
            then: Joi.required().messages({
                "array.base": "Variants must be an array of strings.",
                "array.empty": "Variants are required for electronics.",
                "any.required": "Variants are required for electronics.",
            }),
            otherwise: Joi.optional(),
        }),

    colours: Joi.array()
        .items(Joi.string().trim().min(1))
        .required()
        .messages({
            "array.base": "Colours must be an array of strings.",
            "array.empty": "Colours are required.",
            "string.min": "Each colour must be at least 1 character long.",
            "any.required": "Colours are required.",
        }),

    size: Joi.array()
        .items(Joi.string().trim().min(1))
        .when('category', {
            is: 'clothing',
            then: Joi.required().messages({
                "array.base": "Size must be an array of strings.",
                "array.empty": "Size is required for clothing.",
                "any.required": "Size is required for clothing.",
            }),
            otherwise: Joi.optional(),
        }),
});

// Define validation schema for an array of products
export const productSchema = Joi.alternatives().try(
    singleProductSchema,
    Joi.array().items(singleProductSchema)
);
