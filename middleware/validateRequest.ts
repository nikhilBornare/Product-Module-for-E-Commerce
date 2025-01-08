import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel"; 
import { ApplicationError } from "../error-handler/applicationError";
import { productSchema } from "../validation/productValidation"; 

// Validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false });

    if (error) {    
        const formattedErrors = error.details.map((detail) => ({
            field: detail.context?.key || "unknown",
            message: detail.message,
        }));
        return next(new ApplicationError("Validation failed", 400, formattedErrors));
    }
    next();
};


// Middleware for checking unique product name (if applicable)
export const checkUniqueFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body; 
        const id = req.params?.id;

        // Check if a product with the same name already exists (excluding the current product ID)
        const existingProduct = await Product.findOne({
            name,
            _id: { $ne: id }, // Exclude the current product being updated
        });

        const errors: object[] = [];

        if (existingProduct) {
            errors.push({ field: "name", message: "Product name must be unique. This name is already in use." });
        }

        if (errors.length > 0) {
            return next(new ApplicationError("Duplicate field error", 400, errors));
        }

        next();
    } catch (err) {
        next(new ApplicationError("Internal server error during unique validation", 500));
    }
};
