/**
 * UI Display Functions for BizGetUseCase
 */

export function displayWelcome() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                ║');
  console.log('║              🚀 BizGetUseCase 🚀                              ║');
  console.log('║                                                                ║');
  console.log('║      AI-Powered Business Use Case Generator & Analyzer        ║');
  console.log('║                                                                ║');
  console.log('║          Microsoft Agent League - Creative Apps               ║');
  console.log('║                                                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log('Welcome! This tool helps you discover and evaluate AI agent use cases');
  console.log('for your business across multiple domains.\n');
}

export function displayMenu() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                         MAIN MENU');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('1. 🎯 Generate Use Case');
  console.log('2. 📋 View All Use Cases');
  console.log('3. 🏆 Top Ranked Use Cases');
  console.log('4. 📊 Portfolio Analysis');
  console.log('5. 🗺️  Implementation Roadmap');
  console.log('6. 💾 Export to JSON');
  console.log('7. ❌ Exit');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

export function displayUseCase(useCase) {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log(`║ USE CASE GENERATED                                             ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📌 Title: ${useCase.title}`);
  console.log(`🏢 Domain: ${useCase.domain}`);
  console.log(`🆔 ID: ${useCase.id}`);
  console.log(`\n📝 Description:\n   ${useCase.description}\n`);
  
  console.log('✅ Benefits:');
  useCase.benefits.forEach(benefit => {
    console.log(`   • ${benefit}`);
  });
  
  console.log('\n📋 Requirements:');
  useCase.requirements.forEach(req => {
    console.log(`   • ${req}`);
  });
  
  console.log(`\n🎯 Priority: ${useCase.priority.toUpperCase()}`);
  console.log(`⚙️  Feasibility: ${useCase.feasibility}`);
  console.log(`📊 Score: ${useCase.calculateScore().toFixed(2)}`);
  console.log(`⏰ Created: ${new Date(useCase.createdAt).toLocaleString()}\n`);
}

export function displayAnalysis(analysis) {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║ PORTFOLIO ANALYSIS                                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📊 Total Use Cases: ${analysis.totalUseCases}`);
  console.log(`⭐ Average Score: ${analysis.averageScore.toFixed(2)}\n`);
  
  if (Object.keys(analysis.byDomain).length > 0) {
    console.log('📁 By Domain:');
    Object.entries(analysis.byDomain).forEach(([domain, count]) => {
      console.log(`   ${domain}: ${count}`);
    });
    console.log('');
  }
  
  if (Object.keys(analysis.byPriority).length > 0) {
    console.log('🎯 By Priority:');
    Object.entries(analysis.byPriority).forEach(([priority, count]) => {
      console.log(`   ${priority}: ${count}`);
    });
    console.log('');
  }
  
  if (Object.keys(analysis.byFeasibility).length > 0) {
    console.log('⚙️  By Feasibility:');
    Object.entries(analysis.byFeasibility).forEach(([feasibility, count]) => {
      console.log(`   ${feasibility}: ${count}`);
    });
    console.log('');
  }
}

export function displayDomains(domains) {
  console.log('\n📁 Available Business Domains:\n');
  domains.forEach((domain, index) => {
    console.log(`${index + 1}. ${domain.name}`);
    console.log(`   ${domain.description}`);
    console.log(`   Common Challenges: ${domain.commonChallenges.join(', ')}\n`);
  });
}

export function displayError(message) {
  console.log(`\n❌ Error: ${message}\n`);
}

export function displaySuccess(message) {
  console.log(`\n✅ ${message}\n`);
}
