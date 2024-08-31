import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  // Initialize an empty query object
  const query = {};

  // Apply search filters across the entire dataset
  if (title_like) {
    const regex = new RegExp(title_like, 'i'); // Create a regex for case-insensitive search
    query.$or = [
      { title: regex },
      { location: regex }
    ];
  }

  if (propertyType) {
    query.propertyType = propertyType.toLowerCase(); // Ensure consistent case
  }

  try {
    // Count the total number of documents that match the search query
    const count = await Property.countDocuments(query);

    // Calculate the skip and limit values for pagination
    const start = parseInt(_start) || 0;
    const limit = parseInt(_end) ? parseInt(_end) - start : 10; // Calculate limit as difference between _end and _start

    // Fetch the filtered and sorted properties from the database, applying pagination
    const properties = await Property.find(query)
      .sort({ [_sort]: _order })  // Sort the documents by `_sort` field in `_order` direction
      .skip(start)   // Skip the first `start` items
      .limit(limit); // Limit the result to `limit` items

    // Set response headers to include the total count
    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    // Send the paginated properties in the response
    res.status(200).json(properties);
  } catch (error) {
    // Handle any errors that occur during the database operations
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};



const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Property.findOne({ _id: id }).populate(
    "creator",
  );

  if (propertyExists) {
    res.status(200).json(propertyExists);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
};


const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      dealType,
      location,
      price,
      phone,
      photo,
      email,
      totalSquareFeet,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      dealType,
      location,
      price,
      totalSquareFeet, // Adding the new field
      phone,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      propertyType,
      dealType,
      location,
      price,
      phone,
      photo,
      totalSquareFeet,
    } = req.body;

    const photoUrl = photo ? await cloudinary.uploader.upload(photo) : null;

    await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        dealType,
        phone,
        location,
        price,
        photo: photoUrl?.url || photo,
        totalSquareFeet, // Adding the new field
      }
    );

    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyToDelete = await Property.findById(id).populate("creator");

    if (!propertyToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Extract public_id from the property URL
    const imageUrl = propertyToDelete.photo; // Assuming `photo` contains the URL
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0]; // Extracting the public_id

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          throw new Error('Failed to delete image from Cloudinary');
        }
      });

      // Delete the property from the database
      await propertyToDelete.remove({ session });
      propertyToDelete.creator.allProperties.pull(propertyToDelete);
      await propertyToDelete.creator.save({ session });
      await session.commitTransaction();

      res.status(200).json({ message: "Property and image deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopLatestProperties = async (req, res) => {
  try {
    // Fetch the latest 5 properties sorted by creation date in descending order
    const latestProperties = await Property.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(3); // Limit to 5 results
    
    if (!latestProperties || latestProperties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    // Count total properties
    const totalPropertiesCount = await Property.countDocuments();

    // Count commercial properties
    const commercialPropertiesCount = await Property.countDocuments({ propertyType: 'commercial' });

    // Count apartment properties
    const apartmentPropertiesCount = await Property.countDocuments({ propertyType: 'apartment' });

    // Return the latest properties and additional counts in the response
    res.status(200).json({
      properties: latestProperties,
      totalPropertiesCount,
      commercialPropertiesCount,
      apartmentPropertiesCount
    });
  } catch (error) {
    console.error('Error fetching latest properties:', error.message);
    res.status(500).json({ message: 'Failed to fetch latest properties', error: error.message });
  }
};





export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
  getTopLatestProperties,
};
