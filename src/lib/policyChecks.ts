export type PolicyStatus = 'pass' | 'flagged';

export interface PolicyCheckResult {
  status: PolicyStatus;
  disallowedHits: string[];
  eeConcerns: string[];
}

const DISALLOWED_TERMS = [
  'unpaid trial',
  'work for exposure',
  'no stipend',
  'zero pay',
  'below minimum wage',
  'irregular hours without pay',
];

const EE_PATTERNS: { pattern: RegExp; message: string }[] = [
  { pattern: /male only|female only|men only|women only/i, message: 'Gender-exclusive language detected' },
  { pattern: /under\s*25|younger than/i, message: 'Age-exclusive language detected' },
  { pattern: /african only|white only|black only/i, message: 'Race-exclusive language detected' },
];

export function runPolicyChecks(text: string): PolicyCheckResult {
  const lower = text.toLowerCase();

  const disallowedHits = DISALLOWED_TERMS.filter(term => lower.includes(term));
  const eeConcerns = EE_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ message }) => message);

  const hasIssues = disallowedHits.length > 0 || eeConcerns.length > 0;

  return {
    status: hasIssues ? 'flagged' : 'pass',
    disallowedHits,
    eeConcerns,
  };
}
