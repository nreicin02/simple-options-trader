# Contributing to Simple Options Trader

Thank you for your interest in contributing to Simple Options Trader! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment**:
   ```bash
   git clone https://github.com/yourusername/simple-options-trader.git
   cd simple-options-trader
   npm run install:all
   ```

4. **Set up environment variables** (see [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md))
5. **Start the development servers**:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript with proper type annotations
- **React**: Follow functional component patterns with hooks
- **Backend**: Use Express.js with proper error handling
- **Formatting**: Use Prettier and ESLint configurations

### Commit Messages

Use conventional commit format:
```
type(scope): description

feat(trading): add options trading functionality
fix(api): resolve authentication token issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the coding guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### Testing

- **Frontend**: Test components and user interactions
- **Backend**: Test API endpoints and business logic
- **Integration**: Test full user workflows

## Project Structure

```
simple-options-trader/
├── backend/                 # Backend API server
│   ├── src/routes/         # API routes
│   ├── src/models/         # Database models
│   ├── src/services/       # Business logic
│   └── prisma/             # Database schema
├── shadcn-ui/              # Frontend React app
│   ├── src/components/     # React components
│   ├── src/pages/          # Page components
│   ├── src/hooks/          # Custom hooks
│   └── src/utils/          # Utility functions
└── docs/                   # Documentation
```

## Issues

Before creating an issue:
1. **Search existing issues** to avoid duplicates
2. **Use the issue template** and provide all requested information
3. **Include steps to reproduce** the problem
4. **Add screenshots** if relevant

## Questions?

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check the docs folder for detailed guides

Thank you for contributing! 🚀 