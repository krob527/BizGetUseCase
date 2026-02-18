/**
 * Example: Generating Use Cases for a Retail Company
 * 
 * This example demonstrates how a retail company could use BizGetUseCase
 * to identify and evaluate AI agent opportunities.
 */

import BizGetUseCaseApp from '../src/index.js';
import { UseCaseAnalyzer } from '../src/usecase-engine.js';

console.log('========================================');
console.log('RETAIL COMPANY AI OPPORTUNITIES ANALYSIS');
console.log('========================================\n');

const app = new BizGetUseCaseApp();

// Step 1: Generate use cases for key business areas
console.log('Step 1: Identifying AI Opportunities\n');

const customerServiceUC = app.generateUseCaseForDomain('Customer Service');
console.log('✓ Customer Service opportunity identified\n');

const salesMarketingUC = app.generateUseCaseForDomain('Sales & Marketing');
console.log('✓ Sales & Marketing opportunity identified\n');

const operationsUC = app.generateUseCaseForDomain('Operations');
console.log('✓ Operations opportunity identified\n');

// Step 2: Analyze ROI for each use case
console.log('\nStep 2: ROI Analysis\n');

const useCaseScenarios = [
  {
    useCase: customerServiceUC,
    name: 'Customer Service Automation',
    cost: 75000,
    annualBenefit: 180000
  },
  {
    useCase: salesMarketingUC,
    name: 'Sales Process Optimization',
    cost: 60000,
    annualBenefit: 150000
  },
  {
    useCase: operationsUC,
    name: 'Operations Efficiency',
    cost: 100000,
    annualBenefit: 250000
  }
];

const roiResults = useCaseScenarios.map(scenario => {
  const roi = UseCaseAnalyzer.calculateROI(
    scenario.useCase,
    scenario.cost,
    scenario.annualBenefit
  );
  
  return {
    ...scenario,
    roi: roi.roi,
    paybackPeriod: roi.paybackPeriod,
    recommendation: roi.recommendation
  };
});

roiResults.forEach(result => {
  console.log(`${result.name}:`);
  console.log(`  Investment: $${result.cost.toLocaleString()}`);
  console.log(`  Annual Benefit: $${result.annualBenefit.toLocaleString()}`);
  console.log(`  ROI: ${result.roi}`);
  console.log(`  Payback Period: ${result.paybackPeriod}`);
  console.log(`  Recommendation: ${result.recommendation}\n`);
});

// Step 3: Rank opportunities
console.log('\nStep 3: Prioritized Recommendations\n');

const rankedOpportunities = roiResults.sort((a, b) => {
  const roiA = parseFloat(a.roi);
  const roiB = parseFloat(b.roi);
  return roiB - roiA;
});

console.log('Implementation Priority Order:');
rankedOpportunities.forEach((opp, index) => {
  console.log(`${index + 1}. ${opp.name} (ROI: ${opp.roi})`);
});

// Step 4: Create implementation plan for top opportunity
console.log('\n\nStep 4: Detailed Implementation Plan for Top Priority\n');

const topOpportunity = rankedOpportunities[0];
console.log(`Selected: ${topOpportunity.name}\n`);

const roadmap = UseCaseAnalyzer.generateImplementationRoadmap(topOpportunity.useCase);

Object.entries(roadmap).forEach(([key, phase]) => {
  console.log(`${phase.name}:`);
  console.log(`  Duration: ${phase.duration}`);
  console.log('  Activities:');
  phase.activities.forEach(activity => {
    console.log(`    • ${activity}`);
  });
  console.log('');
});

// Step 5: Generate executive summary
console.log('\n========================================');
console.log('EXECUTIVE SUMMARY');
console.log('========================================\n');

console.log('Our analysis identified 3 high-value AI agent opportunities for our retail operations.\n');

console.log('Key Findings:');
console.log(`• Top opportunity: ${topOpportunity.name}`);
console.log(`• Expected ROI: ${topOpportunity.roi}`);
console.log(`• Payback period: ${topOpportunity.paybackPeriod}`);
console.log(`• Total potential annual benefits: $${useCaseScenarios.reduce((sum, s) => sum + s.annualBenefit, 0).toLocaleString()}\n`);

console.log('Recommended Action Plan:');
console.log('1. Begin implementation of top-ranked opportunity immediately');
console.log('2. Plan Phase 1 (Discovery & Planning) to start within 2 weeks');
console.log('3. Allocate budget and resources for implementation');
console.log('4. Schedule stakeholder meetings to finalize requirements');
console.log('5. Begin planning for second-priority opportunity in parallel\n');

console.log('Next Steps:');
console.log('• Review detailed implementation roadmap');
console.log('• Identify project stakeholders and assign roles');
console.log('• Secure necessary approvals and budget');
console.log('• Schedule kickoff meeting\n');

console.log('========================================\n');
