# Mauka Platform - Volunteer Matching Platform

## 🚀 Overview

Mauka is a location-based volunteer matching platform that connects passionate student volunteers with verified NGOs across India. The platform uses real-time geolocation and distance-based matching to help volunteers find meaningful opportunities near them.

## ✨ Key Features

- **Location-Based Matching**: Find NGOs and volunteer opportunities within your preferred radius
- **Role-Based Dashboards**: Separate interfaces for volunteers, NGOs, and admins
- **NGO Verification System**: Comprehensive verification process with document upload
- **Real-Time Applications**: Apply to opportunities and track application status
- **Interactive Maps**: Visualize nearby opportunities on interactive maps
- **Responsive Design**: Mobile-first design with orange+white theme

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Supabase** for authentication and database
- **Mapbox** for maps and geocoding
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose for geospatial queries
- **Supabase** for authentication and file storage
- **Mapbox Geocoding API** for address conversion

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Supabase account
- Mapbox account

## 🔧 Environment Variables

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
VITE_API_URL=http://localhost:4000/api
```

### Backend (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/mauka
# or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/mauka

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mapbox
MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Run the migration files in `supabase/migrations/`
3. Set up the storage bucket for NGO documents
4. Configure RLS policies

### 3. Set Up MongoDB

```bash
# For local MongoDB
brew install mongodb-community
brew services start mongodb-community

# Or use MongoDB Atlas (recommended)
```

### 4. Configure Environment Variables

Copy the environment variables above and fill in your actual values.

### 5. Run the Application

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 📊 Database Schema

### Supabase Tables

- **user_profiles**: Extended user information with location data
- **ngo_applications**: NGO verification applications with document uploads
- **ngo_postings**: Volunteer opportunity postings by verified NGOs
- **applications**: Volunteer applications to NGO postings
- **user_locations**: Geocoded location cache

### MongoDB Collections

- **users**: User profiles with geospatial coordinates
- **postings**: NGO postings with 2dsphere indexed locations
- **applications**: Application tracking

## 🗺️ Location Features

### Geocoding
- Automatic address-to-coordinates conversion using Mapbox
- Cached geocoding results for performance
- Support for Indian addresses with city/state extraction

### Distance Calculation
- Haversine formula for accurate distance calculation
- MongoDB 2dsphere indexes for efficient geospatial queries
- Configurable search radius (5km to 100km)

### Map Integration
- Interactive maps showing nearby opportunities
- Real-time location updates
- Custom markers for NGOs and volunteers

## 👥 User Roles

### Volunteers
- Browse nearby NGO opportunities
- Apply to volunteer positions
- Track application status
- View volunteering history

### NGOs
- Submit verification applications with documents
- Create and manage volunteer postings (after verification)
- Review and manage volunteer applications
- Track active volunteers

### Admins
- Review NGO verification applications
- Approve/reject NGO registrations
- Monitor platform statistics
- Handle user reports and flags

## 🔐 Security Features

- **Row Level Security (RLS)**: Supabase RLS policies for data protection
- **File Upload Security**: Secure document upload with type and size validation
- **Authentication**: JWT-based authentication with Supabase
- **Role-Based Access**: Different permissions for volunteers, NGOs, and admins

## 📱 API Endpoints

### Location Matching
- `GET /api/match/nearby-ngos?lat=&lng=&radiusKm=25`
- `GET /api/match/nearby-volunteers?postingId=...`

### Postings
- `GET /api/postings?near=lat,lng&radiusKm=25&tags=...`
- `POST /api/postings` (verified NGOs only)
- `PUT /api/postings/:id`
- `DELETE /api/postings/:id`

### Applications
- `POST /api/applications`
- `GET /api/applications/my-applications`
- `PUT /api/applications/:id/status`

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#ea580c) with white
- **Secondary**: Various orange shades (50-900)
- **Neutral**: Gray scale for text and backgrounds

### Components
- Consistent button styles with orange theme
- Form inputs with orange focus states
- Cards with subtle shadows and hover effects
- Mobile-responsive navigation

## 🧪 Testing

### Manual Testing
1. Sign up as a volunteer and complete profile
2. Sign up as an NGO and submit verification
3. Admin approves NGO verification
4. NGO creates volunteer postings
5. Volunteer applies to nearby opportunities

### Location Testing
1. Set your location in profile
2. Create postings with different addresses
3. Verify distance calculations are accurate
4. Test radius filtering

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
npm start
```

### Environment Variables
Make sure to set all environment variables in your deployment platform.

## 🔧 Development

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routes in `src/App.tsx`
4. Add backend routes in `backend/src/routes/`

### Database Changes
1. Create new Supabase migrations
2. Update Mongoose models if needed
3. Run migrations in development and production

## 📞 Support

For issues or questions:
- Email: projectmaukajpis@gmail.com
- Check the console logs for detailed error messages
- Ensure all environment variables are configured correctly

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for creating positive social impact across India.