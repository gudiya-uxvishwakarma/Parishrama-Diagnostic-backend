# Parishrama Diagnostic Laboratory - Backend API

A comprehensive backend API for Parishrama Diagnostic Laboratory management system built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Doctor, Staff)
  - Secure password hashing with bcrypt

- **Appointment Management**
  - Create, read, update, delete appointments
  - Appointment status tracking
  - Duplicate appointment prevention
  - Statistics and analytics

- **Doctor Management**
  - Doctor profiles and specializations
  - Availability management
  - CRUD operations

- **Test Management**
  - Test categories and pricing
  - Search functionality
  - Laboratory test information

- **Home Management**
  - Homepage home content
  - Image and content management

- **Contact Management**
  - Contact form submissions
  - Contact information API

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ParishramaBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update environment variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/parishrama_diagnostic
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_EMAIL=Parishrama123@gmail.com
   ADMIN_PASSWORD=Parishrama1234
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas cloud database

5. **Run the application**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/stats/overview` - Get appointment statistics

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `GET /api/doctors/:id` - Get single doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Tests
- `GET /api/tests` - Get all test categories
- `GET /api/tests/:category` - Get tests by category
- `GET /api/tests/search/:query` - Search tests

### Home
- `GET /api/home` - Get home items
- `POST /api/home` - Create home item
- `PUT /api/home/:id` - Update home item
- `DELETE /api/home/:id` - Delete home item

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/info` - Get contact information

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Admin Credentials
- **Email**: Parishrama123@gmail.com
- **Password**: Parishrama1234

## 📝 Request/Response Examples

### Create Appointment
```bash
POST /api/appointments
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "address": "123 Main Street, City",
  "date": "2024-01-20",
  "time": "10:00",
  "service": "laboratory",
  "testCategory": "hematology",
  "notes": "Fasting required"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "Parishrama123@gmail.com",
  "password": "Parishrama1234"
}
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Express validator
- **Password Hashing**: bcrypt
- **JWT Authentication**: Secure tokens

## 📊 Database Schema

### User Model
- name, email, password, role, phone, isActive, lastLogin

### Appointment Model
- name, email, phone, address, date, time, service, testCategory, collectionType, doctor, notes, status, confirmationNumber

### Doctor Model
- name, specialization, qualification, experience, email, phone, image, bio, availability, consultationFee, isActive

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parishrama
JWT_SECRET=your_production_secret_key
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "parishrama-api"
pm2 startup
pm2 save
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test API endpoints
curl https://parishrama-diagnostic.onrender.com/api/health
```

## 📈 Monitoring

- Health check endpoint: `/api/health`
- Request logging in development mode
- Error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@parishrama.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - Authentication system
  - Appointment management
  - Doctor management
  - Test categories
  - Home management
  - Contact system

---

**Parishrama Diagnostic Laboratory** - Where Accuracy Meets Care