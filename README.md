# Product Module for E-Commerce

This project is a **Product Module** for an e-commerce platform, built using **TypeScript**. It provides functionality for managing product-related operations with robust architecture, proper validations, and error handling.

## Features

### CRUD Operations

- Create, Read, Update, and Delete products.

### Request Validation

- Ensures incoming API requests meet predefined rules (e.g., required fields, types).

### Sorting

- Sort Products alphabetically by their names.
- Sort Products by createdAt & updatedAt.

### Filtering

- Filter Products based on their ratings or other attributes.

### Pagination

- Paginate Products data to handle large lists efficiently.

### Error Handling

- Centralized error handling for cleaner and more manageable error responses.

### Environment Configuration

- Supports environment variables using .env files.

### Database Integration

- MongoDB is used as the database for managing Product data.

### Winston Logger

- Integrated Winston for structured and efficient logging.

### Swagger Documentation

- Provides comprehensive API documentation using Swagger.

### Rate Limiting

- Implements rate limiting to prevent abuse and enhance API security.

## Project Structure

```plaintext
Product MODULE FOR E-COMMERCE
├── config
│   └── db.ts              // Database configuration
├── controllers
│   └── productController.ts // Product-related business logic
├── error-handler
│   ├── applicationError.ts // Custom error class
│   └── logs               // Logs for error tracking
├── middleware
│   ├── rateLimiter.ts     // Middleware for rate limiting
│   └── validateRequest.ts // Middleware for request validation
├── models
│   └── productModel.ts     // Product schema and database interaction
├── routes
│   └── productRoutes.ts    // Routes for Product API
├── utils
│   ├── features.ts        // Helper functions
│   └── logger.ts          // Logger setup
├── validation
│   └── productValidation.ts // Input validation schema
├── .env                   // Environment variables
├── index.ts               // Entry point of the application
├── package.json           // Project dependencies and scripts
├── swagger.json           // API documentation
```

## Technologies Used

- **Node.js**: Backend runtime environment
- **TypeScript**: Typed JavaScript
- **Express.js**: Web framework
- **MongoDB**: Database
- **Swagger**: API documentation

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://https://github.com/nikhilBornare/Product-Module-for-E-Commerce.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Product-Module-for-E-Commerce
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the `.env` file:

   Create a `.env` file in the root directory and add the following:

   ```env
   DB_URI=<your_mongoDB_connection_string>
   PORT=<port_number>
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Access the API documentation:

   Open `http://localhost:<port_number>/api-docs` in your browser to view the Swagger documentation.

## API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/products`            | Get all product        |
| GET    | `/products/:id`        | Get a product           |
| POST   | `/products`            | Add a new product       |
| PUT    | `/product`    | Update product information |
| DELETE | `/product`      | Delete a product        |

## Contributing

Feel free to fork this repository, make your changes, and submit a pull request. All contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
