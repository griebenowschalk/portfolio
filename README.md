# Portfolio Website

A modern, responsive portfolio website built with Next.js and TypeScript. Features a clean, professional design with dark/light theme support and smooth animations.

🌐 **Live Website**: [https://sgriebenowdev.online](https://sgriebenowdev.online)

## Features

- **Responsive Design** - Optimized for all device sizes
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Navigation** - Auto-highlighting based on scroll position
- **Project Showcase** - Filterable project gallery with tags
- **Skills Section** - Visual representation of technical skills
- **Experience Timeline** - Professional experience display
- **Contact Form** - Interactive Q&A section
- **Loading Animation** - Custom loading screen

## Tech Stack

### Frontend

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **Framer Motion 12.23.22** - Animation library

### UI Components

- **Radix UI** - Accessible component primitives
- **Remix Icons** - Icon library
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Conditional class merging

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit linting
- **Next Themes** - Theme management

### Build & Deployment

- **Turbopack** - Fast bundler (dev mode)
- **Node.js 22** - Runtime environment
- **npm 10+** - Package manager

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── common/         # Shared components
│   └── ui/            # UI components
├── data/              # Static data
├── lib/               # Utilities
└── types/             # TypeScript types
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Customization

The portfolio is easily customizable through the data files:

- **About Me**: `src/data/about-me.ts`
- **Skills**: `src/data/skills.ts`
- **Projects**: `src/data/projects.ts`
- **Experience**: `src/data/experience.ts`
- **Questions**: `src/data/questions.ts`

## Responsive Breakpoints

- Mobile: `< 640px`
- Tablet: `640px - 768px`
- Desktop: `768px - 1024px`
- Large: `> 1024px`

## Key Components

- **Hero** - Landing section with introduction
- **About** - Personal information and achievements
- **Experience** - Professional timeline
- **Skills** - Technical skills showcase
- **Projects** - Portfolio gallery with filtering
- **Questions** - Interactive Q&A section
- **Navbar** - Navigation with scroll-based highlighting
