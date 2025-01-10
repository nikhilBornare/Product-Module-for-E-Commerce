import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";  
import { ApplicationError } from "../error-handler/applicationError";
import getFilteredSortedPaginatedProducts from "../utils/features";
import logger from "../utils/logger";

// createProduct
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    logger.info(`Product created: ${product.name}`);
    res.status(201).json({
      success: true,
      data: product,        
      message: "Product created successfully.",
    });
  } catch (error: any) {
    logger.error(`Error creating product: ${error.message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// createMultipleProducts
export const createMultipleProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return next(new ApplicationError("Invalid or empty array of products provided.", 400));
    }

    const success = [];
    const failed = [];

    for (const product of products) {
      try {
        const existingProduct = await Product.findOne({ name: product.name });

        if (existingProduct) {
          failed.push({ product, message: "Product name must be unique." });
          continue; // Skip this product if name is not unique
        }

        const newProduct = await Product.create(product);
        success.push({ id: newProduct._id, name: newProduct.name, message: "Created successfully" });
      } catch (err) {
        failed.push({ product, message: (err as Error).message });
      }
    }

    res.status(201).json({
      success: true,
      results: {
        created: success.length,
        failed: failed.length,
        details: {
          success,
          failed,
        },
      },
    });
  } catch (error) {
    next(new ApplicationError((error as Error).message, 500));
  }
};

// getAllProducts
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryFeatures = {
      search: req.query.search as string,
      priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
      priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
      ratings: req.query.ratings as string,
      sort: req.query.sort as
        | "name"
        | "createdAtAsc"
        | "updatedAtAsc"
        | "createdAtDesc"
        | "updatedAtDesc"
        | "priceAsc"
        | "priceDesc"
        | "ratingsAsc"
        | "ratingsDesc"
        | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
    };

    const { products, total, page, limit } = await getFilteredSortedPaginatedProducts(queryFeatures);

    logger.info(`Fetched ${products.length} products from the database (Total: ${total})`);

    res.status(200).json({
      success: true,
      data: products,
      total,
      page,
      limit,
    });
  } catch (error) {
    logger.error(`Error fetching products: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    logger.info(`Product with ID ${req.params.id} retrieved successfully`);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    logger.error(`Error retrieving product with ID ${req.params.id}: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// Update Product by ID
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }
    logger.info(`Product with ID ${req.params.id} updated successfully`);
    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully.",
    });
  } catch (error) {
    logger.error(`Error updating product with ID ${req.params.id}: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// updateMultipleProducts
export const updateMultipleProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return next(new ApplicationError("Invalid or empty array of updates provided.", 400));
    }

    const success = [];
    const failed = [];

    for (const { id, updateData } of updates) {
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        if (updatedProduct) {
          success.push({ id, name: updatedProduct.name, message: "Updated successfully" });
        } else {
          failed.push({ id, message: "Product not found" });
        }
      } catch (err) {
        failed.push({ id, message: (err as Error).message });
      }
    }
    logger.info(`Multiple product updates: ${success.length} succeeded, ${failed.length} failed`);
    res.status(200).json({
      success: true,
      results: {
        updated: success.length,
        failed: failed.length,
        details: {
          success,
          failed,
        },
      },
    });
  } catch (error) {
    logger.error(`Error updating multiple products: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};

// delete product by ID
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    }
    logger.info(`Product with ID ${req.params.id} deleted successfully`);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error deleting product with ID ${req.params.id}: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};

// deleteMultipleProducts
export const deleteMultipleProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new ApplicationError("Invalid IDs provided.", 400));
    }

    const success = [];
    const failed = [];

    for (const id of ids) {
      try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
          success.push({ id, message: "Deleted successfully" });
        } else {
          failed.push({ id, message: "Product not found" });
        }
      } catch (err) {
        failed.push({ id, message: "Invalid ID format or error during deletion" });
      }
    }

    res.status(200).json({
      success: true,
      results: {
        deleted: success.length,
        failed: failed.length,
        details: {
          success,
          failed,
        },
      },
    });
  } catch (error) {
    logger.error(`Error deleting multiple products: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};
