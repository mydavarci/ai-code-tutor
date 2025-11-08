# Contributing to AI Code Tutor

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Follow the [SETUP.md](./SETUP.md) guide to get your development environment running
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Code Style

### TypeScript

- Use TypeScript strict mode
- Define types for all function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop typing

### Backend

- Follow REST API conventions
- Use async/await instead of callbacks
- Handle errors appropriately
- Add input validation

## Testing

Before submitting a PR:

```bash
# Run type checking
npm run build --workspaces

# Test the full user flow manually:
# 1. Sign up new user
# 2. Generate exercise
# 3. Submit code
# 4. View solution
# 5. Check progress page
```

## Pull Request Process

1. Update the README.md or documentation if needed
2. Describe your changes clearly in the PR description
3. Link any related issues
4. Wait for review and address feedback

## Feature Requests

Feature requests are welcome! Please:

1. Check existing issues first
2. Describe the use case
3. Explain why it would be valuable
4. Consider implementation complexity

## Bug Reports

When reporting bugs, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots if applicable
5. Environment details (OS, Node version, browser)

## Areas for Contribution

- **UI/UX improvements**: Better design, accessibility
- **New exercise topics**: More JavaScript/React topics
- **Testing**: Unit tests, integration tests, E2E tests
- **Performance**: Optimization, caching strategies
- **Documentation**: Tutorials, guides, code comments
- **Features**: See roadmap in README.md

## Questions?

Feel free to open an issue with the "question" label.

Thank you for contributing! 🎉
