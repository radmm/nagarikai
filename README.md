# NagarikAI

A civic issue reporting platform that automatically analyzes complaints and drafts formal communications to appropriate authorities.

## Overview

NagarikAI streamlines the process of reporting civic issues by:
- **Analyzing** citizen complaints and categorizing them by type and severity
- **Drafting** formal correspondence to relevant city departments
- **Alerting** authorities to ensure timely response to critical issues
- **Tracking** issue status and resolution progress

## Features

- Complaint intake and analysis
- Automated formal letter generation
- Department routing and alerts
- Issue tracking and reporting
- Map-based issue visualization

## Prerequisites

- **Node.js** (v18 or higher)
- **API Key** for LLM services (see configuration)

## Installation

### 1. Clone and Setup

```bash
git clone https://github.com/radmm/ng-dr.git
cd ng-dr
npm install
```

### 2. Configuration

Copy the environment template and configure your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
GENAI_API_KEY=your_api_key_here
APP_URL=http://localhost:5173
```

### 3. Run Locally

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check TypeScript errors
- `npm run clean` - Clean build artifacts

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React, Phosphor Icons
- **Mapping**: Leaflet
- **Backend**: Express.js, Node.js
- **LLM Integration**: GenAI SDK
- **Build**: Vite, ESBuild

## Project Structure

```
ng-dr/
├── src/                    # Source code
├── index.html             # Entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GENAI_API_KEY` | API key for LLM service | `your_key_here` |
| `APP_URL` | Application URL | `http://localhost:5173` |

## Building for Production

```bash
npm run build
npm start
```

This will create an optimized production build and start the server.

## Contributing

Contributions are welcome. Please ensure code quality by:

1. Running linter checks: `npm run lint`
2. Testing your changes locally
3. Following the existing code structure

## License

See LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub Issues tracker.
