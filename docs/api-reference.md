# API Reference

## Classes

### BusinessDomain

Represents a business domain with specific challenges.

**Constructor:**
```javascript
new BusinessDomain(name, description, commonChallenges = [])
```

**Parameters:**
- `name` (string): Domain name
- `description` (string): Domain description
- `commonChallenges` (array): List of common challenges in this domain

**Example:**
```javascript
const domain = new BusinessDomain(
  'Customer Service',
  'Automated customer support',
  ['High volume', 'Response time']
);
```

---

### UseCase

Represents a single business use case.

**Constructor:**
```javascript
new UseCase(title, domain, description, benefits = [], requirements = [])
```

**Parameters:**
- `title` (string): Use case title
- `domain` (string): Business domain name
- `description` (string): Detailed description
- `benefits` (array): List of benefits
- `requirements` (array): List of requirements

**Methods:**

#### setPriority(priority)
Sets the priority level.

**Parameters:**
- `priority` (string): One of 'low', 'medium', 'high', 'critical'

**Returns:** UseCase instance (chainable)

#### setFeasibility(feasibility)
Sets the implementation feasibility.

**Parameters:**
- `feasibility` (string): One of 'easy', 'moderate', 'complex', 'very-complex'

**Returns:** UseCase instance (chainable)

#### calculateScore()
Calculates a weighted score based on priority, feasibility, and benefits.

**Returns:** Number

#### toJSON()
Converts the use case to a JSON-serializable object.

**Returns:** Object

**Example:**
```javascript
const useCase = new UseCase(
  'AI Chatbot',
  'Customer Service',
  'Automated support',
  ['24/7 availability', 'Cost savings'],
  ['CRM integration', 'Training data']
);

useCase.setPriority('high').setFeasibility('moderate');
const score = useCase.calculateScore();
const json = useCase.toJSON();
```

---

### UseCaseGenerator

Main engine for generating and managing use cases.

**Constructor:**
```javascript
new UseCaseGenerator()
```

**Properties:**
- `domains` (array): List of available business domains
- `useCases` (array): Generated use cases

**Methods:**

#### generateUseCaseForDomain(domainName, customChallenge = null)
Generates a use case for a specific domain.

**Parameters:**
- `domainName` (string): Name of the business domain
- `customChallenge` (string, optional): Custom challenge to address

**Returns:** UseCase instance

**Throws:** Error if domain not found

**Example:**
```javascript
const generator = new UseCaseGenerator();
const useCase = generator.generateUseCaseForDomain('Sales & Marketing');
```

#### getAllUseCases()
Retrieves all generated use cases.

**Returns:** Array of UseCase instances

#### getUseCasesByDomain(domainName)
Retrieves use cases filtered by domain.

**Parameters:**
- `domainName` (string): Domain name to filter by

**Returns:** Array of UseCase instances

#### getTopUseCases(count = 5)
Retrieves top-ranked use cases by score.

**Parameters:**
- `count` (number): Number of use cases to return

**Returns:** Array of UseCase instances, sorted by score (descending)

#### analyzeUseCases()
Analyzes the portfolio of generated use cases.

**Returns:** Object with analysis data:
```javascript
{
  totalUseCases: number,
  byDomain: object,
  byPriority: object,
  byFeasibility: object,
  averageScore: number
}
```

#### exportUseCases(format = 'json')
Exports use cases in specified format.

**Parameters:**
- `format` (string): Export format ('json' or other)

**Returns:** String (JSON) or Array

**Example:**
```javascript
const generator = new UseCaseGenerator();
generator.generateUseCaseForDomain('Finance');
generator.generateUseCaseForDomain('Operations');

const analysis = generator.analyzeUseCases();
const json = generator.exportUseCases('json');
```

---

### UseCaseAnalyzer

Static utility class for advanced use case analysis.

**Static Methods:**

#### analyzeImplementationComplexity(useCase)
Analyzes the implementation complexity of a use case.

**Parameters:**
- `useCase` (UseCase): Use case to analyze

**Returns:** Object with complexity factors:
```javascript
{
  requirementsCount: number,
  feasibility: string,
  estimatedEffort: string
}
```

#### estimateEffort(useCase)
Estimates implementation effort based on feasibility.

**Parameters:**
- `useCase` (UseCase): Use case to analyze

**Returns:** String (e.g., '2-4 weeks', '1-3 months')

#### calculateROI(useCase, estimatedCost, estimatedBenefit)
Calculates return on investment.

**Parameters:**
- `useCase` (UseCase): Use case to analyze
- `estimatedCost` (number): Implementation cost
- `estimatedBenefit` (number): Annual benefit

**Returns:** Object:
```javascript
{
  roi: string,
  paybackPeriod: string,
  recommendation: string
}
```

#### estimatePaybackPeriod(cost, annualBenefit)
Estimates payback period in months.

**Parameters:**
- `cost` (number): Implementation cost
- `annualBenefit` (number): Annual benefit

**Returns:** String (e.g., '6.0 months')

#### generateImplementationRoadmap(useCase)
Generates a 4-phase implementation roadmap.

**Parameters:**
- `useCase` (UseCase): Use case to plan

**Returns:** Object with 4 phases:
```javascript
{
  phase1: { name, duration, activities: [] },
  phase2: { name, duration, activities: [] },
  phase3: { name, duration, activities: [] },
  phase4: { name, duration, activities: [] }
}
```

**Example:**
```javascript
const useCase = generator.generateUseCaseForDomain('Human Resources');

const complexity = UseCaseAnalyzer.analyzeImplementationComplexity(useCase);
const roi = UseCaseAnalyzer.calculateROI(useCase, 50000, 120000);
const roadmap = UseCaseAnalyzer.generateImplementationRoadmap(useCase);
```

---

### BizGetUseCaseApp

Main application class for user interaction.

**Constructor:**
```javascript
new BizGetUseCaseApp()
```

**Properties:**
- `generator` (UseCaseGenerator): Internal use case generator

**Methods:**

#### run()
Starts the application in interactive mode.

**Returns:** Promise

#### generateUseCaseForDomain(domainName)
Generates and displays a use case.

**Parameters:**
- `domainName` (string): Domain name

**Returns:** UseCase instance or null

#### viewAllUseCases()
Displays all generated use cases.

#### getTopUseCases(count = 5)
Displays top-ranked use cases.

**Parameters:**
- `count` (number): Number to display

#### analyzePortfolio()
Displays portfolio analysis.

#### generateRoadmap(useCase)
Displays implementation roadmap for a use case.

**Parameters:**
- `useCase` (UseCase): Use case to plan

#### exportToJSON()
Exports and displays all use cases as JSON.

**Returns:** String (JSON)

#### getDomains()
Gets available business domains.

**Returns:** Array of BusinessDomain instances

#### getGenerator()
Gets the internal generator instance.

**Returns:** UseCaseGenerator instance

**Example:**
```javascript
import BizGetUseCaseApp from './src/index.js';

const app = new BizGetUseCaseApp();
await app.run();

// Or use programmatically:
const useCase = app.generateUseCaseForDomain('Operations');
app.analyzePortfolio();
app.exportToJSON();
```

---

## UI Functions

### displayWelcome()
Displays welcome banner.

### displayMenu()
Displays main menu.

### displayUseCase(useCase)
Displays formatted use case details.

**Parameters:**
- `useCase` (UseCase): Use case to display

### displayAnalysis(analysis)
Displays portfolio analysis results.

**Parameters:**
- `analysis` (object): Analysis data from analyzeUseCases()

### displayDomains(domains)
Displays available business domains.

**Parameters:**
- `domains` (array): Array of BusinessDomain instances

### displayError(message)
Displays error message.

**Parameters:**
- `message` (string): Error message

### displaySuccess(message)
Displays success message.

**Parameters:**
- `message` (string): Success message

---

## Constants

### Valid Priority Values
- `'low'`
- `'medium'`
- `'high'`
- `'critical'`

### Valid Feasibility Values
- `'easy'`
- `'moderate'`
- `'complex'`
- `'very-complex'`

### Available Domains
- `'Customer Service'`
- `'Sales & Marketing'`
- `'Operations'`
- `'Finance'`
- `'Human Resources'`
- `'Product Development'`

---

## Complete Example

```javascript
import BizGetUseCaseApp from './src/index.js';
import { UseCaseAnalyzer } from './src/usecase-engine.js';

// Create application
const app = new BizGetUseCaseApp();

// Generate use cases
const customerServiceUC = app.generateUseCaseForDomain('Customer Service');
const salesUC = app.generateUseCaseForDomain('Sales & Marketing');
const operationsUC = app.generateUseCaseForDomain('Operations');

// View all
app.viewAllUseCases();

// Get top performers
app.getTopUseCases(3);

// Analyze portfolio
app.analyzePortfolio();

// Analyze specific use case
const roi = UseCaseAnalyzer.calculateROI(customerServiceUC, 50000, 150000);
console.log(`ROI: ${roi.roi}, Recommendation: ${roi.recommendation}`);

// Generate roadmap
app.generateRoadmap(customerServiceUC);

// Export
const json = app.exportToJSON();
```
