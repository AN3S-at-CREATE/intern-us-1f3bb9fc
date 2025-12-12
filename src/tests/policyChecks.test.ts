import { describe, it, expect } from 'vitest';
import { runPolicyChecks } from '../lib/policyChecks';

describe('runPolicyChecks', () => {
  it('passes clean text', () => {
    const result = runPolicyChecks('We welcome all applicants and pay a fair stipend.');
    expect(result.status).toBe('pass');
    expect(result.disallowedHits).toHaveLength(0);
    expect(result.eeConcerns).toHaveLength(0);
  });

  it('flags disallowed compensation terms', () => {
    const result = runPolicyChecks('This is an unpaid trial role with zero pay.');
    expect(result.status).toBe('flagged');
    expect(result.disallowedHits).toContain('unpaid trial');
    expect(result.disallowedHits).toContain('zero pay');
  });

  it('flags EE exclusive language', () => {
    const result = runPolicyChecks('Looking for female only candidates under 25.');
    expect(result.status).toBe('flagged');
    expect(result.eeConcerns).toContain('Gender-exclusive language detected');
    expect(result.eeConcerns).toContain('Age-exclusive language detected');
  });
});
