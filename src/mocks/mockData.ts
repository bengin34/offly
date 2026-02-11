import { Locale, supportedLocales } from "../localization";

export type MockMilestone = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  imageUrl: string;
};

export type MockTimelineItem = {
  id: string;
  title: string;
  details: string;
  date: string;
  tags: string[];
  imageUrl: string;
};

export type LocaleMockData = {
  locale: Locale;
  milestones: MockMilestone[];
  timeline: MockTimelineItem[];
  pregnancyMilestones: MockMilestone[];
  pregnancyTimeline: MockTimelineItem[];
};

// ========================================
// PREGNANCY MODE MOCK DATA
// ========================================

const pregnancyMilestoneDates = [
  "2025-01-15", // Week 8 - First ultrasound
  "2025-02-20", // Week 12 - First trimester complete
  "2025-03-25", // Week 20 - Anatomy scan
  "2025-05-10", // Week 28 - Third trimester
  "2025-06-20", // Week 36 - Almost there
];

const pregnancyTimelineDates = [
  "2025-01-08",
  "2025-02-14",
  "2025-03-18",
  "2025-04-22",
  "2025-05-30",
];

const pregnancyMilestoneIcons = ["💗", "🤰", "👶", "🎀", "✨"];

// High-quality pregnancy images from Unsplash
const pregnancyMilestoneImages = [
  "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?auto=format&fit=crop&w=800&q=80", // Ultrasound moment
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80", // Pregnancy glow
  "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80", // Belly shot
  "https://images.unsplash.com/photo-1607788394806-f9e87c678852?auto=format&fit=crop&w=800&q=80", // Pregnancy journal
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80", // Nursery prep
];

const pregnancyTimelineImages = [
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80", // Positive test
  "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80", // Baby bump
  "https://images.unsplash.com/photo-1607788394806-f9e87c678852?auto=format&fit=crop&w=800&q=80", // Pregnancy planning
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80", // Maternity style
  "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?auto=format&fit=crop&w=800&q=80", // Doctor visit
];

// ========================================
// BABY BORN MODE MOCK DATA
// ========================================

const babyMilestoneDates = [
  "2025-07-15", // 2 weeks - Coming home
  "2025-08-01", // 1 month - First smile
  "2025-09-15", // 2 months - Tracking objects
  "2025-10-20", // 3 months - First laugh
  "2025-11-30", // 4 months - Rolling over
];

const babyTimelineDates = [
  "2025-07-10",
  "2025-07-25",
  "2025-08-20",
  "2025-09-30",
  "2025-11-15",
];

const babyMilestoneIcons = ["🍼", "😊", "👀", "😄", "🎉"];

// High-quality baby growth progression images from Unsplash
// Each image represents the same baby growing from newborn to 5 months
const babyMilestoneImages = [
  "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80", // Month 1: Newborn (0-4 weeks)
  "https://images.unsplash.com/photo-1519689373023-dd07c7988603?auto=format&fit=crop&w=800&q=80", // Month 2: First smiles (1-2 months)
  "https://images.unsplash.com/photo-1544181796-14e735b7e8be?auto=format&fit=crop&w=800&q=80", // Month 3: Alert and engaged (2-3 months)
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80", // Month 4: Social smiling (3-4 months)
  "https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=800&q=80", // Month 5: Sitting support (4-5 months)
];

const babyTimelineImages = [
  "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80", // First days home
  "https://images.unsplash.com/photo-1519689373023-dd07c7988603?auto=format&fit=crop&w=800&q=80", // Growing stronger
  "https://images.unsplash.com/photo-1544181796-14e735b7e8be?auto=format&fit=crop&w=800&q=80", // More alert
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80", // Happy baby
  "https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=800&q=80", // Getting bigger
];

// ========================================
// BUILD FUNCTIONS
// ========================================

function buildPregnancyMilestones(locale: Locale): MockMilestone[] {
  const milestoneLabels = [
    "First Heartbeat",
    "First Trimester Complete",
    "Anatomy Scan",
    "Third Trimester Begins",
    "Full Term Baby",
  ];

  const descriptions = [
    "Heard our baby's heartbeat for the first time. It was the most beautiful sound.",
    "Made it through the first trimester! Feeling more energetic and excited.",
    "Found out we're having a beautiful baby. Gender reveal was perfect.",
    "Final stretch! Getting the nursery ready and feeling those strong kicks.",
    "Baby is full term and ready to meet us. Can't wait for this journey.",
  ];

  return pregnancyMilestoneDates.map((date, index) => ({
    id: `pregnancy-milestone-${locale}-${index + 1}`,
    title: milestoneLabels[index],
    description: descriptions[index],
    date,
    icon: pregnancyMilestoneIcons[index],
    imageUrl: pregnancyMilestoneImages[index],
  }));
}

function buildPregnancyTimeline(locale: Locale): MockTimelineItem[] {
  const timelineTitles = [
    "Positive Test Day",
    "Valentine's Baby Announcement",
    "First Kicks Felt",
    "Nursery Shopping",
    "Baby Shower",
  ];

  const details = [
    "Two lines appeared and our world changed forever. So much joy and anticipation.",
    "Told our families today. Their reactions were priceless - tears of happiness everywhere.",
    "Felt the first little flutter today while reading. Such a magical moment.",
    "Started picking out furniture for the nursery. Everything is becoming so real now.",
    "Surrounded by love from friends and family. Feeling so blessed and supported.",
  ];

  return pregnancyTimelineDates.map((date, index) => {
    const tags = ["First Trimester", "Memories"];
    if (index >= 2) tags[0] = "Second Trimester";
    if (index >= 4) tags[0] = "Third Trimester";

    return {
      id: `pregnancy-timeline-${locale}-${index + 1}`,
      title: timelineTitles[index],
      details: details[index],
      date,
      tags,
      imageUrl: pregnancyTimelineImages[index],
    };
  });
}

function buildBabyMilestones(locale: Locale): MockMilestone[] {
  const milestoneLabels = [
    "Month 1: Welcome Home",
    "Month 2: First Real Smile",
    "Month 3: Tracking & Cooing",
    "Month 4: First Laugh",
    "Month 5: Rolling Over",
  ];

  const descriptions = [
    "Brought our precious baby home today. Those tiny fingers, that sweet smell. Life will never be the same - in the best way.",
    "At 6 weeks, we got the first real intentional smile! Not gas, the real thing. Pure magic seeing that little face light up.",
    "Baby started following my face with those beautiful eyes and making the sweetest cooing sounds. The connection grows stronger every day.",
    "The first real belly laugh today at 14 weeks! Daddy made funny faces and baby just cracked up. The most beautiful sound we've ever heard.",
    "At 4.5 months, rolled from tummy to back for the first time! Getting so strong and mobile. Can't believe how fast time flies.",
  ];

  return babyMilestoneDates.map((date, index) => ({
    id: `baby-milestone-${locale}-${index + 1}`,
    title: milestoneLabels[index],
    description: descriptions[index],
    date,
    icon: babyMilestoneIcons[index],
    imageUrl: babyMilestoneImages[index],
  }));
}

function buildBabyTimeline(locale: Locale): MockTimelineItem[] {
  const timelineTitles = [
    "First Night Home",
    "Meeting Grandparents",
    "First Pediatrician Visit",
    "Bedtime Routine Established",
    "Trying Tummy Time",
  ];

  const details = [
    "First night with our baby at home. Barely slept but couldn't stop watching those tiny movements and listening to every breath. So much love.",
    "Grandparents met their grandchild for the first time today. Tears of joy everywhere. Four generations together - what a precious moment.",
    "Two-week checkup went great! Baby is healthy, gaining weight, and growing perfectly. The pediatrician says everything looks wonderful.",
    "Finally found a bedtime routine that works: bath, feeding, white noise, and cuddles. Baby is sleeping in 2-3 hour stretches now!",
    "Started tummy time sessions today. Baby held their head up for almost 10 seconds! Those little neck muscles are getting so strong.",
  ];

  return babyTimelineDates.map((date, index) => {
    let tags = ["Newborn", "Family"];
    if (index === 1) tags = ["Family", "Grandparents"];
    if (index === 2) tags = ["Health", "Checkup"];
    if (index === 3) tags = ["Sleep", "Routine"];
    if (index === 4) tags = ["Development", "Milestones"];

    return {
      id: `baby-timeline-${locale}-${index + 1}`,
      title: timelineTitles[index],
      details: details[index],
      date,
      tags,
      imageUrl: babyTimelineImages[index],
    };
  });
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

const localeMocks: Record<Locale, LocaleMockData> = supportedLocales.reduce(
  (acc, locale) => {
    acc[locale] = {
      locale,
      milestones: buildBabyMilestones(locale), // Default to baby mode
      timeline: buildBabyTimeline(locale),
      pregnancyMilestones: buildPregnancyMilestones(locale),
      pregnancyTimeline: buildPregnancyTimeline(locale),
    };
    return acc;
  },
  {} as Record<Locale, LocaleMockData>,
);

export function getLocaleMockData(
  locale: Locale,
  mode: "pregnancy" | "baby" = "baby",
): LocaleMockData {
  const data = localeMocks[locale];

  if (mode === "pregnancy") {
    return {
      ...data,
      milestones: data.pregnancyMilestones,
      timeline: data.pregnancyTimeline,
    };
  }

  return data;
}

export function getAllLocaleMocks(): Record<Locale, LocaleMockData> {
  return localeMocks;
}
