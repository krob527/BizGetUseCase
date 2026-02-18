# BizGetUseCase - Quick Reference Card

## 🚀 What is BizGetUseCase?

An AI-powered tool that helps businesses discover, evaluate, and implement AI agent use cases across multiple domains.

---

## ⚡ Quick Commands

```bash
npm run demo    # Interactive demonstration
npm start       # Run application
npm test        # Run test suite
```

---

## 📊 Core Features

### 1. Use Case Generation
Generate intelligent use cases for any business domain:
```javascript
const useCase = app.generateUseCaseForDomain('Customer Service');
```

### 2. Portfolio Analysis
Analyze your complete portfolio:
```javascript
app.analyzePortfolio();
// Shows: total count, avg score, distribution by domain/priority/feasibility
```

### 3. Top Ranking
Get your best opportunities:
```javascript
app.getTopUseCases(5);
// Returns: top 5 use cases sorted by score
```

### 4. ROI Calculation
Calculate financial returns:
```javascript
const roi = UseCaseAnalyzer.calculateROI(useCase, 50000, 120000);
// Returns: ROI %, payback period, recommendation
```

### 5. Implementation Planning
Generate detailed roadmap:
```javascript
app.generateRoadmap(useCase);
// Returns: 4-phase implementation plan
```

### 6. Export Data
Export for integration:
```javascript
const json = app.exportToJSON();
// Returns: JSON formatted use cases
```

---

## 🏢 Available Domains

| Domain | Focus Area |
|--------|------------|
| **Customer Service** | Support automation, chatbots, ticket management |
| **Sales & Marketing** | Lead qualification, campaigns, personalization |
| **Operations** | Process automation, scheduling, invoice processing |
| **Finance** | Reporting, forecasting, compliance |
| **Human Resources** | Recruitment, onboarding, training |
| **Product Development** | Bug tracking, testing, documentation |

---

## 📈 Scoring System

Use cases are scored on three dimensions:

**Priority**: low (1) → medium (2) → high (3) → critical (4)  
**Feasibility**: very-complex (1) → complex (2) → moderate (3) → easy (4)  
**Benefits**: Count of expected benefits

**Formula**: `Score = (Priority × 0.4) + (Feasibility × 0.3) + (Benefits × 0.3)`

---

## 🎯 Use Case Properties

Every use case includes:
- **ID**: Unique identifier
- **Title**: Descriptive name
- **Domain**: Business area
- **Description**: Detailed explanation
- **Benefits**: List of expected benefits
- **Requirements**: Implementation requirements
- **Priority**: Business priority level
- **Feasibility**: Implementation complexity
- **Score**: Calculated weighted score
- **Created**: Timestamp

---

## 📋 Implementation Phases

Every roadmap includes 4 phases:

1. **Discovery & Planning** (2-4 weeks)
   - Stakeholder interviews
   - Requirements documentation
   - Technical feasibility
   - Resource allocation

2. **Design & Development** (varies by complexity)
   - Architecture design
   - Integration planning
   - Development & testing
   - Quality assurance

3. **Deployment & Training** (2-3 weeks)
   - Pilot deployment
   - User training
   - Performance monitoring
   - Optimization

4. **Monitoring & Optimization** (ongoing)
   - Performance tracking
   - Feedback collection
   - Continuous improvement
   - Scaling strategy

---

## 💡 Quick Tips

✅ **DO:**
- Generate multiple use cases before analyzing
- Use ROI calculator for business cases
- Export JSON for integration with other tools
- Review top-ranked use cases first
- Consider both priority AND feasibility

❌ **DON'T:**
- Analyze empty portfolio (generate first)
- Use invalid domain names
- Ignore feasibility for high priority items

---

## 🔗 More Information

- Full documentation: `README.md`
- API reference: `docs/api-reference.md`
- Implementation guide: `docs/implementation-guide.md`
- Templates: `docs/use-case-templates.md`

---

## 🏆 Microsoft Agent League Entry

**Created by**: Kevin Robinson  
**Competition**: Creative Apps  
**Repository**: github.com/krob527/BizGetUseCase

---

**Built with ❤️ for the Microsoft Agent League Competition**
