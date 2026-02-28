import {
  getLocalizedMilestoneLabel,
  getMilestoneTemplateById,
} from '../src/constants/milestoneTemplates';

const t = (key: string, params?: Record<string, string | number>): string => {
  if (key === 'labels.milestone.firstWeek') return 'İlk Hafta';
  if (key === 'labels.milestone.firstSmile') return 'İlk Gülümseme';
  if (key === 'labels.milestone.firstLaughs') return 'İlk Kahkahalar';
  if (key === 'labels.milestone.firstTooth') return 'İlk Diş';
  if (key === 'labels.milestone.sitsUpAlone') return 'Desteksiz Oturma';
  if (key === 'labels.milestone.firstCrawl') return 'İlk Emekleme';
  if (key === 'labels.milestone.firstSteps') return 'İlk Adımlar';
  if (key === 'labels.milestone.firstWords') return 'İlk Kelimeler';
  if (key === 'age.month') return `${params?.count} ay`;
  if (key === 'age.months') return `${params?.count} ay`;
  if (key === 'age.year') return `${params?.count} yıl`;
  if (key === 'age.years') return `${params?.count} yıl`;
  return key;
};

describe('milestone label localization regression', () => {
  it('localizes known mapped milestone IDs', () => {
    const firstSmile = getMilestoneTemplateById('milestone_first_smile');
    expect(firstSmile).toBeTruthy();
    expect(getLocalizedMilestoneLabel(firstSmile!, t)).toBe('İlk Gülümseme');

    const firstSteps = getMilestoneTemplateById('milestone_first_steps');
    expect(firstSteps).toBeTruthy();
    expect(getLocalizedMilestoneLabel(firstSteps!, t)).toBe('İlk Adımlar');
  });

  it('localizes dynamic month/year milestone IDs', () => {
    const oneMonth = getMilestoneTemplateById('milestone_1_month');
    const twoMonths = getMilestoneTemplateById('milestone_2_months');
    const twoYears = getMilestoneTemplateById('milestone_2_years');

    expect(oneMonth).toBeTruthy();
    expect(twoMonths).toBeTruthy();
    expect(twoYears).toBeTruthy();

    expect(getLocalizedMilestoneLabel(oneMonth!, t)).toBe('1 ay');
    expect(getLocalizedMilestoneLabel(twoMonths!, t)).toBe('2 ay');
    expect(getLocalizedMilestoneLabel(twoYears!, t)).toBe('2 yıl');
  });

  it('falls back to template label for unmapped IDs', () => {
    const prenatal = getMilestoneTemplateById('milestone_pregnancy_8_weeks');
    expect(prenatal).toBeTruthy();
    expect(getLocalizedMilestoneLabel(prenatal!, t)).toBe(prenatal!.label);
  });
});
