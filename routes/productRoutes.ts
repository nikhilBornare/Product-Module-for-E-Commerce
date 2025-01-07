import express from "express";
import mongoose from "mongoose";
import {
  createMultipleProducts,
  createProduct,
  deleteMultipleProducts,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateMultipleProducts,
  updateProduct,
} from "../controllers/productController";
import { validateRequest, checkUniqueFields } from "../middleware/validateRequest";

const router = express.Router();

// Middleware to check for valid ObjectId
const validateObjectId = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const ids = req.params.id ? [req.params.id] : req.body.ids;

  if (ids && !ids.every((id: string) => mongoose.Types.ObjectId.isValid(id))) {
    res.status(400).json({
      success: false,
      message: "One or more IDs are invalid.",
    });
  }
  next();
};

// Route to create multiple products
router.post("/bulk", validateRequest, checkUniqueFields, createMultipleProducts);

// Route to update multiple products
router.put("/bulk", validateRequest, checkUniqueFields, updateMultipleProducts);

// Route to delete multiple products by ID
router.delete("/", deleteMultipleProducts);

// Route to create a product
router.post("/", validateRequest,checkUniqueFields,  createProduct);

// Route to get all products
router.get("/", getAllProducts);

// Route to get a single product by ID
router.get("/:id", validateObjectId, getProductById);

// Route to update a product by ID
router.put("/:id", validateRequest, updateProduct);

// Route to delete a product by ID
router.delete("/:id", deleteProduct);

export default router;
