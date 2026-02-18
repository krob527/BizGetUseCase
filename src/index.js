/**
 * BizGetUseCase - Main Application Entry Point
 * 
 * This is an AI-powered business use case generator and analyzer designed for
 * the Microsoft Agent League Creative Apps competition.
 */

import { UseCaseGenerator, UseCaseAnalyzer } from './usecase-engine.js';
import { displayWelcome, displayMenu, displayUseCase, displayAnalysis } from './ui.js';

class BizGetUseCaseApp {
  constructor() {
    this.generator = new UseCaseGenerator();
  }

  async run() {
    displayWelcome();
    await this.interactiveMode();
  }

  async interactiveMode() {
    console.log('\n🎯 BizGetUseCase - Interactive Mode\n');
    console.log('Available Commands:');
    console.log('1. Generate use case for a specific domain');
    console.log('2. View all generated use cases');
    console.log('3. Get top-ranked use cases');
    console.log('4. Analyze use case portfolio');
    console.log('5. Generate implementation roadmap');
    console.log('6. Export use cases to JSON');
    console.log('7. Exit\n');
  }

  generateUseCaseForDomain(domainName) {
    try {
      const useCase = this.generator.generateUseCaseForDomain(domainName);
      displayUseCase(useCase);
      return useCase;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return null;
    }
  }

  viewAllUseCases() {
    const useCases = this.generator.getAllUseCases();
    if (useCases.length === 0) {
      console.log('\n📋 No use cases generated yet.\n');
      return;
    }

    console.log(`\n📋 All Generated Use Cases (${useCases.length}):\n`);
    useCases.forEach((uc, index) => {
      console.log(`${index + 1}. ${uc.title} [${uc.domain}] - Score: ${uc.calculateScore().toFixed(2)}`);
    });
    console.log('');
  }

  getTopUseCases(count = 5) {
    const topUseCases = this.generator.getTopUseCases(count);
    if (topUseCases.length === 0) {
      console.log('\n🏆 No use cases available to rank.\n');
      return;
    }

    console.log(`\n🏆 Top ${count} Use Cases by Score:\n`);
    topUseCases.forEach((uc, index) => {
      console.log(`${index + 1}. ${uc.title}`);
      console.log(`   Domain: ${uc.domain}`);
      console.log(`   Priority: ${uc.priority} | Feasibility: ${uc.feasibility}`);
      console.log(`   Score: ${uc.calculateScore().toFixed(2)}`);
      console.log('');
    });
  }

  analyzePortfolio() {
    const analysis = this.generator.analyzeUseCases();
    displayAnalysis(analysis);
  }

  generateRoadmap(useCase) {
    const roadmap = UseCaseAnalyzer.generateImplementationRoadmap(useCase);
    
    console.log(`\n🗺️  Implementation Roadmap for: ${useCase.title}\n`);
    Object.values(roadmap).forEach(phase => {
      console.log(`Phase: ${phase.name} (${phase.duration})`);
      phase.activities.forEach(activity => {
        console.log(`  • ${activity}`);
      });
      console.log('');
    });
  }

  exportToJSON() {
    const json = this.generator.exportUseCases('json');
    console.log('\n📄 Exported Use Cases (JSON):\n');
    console.log(json);
    console.log('');
    return json;
  }

  getDomains() {
    return this.generator.domains;
  }

  getGenerator() {
    return this.generator;
  }
}

export default BizGetUseCaseApp;

// Run the application if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new BizGetUseCaseApp();
  app.run();
}
