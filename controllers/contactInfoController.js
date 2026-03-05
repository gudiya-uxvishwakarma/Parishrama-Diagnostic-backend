import ContactInfo from '../models/ContactInfo.js';

// Get contact info (should only be one record)
export const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    res.status(200).json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact info',
      error: error.message
    });
  }
};

// Create or update contact info
export const upsertContactInfo = async (req, res) => {
  try {
    const { phone, email, address } = req.body;

    if (!phone || !email || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone, email, and address'
      });
    }

    // Check if contact info already exists
    const existingContact = await ContactInfo.findOne();

    let contactInfo;
    if (existingContact) {
      // Update existing
      contactInfo = await ContactInfo.findByIdAndUpdate(
        existingContact._id,
        { phone, email, address },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      contactInfo = new ContactInfo({ phone, email, address });
      await contactInfo.save();
    }

    res.status(200).json({
      success: true,
      message: 'Contact info saved successfully',
      data: contactInfo
    });
  } catch (error) {
    console.error('Error saving contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving contact info',
      error: error.message
    });
  }
};
