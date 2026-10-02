import { describe, it, expect } from "vitest";
import {
  toolCategorizationQuestion,
  cardToneQuestion,
  patrioticResonanceScoreQuestion,
  evaluateChoiceForCompactionAccuracy,
  analyzeQuestionInstructionsCompliance,
} from "../core";

describe("TypeSafe core System One questions and evaluation", () => {
  it("evaluates Choice primitive for tool categorization positively", () => {
    const evaluation = evaluateChoiceForCompactionAccuracy();
    expect(evaluation.recommendation).toBe("strongly_recommended");
    expect(evaluation.bestPracticeChecklist.length).toBeGreaterThanOrEqual(4);
    expect(evaluation.rationale).toContain("Choice primitive provides mutually exclusive probability distributions");
  });

  it("ensures toolCategorizationQuestion strictly follows TypeSafe prompting best practices", () => {
    const analysis = analyzeQuestionInstructionsCompliance(toolCategorizationQuestion);
    expect(analysis.isCompliant).toBe(true);
    expect(analysis.score).toBeGreaterThanOrEqual(90);
    expect(analysis.auditDetails.usesBacktickedPaths).toBe(true);
    expect(analysis.auditDetails.hasSelfContainedInstructions).toBe(true);
    expect(analysis.auditDetails.hasDistinctCriteria).toBe(true);
    expect(analysis.auditDetails.hasFallbackOrCoverage).toBe(true);
  });

  it("ensures cardToneQuestion complies with TypeSafe Choice criteria standards", () => {
    const analysis = analyzeQuestionInstructionsCompliance(cardToneQuestion);
    expect(analysis.isCompliant).toBe(true);
    expect(analysis.auditDetails.usesBacktickedPaths).toBe(true);
    expect(cardToneQuestion.options?.length).toBe(4);
  });

  it("ensures patrioticResonanceScoreQuestion has distinct concrete score levels", () => {
    const analysis = analyzeQuestionInstructionsCompliance(patrioticResonanceScoreQuestion);
    expect(analysis.isCompliant).toBe(true);
    expect(patrioticResonanceScoreQuestion.levels?.length).toBe(5);
    expect(patrioticResonanceScoreQuestion.levels?.[0].description).toBeDefined();
  });
});
