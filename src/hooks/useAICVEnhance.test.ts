import { describe, expect, it } from 'vitest';
import { replaceInstitutions } from './useAICVEnhance';

describe('replaceInstitutions', () => {
  const content = `Graduated from University of Cape Town and University of johannesburg. Worked with peers from UCT.`;

  it('redacts institution names case-insensitively', () => {
    const output = replaceInstitutions(content, ['University of Cape Town', 'University of Johannesburg', 'UCT']);

    expect(output).not.toContain('Cape Town');
    expect(output).not.toContain('Johannesburg');
    expect(output).not.toContain('UCT');
    expect(output.match(/\[institution redacted\]/g)?.length).toBeGreaterThanOrEqual(3);
  });

  it('uses a custom replacement label', () => {
    const output = replaceInstitutions(content, ['University of Cape Town'], 'Tier 1 Institution');

    expect(output).toContain('Tier 1 Institution');
    expect(output).not.toContain('University of Cape Town');
  });

  it('returns original content when nothing to redact', () => {
    const output = replaceInstitutions(content, []);
    expect(output).toBe(content);
  });
});
