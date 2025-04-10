import mongoose from 'mongoose';

// Define product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    sizes: [{ type: String, required: true }], // Array of sizes
    bestSeller: { type: Boolean, default: false }, // Consistent naming
    description: { type: String, required: true }, // Fixed typo
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create and export Product model
const Product = mongoose.model('Product', productSchema);

export { Product };
