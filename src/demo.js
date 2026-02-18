/**
 * Demo Script for BizGetUseCase
 * 
 * Demonstrates the capabilities of the BizGetUseCase application
 * by generating use cases across multiple domains and analyzing them.
 */

import BizGetUseCaseApp from './index.js';
import { displayDomains, displaySuccess } from './ui.js';
import { UseCaseAnalyzer } from './usecase-engine.js';

async function runDemo() {
  const app = new BizGetUseCaseApp();
  
  console.log('Starting BizGetUseCase Demo...\n');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Display available domains
  displayDomains(app.getDomains());
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate use cases for different domains
  console.log('════════════════════════════════════════════════════════════════');
  console.log('STEP 1: Generating Use Cases Across Multiple Domains');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  const domains = [
    'Customer Service',
    'Sales & Marketing',
    'Operations',
    'Finance',
    'Human Resources',
    'Product Development'
  ];

  const generatedUseCases = [];
  
  for (const domain of domains) {
    console.log(`\n➡️  Generating use case for ${domain}...\n`);
    const useCase = app.generateUseCaseForDomain(domain);
    if (useCase) {
      generatedUseCases.push(useCase);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  displaySuccess(`Generated ${generatedUseCases.length} use cases successfully!`);
  await new Promise(resolve => setTimeout(resolve, 1500));

  // View all use cases
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('STEP 2: Viewing All Generated Use Cases');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  app.viewAllUseCases();
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Show top use cases
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('STEP 3: Top-Ranked Use Cases');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  app.getTopUseCases(3);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Analyze portfolio
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('STEP 4: Portfolio Analysis');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  app.analyzePortfolio();
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate implementation roadmap for top use case
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('STEP 5: Implementation Roadmap');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  const topUseCases = app.getGenerator().getTopUseCases(1);
  if (topUseCases.length > 0) {
    app.generateRoadmap(topUseCases[0]);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Demonstrate ROI calculation
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('STEP 6: ROI Analysis Example');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  if (generatedUseCases.length > 0) {
    const useCase = generatedUseCases[0];
    console.log(`Analyzing ROI for: ${useCase.title}\n`);
    
    const estimatedCost = 50000; // $50,000
    const estimatedBenefit = 120000; // $120,000 annual benefit
    
    const roiAnalysis = UseCaseAnalyzer.calculateROI(useCase, estimatedCost, estimatedBenefit);
    
    console.log(`💰 Estimated Implementation Cost: $${estimatedCost.toLocaleString()}`);
    console.log(`📈 Estimated Annual Benefit: $${estimatedBenefit.toLocaleString()}`);
    console.log(`📊 ROI: ${roiAnalysis.roi}`);
    console.log(`⏱️  Payback Period: ${roiAnalysis.paybackPeriod}`);
    console.log(`💡 Recommendation: ${roiAnalysis.recommendation}\n`);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Export to JSON
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('STEP 7: Exporting Use Cases to JSON');
  console.log('════════════════════════════════════════════════════════════════\n');
  
  const json = app.exportToJSON();
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Final summary
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                      DEMO COMPLETE                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  console.log('✨ BizGetUseCase Demo Summary:');
  console.log(`   • Generated ${generatedUseCases.length} use cases across ${domains.length} business domains`);
  console.log('   • Analyzed and ranked use cases by priority and feasibility');
  console.log('   • Created implementation roadmaps');
  console.log('   • Calculated ROI projections');
  console.log('   • Exported data to JSON format');
  console.log('\n📚 This demonstrates how AI agents can help businesses identify and');
  console.log('   evaluate opportunities for automation and innovation.\n');
  
  console.log('🏆 Microsoft Agent League - Creative Apps Competition Entry');
  console.log('   Created by: Kevin Robinson\n');
}

// Run the demo
runDemo().catch(error => {
  console.error('Demo error:', error);
  process.exit(1);
});
