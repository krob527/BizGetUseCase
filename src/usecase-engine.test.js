/**
 * Tests for BizGetUseCase Core Functionality
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BusinessDomain, UseCase, UseCaseGenerator, UseCaseAnalyzer } from './usecase-engine.js';

describe('BusinessDomain', () => {
  it('should create a business domain with name and description', () => {
    const domain = new BusinessDomain('Test Domain', 'Test Description', ['Challenge 1']);
    assert.strictEqual(domain.name, 'Test Domain');
    assert.strictEqual(domain.description, 'Test Description');
    assert.strictEqual(domain.commonChallenges.length, 1);
  });
});

describe('UseCase', () => {
  it('should create a use case with required properties', () => {
    const useCase = new UseCase(
      'Test Use Case',
      'Test Domain',
      'Test Description',
      ['Benefit 1', 'Benefit 2'],
      ['Requirement 1']
    );
    
    assert.strictEqual(useCase.title, 'Test Use Case');
    assert.strictEqual(useCase.domain, 'Test Domain');
    assert.strictEqual(useCase.description, 'Test Description');
    assert.strictEqual(useCase.benefits.length, 2);
    assert.strictEqual(useCase.requirements.length, 1);
    assert.ok(useCase.id);
    assert.ok(useCase.createdAt);
  });

  it('should generate unique IDs for use cases', () => {
    const useCase1 = new UseCase('UC1', 'Domain', 'Description');
    const useCase2 = new UseCase('UC2', 'Domain', 'Description');
    
    assert.notStrictEqual(useCase1.id, useCase2.id);
  });

  it('should set priority correctly', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    useCase.setPriority('high');
    assert.strictEqual(useCase.priority, 'high');
  });

  it('should not set invalid priority', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    const originalPriority = useCase.priority;
    useCase.setPriority('invalid');
    assert.strictEqual(useCase.priority, originalPriority);
  });

  it('should set feasibility correctly', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    useCase.setFeasibility('easy');
    assert.strictEqual(useCase.feasibility, 'easy');
  });

  it('should calculate score based on priority, feasibility, and benefits', () => {
    const useCase = new UseCase(
      'Test',
      'Domain',
      'Description',
      ['Benefit 1', 'Benefit 2', 'Benefit 3']
    );
    useCase.setPriority('high').setFeasibility('easy');
    
    const score = useCase.calculateScore();
    assert.ok(score > 0);
    assert.ok(typeof score === 'number');
  });

  it('should convert to JSON correctly', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description', ['Benefit 1']);
    const json = useCase.toJSON();
    
    assert.ok(json.id);
    assert.strictEqual(json.title, 'Test');
    assert.strictEqual(json.domain, 'Domain');
    assert.ok(json.score);
  });
});

describe('UseCaseGenerator', () => {
  it('should initialize with predefined domains', () => {
    const generator = new UseCaseGenerator();
    assert.ok(generator.domains.length > 0);
  });

  it('should generate a use case for a valid domain', () => {
    const generator = new UseCaseGenerator();
    const useCase = generator.generateUseCaseForDomain('Customer Service');
    
    assert.ok(useCase);
    assert.strictEqual(useCase.domain, 'Customer Service');
    assert.ok(useCase.title);
    assert.ok(useCase.description);
  });

  it('should throw error for invalid domain', () => {
    const generator = new UseCaseGenerator();
    assert.throws(() => {
      generator.generateUseCaseForDomain('Invalid Domain');
    }, /Domain "Invalid Domain" not found/);
  });

  it('should store generated use cases', () => {
    const generator = new UseCaseGenerator();
    const initialCount = generator.getAllUseCases().length;
    
    generator.generateUseCaseForDomain('Sales & Marketing');
    
    assert.strictEqual(generator.getAllUseCases().length, initialCount + 1);
  });

  it('should get use cases by domain', () => {
    const generator = new UseCaseGenerator();
    generator.generateUseCaseForDomain('Operations');
    generator.generateUseCaseForDomain('Operations');
    generator.generateUseCaseForDomain('Finance');
    
    const operationsUseCases = generator.getUseCasesByDomain('Operations');
    assert.strictEqual(operationsUseCases.length, 2);
  });

  it('should get top use cases sorted by score', () => {
    const generator = new UseCaseGenerator();
    
    // Generate multiple use cases
    generator.generateUseCaseForDomain('Customer Service');
    generator.generateUseCaseForDomain('Sales & Marketing');
    generator.generateUseCaseForDomain('Operations');
    
    const topUseCases = generator.getTopUseCases(2);
    assert.strictEqual(topUseCases.length, 2);
    
    // Verify sorting
    if (topUseCases.length === 2) {
      assert.ok(topUseCases[0].calculateScore() >= topUseCases[1].calculateScore());
    }
  });

  it('should analyze use cases portfolio', () => {
    const generator = new UseCaseGenerator();
    generator.generateUseCaseForDomain('Finance');
    generator.generateUseCaseForDomain('Finance');
    
    const analysis = generator.analyzeUseCases();
    
    assert.strictEqual(analysis.totalUseCases, 2);
    assert.ok(analysis.byDomain);
    assert.ok(analysis.byPriority);
    assert.ok(analysis.byFeasibility);
    assert.ok(typeof analysis.averageScore === 'number');
  });

  it('should export use cases to JSON', () => {
    const generator = new UseCaseGenerator();
    generator.generateUseCaseForDomain('Human Resources');
    
    const json = generator.exportUseCases('json');
    assert.ok(typeof json === 'string');
    
    const parsed = JSON.parse(json);
    assert.ok(Array.isArray(parsed));
    assert.strictEqual(parsed.length, 1);
  });
});

describe('UseCaseAnalyzer', () => {
  it('should analyze implementation complexity', () => {
    const useCase = new UseCase(
      'Test',
      'Domain',
      'Description',
      [],
      ['Req1', 'Req2', 'Req3']
    );
    useCase.setFeasibility('complex');
    
    const complexity = UseCaseAnalyzer.analyzeImplementationComplexity(useCase);
    
    assert.strictEqual(complexity.requirementsCount, 3);
    assert.strictEqual(complexity.feasibility, 'complex');
    assert.ok(complexity.estimatedEffort);
  });

  it('should estimate effort based on feasibility', () => {
    const useCase1 = new UseCase('Test', 'Domain', 'Desc');
    useCase1.setFeasibility('easy');
    
    const effort1 = UseCaseAnalyzer.estimateEffort(useCase1);
    assert.ok(effort1.includes('weeks') || effort1.includes('months'));
    
    const useCase2 = new UseCase('Test', 'Domain', 'Desc');
    useCase2.setFeasibility('complex');
    
    const effort2 = UseCaseAnalyzer.estimateEffort(useCase2);
    assert.ok(effort2.includes('months'));
  });

  it('should calculate ROI correctly', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    const roi = UseCaseAnalyzer.calculateROI(useCase, 10000, 20000);
    
    assert.ok(roi.roi);
    assert.ok(roi.paybackPeriod);
    assert.ok(roi.recommendation);
  });

  it('should recommend highly for good ROI', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    const roi = UseCaseAnalyzer.calculateROI(useCase, 10000, 20000);
    
    assert.strictEqual(roi.recommendation, 'Highly Recommended');
  });

  it('should generate implementation roadmap with 4 phases', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    const roadmap = UseCaseAnalyzer.generateImplementationRoadmap(useCase);
    
    assert.ok(roadmap.phase1);
    assert.ok(roadmap.phase2);
    assert.ok(roadmap.phase3);
    assert.ok(roadmap.phase4);
    
    assert.ok(roadmap.phase1.name);
    assert.ok(roadmap.phase1.duration);
    assert.ok(Array.isArray(roadmap.phase1.activities));
  });

  it('should estimate payback period', () => {
    const useCase = new UseCase('Test', 'Domain', 'Description');
    const payback = UseCaseAnalyzer.estimatePaybackPeriod(12000, 24000);
    
    assert.ok(payback.includes('months'));
  });
});
