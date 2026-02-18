# Implementation Guide

This guide provides step-by-step instructions for implementing and using BizGetUseCase in your organization.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Integration Examples](#integration-examples)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

Ensure you have Node.js 18.0.0 or higher installed:

```bash
node --version
```

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/krob527/BizGetUseCase.git

# Navigate to project directory
cd BizGetUseCase

# Verify installation
npm test
```

No additional dependencies are required as the application uses only Node.js built-in modules.

---

## Basic Usage

### Running the Demo

The easiest way to see BizGetUseCase in action:

```bash
npm run demo
```

This runs a comprehensive demonstration showing:
- Use case generation for all domains
- Portfolio analysis
- Implementation roadmaps
- ROI calculations
- JSON export

### Interactive Mode

Start the application interactively:

```bash
npm start
```

### Programmatic Usage

Create a simple script to use BizGetUseCase:

```javascript
// my-script.js
import BizGetUseCaseApp from './src/index.js';

const app = new BizGetUseCaseApp();

// Generate a use case
const useCase = app.generateUseCaseForDomain('Customer Service');

// View details
console.log('Generated:', useCase.title);
console.log('Score:', useCase.calculateScore());
```

Run it:
```bash
node my-script.js
```

---

## Advanced Features

### 1. Bulk Use Case Generation

Generate multiple use cases at once:

```javascript
import BizGetUseCaseApp from './src/index.js';

const app = new BizGetUseCaseApp();
const domains = app.getDomains();

// Generate one use case per domain
const useCases = domains.map(domain => 
  app.generateUseCaseForDomain(domain.name)
);

console.log(`Generated ${useCases.length} use cases`);
```

### 2. Custom Filtering and Sorting

Filter use cases by criteria:

```javascript
const app = new BizGetUseCaseApp();
const generator = app.getGenerator();

// Generate several use cases
['Customer Service', 'Sales & Marketing', 'Operations'].forEach(domain => {
  generator.generateUseCaseForDomain(domain);
});

// Get high-priority use cases only
const highPriority = generator.getAllUseCases()
  .filter(uc => uc.priority === 'high');

// Get easy-to-implement use cases
const easyToImplement = generator.getAllUseCases()
  .filter(uc => uc.feasibility === 'easy');

// Get use cases with 5+ benefits
const highBenefit = generator.getAllUseCases()
  .filter(uc => uc.benefits.length >= 5);
```

### 3. ROI Analysis Workflow

Complete ROI analysis for decision-making:

```javascript
import BizGetUseCaseApp from './src/index.js';
import { UseCaseAnalyzer } from './src/usecase-engine.js';

const app = new BizGetUseCaseApp();

// Generate use cases
const useCase1 = app.generateUseCaseForDomain('Operations');
const useCase2 = app.generateUseCaseForDomain('Finance');

// Define cost/benefit scenarios
const scenarios = [
  { useCase: useCase1, cost: 50000, benefit: 120000 },
  { useCase: useCase2, cost: 75000, benefit: 150000 }
];

// Analyze each scenario
scenarios.forEach(scenario => {
  const roi = UseCaseAnalyzer.calculateROI(
    scenario.useCase,
    scenario.cost,
    scenario.benefit
  );
  
  console.log(`${scenario.useCase.title}`);
  console.log(`  ROI: ${roi.roi}`);
  console.log(`  Payback: ${roi.paybackPeriod}`);
  console.log(`  Recommendation: ${roi.recommendation}\n`);
});
```

### 4. Implementation Planning

Generate comprehensive implementation plans:

```javascript
import BizGetUseCaseApp from './src/index.js';
import { UseCaseAnalyzer } from './src/usecase-engine.js';

const app = new BizGetUseCaseApp();
const useCase = app.generateUseCaseForDomain('Human Resources');

// Get implementation details
const complexity = UseCaseAnalyzer.analyzeImplementationComplexity(useCase);
const roadmap = UseCaseAnalyzer.generateImplementationRoadmap(useCase);

console.log('Implementation Complexity:');
console.log(`  Requirements: ${complexity.requirementsCount}`);
console.log(`  Feasibility: ${complexity.feasibility}`);
console.log(`  Estimated Effort: ${complexity.estimatedEffort}\n`);

console.log('Roadmap Phases:');
Object.entries(roadmap).forEach(([key, phase]) => {
  console.log(`  ${phase.name} (${phase.duration})`);
  phase.activities.forEach(activity => {
    console.log(`    - ${activity}`);
  });
});
```

### 5. Data Export and Integration

Export for use in other systems:

```javascript
import BizGetUseCaseApp from './src/index.js';
import { writeFile } from 'fs/promises';

const app = new BizGetUseCaseApp();

// Generate multiple use cases
['Customer Service', 'Sales & Marketing', 'Operations'].forEach(domain => {
  app.generateUseCaseForDomain(domain);
});

// Export to JSON file
const json = app.exportToJSON();
await writeFile('./use-cases.json', json);

// Export specific fields for spreadsheet
const generator = app.getGenerator();
const csv = generator.getAllUseCases()
  .map(uc => `"${uc.title}","${uc.domain}","${uc.priority}",${uc.calculateScore()}`)
  .join('\n');

await writeFile('./use-cases.csv', 'Title,Domain,Priority,Score\n' + csv);
```

---

## Integration Examples

### Integration with Project Management Tools

```javascript
// Example: Prepare data for project management tool
import BizGetUseCaseApp from './src/index.js';

const app = new BizGetUseCaseApp();
const useCase = app.generateUseCaseForDomain('Operations');

const projectData = {
  name: useCase.title,
  description: useCase.description,
  priority: useCase.priority,
  estimatedEffort: UseCaseAnalyzer.estimateEffort(useCase),
  tasks: useCase.requirements.map(req => ({
    name: req,
    status: 'not_started'
  })),
  benefits: useCase.benefits
};

// Send to your project management API
// await projectManagementAPI.createProject(projectData);
```

### Integration with Business Intelligence

```javascript
// Example: Analytics dashboard data
import BizGetUseCaseApp from './src/index.js';

const app = new BizGetUseCaseApp();

// Generate portfolio
const domains = ['Customer Service', 'Sales & Marketing', 'Operations', 'Finance'];
domains.forEach(d => app.generateUseCaseForDomain(d));

// Prepare analytics data
const analysis = app.getGenerator().analyzeUseCases();
const dashboardData = {
  metrics: {
    totalUseCases: analysis.totalUseCases,
    averageScore: analysis.averageScore,
    domainDistribution: analysis.byDomain,
    priorityDistribution: analysis.byPriority
  },
  topOpportunities: app.getGenerator().getTopUseCases(5).map(uc => ({
    title: uc.title,
    score: uc.calculateScore(),
    priority: uc.priority,
    feasibility: uc.feasibility
  }))
};

// Send to BI tool
// await biTool.updateDashboard(dashboardData);
```

---

## Best Practices

### 1. Regular Portfolio Reviews

Review and update your use case portfolio regularly:

```javascript
// Monthly portfolio review
const app = new BizGetUseCaseApp();
const analysis = app.getGenerator().analyzeUseCases();

if (analysis.averageScore < 2.5) {
  console.log('⚠️ Low average score - consider generating new use cases');
}

const topCases = app.getGenerator().getTopUseCases(3);
console.log('Focus on these top opportunities:', 
  topCases.map(uc => uc.title)
);
```

### 2. Prioritization Strategy

Use the scoring system to prioritize:

```javascript
const app = new BizGetUseCaseApp();
const generator = app.getGenerator();

// Generate portfolio
['Customer Service', 'Sales & Marketing', 'Operations'].forEach(d => {
  generator.generateUseCaseForDomain(d);
});

// Prioritize: High priority + Easy feasibility
const quickWins = generator.getAllUseCases()
  .filter(uc => uc.priority === 'high' && uc.feasibility === 'easy')
  .sort((a, b) => b.calculateScore() - a.calculateScore());

console.log('Quick Wins (High Priority + Easy Implementation):');
quickWins.forEach(uc => console.log(`- ${uc.title}`));
```

### 3. Stakeholder Communication

Generate reports for stakeholders:

```javascript
import BizGetUseCaseApp from './src/index.js';
import { UseCaseAnalyzer } from './src/usecase-engine.js';

function generateExecutiveSummary(app) {
  const generator = app.getGenerator();
  const analysis = generator.analyzeUseCases();
  const topCases = generator.getTopUseCases(5);
  
  console.log('EXECUTIVE SUMMARY');
  console.log('=================\n');
  console.log(`Total Opportunities Identified: ${analysis.totalUseCases}`);
  console.log(`Average Opportunity Score: ${analysis.averageScore.toFixed(2)}`);
  console.log('\nTop 5 Opportunities:');
  
  topCases.forEach((uc, i) => {
    const roi = UseCaseAnalyzer.calculateROI(uc, 50000, 120000);
    console.log(`${i+1}. ${uc.title}`);
    console.log(`   Domain: ${uc.domain}`);
    console.log(`   Estimated ROI: ${roi.roi}`);
    console.log(`   Recommendation: ${roi.recommendation}\n`);
  });
}
```

### 4. Documentation

Document your generated use cases:

```javascript
import BizGetUseCaseApp from './src/index.js';
import { writeFile } from 'fs/promises';

async function documentUseCase(useCase) {
  const roadmap = UseCaseAnalyzer.generateImplementationRoadmap(useCase);
  
  const doc = `
# ${useCase.title}

**Domain:** ${useCase.domain}
**Priority:** ${useCase.priority}
**Feasibility:** ${useCase.feasibility}
**Score:** ${useCase.calculateScore().toFixed(2)}

## Description

${useCase.description}

## Benefits

${useCase.benefits.map(b => `- ${b}`).join('\n')}

## Requirements

${useCase.requirements.map(r => `- ${r}`).join('\n')}

## Implementation Roadmap

${Object.values(roadmap).map(phase => `
### ${phase.name} (${phase.duration})

${phase.activities.map(a => `- ${a}`).join('\n')}
`).join('\n')}
`;

  await writeFile(`./use-case-${useCase.id}.md`, doc);
}
```

---

## Troubleshooting

### Issue: Domain Not Found

**Error:** `Domain "XYZ" not found`

**Solution:** Use one of the valid domain names:
- Customer Service
- Sales & Marketing
- Operations
- Finance
- Human Resources
- Product Development

### Issue: No Use Cases Generated

**Problem:** Analysis shows 0 use cases

**Solution:** Generate use cases before analyzing:
```javascript
const app = new BizGetUseCaseApp();
app.generateUseCaseForDomain('Operations'); // Generate first
app.analyzePortfolio(); // Then analyze
```

### Issue: Invalid Priority/Feasibility

**Problem:** Priority or feasibility not being set

**Solution:** Use valid values:
```javascript
useCase.setPriority('high'); // Valid: low, medium, high, critical
useCase.setFeasibility('moderate'); // Valid: easy, moderate, complex, very-complex
```

---

## Next Steps

1. **Run the demo:** `npm run demo`
2. **Run tests:** `npm test`
3. **Create custom integrations** using the API
4. **Generate your portfolio** of use cases
5. **Share with stakeholders** using export features

For more information, see:
- [API Reference](api-reference.md)
- [Use Case Templates](use-case-templates.md)
- [README](../README.md)
