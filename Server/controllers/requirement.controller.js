import mongoose from 'mongoose';
import RequirementModel from '../mongodb/models/requirment.js';
import User from '../mongodb/models/user.js';

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

export { saveRequirement };


const getAllRequirements = async (req, res) => {
  try {
    // Fetch all requirements from the database
    const requirements = await RequirementModel.find();

    // Return the requirements in the response
    res.status(200).json({ requirements });
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ message: 'Failed to fetch requirements', error: error.message });
  }
};

export { getAllRequirements };

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


export { deleteRequirement };



const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, dealType, phone, location, askedPrice } =
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

export { updateRequirement };


export { getRequirementById };