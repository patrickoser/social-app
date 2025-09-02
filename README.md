# Social Media App

A modern, responsive social media application built with React, Firebase, and Tailwind CSS. Features include user authentication, real-time posts, likes/saves, profile management, and guest mode functionality.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth sign-in
- 👥 **Guest Mode**: Try the app without creating an account
- 📝 **Posts**: Create, read, and delete posts with real-time updates
- ❤️ **Interactions**: Like and save posts with instant feedback
- 👤 **Profiles**: Customizable user profiles with bio and avatar uploads
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Mobile-first design with dedicated mobile navigation
- 🔒 **Private Routes**: Protected pages for authenticated users

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context API with custom hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite for fast development and optimized builds

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation
1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd social-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start development server
   ```bash
   npm run dev
   ```

5. Build for production
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── pages/              # Route components
├── config/             # Firebase configuration
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Key Components

- **AuthContext**: Manages user authentication state
- **DataContext**: Handles posts, likes, and saves
- **ThemeContext**: Manages dark/light mode
- **ProfilePictureContext**: Handles profile image caching

## Features in Detail

### Guest Mode
Users can explore the app without creating an account. Guest data is stored in session storage and automatically cleaned up on logout.

### Real-time Updates
Posts, likes, and saves update in real-time using Firebase's real-time capabilities.

### Responsive Design
Mobile-first approach with dedicated mobile navigation and responsive layouts for all screen sizes. 

### File Upload
Profile picture uploads with validation for file type, size, and dimensions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.