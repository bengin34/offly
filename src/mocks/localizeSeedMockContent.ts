type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

const TITLE_MAP: Record<string, string> = {
  'First Smile': 'mockContent.memoryTitles.firstSmile',
  'Morning cuddles': 'mockContent.memoryTitles.morningCuddles',
  'Tummy time champion': 'mockContent.memoryTitles.tummyTimeChampion',
};

const DESCRIPTION_MAP: Record<string, string> = {
  'That magical moment when they looked up and smiled for the first time. Pure joy.':
    'mockContent.memoryDescriptions.firstSmile',
  'We spent the whole morning just being together. These quiet moments are everything.':
    'mockContent.memoryDescriptions.morningCuddles',
  'Held their head up for almost 10 seconds today! Getting so strong.':
    'mockContent.memoryDescriptions.tummyTimeChampion',
};

export function getLocalizedSeedMockTitle(title: string, t: TranslateFn): string {
  const key = TITLE_MAP[title];
  if (!key) return title;
  const translated = t(key);
  return translated === key ? title : translated;
}

export function getLocalizedSeedMockDescription(description: string, t: TranslateFn): string {
  const key = DESCRIPTION_MAP[description];
  if (!key) return description;
  const translated = t(key);
  return translated === key ? description : translated;
}

