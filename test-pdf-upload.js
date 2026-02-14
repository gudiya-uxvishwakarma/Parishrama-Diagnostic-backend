import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Test PDF upload endpoint
async function testPdfUpload() {
  try {
    console.log('🧪 Testing PDF Upload Endpoint...\n');

    // First, get or create a test appointment
    console.log('1️⃣ Fetching appointments...');
    const appointmentsResponse = await fetch('https://parishrama-diagnostic-backend.onrender.com/api/appointments');
    const appointmentsData = await appointmentsResponse.json();
    
    if (!appointmentsData.success || appointmentsData.data.length === 0) {
      console.log('❌ No appointments found. Please create an appointment first.');
      return;
    }

    const testAppointment = appointmentsData.data[0];
    console.log(`✅ Using appointment: ${testAppointment.name} (ID: ${testAppointment._id})\n`);

    // Create a test PDF file
    console.log('2️⃣ Creating test PDF file...');
    const testPdfPath = path.join(process.cwd(), 'test-report.pdf');
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test Lab Report) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
410
%%EOF`;

    fs.writeFileSync(testPdfPath, pdfContent);
    console.log(`✅ Test PDF created: ${testPdfPath}\n`);

    // Upload the PDF
    console.log('3️⃣ Uploading PDF...');
    const formData = new FormData();
    formData.append('pdfReport', fs.createReadStream(testPdfPath));

    const uploadResponse = await fetch(
      `https://parishrama-diagnostic-backend.onrender.com/api/appointments/${testAppointment._id}/upload-report`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const uploadResult = await uploadResponse.json();
    console.log('Upload Response:', JSON.stringify(uploadResult, null, 2));

    if (uploadResult.success) {
      console.log('\n✅ PDF uploaded successfully!');
      console.log(`📄 Filename: ${uploadResult.data.filename}`);
      console.log(`📁 Path: ${uploadResult.data.path}`);
      console.log(`📅 Upload Date: ${uploadResult.data.uploadDate}\n`);

      // Test download
      console.log('4️⃣ Testing download...');
      const downloadUrl = `https://parishrama-diagnostic-backend.onrender.com/api/appointments/${testAppointment._id}/download-report`;
      console.log(`Download URL: ${downloadUrl}`);
      
      const downloadResponse = await fetch(downloadUrl);
      if (downloadResponse.ok) {
        console.log('✅ Download endpoint working!\n');
      } else {
        console.log('❌ Download failed:', downloadResponse.status, downloadResponse.statusText);
      }
    } else {
      console.log('\n❌ Upload failed:', uploadResult.message);
    }

    // Cleanup
    fs.unlinkSync(testPdfPath);
    console.log('🧹 Cleaned up test file');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the test
testPdfUpload();
