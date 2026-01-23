const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/darshans', require('./routes/darshans'));
app.use('/api/newsletters', require('./routes/newsletters'));
app.use('/api/contacts', require('./routes/contacts'));

// Hotel info
const hotelInfo = {
  name: 'Shri Balaji ',
  subname: 'Home Stay',
  tagline: 'Where Luxury Meets Tranquility',
  description: 'Nestled along the pristine Mediterranean coastline, Shri Balaji  offers an unparalleled escape into luxury and serenity. Our boutique hotel combines timeless elegance with modern comfort, creating unforgettable experiences for our distinguished guests.',
  address: '123 Coastal Drive, Mediterranean Bay, 12345',
  phone: '+1 (555) 123-4567',
  email: 'reservations@azurehaven.com',
  checkInTime: '3:00 PM',
  checkOutTime: '11:00 AM',
  amenities: [
    'Infinity Pool',
    'World-Class Spa',
    'Fine Dining Restaurant',
    'Private Beach Access',
    'Fitness Center',
    'Concierge Service',
    '24-Hour Room Service',
    'Valet Parking',
    'Business Center',
    'Event Spaces'
  ]
};

app.get('/api/info', (req, res) => res.json(hotelInfo));

// Reviews
app.get('/api/reviews', require('./controllers/bookingController').getApprovedReviews);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in controllers
app.set('io', io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));