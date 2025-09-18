# ChatBot Web App

This is a [Next.js](https://nextjs.org) project for a chatbot application with authentication and chat functionality.

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time chat functionality
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔧 Environment-based configuration

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_NAME=ChatBot App
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000/api` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `10000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `ChatBot App` |
| `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` | Enable Google authentication | `false` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── Auth/           # Authentication components
│   └── Onboarding/     # Onboarding components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
