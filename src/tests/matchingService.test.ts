import { describe, expect, it } from 'vitest';
import { buildMatchRequestPayload, normalizeLanguages, normalizeProvince, stripPII } from '@/lib/matchingService';

const sampleProfile: Parameters<typeof buildMatchRequestPayload>[0] = {
  user_id: 'user-1',
  field_of_study: 'Computer Science',
  qualification: 'BSc',
  institution: 'UCT',
  location: 'kzn',
  gender: 'Female',
  skills: ['TypeScript', 'React'],
  experience: 'Built dashboards',
  headline: 'Aspiring engineer',
};

describe('matchingService', () => {
  it('normalizes provinces and languages', () => {
    expect(normalizeProvince('gp')).toBe('Gauteng');
    expect(normalizeProvince('KwaZulu Natal')).toBe('KwaZulu-Natal');
    expect(normalizeLanguages(['zulu', 'English'])).toEqual(['isiZulu', 'English']);
  });

  it('strips PII and enforces blind match headlining', () => {
    const sanitized = stripPII({ ...sampleProfile, id_number: '123' }, true);
    expect(sanitized).not.toHaveProperty('id_number');
    expect(sanitized.headline).toBe('Blind profile enabled');
  });

  it('builds payload with bias assessment metadata', () => {
    const payload = buildMatchRequestPayload(sampleProfile, {
      id: 'opp-1',
      employer_id: 'emp',
      title: 'Intern',
      company_name: 'Acme',
      industry: 'Tech',
      description: 'Role',
      requirements: null,
      responsibilities: null,
      field_of_study: ['Computer Science'],
      opportunity_type: 'internship',
      location: 'Johannesburg',
      location_type: 'remote',
      application_deadline: null,
      start_date: null,
      duration_months: null,
      stipend_min: null,
      stipend_max: null,
      is_active: true,
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: 0,
      applications_count: 0,
      min_qualification: null,
    }, { blindMatchMode: true });

    expect(payload.normalizedDemographics.province).toBe('KwaZulu-Natal');
    expect(payload.biasAssessment.risk).toBe('medium');
  });
});
