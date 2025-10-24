# Contributing to TamperCell

Thank you for your interest in contributing to TamperCell! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/ruriazz/tampercell.git
cd tampercell

# Install dependencies
npm install

# Build the project
npm run build

# Start development mode with file watching
npm run dev
```

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code style and conventions
- Add JSDoc comments for public APIs
- Use meaningful variable and function names

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes (formatting, etc.)
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat(next-observer): add route change detection
fix(custom-console): resolve object inspection bug
docs(readme): update installation instructions
```

### Branch Naming

- `feature/feature-name` for new features
- `fix/bug-description` for bug fixes
- `docs/update-description` for documentation updates

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build test
npm run rebuild

# Manual testing with example scripts
```

## 📦 Project Structure

```
tampercell/
├── src/
│   ├── @types/           # TypeScript type definitions
│   ├── next-observer/    # Next.js observer library
│   └── custom-console/   # Custom console library
├── docs/                 # Documentation
├── dist/                 # Built files (generated)
└── examples/             # Usage examples
```

## 🔧 Adding New Features

### For Next Observer

1. Update types in `src/@types/next-observer.ts`
2. Implement feature in `src/next-observer/index.ts`
3. Add tests and examples
4. Update documentation in `docs/next-observer.md`

### For Custom Console

1. Update types in `src/@types/custom-console.ts`
2. Implement feature in `src/custom-console/index.ts`
3. Update styles if needed in `src/custom-console/style.css`
4. Update documentation in `docs/custom-console.md`

## 📖 Documentation

- Update relevant documentation in the `docs/` folder
- Update README.md if needed
- Add examples for new features
- Update API reference in `docs/api-reference.md`

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Reproduction**: Steps to reproduce the issue
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Browser, Tampermonkey version, etc.
6. **Code sample**: Minimal reproduction code if applicable

Use the bug report template when creating issues.

## 💡 Feature Requests

For feature requests, please:

1. Check existing issues first
2. Describe the use case clearly
3. Explain why this feature would be valuable
4. Provide examples of how it would be used

## 🔍 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch from `dev`
3. **Make** your changes
4. **Test** your changes thoroughly
5. **Update** documentation if needed
6. **Submit** a pull request

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] All builds pass (`npm run rebuild`)
- [ ] Types are correct (`npm run type-check`)
- [ ] Documentation is updated
- [ ] Examples are provided for new features
- [ ] Commit messages follow conventional format

## 📝 Documentation Standards

- Use clear, concise language
- Provide practical examples
- Include code snippets with explanations
- Use consistent formatting and structure
- Add table of contents for longer documents

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Maintain a positive environment

## 📞 Getting Help

- **Documentation**: Check the `docs/` folder
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Examples**: Check `docs/examples.md` for usage patterns

## 🎉 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to TamperCell! 🚀