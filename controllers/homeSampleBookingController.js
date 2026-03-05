import HomeSampleBooking from '../models/HomeSampleBooking.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await HomeSampleBooking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await HomeSampleBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, address, date, time, testType, doctorName, doctorSpecialization } = req.body;

    if (!name || !email || !phone || !address || !date || !time || !testType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const booking = new HomeSampleBooking({
      name,
      email,
      phone,
      address,
      date,
      time,
      testType,
      doctorName: doctorName || '',
      doctorSpecialization: doctorSpecialization || ''
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { name, email, phone, address, date, time, testType, doctorName, doctorSpecialization } = req.body;

    const booking = await HomeSampleBooking.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, date, time, testType, doctorName, doctorSpecialization },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await HomeSampleBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// Upload PDF report for booking
export const uploadPdfReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const booking = await HomeSampleBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking with PDF report path
    booking.pdfReport = req.file.filename;
    booking.pdfUploadDate = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'PDF report uploaded successfully',
      data: {
        filename: req.file.filename,
        path: req.file.path,
        uploadDate: booking.pdfUploadDate
      }
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while uploading PDF report',
      error: error.message
    });
  }
};

// Download PDF report
export const downloadPdfReport = async (req, res) => {
  try {
    const booking = await HomeSampleBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.pdfReport) {
      return res.status(404).json({
        success: false,
        message: 'No PDF report found for this booking'
      });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'reports', booking.pdfReport);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found on server'
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${booking.name}-report.pdf"`);
    
    // Send file
    res.sendFile(filePath);

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while downloading PDF report',
      error: error.message
    });
  }
};

// Send report via email with PDF attachment
export const sendReportViaEmail = async (req, res) => {
  try {
    const booking = await HomeSampleBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.pdfReport) {
      return res.status(400).json({
        success: false,
        message: 'No PDF report found for this booking. Please upload a PDF first.'
      });
    }

    const pdfPath = path.join(process.cwd(), 'uploads', 'reports', booking.pdfReport);

    // Check if PDF file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found on server'
      });
    }

    // Import email service dynamically
    const { sendReportEmail } = await import('../services/emailService.js');
    
    const result = await sendReportEmail(booking, pdfPath);

    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully with PDF attachment',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: result.error
      });
    }

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while sending email',
      error: error.message
    });
  }
};
