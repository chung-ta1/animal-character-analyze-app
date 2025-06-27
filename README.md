# Animal Character Analyzer App (Frontend)

A React TypeScript web application that captures user photos and analyzes them to match with cartoon/fantasy animal characters using AI.

## Overview

This is the frontend application for the Animal Character Analyzer project. It provides a fun, interactive interface where users can:
- Take a selfie using their device camera
- Submit the photo for AI analysis
- View their matched animal character with personality traits and backstory
- Share results on social media

## Tech Stack

- **React 18.x** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router v6** - Client-side routing

## Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser with camera support

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/animal-character-analyze-app.git
cd animal-character-analyze-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── camera/      # Camera-related components
│   ├── character/   # Character display components
│   └── common/      # Shared components
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── services/        # API and external services
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Features

- Camera integration with permission handling
- Real-time image capture and preview
- Responsive design for mobile and desktop
- Share functionality for social media
- Accessible UI components

## Environment Variables

- `REACT_APP_API_URL` - Backend API endpoint (default: http://localhost:8080)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Projects

- [animal-character-analyze-service](https://github.com/[your-username]/animal-character-analyze-service) - Backend API service

## License

This project is licensed under the MIT License.