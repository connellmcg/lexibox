# LexiBox - PDF Text Extraction & Search

A modern, secure web application for uploading PDFs, extracting text, and performing intelligent search through your document collection. Built with a beautiful, responsive interface and robust security features.

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure JWT-based authentication
- **Password Hashing**: Bcrypt password security
- **User Isolation**: Each user can only access their own documents
- **XSS Protection**: Safe text rendering prevents malicious content execution
- **Input Validation**: Comprehensive validation on all inputs

### 📄 PDF Management
- **Drag & Drop Upload**: Intuitive file upload interface
- **Password-Protected PDF Detection**: Clear error messages for encrypted files
- **Automatic Text Extraction**: Extract text from PDFs using PyPDF2
- **Document Metadata**: Track filename, upload date, and content
- **Document Deletion**: Secure document removal with proper cleanup

### 🔍 Advanced Search
- **Full-Text Search**: Search through both filenames and document content
- **Case-Insensitive**: Find matches regardless of capitalization
- **Real-Time Results**: Instant search results as you type
- **Search Result Navigation**: Click results to view full documents
- **In-Document Search**: Search within individual documents with highlighting
- **Match Navigation**: Navigate between search matches with prev/next buttons

### 🎨 Modern User Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Gradients**: Modern glassmorphism design with vibrant colors
- **Landing Page**: Professional introduction to the application
- **Modal Uploads**: Clean upload interface that doesn't clutter the main view
- **Always-Visible Search**: Search bar stays accessible while viewing documents
- **Custom Scrollbars**: Always-visible, styled scrollbars for better UX
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: User-friendly error messages and validation

### 📱 User Experience
- **Landing Page**: Professional introduction with features overview
- **Authentication Flow**: Seamless signup/login experience
- **Document Viewer**: Full-featured document viewer with search integration
- **Search Highlighting**: Automatic highlighting of search terms in documents
- **Navigation**: Easy navigation between different sections
- **Responsive Layout**: Optimized for all screen sizes

### 👑 Admin Features
- **Admin Panel**: Comprehensive admin interface for system management
- **User Management**: View all users, toggle admin status, delete users
- **System Statistics**: Real-time overview of users, documents, and usage metrics
- **Document Overview**: View all documents across all users
- **Admin Access Control**: Secure admin-only endpoints with proper authorization
- **User Analytics**: Track average documents per user and system health
- **Bulk Operations**: Manage multiple users and documents efficiently

## 🛠 Tech Stack

### Backend
- **FastAPI**: Modern, fast Python web framework
- **PyPDF2**: Robust PDF text extraction
- **SQLAlchemy**: Powerful database ORM
- **SQLite**: Lightweight, reliable database
- **Uvicorn**: High-performance ASGI server
- **JWT**: Secure token-based authentication
- **Bcrypt**: Secure password hashing
- **Pydantic**: Data validation and serialization

### Frontend
- **Vite**: Lightning-fast build tool and dev server
- **React 18**: Modern UI framework with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: Reliable HTTP client
- **React Router**: Client-side routing

## 📁 Project Structure

```
lexibox/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── models/            # Database models (User, Document)
│   │   ├── routes/            # API endpoints (auth, documents, search, upload)
│   │   ├── schemas/           # Pydantic schemas for validation
│   │   ├── services/          # Business logic (PDF processing)
│   │   ├── auth.py            # JWT authentication utilities
│   │   └── database.py        # Database configuration
│   ├── uploads/               # PDF file storage
│   ├── venv/                  # Python virtual environment
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend Docker configuration
│   ├── .dockerignore         # Docker ignore file
│   └── main.py               # FastAPI app entry point
├── frontend/                  # Vite React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── DocumentList.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── DocumentViewer.jsx
│   │   ├── services/          # API service functions
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Node.js dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── Dockerfile            # Frontend Docker configuration
│   ├── .dockerignore         # Docker ignore file
│   └── nginx.conf            # Nginx configuration for production
├── docker-compose.yml        # Docker Compose orchestration
├── docker-deploy.sh          # Docker deployment script
├── start.sh                  # Local development startup script
└── README.md                 # This file
```

## 🚀 Getting Started

### 🐳 Docker Deployment (Recommended)

The easiest way to run LexiBox is using Docker. This method ensures consistent deployment across different environments.

#### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

#### Quick Docker Start
```bash
# Clone the repository
git clone <repository-url>
cd lexibox

# Make the deployment script executable and run it
chmod +x docker-deploy.sh
./docker-deploy.sh
```

This script will:
- Build both frontend and backend Docker images
- Start all services with proper networking
- Wait for services to be healthy
- Display access URLs

#### Manual Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images (after code changes)
docker-compose build --no-cache
docker-compose up -d
```

#### Docker Access Points
- **Frontend Application**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

#### Docker Management Commands
```bash
# View running containers
docker-compose ps

# View service logs
docker-compose logs backend
docker-compose logs frontend

# Restart a specific service
docker-compose restart backend

# Remove all containers and volumes
docker-compose down -v

# Update and rebuild
git pull
docker-compose build --no-cache
docker-compose up -d
```

### 🛠 Development Setup

#### Quick Start (Local Development)
```bash
# Clone the repository
git clone <repository-url>
cd lexibox

# Make the startup script executable and run it
chmod +x start.sh
./start.sh
```

This automated script will:
- Set up the Python virtual environment
- Install all Python and Node.js dependencies
- Start both backend and frontend servers
- Open the application in your browser

#### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Access Points

### Docker Deployment
- **Frontend Application**: http://localhost
- **Backend API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

### Local Development
- **Frontend Application**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Documents
- `GET /documents/` - List user's documents
- `GET /documents/{id}` - Get specific document
- `DELETE /documents/{id}` - Delete document

### Upload
- `POST /upload/` - Upload PDF file

### Search
- `GET /search/?q=query` - Search through documents
- `GET /search/test` - Debug search endpoint

### Admin (Admin Only)
- `GET /admin/users` - List all users
- `GET /admin/documents` - List all documents
- `GET /admin/stats` - Get system statistics
- `PUT /admin/users/{id}/admin` - Toggle admin status
- `DELETE /admin/users/{id}` - Delete user and their documents

## 🎯 Features in Detail

### Authentication System
- **Secure Registration**: Email validation and password requirements
- **JWT Tokens**: Stateless authentication with automatic token refresh
- **User Sessions**: Persistent login across browser sessions
- **Logout**: Secure session termination

### PDF Processing
- **File Validation**: Ensures only PDF files are uploaded
- **Text Extraction**: Extracts text content using PyPDF2
- **Error Handling**: Graceful handling of corrupted or encrypted PDFs
- **Storage Management**: Organized file storage with user isolation

### Search Capabilities
- **Multi-Field Search**: Searches both filename and content
- **Case-Insensitive**: Finds matches regardless of text case
- **Real-Time Results**: Instant search feedback
- **Result Highlighting**: Visual indication of search matches
- **Document Navigation**: Seamless transition from search to document view

### Document Viewer
- **Full-Text Display**: Complete document content viewing
- **Search Integration**: Built-in search within documents
- **Match Highlighting**: Yellow highlighting of search terms
- **Navigation Controls**: Previous/next match navigation
- **Always-Visible Search**: Search bar stays accessible while scrolling
- **Custom Scrollbars**: Always-visible, styled scrollbars
- **XSS Protection**: Safe rendering prevents malicious content execution

### User Interface
- **Landing Page**: Professional introduction with feature overview
- **Responsive Design**: Optimized for all device sizes
- **Modern Styling**: Glassmorphism effects and gradient backgrounds
- **Loading States**: Smooth animations and progress indicators
- **Error Messages**: Clear, user-friendly error handling
- **Modal Interfaces**: Clean, focused interaction patterns

## 🔒 Security Features

- **XSS Prevention**: Safe text rendering without `dangerouslySetInnerHTML`
- **SQL Injection Protection**: Parameterized queries via SQLAlchemy
- **CSRF Protection**: JWT tokens provide CSRF resistance
- **Input Validation**: Comprehensive validation on all inputs
- **Password Security**: Bcrypt hashing with salt
- **User Isolation**: Complete separation of user data
- **File Upload Security**: Validation and safe file handling

## 🎨 UI/UX Highlights

- **Glassmorphism Design**: Modern frosted glass effects
- **Gradient Backgrounds**: Vibrant, eye-catching color schemes
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading Feedback**: Clear indication of application state
- **Error Handling**: Graceful error messages and recovery

## 🚀 Development

### Backend Development
- **FastAPI**: Automatic API documentation and validation
- **Hot Reload**: Automatic server restart on code changes
- **Interactive Docs**: Visit http://localhost:8000/docs for API exploration
- **Type Safety**: Full type hints and validation

### Frontend Development
- **Vite**: Lightning-fast development server with HMR
- **React DevTools**: Full debugging support
- **Hot Module Replacement**: Instant updates without page refresh
- **ESLint**: Code quality and consistency

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

#### Docker Issues

**Docker containers won't start:**
- Ensure Docker and Docker Compose are installed and running
- Check available disk space: `docker system df`
- Clear Docker cache: `docker system prune -a`
- Check Docker logs: `docker-compose logs`

**Port conflicts:**
- Ensure ports 80 and 8000 are not in use by other services
- Change ports in `docker-compose.yml` if needed
- Check for conflicting services: `lsof -i :80` and `lsof -i :8000`

**Database persistence issues:**
- Check volume mounts in `docker-compose.yml`
- Ensure database file permissions are correct
- Restart with fresh volumes: `docker-compose down -v && docker-compose up -d`

**Frontend can't connect to backend:**
- Verify both containers are running: `docker-compose ps`
- Check network connectivity: `docker network ls`
- Ensure API URL is correctly configured in frontend

**Health checks failing:**
- Check container logs: `docker-compose logs backend`
- Verify health endpoint: `curl http://localhost:8000/health`
- Increase health check timeout in `docker-compose.yml` if needed

#### Backend Issues

**Backend won't start:**
- Ensure Python 3.8+ is installed
- Check that virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`

**Frontend won't start:**
- Ensure Node.js 16+ is installed
- Check that dependencies are installed: `npm install`
- Clear npm cache if needed: `npm cache clean --force`

**Upload issues:**
- Ensure the `uploads/` directory exists and is writable
- Check file size limits
- Verify PDF file is not password-protected

**Search not working:**
- Check that documents have been properly uploaded
- Verify backend is running and accessible
- Check browser console for error messages

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## 👑 Admin Setup

### Making a User an Admin

The application automatically makes `cmcginley@gmail.com` an admin when they sign up. For other users, you can:

1. **Run the migration script** (if not already done):
   ```bash
   cd backend
   python migrate_admin.py
   ```

2. **Use the admin panel** (if you're already an admin):
   - Log in as an admin user
   - Click the "Admin" button in the header
   - Go to "User Management" tab
   - Click "Make Admin" for the desired user

3. **Direct database access**:
   ```sql
   UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';
   ```

### Admin Features

Once you have admin access, you can:

- **View System Statistics**: Total users, documents, admin count, and usage metrics
- **Manage Users**: View all users, toggle admin status, delete users
- **Monitor Documents**: View all documents across all users
- **System Health**: Track average documents per user and system performance

### Admin Security

- Admin endpoints require proper authentication and admin privileges
- Admin users cannot modify their own admin status
- Admin users cannot delete their own account
- All admin actions are logged and require confirmation