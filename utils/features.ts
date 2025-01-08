import Product from "../models/productModel";

interface QueryFeatures {
  search?: string;
  ratings?: string;
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
    | "ratingsAsc"
    | "ratingsDesc";
  page?: number;
  limit?: number;
}

const getFilteredSortedPaginatedProducts = async (queryFeatures: QueryFeatures) => {
  const { search, ratings, priceMin, priceMax, sort, page = 1, limit = 10 } = queryFeatures;

  const query: any = {};

  // Filter by product name (search)
  if (search) {
    query.name = { $regex: search, $options: "i" }; // Case-insensitive search
  }

  // Filter by product ratings
  if (ratings) {
    query.ratings = { $gte: parseFloat(ratings) }; 
  }

  // Filter by price range
  if (priceMin !== undefined || priceMax !== undefined) {
    query.price = {};
    if (priceMin !== undefined) {
      query.price.$gte = priceMin;
    }
    if (priceMax !== undefined) {
      query.price.$lte = priceMax;
    }
  }

  // Sorting options
  const sortOptionsMap = {
    name: { name: 1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    createdAtAsc: { createdAt: 1 },
    updatedAtAsc: { updatedAt: 1 },
    createdAtDesc: { createdAt: -1 },
    updatedAtDesc: { updatedAt: -1 },
    ratingsAsc: { ratings: 1 },
    ratingsDesc: { ratings: -1 },
  };

  const sortOption = sort ? sortOptionsMap[sort] : {};

  // Fetch filtered, sorted, and paginated products
  const products = await Product.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page,
    limit,
  };
};

export default getFilteredSortedPaginatedProducts;