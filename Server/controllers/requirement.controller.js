import RequirementModel from "../mongodb/models/requirment.js";

// Controller function to save requirement data
const saveRequirement = async (req, res) => {
  // Extract data from the request body
  const { title, description, askedPrice, location } = req.body;

  try {
    // Create a new requirement document using the RequirementModel
    const requirement = new RequirementModel({
      title,
      description,
      askedPrice,
      location,
    });

    // Save the requirement document to the database
    const savedRequirement = await requirement.save();

    // Return a success response with the saved requirement data
    res.status(201).json(savedRequirement);
  } catch (error) {
    // If an error occurs, return an error response
    res.status(500).json({ message: "Failed to save requirement", error: error.message });
  }
};

export { saveRequirement };
