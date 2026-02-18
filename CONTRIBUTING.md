# Contributing to BizGetUseCase

Thank you for your interest in contributing to BizGetUseCase! This document provides guidelines for contributing to this Microsoft Agent League competition entry.

## 🎯 Project Goal

BizGetUseCase is designed to help businesses discover and evaluate AI agent opportunities. While this is a competition entry, we welcome improvements and adaptations!

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node.js version, OS)

### Suggesting Features

For new features or domains:

1. Open an issue describing:
   - The use case or business domain
   - Why it would be valuable
   - How it fits with existing features
   - Any implementation ideas

### Code Contributions

#### Getting Started

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/BizGetUseCase.git
cd BizGetUseCase

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test your changes
npm test

# Commit with clear message
git commit -m "Add feature: description"

# Push and create pull request
git push origin feature/your-feature-name
```

#### Code Style

- Use ES6+ features
- Follow existing code structure
- Add JSDoc comments for new functions
- Keep functions focused and small
- Use descriptive variable names

#### Testing

- Add tests for new features
- Ensure all tests pass: `npm test`
- Test coverage should not decrease
- Run the demo to verify: `npm run demo`

#### Documentation

- Update README.md for user-facing changes
- Update API docs in `docs/api-reference.md`
- Add examples if introducing new features
- Keep documentation clear and concise

## 📋 Contribution Ideas

### Add New Business Domains

Add new domains to `src/usecase-engine.js`:

```javascript
new BusinessDomain(
  'Your Domain Name',
  'Domain description',
  ['Challenge 1', 'Challenge 2']
)
```

### Add New Use Case Templates

Extend templates in `getUseCaseTemplates()`:

```javascript
'Your Domain': [
  {
    title: 'Use Case Title',
    description: 'Detailed description',
    benefits: ['Benefit 1', 'Benefit 2'],
    requirements: ['Req 1', 'Req 2'],
    priority: 'high',
    feasibility: 'moderate'
  }
]
```

### Improve Scoring Algorithm

The scoring formula can be enhanced in `calculateScore()`:

```javascript
calculateScore() {
  // Current: (priority * 0.4 + feasibility * 0.3 + benefits * 0.3)
  // Your improved algorithm here
}
```

### Add Export Formats

Support additional export formats:

```javascript
exportUseCases(format) {
  if (format === 'csv') { /* CSV export */ }
  if (format === 'xml') { /* XML export */ }
  if (format === 'yaml') { /* YAML export */ }
}
```

### Enhance ROI Calculator

Add more sophisticated financial models:

```javascript
static calculateAdvancedROI(useCase, financialData) {
  // NPV, IRR, sensitivity analysis, etc.
}
```

## 🧪 Testing Guidelines

### Test Structure

```javascript
describe('FeatureName', () => {
  it('should do something specific', () => {
    // Arrange
    const input = setupTestData();
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    assert.strictEqual(result, expected);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with verbose output
node --test src/**/*.test.js --reporter=spec
```

## 📝 Pull Request Process

1. **Ensure Tests Pass**: All tests must pass
2. **Update Documentation**: Keep docs in sync
3. **Clear Commits**: Use descriptive commit messages
4. **Link Issues**: Reference related issues
5. **Description**: Explain what and why
6. **Small PRs**: Keep changes focused

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Demo works correctly

## Documentation
- [ ] README updated
- [ ] API docs updated
- [ ] Examples added/updated
```

## 🎨 Adding New Examples

Add real-world examples to `/examples`:

```javascript
// examples/your-industry-example.js
import BizGetUseCaseApp from '../src/index.js';

// Your industry-specific demonstration
```

## 🐛 Debugging Tips

### Enable Detailed Logging

```javascript
// Add console.log for debugging
console.log('Debug:', JSON.stringify(data, null, 2));
```

### Test Individual Components

```javascript
// Test specific functionality
import { UseCase } from './src/usecase-engine.js';
const uc = new UseCase('Test', 'Domain', 'Desc');
console.log(uc.toJSON());
```

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [ES6 Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js Test Runner](https://nodejs.org/api/test.html)

## 🙏 Recognition

Contributors will be acknowledged in the README.md file.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Open an issue for questions
- Check existing documentation first
- Be respectful and constructive

---

Thank you for contributing to BizGetUseCase! 🚀

**Microsoft Agent League - Creative Apps Competition**
