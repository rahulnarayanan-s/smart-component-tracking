# Supabase Next.js App

This project is a Next.js application that integrates with Supabase for backend services, including authentication and user management.

## Features

- **Supabase Integration**: Utilizes Supabase for database and authentication services.
- **API Routes**: Custom API routes for authentication, user management, and webhooks.
- **TypeScript Support**: Built with TypeScript for type safety and better development experience.
- **Global Styles**: Includes global CSS styles for consistent design across the application.

## Project Structure

```
supabase-nextjs-app
├── lib
│   └── supabase.ts          # Supabase client initialization
├── pages
│   ├── api
│   │   ├── auth.ts         # Authentication API routes
│   │   ├── user.ts         # User management API routes
│   │   └── webhook.ts      # Webhook handling
│   └── _app.tsx            # Custom App component
├── components
│   └── Header.tsx          # Header component
├── styles
│   └── globals.css         # Global CSS styles
├── types
│   └── index.ts            # TypeScript types and interfaces
├── package.json             # NPM configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── .env.local               # Local environment variables
└── README.md                # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd supabase-nextjs-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

- Use the API routes for authentication and user management as needed.
- Customize the `Header` component and global styles to fit your design requirements.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.