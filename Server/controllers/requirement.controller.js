import mongoose from 'mongoose';
import RequirementModel from '../mongodb/models/requirment.js';
import User from '../mongodb/models/user.js';


const getAllRequirements = async (req, res) => {
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
    const count = await RequirementModel.countDocuments(query);

    // Calculate the skip and limit values for pagination
    const start = parseInt(_start) || 0;
    const limit = parseInt(_end) || 10;

    // Fetch the filtered and sorted requirements from the database, applying pagination
    const requirements = await RequirementModel.find(query)
      .sort({ [_sort]: _order })  // Sort the documents by `_sort` field in `_order` direction
      .skip(start)   // Skip the first `start` items
      .limit(limit); // Limit the result to `limit` items

    // Set response headers to include the total count
    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    // Send the paginated requirements in the response
    res.status(200).json(requirements);
  } catch (error) {
    // Handle any errors that occur during the database operations
    console.error('Error fetching requirements:', error);
    res.status(500).json({ message: 'Failed to fetch requirements', error: error.message });
  }
};



const saveRequirement = async (req, res) => {
  // Extract data from the request body
  const { title, description, propertyType, dealType, phone, askedPrice, location, email } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the user by email
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new requirement document
    const requirement = await RequirementModel.create({
      title,
      description,
      propertyType,
      dealType,
      askedPrice,
      phone,
      location,
      creator: user._id,
    });

    // Add the new requirement to the user's array
    user.allRequirement.push(requirement);
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the created requirement data in the response
    res.status(201).json({ message: 'Requirement created successfully', requirement });
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Error saving requirement:', error);
    res.status(500).json({ message: 'Failed to save requirement', error: error.message });
  }
};


const getRequirementById = async (req, res) => {
  try {
    // Extract the requirement ID from the request parameters
    const { id } = req.params;

    // Find the requirement by ID in the database, populating the 'creator' field
    const requirement = await RequirementModel.findOne({ _id: id }).populate('creator');

    // If the requirement is found, return it in the response
    if (requirement) {
      res.status(200).json(requirement);
    } else {
      // If the requirement is not found, return a 404 status with an error message
      res.status(404).json({ message: 'Requirement not found' });
    }
  } catch (error) {
    // If an error occurs, log it and return a 500 status with an error message
    console.error('Error fetching requirement by ID:', error);
    res.status(500).json({ message: 'Failed to fetch requirement', error: error.message });
  }
};

const deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyToDelete = await RequirementModel.findById(id).populate("creator");

    if (!propertyToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove the requirement document
      await propertyToDelete.remove({ session });

      // Remove the reference to the requirement from the user's array
      const user = propertyToDelete.creator;
      user.allRequirement.pull(propertyToDelete);

      // Save the user document
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({ message: "Property deleted successfully" });
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


const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, dealType, askedPrice, phone, location } =
      req.body;
    await RequirementModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        dealType,
        phone,
        location,
        askedPrice,
      },
    );

    res.status(200).json({ message: "Requirement updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopLatestRequirements = async (req, res) => {
  try {
    // Fetch the latest 5 requirements sorted by creation date in descending order
    const latestRequirements = await RequirementModel.find()
      .sort({ createdAt: -1 })
      .limit(3);

    // Count the total number of requirements
    const totalRequirementsCount = await RequirementModel.countDocuments();

    // Return the latest requirements and the total count in the response
    res.status(200).json({ 
      requirements: latestRequirements,
      totalRequirementsCount 
    });
  } catch (error) {
    console.error('Error fetching latest requirements:', error);
    res.status(500).json({ message: 'Failed to fetch latest requirements', error: error.message });
  }
};





export { updateRequirement, 
  getTopLatestRequirements, 
  getRequirementById, 
  deleteRequirement,
  getAllRequirements,
  saveRequirement,
 };
