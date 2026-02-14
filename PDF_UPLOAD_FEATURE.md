# PDF Lab Report Upload Feature

## Overview
This feature allows admins to upload PDF lab reports for appointments and share them with patients via WhatsApp.

## How It Works

### 1. Upload PDF Report
- In the Appointments page, click the purple **Upload** button (📤) next to any appointment
- Select a PDF file (max 10MB)
- The PDF is uploaded to the backend server and stored in `uploads/reports/`
- The button turns green (📄) when a PDF is uploaded

### 2. Share via WhatsApp
- Click the green **WhatsApp** button (💬)
- If a PDF report is uploaded, the WhatsApp message includes:
  - Patient name and greeting
  - Download link to the PDF report
  - Test details (service, test name, package, date, time)
  - Contact information
- The patient can click the download link to get their report

### 3. Download Report
- Patients can download their report using the link: 
  ```
  https://your-backend-url/api/appointments/{appointmentId}/download-report
  ```
- The file is downloaded with the patient's name: `{PatientName}-report.pdf`

## API Endpoints

### Upload PDF Report
```
POST /api/appointments/:id/upload-report
Content-Type: multipart/form-data

Body:
- pdfReport: PDF file (max 10MB)

Response:
{
  "success": true,
  "message": "PDF report uploaded successfully",
  "data": {
    "filename": "report-1234567890-123456789.pdf",
    "path": "uploads/reports/report-1234567890-123456789.pdf",
    "uploadDate": "2024-02-14T10:30:00.000Z"
  }
}
```

### Download PDF Report
```
GET /api/appointments/:id/download-report

Response:
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="{PatientName}-report.pdf"
- File stream
```

## Database Schema Update

The Appointment model now includes:
```javascript
{
  pdfReport: String,        // Filename of uploaded PDF
  pdfUploadDate: Date       // When the PDF was uploaded
}
```

## File Storage

- PDFs are stored in: `uploads/reports/`
- Filename format: `report-{timestamp}-{random}.pdf`
- Max file size: 10MB
- Only PDF files are accepted

## WhatsApp Message Format

When a PDF is uploaded, the WhatsApp message includes:

```
Hello {PatientName},

Your lab report is ready! 📋

You can download your report from this link:
{DownloadURL}

Test Details:
- Service: {Service}
- Test: {TestName}
- Package: {PackageName}
- Date: {Date}
- Time: {Time}

If you have any questions, please contact us.

Thank you for choosing Parishrama Diagnostic Laboratory!

Contact: +91 9591035131
```

## Security Notes

- PDF files are validated on upload (only PDF MIME type accepted)
- File size is limited to 10MB
- Files are stored with unique names to prevent conflicts
- Download endpoint is public (anyone with the link can download)

## Future Enhancements

Consider implementing:
1. Authentication for download endpoint
2. Expiring download links
3. WhatsApp Business API for automatic file attachment
4. Email notification with PDF attachment
5. PDF preview in admin panel
