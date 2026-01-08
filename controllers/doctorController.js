import Doctor from "../models/Doctor.js";

/**
 * @desc    Create Doctor
 * @route   POST /api/doctors
 */
export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get All Doctors
 * @route   GET /api/doctors
 */
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get Single Doctor
 * @route   GET /api/doctors/:id
 */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid doctor ID"
    });
  }
};

/**
 * @desc    Update Doctor
 * @route   PUT /api/doctors/:id
 */
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete Doctor
 * @route   DELETE /api/doctors/:id
 */
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid doctor ID"
    });
  }
};

/**
 * @desc    Toggle Doctor Status (Active / Inactive)
 * @route   PATCH /api/doctors/:id/status
 */
export const toggleDoctorStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor is now ${doctor.isActive ? "Active" : "Inactive"}`,
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
