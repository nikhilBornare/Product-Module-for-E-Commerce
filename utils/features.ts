import Product from "../models/productModel";  

interface QueryFeatures {
  search?: string;
  rating?: string;  
  priceMin?: number;  
  priceMax?: number;  
  sort?:
    | "name"
    | "priceAsc"
    | "priceDesc"
    | "createdAtAsc"
    | "updatedAtAsc"
    | "createdAtDesc"
    | "updatedAtDesc"
    | "ratingAsc"
    | "ratingDesc";
  page?: number;
  limit?: number;
}

const getFilteredSortedPaginatedProducts = async (queryFeatures: QueryFeatures) => {
  const { search, rating, priceMin, priceMax, sort, page = 1, limit = 10 } = queryFeatures;

  const query: any = {};

  // Filter by product name (search)
  if (search) {
    query.name = { $regex: search, $options: "i" };  // Case-insensitive search
  }

  // Filter by product rating
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };  
  }

  // Filter by price range
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) {
      query.price.$gte = priceMin;  
    }
    if (priceMax) {
      query.price.$lte = priceMax;  
    }
  }

  // Sorting options
  let sortOption = {};
  const sortOptionsMap = {
    name: { name: 1 },
    nameDesc: { name: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    createdAtAsc: { createdAt: 1 },
    updatedAtAsc: { updatedAt: 1 },
    createdAtDesc: { createdAt: -1 },
    updatedAtDesc: { updatedAt: -1 },
    ratingAsc: { rating: 1 },
    ratingDesc: { rating: -1 },
  };

  if (sort) {
    sortOption = sortOptionsMap[sort] || {};
  }

  // Fetch filtered, sorted, and paginated products
  const products = await Product.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort(sortOption);

  return {
    products,
    total: await Product.countDocuments(query),
    page: Number(page),
    limit: Number(limit),
  };
};

export default getFilteredSortedPaginatedProducts;
