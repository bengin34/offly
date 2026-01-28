export const supportedLocales = ["en", "de", "it", "fr", "es", "tr"] as const;
export type Locale = (typeof supportedLocales)[number];

export type TranslationParams = Record<string, string | number>;

type Translations = {
  common: {
    appName: string;
    done: string;
    cancel: string;
    delete: string;
    save: string;
    add: string;
    create: string;
    close: string;
    saving: string;
    creating: string;
    adding: string;
    entry: string;
    entries: string;
    memories: string;
    shareTrip: string;
  };
  shareDialog: {
    title: string;
    subtitle: string;
    hint: string;
    optionTextTitle: string;
    optionTextDescription: string;
    optionImageTitle: string;
    optionImageDescription: string;
    optionPdfTitle: string;
    optionPdfDescription: string;
    dialogTitleTrip: string;
    dialogTitleCityRecommendations: string;
    dialogTitleCityGuide: string;
    dialogTitleCard: string;
  };
  tabs: {
    chapters: string;
    trips: string;
    search: string;
    insights: string;
    settings: string;
  };
  navigation: {
    newChapter: string;
    chapter: string;
    editChapter: string;
    newTrip: string;
    trip: string;
    editTrip: string;
    newMemory: string;
    memory: string;
    editMemory: string;
    newEntry: string;
    entry: string;
    editEntry: string;
  };
  chapters: {
    addCover: string;
    days: string;
    emptyTitle: string;
    emptySubtitle: string;
    emptyButton: string;
  };
  trips: {
    addCover: string;
    days: string;
    emptyTitle: string;
    emptySubtitle: string;
    emptyButton: string;
  };
  settings: {
    preferences: string;
    appearance: string;
    language: string;
    chooseAppearance: string;
    chooseLanguage: string;
    exportSection: string;
    exportTitle: string;
    exportDescription: string;
    exportButton: string;
    exportButtonXls: string;
    exportOpenButton: string;
    exportInfoTitle: string;
    exportInfoDescription: string;
    exportPrivacyNote: string;
    exportPhotosNote: string;
    exportFormatsTitle: string;
    exportFormatsDescription: string;
    importSection: string;
    importTitle: string;
    importDescription: string;
    importButton: string;
    importButtonImporting: string;
    dataSection: string;
    dataTitle: string;
    dataDescription: string;
    dataButton: string;
    supportSection: string;
    supportRate: string;
    supportShare: string;
    supportContact: string;
    supportShareMessage: string;
    onboardingSection: string;
    onboardingTitle: string;
    onboardingDescription: string;
    onboardingButton: string;
    onboardingResetTitle: string;
    onboardingResetMessage: string;
    onboardingResetAction: string;
    aboutSection: string;
    version: string;
    storage: string;
    privacy: string;
    storageValue: string;
    privacyValue: string;
    footer: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
  };
  proBanner: {
    title: string;
    subtitle: string;
    cta: string;
    messages: Array<{
      title: string;
      subtitle: string;
    }>;
  };
  labels: {
    date: string;
    startDate: string;
    endDate: string;
  };
  placeholders: {
    search: string;
    tripTitle: string;
    tripSummary: string;
    chapterTitle: string;
    chapterDescription: string;
    entryTitlePlace: string;
    entryTitleMoment: string;
    memoryTitleMilestone: string;
    memoryTitleNote: string;
    entryNotes: string;
    cityListName: string;
    countryName: string;
  };
  chapterForm: {
    titleLabel: string;
    descriptionLabel: string;
    coverImageLabel: string;
    changeCover: string;
    addCoverPlaceholder: string;
  };
  tripForm: {
    titleLabel: string;
    summaryLabel: string;
    coverImageLabel: string;
    changeCover: string;
    addCoverPlaceholder: string;
  };
  memoryForm: {
    titleLabel: string;
    locationLabel: string;
    importanceLabel: string;
    descriptionLabel: string;
    tagsLabel: string;
    milestone: string;
    note: string;
  };
  entryForm: {
    titleLabel: string;
    ratingLabel: string;
    notesLabel: string;
    tagsLabel: string;
    photosLabel: string;
    gallery: string;
    camera: string;
    tapToAddTags: string;
    place: string;
    moment: string;
    moreTags: string;
    locationLabel: string;
    locationPlaceholder: string;
    locationHint: string;
  };
  memoryDetail: {
    descriptionTitle: string;
    tagsTitle: string;
  };
  entryDetail: {
    notesTitle: string;
    tagsTitle: string;
    allPhotos: string;
    created: string;
    updated: string;
    locationTitle: string;
    openInMaps: string;
  };
  chapterDetail: {
    noPhoto: string;
    notePill: string;
    uncategorized: string;
    emptyTitle: string;
    emptySubtitle: string;
    addFirstMemory: string;
    addMemory: string;
  };
  tripDetail: {
    noPhoto: string;
    notePill: string;
    uncategorized: string;
    emptyTitle: string;
    emptySubtitle: string;
    addFirstEntry: string;
    addEntry: string;
  };
  memories: {
    memory: string;
    milestone: string;
    note: string;
    notePill: string;
    noPhoto: string;
  };
  cityLists: {
    title: string;
    listNameLabel: string;
    listTypeLabel: string;
    countryLabel: string;
    typeCustom: string;
    typeCountry: string;
    typeHintCustom: string;
    typeHintCountry: string;
    emptyTitle: string;
    emptyDescription: string;
    createFirstList: string;
    progressVisited: string;
    detailProgress: string;
    detailEmptyTitle: string;
    detailEmptyDescription: string;
    detailAddCity: string;
    detailVisited: string;
    notFound: string;
    loading: string;
  };
  search: {
    emptyTitle: string;
    emptySubtitle: string;
    noResultsTitle: string;
    noResultsSubtitle: string;
    showLabel: string;
    memoryTypeLabel: string;
    minImportanceLabel: string;
    entryTypeLabel: string;
    minRatingLabel: string;
    tagsLabel: string;
    clearFilters: string;
    filterAll: string;
    filterChapters: string;
    filterMemories: string;
    filterTrips: string;
    filterEntries: string;
    filterAny: string;
    filterMilestones: string;
    filterNotes: string;
    filterPlaces: string;
    filterMoments: string;
    matchedIn: string;
    inChapter: string;
    inTrip: string;
    matchFieldTitle: string;
    matchFieldLocation: string;
    matchFieldSummary: string;
    matchFieldNotes: string;
    matchFieldTag: string;
    matchFieldCity: string;
  };
  insights: {
    sectionStats: string;
    statsChapters: string;
    statsMemories: string;
    statsTrips: string;
    statsEntries: string;
    statsCities: string;
    statsCountries: string;
    statsPhotos: string;
    statsImportant: string;
    statsTripDays: string;
    memoriesBreakdown: string;
    entriesBreakdown: string;
    highlightMostVisited: string;
    highlightFirstTrip: string;
    highlightFirstMemory: string;
    highlightAvgRating: string;
    highlightImportant: string;
    topTags: string;
    cityProgress: string;
    seeAll: string;
    createFirstCityList: string;
    cityListsEmptyHint: string;
    cityListCount: string;
    moreLists: string;
    achievements: string;
    viewAll: string;
    noBadgesEarned: string;
    badgesEmptyHint: string;
    moreBadges: string;
    badgesProgress: string;
  };
  badges: {
    earned: string;
    locked: string;
    allBadges: string;
    badgesEarned: string;
    special: string;
    tagAdventures: string;
    firstSteps: string;
    tripMilestones: string;
    placeMilestones: string;
    entryMilestones: string;
    countryMilestones: string;
    photoMilestones: string;
    cityMilestones: string;
    cityListAchievements: string;
    badgeUnlocked: string;
  };
  badgeDetail: {
    congratulations: string;
    earnedOn: string;
    notYetEarned: string;
  };
  badgeItems: Record<string, { title: string; description: string }>;
  tags: {
    quick: Record<string, string>;
  };
  dialogs: {
    tagPicker: {
      title: string;
      selected: string;
      addCustom: string;
      customPlaceholder: string;
      quickTags: string;
      yourTags: string;
    };
    cityPicker: {
      label: string;
      placeholder: string;
      title: string;
      addCity: string;
      cityNamePlaceholder: string;
      noCity: string;
      fromDate: string;
      untilDate: string;
    };
    cityEditor: {
      label: string;
      empty: string;
      addCity: string;
      editTitle: string;
      addTitle: string;
      cityNameLabel: string;
      cityNamePlaceholder: string;
      arrivalDateLabel: string;
      departureDateLabel: string;
      notSet: string;
      fromDate: string;
      untilDate: string;
      done: string;
    };
    cityList: {
      createTitle: string;
      addCityTitle: string;
      addCityPlaceholder: string;
      addCityButton: string;
      adding: string;
      linkTripTitle: string;
      noTripLinked: string;
    };
  };
  alerts: {
    exportFailedTitle: string;
    exportFailedMessage: string;
    importComplete: string;
    importCompletedWithErrors: string;
    importFailed: string;
    errorTitle: string;
    requiredTitle: string;
    invalidDateTitle: string;
    permissionTitle: string;
    deleteEntryTitle: string;
    deleteEntryMessage: string;
    deletePhotoTitle: string;
    deletePhotoMessage: string;
    deleteChapterTitle: string;
    deleteChapterMessage: string;
    deleteTripTitle: string;
    deleteTripMessage: string;
    deleteListTitle: string;
    deleteListMessage: string;
    deleteItemTitle: string;
    deleteItemMessage: string;
    deleteEntryFailed: string;
    deleteMemoryFailed: string;
    deletePhotoFailed: string;
    deleteChapterFailed: string;
    deleteTripFailed: string;
    deleteListFailed: string;
    createEntryFailed: string;
    updateEntryFailed: string;
    createChapterFailed: string;
    updateChapterFailed: string;
    createTripFailed: string;
    updateTripFailed: string;
    createCityListFailed: string;
    createCityFailed: string;
    addCityFailed: string;
    permissionCameraMessage: string;
    invalidDateMessage: string;
    entryDateOutOfRangeTitle: string;
    entryDateOutOfRangeMessage: string;
    requiredEntryTitle: string;
    requiredChapterTitle: string;
    requiredTripTitle: string;
    requiredTripCity: string;
    requiredListName: string;
    requiredCountry: string;
    requiredCityName: string;
    noProfileFound: string;
    nothingToShare: string;
    nothingToShareMessage: string;
    shareFailed: string;
    chapterLimitTitle: string;
    chapterLimitMessage: string;
    chapterLimitUpgrade: string;
    tripLimitTitle: string;
    tripLimitMessage: string;
    tripLimitUpgrade: string;
    backupReminderTitle: string;
    backupReminderMessage: string;
    backupReminderExport: string;
    backupReminderLater: string;
    proFeatureTitle: string;
    proFeatureExport: string;
    proFeatureAdvancedSearch: string;
    proFeatureDarkMode: string;
    purchasesUnavailableTitle: string;
    purchasesUnavailableMessage: string;
    purchasesNotReadyTitle: string;
    purchasesNotReadyMessage: string;
    purchasesNotConfiguredTitle: string;
    purchasesNotConfiguredMessage: string;
    restoreTitle: string;
    restoreSuccessMessage: string;
    restoreEmptyMessage: string;
    restoreFailedMessage: string;
  };
  limitations: {
    title: string;
    photosNotBundled: string;
    noCloudSync: string;
    freeTextCities: string;
    noAutoBackup: string;
  };
  onboarding: {
    screens: {
      photoOverload: {
        title: string;
        body: string;
      };
      structuredArchive: {
        title: string;
        body: string;
      };
      fastSearch: {
        title: string;
        body: string;
      };
      bestOfList: {
        title: string;
        body: string;
      };
      noCompetition: {
        title: string;
        body: string;
      };
      privateOffline: {
        title: string;
        body: string;
      };
      simpleStart: {
        title: string;
        body: string;
      };
    };
    createFirstTrip: string;
    next: string;
    skip: string;
    back: string;
  };
  shareContent: {
    locationLabel: string;
    summaryLabel: string;
    noEntries: string;
    otherEntries: string;
    sharedFrom: string;
    tripHighlights: string;
    cities: string;
    places: string;
    moments: string;
    moreItems: string;
    fromTrip: string;
    placesSection: string;
    otherPlaces: string;
    momentsSection: string;
    myRecommendations: string;
    from: string;
    other: string;
  };
};

const translations: Record<Locale, Translations> = {
  en: {
    common: {
      appName: "BabyLegacy",
      done: "Done",
      cancel: "Cancel",
      delete: "Delete",
      save: "Save",
      add: "Add",
      create: "Create",
      close: "Close",
      saving: "Saving...",
      creating: "Creating...",
      adding: "Adding...",
      entry: "memory",
      entries: "memories",
      memories: "Memories",
      shareTrip: "Share chapter",
    },
    shareDialog: {
      title: "Share {name}",
      subtitle: "Choose how you want to share this chapter",
      hint: "Your data stays private — sharing creates a local file",
      optionTextTitle: "Text List",
      optionTextDescription: "Simple text format, perfect for messaging apps",
      optionImageTitle: "Visual Card",
      optionImageDescription: "Beautiful card with your highlights",
      optionPdfTitle: "PDF Document",
      optionPdfDescription: "Full chapter with all details and notes",
      dialogTitleTrip: "Share {name} Chapter",
      dialogTitleCityRecommendations: "Share {name} Highlights",
      dialogTitleCityGuide: "Share {name} Chapter",
      dialogTitleCard: "Share {name} Card",
    },
    tabs: {
      chapters: "Chapters",
      trips: "Chapters",
      search: "Search",
      insights: "Insights",
      settings: "Settings",
    },
    navigation: {
      newChapter: "New Chapter",
      chapter: "Chapter",
      editChapter: "Edit Chapter",
      newTrip: "New Chapter",
      trip: "Chapter",
      editTrip: "Edit Chapter",
      newMemory: "New Memory",
      memory: "Memory",
      editMemory: "Edit Memory",
      newEntry: "New Memory",
      entry: "Memory",
      editEntry: "Edit Memory",
    },
    chapters: {
      addCover: "Add a cover",
      days: "{count} days",
      emptyTitle: "No chapters yet",
      emptySubtitle: "Start recording your baby's memories",
      emptyButton: "Create Your First Chapter",
    },
    trips: {
      addCover: "Add a cover",
      days: "{count} days",
      emptyTitle: "No chapters yet",
      emptySubtitle: "Start recording your baby's memories",
      emptyButton: "Create Your First Chapter",
    },
    settings: {
      preferences: "Preferences",
      appearance: "Appearance",
      language: "Language",
      chooseAppearance: "Choose Appearance",
      chooseLanguage: "Choose Language",
      exportSection: "Export",
      exportTitle: "Export All Data",
      exportDescription:
        "Download your chapters, memories, and tags as JSON or XLS",
      exportButton: "Export JSON",
      exportButtonXls: "Export XLS",
      exportOpenButton: "Open export options",
      exportInfoTitle: "Why export?",
      exportInfoDescription:
        "Keep a personal backup, move to a new phone, or analyze your memories in a spreadsheet. Exports stay on your device until you share them.",
      exportPrivacyNote:
        "Export files can include personal notes. Share carefully.",
      exportPhotosNote:
        "Photos are not included in exports.",
      exportFormatsTitle: "Choose a format",
      exportFormatsDescription:
        "JSON is best for backups and re-import. XLS opens easily in Excel or Google Sheets.",
      importSection: "Import",
      importTitle: "Import Data",
      importDescription: "Bring in your saved chapters and memories from a JSON file.",
      importButton: "Import JSON",
      importButtonImporting: "Importing...",
      dataSection: "Data",
      dataTitle: "Export & Import",
      dataDescription: "Back up or move your memories using export and import.",
      dataButton: "Show options",
      supportSection: "Support",
      supportRate: "Rate us 5 stars",
      supportShare: "Share the app",
      supportContact: "Contact us",
      supportShareMessage:
        "BabyLegacy - a private family memory archive I love: {link}",
      onboardingSection: "Onboarding",
      onboardingTitle: "Show onboarding again",
      onboardingDescription: "Replay the 7 screen introduction at any time.",
      onboardingButton: "Start onboarding",
      onboardingResetTitle: "Start onboarding?",
      onboardingResetMessage: "This will show the onboarding flow again. You can skip anytime.",
      onboardingResetAction: "Start",
      aboutSection: "About",
      version: "Version",
      storage: "Storage",
      privacy: "Privacy",
      storageValue: "Data stays on your device.",
      privacyValue: "Offline-first",
      footer: "BabyLegacy — your private family memory archive",
      themeLight: "Light",
      themeDark: "Dark",
      themeSystem: "System",
    },
    proBanner: {
      title: "Go Pro",
      subtitle: "Unlock all features.",
      cta: "Upgrade",
      messages: [
        {
          title: "Go Pro",
          subtitle: "Unlock all features.",
        },
        {
          title: "Less scrolling, more meaning",
          subtitle: "Find the moments that matter instantly.",
        },
        {
          title: "Remember everything",
          subtitle: "Keep the little moments safe.",
        },
        {
          title: "Your family archive",
          subtitle: "Instant recall for every chapter.",
        },
        {
          title: "Find it in seconds",
          subtitle: "Search memories by title, notes, or tags.",
        },
        {
          title: "Grow without limits",
          subtitle: "Unlimited chapters. Unlimited memories.",
        },
      ],
    },
    labels: {
      date: "Date",
      startDate: "Start Date",
      endDate: "End Date",
    },
    placeholders: {
      search: "Search chapters, memories, notes...",
      tripTitle: "e.g., First Year",
      tripSummary: "Brief description of this chapter...",
      chapterTitle: "e.g., 0–3 months",
      chapterDescription: "Short description of this chapter...",
      entryTitlePlace: "e.g., First smile",
      entryTitleMoment: "e.g., A quiet afternoon",
      memoryTitleMilestone: "First smile, First steps...",
      memoryTitleNote: "A quiet afternoon, Funny moment...",
      entryNotes: "Add details...",
      cityListName: "e.g., Milestone ideas, Family traditions",
      countryName: "e.g., Home, Grandma's house",
    },
    chapterForm: {
      titleLabel: "Chapter Title *",
      descriptionLabel: "Description (optional)",
      coverImageLabel: "Cover Image (optional)",
      changeCover: "Change",
      addCoverPlaceholder: "Tap to add cover image",
    },
    tripForm: {
      titleLabel: "Chapter Title *",
      summaryLabel: "Description (optional)",
      coverImageLabel: "Cover Image (optional)",
      changeCover: "Change",
      addCoverPlaceholder: "Tap to add cover image",
    },
    memoryForm: {
      titleLabel: "Title *",
      locationLabel: "Location",
      importanceLabel: "IMPORTANCE",
      descriptionLabel: "Description",
      tagsLabel: "Tags",
      milestone: "Milestone",
      note: "Note",
    },
    entryForm: {
      titleLabel: "Title *",
      ratingLabel: "Importance",
      notesLabel: "Notes",
      tagsLabel: "Tags",
      photosLabel: "Photos ({count}/{max})",
      gallery: "Gallery",
      camera: "Camera",
      tapToAddTags: "Tap to add tags...",
      place: "Milestone",
      moment: "Note",
      moreTags: "+{count} more",
      locationLabel: "Location",
      locationPlaceholder: "Add a place (optional)",
      locationHint: "Add a location if it helps the memory",
    },
    memoryDetail: {
      descriptionTitle: "Description",
      tagsTitle: "Tags",
    },
    entryDetail: {
      notesTitle: "Notes",
      tagsTitle: "Tags",
      allPhotos: "All Photos ({count})",
      created: "Created: {date}",
      updated: "Updated: {date}",
      locationTitle: "Location",
      openInMaps: "Open in Maps",
    },
    chapterDetail: {
      noPhoto: "No photo",
      notePill: "Note",
      uncategorized: "Uncategorized",
      emptyTitle: "No memories yet",
      emptySubtitle: "Start adding memories to this chapter",
      addFirstMemory: "Add Your First Memory",
      addMemory: "Add Memory",
    },
    tripDetail: {
      noPhoto: "No photo",
      notePill: "Note",
      uncategorized: "Uncategorized",
      emptyTitle: "No memories yet",
      emptySubtitle: "Start adding memories to this chapter",
      addFirstEntry: "Add Your First Memory",
      addEntry: "Add Memory",
    },
    memories: {
      memory: "Memory",
      milestone: "Milestone",
      note: "Note",
      notePill: "NOTE",
      noPhoto: "No photo",
    },
    cityLists: {
      title: "City Lists",
      listNameLabel: "List Name *",
      listTypeLabel: "List Type",
      countryLabel: "Country *",
      typeCustom: "Custom",
      typeCountry: "Country",
      typeHintCustom: "Create a custom list of any cities you want to track",
      typeHintCountry: "Create a list of cities within a specific country",
      emptyTitle: "No City Lists Yet",
      emptyDescription:
        "Create lists of cities you want to visit and track your progress",
      createFirstList: "Create Your First List",
      progressVisited: "{visited}/{total} visited ({percent}%)",
      detailProgress: "{visited} of {total} cities visited ({percent}%)",
      detailEmptyTitle: "No Cities Yet",
      detailEmptyDescription: "Add cities you want to visit and track your progress",
      detailAddCity: "Add City",
      detailVisited: "Visited",
      notFound: "City list not found",
      loading: "Loading...",
    },
    search: {
      emptyTitle: "Search your memories",
      emptySubtitle:
        "Find chapters and memories by title, description, notes, or tags",
      noResultsTitle: "No results found",
      noResultsSubtitle: "Try searching with different keywords",
      showLabel: "Show",
      memoryTypeLabel: "Memory Type",
      minImportanceLabel: "Min Importance",
      entryTypeLabel: "Memory Type",
      minRatingLabel: "Min Importance",
      tagsLabel: "Tags",
      clearFilters: "Clear filters",
      filterAll: "All",
      filterChapters: "Chapters",
      filterMemories: "Memories",
      filterTrips: "Chapters",
      filterEntries: "Memories",
      filterAny: "Any",
      filterMilestones: "Milestones",
      filterNotes: "Notes",
      filterPlaces: "Milestones",
      filterMoments: "Notes",
      matchedIn: "Matched in {field}:",
      inChapter: "in {chapter}",
      inTrip: "in {chapter}",
      matchFieldTitle: "title",
      matchFieldLocation: "location",
      matchFieldSummary: "description",
      matchFieldNotes: "notes",
      matchFieldTag: "tag",
      matchFieldCity: "city",
    },
    insights: {
      sectionStats: "Your Stats",
      statsChapters: "Chapters",
      statsMemories: "Memories",
      statsTrips: "Chapters",
      statsEntries: "Memories",
      statsCities: "Places",
      statsCountries: "Locations",
      statsPhotos: "Photos",
      statsImportant: "Important",
      statsTripDays: "Chapter Days",
      memoriesBreakdown: "{milestones} milestones, {notes} notes",
      entriesBreakdown: "{milestones} milestones, {notes} notes",
      highlightMostVisited: "Most Visited",
      highlightFirstTrip: "First Chapter",
      highlightFirstMemory: "First Memory",
      highlightAvgRating: "Avg Importance",
      highlightImportant: "Most Important",
      topTags: "Top Tags",
      cityProgress: "Milestone Lists",
      seeAll: "See All",
      createFirstCityList: "Create your first milestone list",
      cityListsEmptyHint: "Track milestones you want to capture",
      cityListCount: "{visited}/{total} items",
      moreLists: "+{count} more lists",
      achievements: "Achievements",
      viewAll: "View All",
      noBadgesEarned: "No badges earned yet",
      badgesEmptyHint: "Keep capturing memories to unlock achievements",
      moreBadges: "+{count} more badges",
      badgesProgress: "{unlocked} of {total} badges earned",
    },
    badges: {
      earned: "Earned",
      locked: "Locked",
      allBadges: "All Badges",
      badgesEarned: "Badges Earned",
      special: "Special",
      tagAdventures: "Tag Milestones",
      firstSteps: "First Steps",
      tripMilestones: "Chapter Milestones",
      placeMilestones: "Milestone Memories",
      entryMilestones: "Memory Milestones",
      countryMilestones: "Location Milestones",
      photoMilestones: "Photo Milestones",
      cityMilestones: "Location Milestones",
      cityListAchievements: "City List Achievements",
      badgeUnlocked: "Badge Unlocked!",
    },
    badgeDetail: {
      congratulations: "Congratulations!",
      earnedOn: "Earned on {date}",
      notYetEarned: "Not yet earned",
    },
    badgeItems: {
      first_trip: {
        title: "First Trip",
        description: "Created your first trip",
      },
      first_place: {
        title: "First Place",
        description: "Saved your first place",
      },
      first_moment: {
        title: "First Moment",
        description: "Captured your first moment",
      },
      first_tag: {
        title: "First Tag",
        description: "Created your first tag",
      },
      trips_3: {
        title: "Explorer",
        description: "Logged 5 trips",
      },
      trips_10: {
        title: "Adventurer",
        description: "Logged 15 trips",
      },
      trips_25: {
        title: "Globetrotter",
        description: "Logged 30 trips",
      },
      places_10: {
        title: "Place Hunter",
        description: "Saved 15 places",
      },
      places_25: {
        title: "Place Collector",
        description: "Saved 40 places",
      },
      places_100: {
        title: "Place Master",
        description: "Saved 150 places",
      },
      entries_25: {
        title: "Memory Keeper",
        description: "Created 40 entries",
      },
      entries_100: {
        title: "Historian",
        description: "Created 150 entries",
      },
      countries_3: {
        title: "Border Crosser",
        description: "Visited 5 countries",
      },
      countries_5: {
        title: "World Traveler",
        description: "Visited 8 countries",
      },
      countries_10: {
        title: "Continental",
        description: "Visited 15 countries",
      },
      photos_10: {
        title: "Shutterbug",
        description: "Captured 25 photos",
      },
      photos_50: {
        title: "Photographer",
        description: "Captured 100 photos",
      },
      photos_200: {
        title: "Photo Archivist",
        description: "Captured 400 photos",
      },
      cities_5: {
        title: "City Hopper",
        description: "Visited 10 cities",
      },
      cities_20: {
        title: "Urban Explorer",
        description: "Visited 40 cities",
      },
      tag_pizza: {
        title: "Pizza Pilgrim",
        description: "Logged 20 pizza entries",
      },
      tag_cafe: {
        title: "Cafe Regular",
        description: "Logged 25 cafe entries",
      },
      tag_museum: {
        title: "Museum Maven",
        description: "Logged 15 museum entries",
      },
      tag_beach: {
        title: "Beach Comber",
        description: "Logged 12 beach entries",
      },
      tag_nightlife: {
        title: "Night Owl",
        description: "Logged 12 nightlife entries",
      },
      tag_street_food: {
        title: "Street Food Legend",
        description: "Logged 25 street food entries",
      },
      tag_market: {
        title: "Market Maven",
        description: "Logged 12 market entries",
      },
      tag_temple: {
        title: "Temple Seeker",
        description: "Logged 10 temple entries",
      },
      historian: {
        title: "Historian",
        description: "Logged 40 entries from past travels",
      },
      weekend_warrior: {
        title: "Weekend Warrior",
        description: "Started 8 trips on a weekend",
      },
      weekend_master: {
        title: "Weekend Master",
        description: "Started 25 trips on a weekend",
      },
      long_haul: {
        title: "Long Haul",
        description: "Completed 5 trips of 7+ days",
      },
      marathon_traveler: {
        title: "Marathon Traveler",
        description: "Completed 15 trips of 7+ days",
      },
      quick_escape: {
        title: "Quick Escape",
        description: "Completed 5 trips of 2 days or less",
      },
      express_traveler: {
        title: "Express Traveler",
        description: "Completed 20 trips of 2 days or less",
      },
      critic: {
        title: "Critic",
        description: "Rated 20 entries",
      },
      taste_maker: {
        title: "Taste Maker",
        description: "Rated 100 entries",
      },
      five_star_finder: {
        title: "Five Star Finder",
        description: "Found 10 five-star experiences",
      },
      gold_standard: {
        title: "Gold Standard",
        description: "Found 40 five-star experiences",
      },
      high_standards: {
        title: "High Standards",
        description: "Maintain an average rating of 4+",
      },
      note_taker: {
        title: "Note Taker",
        description: "Added notes to 20 entries",
      },
      storyteller: {
        title: "Storyteller",
        description: "Added notes to 100 entries",
      },
      visual_logger: {
        title: "Visual Logger",
        description: "Added photos to 20 entries",
      },
      photo_journalist: {
        title: "Photo Journalist",
        description: "Added photos to 100 entries",
      },
      organizer: {
        title: "Organizer",
        description: "Tagged 20 entries",
      },
      master_organizer: {
        title: "Master Organizer",
        description: "Tagged 100 entries",
      },
      tag_creator: {
        title: "Tag Creator",
        description: "Created 20 unique tags",
      },
      taxonomy_expert: {
        title: "Taxonomy Expert",
        description: "Created 40 unique tags",
      },
      summer_lover: {
        title: "Summer Lover",
        description: "Took 5 trips in summer months",
      },
      sun_chaser: {
        title: "Sun Chaser",
        description: "Took 15 trips in summer months",
      },
      winter_explorer: {
        title: "Winter Explorer",
        description: "Took 5 trips in winter months",
      },
      frost_seeker: {
        title: "Frost Seeker",
        description: "Took 15 trips in winter months",
      },
      city_hopper_trip: {
        title: "City Hopper",
        description: "Completed 2 trips with 3+ cities",
      },
      grand_tour: {
        title: "Grand Tour",
        description: "Completed 10 trips with 3+ cities",
      },
      focused_traveler: {
        title: "Focused Traveler",
        description: "Completed 10 single-city trips",
      },
      deep_diver: {
        title: "Deep Diver",
        description: "Completed 25 single-city trips",
      },
      city_list_first: {
        title: "List Maker",
        description: "Created your first city list",
      },
      city_list_halfway: {
        title: "Halfway There",
        description: "Completed 50% of a city list",
      },
      city_list_complete: {
        title: "List Conqueror",
        description: "Completed a city list 100%",
      },
    },
    tags: {
      quick: {
        restaurant: "Restaurant",
        cafe: "Cafe",
        hotel: "Hotel",
        museum: "Museum",
        cityCenter: "City Center",
        beach: "Beach",
        sea: "Sea",
        park: "Park",
        shopping: "Shopping",
        bar: "Bar",
        landmark: "Landmark",
        mosque: "Mosque",
        ship: "Ship",
        temple: "Temple",
        market: "Market",
        nightlife: "Nightlife",
        nature: "Nature",
        adventure: "Adventure",
        localFood: "Local Food",
        streetFood: "Street Food",
        viewPoint: "View Point",
        historic: "Historic",
        art: "Art",
        transport: "Transport",
      },
    },
    dialogs: {
      tagPicker: {
        title: "Add Tags",
        selected: "Selected",
        addCustom: "Add Custom Tag",
        customPlaceholder: "Type a tag name...",
        quickTags: "Quick Tags",
        yourTags: "Your Tags",
      },
      cityPicker: {
        label: "City",
        placeholder: "Select a city",
        title: "Select City",
        addCity: "Add City",
        cityNamePlaceholder: "City name",
        noCity: "No city (uncategorized)",
        fromDate: "From {date}",
        untilDate: "Until {date}",
      },
      cityEditor: {
        label: "Cities",
        empty: "No cities added yet",
        addCity: "Add City",
        editTitle: "Edit City",
        addTitle: "Add City",
        cityNameLabel: "City Name *",
        cityNamePlaceholder: "e.g., Rome, Florence",
        arrivalDateLabel: "Arrival Date (optional)",
        departureDateLabel: "Departure Date (optional)",
        notSet: "Not set",
        fromDate: "From {date}",
        untilDate: "Until {date}",
        done: "Done",
      },
      cityList: {
        createTitle: "New City List",
        addCityTitle: "Add City",
        addCityPlaceholder: "City name",
        addCityButton: "Add City",
        adding: "Adding...",
        linkTripTitle: "Link to Trip (Optional)",
        noTripLinked: "No trip linked",
      },
    },
    alerts: {
      exportFailedTitle: "Export Failed",
      exportFailedMessage: "Unable to export data. Please try again.",
      importComplete: "Import complete",
      importCompletedWithErrors: "Import completed with some issues",
      importFailed: "Import failed. Please try again.",
      errorTitle: "Error",
      requiredTitle: "Required",
      invalidDateTitle: "Invalid Date",
      permissionTitle: "Permission needed",
      deleteEntryTitle: "Delete Memory",
      deleteEntryMessage: "Are you sure you want to delete this memory?",
      deletePhotoTitle: "Delete Photo",
      deletePhotoMessage: "Are you sure you want to delete this photo?",
      deleteChapterTitle: "Delete Chapter",
      deleteChapterMessage:
        "Are you sure you want to delete this chapter? This will also delete all memories.",
      deleteTripTitle: "Delete Chapter",
      deleteTripMessage:
        "Are you sure you want to delete this chapter? This will also delete all memories.",
      deleteListTitle: "Delete List",
      deleteListMessage:
        "Are you sure you want to delete \"{name}\"? This will also delete all cities in this list.",
      deleteItemTitle: "Delete {item}",
      deleteItemMessage: "Are you sure you want to delete this {item}?",
      deleteEntryFailed: "Failed to delete memory",
      deleteMemoryFailed: "Failed to delete memory",
      deletePhotoFailed: "Failed to delete photo",
      deleteChapterFailed: "Failed to delete chapter",
      deleteTripFailed: "Failed to delete chapter",
      deleteListFailed: "Failed to delete list",
      createEntryFailed: "Failed to create entry. Please try again.",
      updateEntryFailed: "Failed to update entry. Please try again.",
      createChapterFailed: "Failed to create chapter. Please try again.",
      updateChapterFailed: "Failed to update chapter. Please try again.",
      createTripFailed: "Failed to create chapter. Please try again.",
      updateTripFailed: "Failed to update chapter. Please try again.",
      createCityListFailed: "Failed to create city list. Please try again.",
      createCityFailed: "Failed to create city. Please try again.",
      addCityFailed: "Failed to add city",
      permissionCameraMessage: "Camera access is required to take photos",
      invalidDateMessage: "End date cannot be before start date",
      entryDateOutOfRangeTitle: "Date out of range",
      entryDateOutOfRangeMessage: "Entry date must be between {start} and {end}.",
      requiredEntryTitle: "Please enter a title",
      requiredChapterTitle: "Please enter a chapter title",
      requiredTripTitle: "Please enter a chapter title",
      requiredTripCity: "Please add at least one city",
      requiredListName: "Please enter a list name",
      requiredCountry: "Please enter a country name",
      requiredCityName: "Please enter a city name",
      noProfileFound: "No baby profile found. Please create one first.",
      nothingToShare: "Nothing to Share",
      nothingToShareMessage: "This city has no entries to share yet.",
      shareFailed: "Failed to share. Please try again.",
      chapterLimitTitle: "Chapter Limit Reached",
      chapterLimitMessage:
        "Free users can create up to {limit} chapters. Upgrade to Pro for unlimited chapters.",
      chapterLimitUpgrade: "Upgrade to Pro",
      tripLimitTitle: "Chapter Limit Reached",
      tripLimitMessage:
        "Free users can create up to {limit} chapters. Upgrade to Pro for unlimited chapters.",
      tripLimitUpgrade: "Upgrade to Pro",
      backupReminderTitle: "Back Up Your Memories",
      backupReminderMessage:
        "You've created {count} chapters! Consider exporting your data to keep it safe.",
      backupReminderExport: "Export Now",
      backupReminderLater: "Later",
      proFeatureTitle: "Pro Feature",
      proFeatureExport: "Export is a Pro feature. Upgrade to export your data.",
      proFeatureAdvancedSearch: "Advanced search filters are a Pro feature.",
      proFeatureDarkMode: "Dark mode is a Pro feature. Upgrade to unlock all themes.",
      purchasesUnavailableTitle: "Purchases unavailable",
      purchasesUnavailableMessage: "Purchases are not available in this build.",
      purchasesNotReadyTitle: "Purchases not ready",
      purchasesNotReadyMessage: "Please try again in a moment.",
      purchasesNotConfiguredTitle: "Purchases unavailable",
      purchasesNotConfiguredMessage: "RevenueCat is not configured yet.",
      restoreTitle: "Restore",
      restoreSuccessMessage: "Your purchases were restored successfully.",
      restoreEmptyMessage: "No active subscriptions to restore.",
      restoreFailedMessage: "Restore failed. Please try again.",
    },
    limitations: {
      title: "Good to Know",
      photosNotBundled:
        "Photos are not included in exports - only references to local files",
      noCloudSync: "All data is stored locally on your device only",
      freeTextCities:
        "Milestone list names are free text — duplicates are treated as separate lists",
      noAutoBackup: "No automatic backups - remember to export your data regularly",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Stop digging through photo folders",
          body: "Memories get lost in thousands of pictures. Keep the moments and details in one calm archive.",
        },
        structuredArchive: {
          title: "Your baby's story, organized",
          body: "Create a chapter, then add milestones and notes. Everything stays structured and easy to revisit.",
        },
        fastSearch: {
          title: "Find it in seconds",
          body: "Search across chapters, milestones, and notes — instantly.",
        },
        bestOfList: {
          title: "Capture the meaningful moments",
          body: "Mark important memories and add short notes to find them later.",
        },
        noCompetition: {
          title: "No feed. No competition.",
          body: "This is your private archive. Your memories — only for you.",
        },
        privateOffline: {
          title: "Private and offline-first",
          body: "No account required. Your data stays on your device and works even when you’re offline.",
        },
        simpleStart: {
          title: "Start your first chapter now",
          body: "Create a chapter in seconds and add your first memory. You can build details over time.",
        },
      },
      createFirstTrip: "Create your first chapter",
      next: "Next",
      skip: "Skip",
      back: "Back",
    },
    shareContent: {
      locationLabel: "Location",
      summaryLabel: "Summary",
      noEntries: "No entries",
      otherEntries: "Other Entries",
      sharedFrom: "Shared from BabyLegacy",
      tripHighlights: "Chapter Highlights",
      cities: "Locations",
      places: "Milestones",
      moments: "Notes",
      moreItems: "+ {count} more",
      fromTrip: "From chapter",
      placesSection: "MILESTONES",
      otherPlaces: "OTHER MILESTONES",
      momentsSection: "NOTES",
      myRecommendations: "My Highlights",
      from: "From",
      other: "Other",
    },
  },
  de: {
    common: {
      appName: "BabyLegacy",
      done: "Fertig",
      cancel: "Abbrechen",
      delete: "Löschen",
      save: "Speichern",
      add: "Hinzufügen",
      create: "Erstellen",
      close: "Schließen",
      saving: "Wird gespeichert...",
      creating: "Wird erstellt...",
      adding: "Wird hinzugefügt...",
      entry: "Erinnerung",
      entries: "Erinnerungen",
      memories: "Erinnerungen",
      shareTrip: "Kapitel teilen",
    },
    shareDialog: {
      title: "{name} teilen",
      subtitle: "Wähle aus, wie du dieses Kapitel teilen möchtest",
      hint: "Deine Daten bleiben privat — beim Teilen wird eine lokale Datei erstellt",
      optionTextTitle: "Textliste",
      optionTextDescription: "Einfaches Textformat, ideal für Messenger",
      optionImageTitle: "Visuelle Karte",
      optionImageDescription: "Schöne Karte mit deinen Highlights",
      optionPdfTitle: "PDF-Dokument",
      optionPdfDescription: "Vollständiges Kapitel mit allen Details und Notizen",
      dialogTitleTrip: "Kapitel {name} teilen",
      dialogTitleCityRecommendations: "{name}-Highlights teilen",
      dialogTitleCityGuide: "Kapitel {name} teilen",
      dialogTitleCard: "{name}-Karte teilen",
    },
    tabs: {
      chapters: "Kapitel",
      trips: "Kapitel",
      search: "Suche",
      insights: "Einblicke",
      settings: "Einstellungen",
    },
    navigation: {
      newChapter: "Neues Kapitel",
      chapter: "Kapitel",
      editChapter: "Kapitel bearbeiten",
      newTrip: "Neues Kapitel",
      trip: "Kapitel",
      editTrip: "Kapitel bearbeiten",
      newMemory: "Neue Erinnerung",
      memory: "Erinnerung",
      editMemory: "Erinnerung bearbeiten",
      newEntry: "Neue Erinnerung",
      entry: "Erinnerung",
      editEntry: "Erinnerung bearbeiten",
    },
    chapters: {
      addCover: "Titelbild hinzufügen",
      days: "{count} Tage",
      emptyTitle: "Noch keine Kapitel",
      emptySubtitle: "Beginne, die Erinnerungen deines Babys festzuhalten",
      emptyButton: "Erstes Kapitel erstellen",
    },
    trips: {
      addCover: "Titelbild hinzufügen",
      days: "{count} Tage",
      emptyTitle: "Noch keine Kapitel",
      emptySubtitle: "Beginne, die Erinnerungen deines Babys festzuhalten",
      emptyButton: "Erstes Kapitel erstellen",
    },
    settings: {
      preferences: "Präferenzen",
      appearance: "Erscheinungsbild",
      language: "Sprache",
      chooseAppearance: "Erscheinungsbild wählen",
      chooseLanguage: "Sprache wählen",
      exportSection: "Export",
      exportTitle: "Alle Daten exportieren",
      exportDescription:
        "Lade deine Kapitel, Erinnerungen und Tags als JSON oder XLS herunter",
      exportButton: "JSON exportieren",
      exportButtonXls: "XLS exportieren",
      exportOpenButton: "Exportoptionen öffnen",
      exportInfoTitle: "Warum exportieren?",
      exportInfoDescription:
        "Erstelle ein persönliches Backup, wechsle auf ein neues Gerät oder analysiere deine Erinnerungen in einer Tabelle. Exporte bleiben auf deinem Gerät, bis du sie teilst.",
      exportPrivacyNote:
        "Exportdateien können persönliche Notizen enthalten. Bitte vorsichtig teilen.",
      exportPhotosNote:
        "Fotos werden nicht exportiert.",
      exportFormatsTitle: "Format auswählen",
      exportFormatsDescription:
        "JSON eignet sich für Backups und Re-Import. XLS lässt sich leicht in Excel oder Google Sheets öffnen.",
      importSection: "Import",
      importTitle: "Daten importieren",
      importDescription: "Importiere deine gespeicherten Kapitel und Erinnerungen aus einer JSON-Datei.",
      importButton: "JSON importieren",
      importButtonImporting: "Importiere...",
      dataSection: "Daten",
      dataTitle: "Export & Import",
      dataDescription: "Sichere oder übertrage deine Erinnerungen per Export/Import.",
      dataButton: "Optionen anzeigen",
      supportSection: "Support",
      supportRate: "Gib uns 5 Sterne",
      supportShare: "App teilen",
      supportContact: "Kontakt",
      supportShareMessage:
        "BabyLegacy - ein privates Familienarchiv, das ich liebe: {link}",
      onboardingSection: "Einführung",
      onboardingTitle: "Einführung erneut anzeigen",
      onboardingDescription: "Spiele die Einführung mit 7 Screens jederzeit erneut ab.",
      onboardingButton: "Einführung starten",
      onboardingResetTitle: "Einführung starten?",
      onboardingResetMessage: "Dadurch wird die Einführung erneut angezeigt. Du kannst jederzeit überspringen.",
      onboardingResetAction: "Starten",
      aboutSection: "Über",
      version: "Version",
      storage: "Speicher",
      privacy: "Datenschutz",
      storageValue: "Daten bleiben auf deinem Gerät.",
      privacyValue: "Offline-first",
      footer: "BabyLegacy — dein privates Familienarchiv",
      themeLight: "Hell",
      themeDark: "Dunkel",
      themeSystem: "System",
    },
    proBanner: {
      title: "Pro freischalten",
      subtitle: "Schalte alle Funktionen frei.",
      cta: "Upgrade",
      messages: [
        { title: "Pro freischalten", subtitle: "Schalte alle Funktionen frei." },
        { title: "Weniger Scrollen, mehr Bedeutung", subtitle: "Finde die wichtigsten Momente sofort." },
        { title: "Alles festhalten", subtitle: "Bewahre die kleinen Momente sicher auf." },
        { title: "Dein Familienarchiv", subtitle: "Sofortiger Zugriff auf jedes Kapitel." },
        { title: "In Sekunden finden", subtitle: "Suche nach Titeln, Notizen oder Tags." },
        { title: "Wachse ohne Limits", subtitle: "Unbegrenzte Kapitel. Unbegrenzte Erinnerungen." },
      ],
    },
    labels: {
      date: "Datum",
      startDate: "Startdatum",
      endDate: "Enddatum",
    },
    placeholders: {
      search: "Kapitel, Erinnerungen, Notizen suchen...",
      tripTitle: "z. B. Erstes Jahr",
      tripSummary: "Kurze Beschreibung dieses Kapitels...",
      chapterTitle: "z. B. 0–3 Monate",
      chapterDescription: "Kurze Beschreibung dieses Kapitels...",
      entryTitlePlace: "z. B. Erstes Lächeln",
      entryTitleMoment: "z. B. Ein ruhiger Nachmittag",
      memoryTitleMilestone: "Erstes Lächeln, Erste Schritte...",
      memoryTitleNote: "Ein ruhiger Nachmittag, Lustiger Moment...",
      entryNotes: "Details hinzufügen...",
      cityListName: "z. B. Meilensteine, Familientraditionen",
      countryName: "z. B. Zuhause, bei Oma",
    },
    chapterForm: {
      titleLabel: "Kapitel-Titel *",
      descriptionLabel: "Beschreibung (optional)",
      coverImageLabel: "Titelbild (optional)",
      changeCover: "Ändern",
      addCoverPlaceholder: "Tippe, um ein Titelbild hinzuzufügen",
    },
    tripForm: {
      titleLabel: "Kapitel-Titel *",
      summaryLabel: "Beschreibung (optional)",
      coverImageLabel: "Titelbild (optional)",
      changeCover: "Ändern",
      addCoverPlaceholder: "Tippe, um ein Titelbild hinzuzufügen",
    },
    memoryForm: {
      titleLabel: "Titel *",
      locationLabel: "Ort",
      importanceLabel: "WICHTIGKEIT",
      descriptionLabel: "Beschreibung",
      tagsLabel: "Tags",
      milestone: "Meilenstein",
      note: "Notiz",
    },
    entryForm: {
      titleLabel: "Titel *",
      ratingLabel: "Wichtigkeit",
      notesLabel: "Notizen",
      tagsLabel: "Tags",
      photosLabel: "Fotos ({count}/{max})",
      gallery: "Galerie",
      camera: "Kamera",
      tapToAddTags: "Tippe, um Tags hinzuzufügen...",
      place: "Meilenstein",
      moment: "Notiz",
      moreTags: "+{count} mehr",
      locationLabel: "Ort",
      locationPlaceholder: "Optionalen Ort hinzufügen",
      locationHint: "Füge einen Ort hinzu, wenn er hilft",
    },
    memoryDetail: {
      descriptionTitle: "Beschreibung",
      tagsTitle: "Tags",
    },
    entryDetail: {
      notesTitle: "Notizen",
      tagsTitle: "Tags",
      allPhotos: "Alle Fotos ({count})",
      created: "Erstellt: {date}",
      updated: "Aktualisiert: {date}",
      locationTitle: "Standort",
      openInMaps: "In Karten öffnen",
    },
    chapterDetail: {
      noPhoto: "Kein Foto",
      notePill: "Notiz",
      uncategorized: "Ohne Kategorie",
      emptyTitle: "Noch keine Erinnerungen",
      emptySubtitle: "Beginne, Erinnerungen zu diesem Kapitel hinzuzufügen",
      addFirstMemory: "Erste Erinnerung hinzufügen",
      addMemory: "Erinnerung hinzufügen",
    },
    tripDetail: {
      noPhoto: "Kein Foto",
      notePill: "Notiz",
      uncategorized: "Ohne Kategorie",
      emptyTitle: "Noch keine Erinnerungen",
      emptySubtitle: "Beginne, Erinnerungen zu diesem Kapitel hinzuzufügen",
      addFirstEntry: "Erste Erinnerung hinzufügen",
      addEntry: "Erinnerung hinzufügen",
    },
    memories: {
      memory: "Erinnerung",
      milestone: "Meilenstein",
      note: "Notiz",
      notePill: "NOTIZ",
      noPhoto: "Kein Foto",
    },
    cityLists: {
      title: "Stadtlisten",
      listNameLabel: "Listenname *",
      listTypeLabel: "Listentyp",
      countryLabel: "Land *",
      typeCustom: "Benutzerdefiniert",
      typeCountry: "Land",
      typeHintCustom: "Erstelle eine benutzerdefinierte Liste mit Städten, die du verfolgen möchtest",
      typeHintCountry: "Erstelle eine Liste von Städten in einem bestimmten Land",
      emptyTitle: "Noch keine Stadtlisten",
      emptyDescription:
        "Erstelle Listen mit Städten, die du besuchen möchtest, und verfolge deinen Fortschritt",
      createFirstList: "Erste Liste erstellen",
      progressVisited: "{visited}/{total} besucht ({percent}%)",
      detailProgress: "{visited} von {total} Städten besucht ({percent}%)",
      detailEmptyTitle: "Noch keine Städte",
      detailEmptyDescription:
        "Füge Städte hinzu, die du besuchen möchtest, und verfolge deinen Fortschritt",
      detailAddCity: "Stadt hinzufügen",
      detailVisited: "Besucht",
      notFound: "Stadtliste nicht gefunden",
      loading: "Wird geladen...",
    },
    search: {
      emptyTitle: "Durchsuche deine Erinnerungen",
      emptySubtitle:
        "Finde Kapitel und Erinnerungen nach Titel, Beschreibung, Notizen oder Tags",
      noResultsTitle: "Keine Ergebnisse gefunden",
      noResultsSubtitle: "Versuche andere Suchbegriffe",
      showLabel: "Anzeigen",
      memoryTypeLabel: "Erinnerungstyp",
      minImportanceLabel: "Min. Wichtigkeit",
      entryTypeLabel: "Erinnerungstyp",
      minRatingLabel: "Min. Wichtigkeit",
      tagsLabel: "Tags",
      clearFilters: "Filter zurücksetzen",
      filterAll: "Alle",
      filterChapters: "Kapitel",
      filterMemories: "Erinnerungen",
      filterTrips: "Kapitel",
      filterEntries: "Erinnerungen",
      filterAny: "Beliebig",
      filterMilestones: "Meilensteine",
      filterNotes: "Notizen",
      filterPlaces: "Meilensteine",
      filterMoments: "Notizen",
      matchedIn: "Gefunden in {field}:",
      inChapter: "in {chapter}",
      inTrip: "in {chapter}",
      matchFieldTitle: "Titel",
      matchFieldLocation: "Ort",
      matchFieldSummary: "Beschreibung",
      matchFieldNotes: "Notizen",
      matchFieldTag: "Tag",
      matchFieldCity: "Stadt",
    },
    insights: {
      sectionStats: "Deine Statistiken",
      statsChapters: "Kapitel",
      statsMemories: "Erinnerungen",
      statsTrips: "Kapitel",
      statsEntries: "Erinnerungen",
      statsCities: "Orte",
      statsCountries: "Standorte",
      statsPhotos: "Fotos",
      statsImportant: "Wichtig",
      statsTripDays: "Kapitel-Tage",
      memoriesBreakdown: "{milestones} Meilensteine, {notes} Notizen",
      entriesBreakdown: "{milestones} Meilensteine, {notes} Notizen",
      highlightMostVisited: "Am häufigsten besucht",
      highlightFirstTrip: "Erstes Kapitel",
      highlightFirstMemory: "Erste Erinnerung",
      highlightAvgRating: "Ø Wichtigkeit",
      highlightImportant: "Am wichtigsten",
      topTags: "Top-Tags",
      cityProgress: "Meilenstein-Listen",
      seeAll: "Alle ansehen",
      createFirstCityList: "Erstelle deine erste Meilenstein-Liste",
      cityListsEmptyHint: "Verfolge Meilensteine, die du festhalten möchtest",
      cityListCount: "{visited}/{total} Einträge",
      moreLists: "+{count} weitere Listen",
      achievements: "Erfolge",
      viewAll: "Alle anzeigen",
      noBadgesEarned: "Noch keine Abzeichen verdient",
      badgesEmptyHint: "Halte Erinnerungen fest, um Erfolge freizuschalten",
      moreBadges: "+{count} weitere Abzeichen",
      badgesProgress: "{unlocked} von {total} Abzeichen verdient",
    },
    badges: {
      earned: "Verdient",
      locked: "Gesperrt",
      allBadges: "Alle Abzeichen",
      badgesEarned: "Verdiente Abzeichen",
      special: "Spezial",
      tagAdventures: "Tag-Meilensteine",
      firstSteps: "Erste Schritte",
      tripMilestones: "Kapitel-Meilensteine",
      placeMilestones: "Meilenstein-Erinnerungen",
      entryMilestones: "Erinnerungs-Meilensteine",
      countryMilestones: "Standort-Meilensteine",
      photoMilestones: "Foto-Meilensteine",
      cityMilestones: "Standort-Meilensteine",
      cityListAchievements: "Stadtlisten-Erfolge",
      badgeUnlocked: "Abzeichen freigeschaltet!",
    },
    badgeDetail: {
      congratulations: "Glückwunsch!",
      earnedOn: "Verdient am {date}",
      notYetEarned: "Noch nicht verdient",
    },
    badgeItems: {
      first_trip: {
        title: "Erste Reise",
        description: "Erste Reise erstellt",
      },
      first_place: {
        title: "Erster Ort",
        description: "Deinen ersten Ort gespeichert",
      },
      first_moment: {
        title: "Erster Moment",
        description: "Deinen ersten Moment festgehalten",
      },
      first_tag: {
        title: "Erstes Schlagwort",
        description: "Dein erstes Schlagwort erstellt",
      },
      trips_3: {
        title: "Entdecker",
        description: "5 Reisen protokolliert",
      },
      trips_10: {
        title: "Abenteurer",
        description: "15 Reisen protokolliert",
      },
      trips_25: {
        title: "Weltenbummler",
        description: "30 Reisen protokolliert",
      },
      places_10: {
        title: "Orte-Jäger",
        description: "15 Orte gespeichert",
      },
      places_25: {
        title: "Orte-Sammler",
        description: "40 Orte gespeichert",
      },
      places_100: {
        title: "Orte-Meister",
        description: "150 Orte gespeichert",
      },
      entries_25: {
        title: "Erinnerungshüter",
        description: "40 Einträge erstellt",
      },
      entries_100: {
        title: "Historiker",
        description: "150 Einträge erstellt",
      },
      countries_3: {
        title: "Grenzgänger",
        description: "5 Länder besucht",
      },
      countries_5: {
        title: "Weltreisender",
        description: "8 Länder besucht",
      },
      countries_10: {
        title: "Kontinental",
        description: "15 Länder besucht",
      },
      photos_10: {
        title: "Knipser",
        description: "25 Fotos aufgenommen",
      },
      photos_50: {
        title: "Fotograf",
        description: "100 Fotos aufgenommen",
      },
      photos_200: {
        title: "Foto-Archivar",
        description: "400 Fotos aufgenommen",
      },
      cities_5: {
        title: "Städtehopper",
        description: "10 Städte besucht",
      },
      cities_20: {
        title: "Stadtentdecker",
        description: "40 Städte besucht",
      },
      tag_pizza: {
        title: "Pizza-Pilger",
        description: "20 Pizza-Einträge protokolliert",
      },
      tag_cafe: {
        title: "Café-Stammgast",
        description: "25 Café-Einträge protokolliert",
      },
      tag_museum: {
        title: "Museum-Experte",
        description: "15 Museum-Einträge protokolliert",
      },
      tag_beach: {
        title: "Strandläufer",
        description: "12 Strand-Einträge protokolliert",
      },
      tag_nightlife: {
        title: "Nachtmensch",
        description: "12 Nachtleben-Einträge protokolliert",
      },
      tag_street_food: {
        title: "Streetfood-Legende",
        description: "25 Streetfood-Einträge protokolliert",
      },
      tag_market: {
        title: "Markt-Experte",
        description: "12 Markt-Einträge protokolliert",
      },
      tag_temple: {
        title: "Tempel-Sucher",
        description: "10 Tempel-Einträge protokolliert",
      },
      historian: {
        title: "Historiker",
        description: "40 Einträge aus früheren Reisen protokolliert",
      },
      weekend_warrior: {
        title: "Wochenendkrieger",
        description: "8 Reisen am Wochenende gestartet",
      },
      weekend_master: {
        title: "Wochenendmeister",
        description: "25 Reisen am Wochenende gestartet",
      },
      long_haul: {
        title: "Langstreckenreisender",
        description: "5 Reisen mit 7+ Tagen abgeschlossen",
      },
      marathon_traveler: {
        title: "Marathonreisender",
        description: "15 Reisen mit 7+ Tagen abgeschlossen",
      },
      quick_escape: {
        title: "Kurztrip",
        description: "5 Reisen mit 2 Tagen oder weniger abgeschlossen",
      },
      express_traveler: {
        title: "Expressreisender",
        description: "20 Reisen mit 2 Tagen oder weniger abgeschlossen",
      },
      critic: {
        title: "Kritiker",
        description: "20 Einträge bewertet",
      },
      taste_maker: {
        title: "Geschmacksmacher",
        description: "100 Einträge bewertet",
      },
      five_star_finder: {
        title: "Fünf-Sterne-Finder",
        description: "10 Fünf-Sterne-Erlebnisse gefunden",
      },
      gold_standard: {
        title: "Goldstandard",
        description: "40 Fünf-Sterne-Erlebnisse gefunden",
      },
      high_standards: {
        title: "Hohe Ansprüche",
        description: "Durchschnittsbewertung von 4+ halten",
      },
      note_taker: {
        title: "Notizenschreiber",
        description: "Notizen zu 20 Einträgen hinzugefügt",
      },
      storyteller: {
        title: "Geschichtenerzähler",
        description: "Notizen zu 100 Einträgen hinzugefügt",
      },
      visual_logger: {
        title: "Bildchronist",
        description: "Fotos zu 20 Einträgen hinzugefügt",
      },
      photo_journalist: {
        title: "Fotojournalist",
        description: "Fotos zu 100 Einträgen hinzugefügt",
      },
      organizer: {
        title: "Organisator",
        description: "20 Einträge getaggt",
      },
      master_organizer: {
        title: "Meister-Organisator",
        description: "100 Einträge getaggt",
      },
      tag_creator: {
        title: "Tag-Ersteller",
        description: "20 einzigartige Tags erstellt",
      },
      taxonomy_expert: {
        title: "Taxonomie-Experte",
        description: "40 einzigartige Tags erstellt",
      },
      summer_lover: {
        title: "Sommerliebhaber",
        description: "5 Reisen in den Sommermonaten gemacht",
      },
      sun_chaser: {
        title: "Sonnenjäger",
        description: "15 Reisen in den Sommermonaten gemacht",
      },
      winter_explorer: {
        title: "Winterentdecker",
        description: "5 Reisen in den Wintermonaten gemacht",
      },
      frost_seeker: {
        title: "Frostjäger",
        description: "15 Reisen in den Wintermonaten gemacht",
      },
      city_hopper_trip: {
        title: "Städtehopper",
        description: "2 Reisen mit 3+ Städten abgeschlossen",
      },
      grand_tour: {
        title: "Große Tour",
        description: "10 Reisen mit 3+ Städten abgeschlossen",
      },
      focused_traveler: {
        title: "Fokussierter Reisender",
        description: "10 Ein-Stadt-Reisen abgeschlossen",
      },
      deep_diver: {
        title: "Tiefentaucher",
        description: "25 Ein-Stadt-Reisen abgeschlossen",
      },
      city_list_first: {
        title: "Listenmacher",
        description: "Deine erste Stadtliste erstellt",
      },
      city_list_halfway: {
        title: "Halbzeit",
        description: "50% einer Stadtliste abgeschlossen",
      },
      city_list_complete: {
        title: "Listenbezwinger",
        description: "Eine Stadtliste zu 100% abgeschlossen",
      },
    },
    tags: {
      quick: {
        restaurant: "Restaurant",
        cafe: "Café",
        hotel: "Hotel",
        museum: "Museum",
        cityCenter: "Stadtzentrum",
        beach: "Strand",
        sea: "Meer",
        park: "Park",
        shopping: "Einkaufen",
        bar: "Bar",
        landmark: "Sehenswürdigkeit",
        mosque: "Moschee",
        ship: "Schiff",
        temple: "Tempel",
        market: "Markt",
        nightlife: "Nachtleben",
        nature: "Natur",
        adventure: "Abenteuer",
        localFood: "Lokale Küche",
        streetFood: "Streetfood",
        viewPoint: "Aussichtspunkt",
        historic: "Historisch",
        art: "Kunst",
        transport: "Transport",
      },
    },
    dialogs: {
      tagPicker: {
        title: "Tags hinzufügen",
        selected: "Ausgewählt",
        addCustom: "Benutzerdefiniertes Tag hinzufügen",
        customPlaceholder: "Tag-Namen eingeben...",
        quickTags: "Schnell-Tags",
        yourTags: "Deine Tags",
      },
      cityPicker: {
        label: "Stadt",
        placeholder: "Stadt auswählen",
        title: "Stadt auswählen",
        addCity: "Stadt hinzufügen",
        cityNamePlaceholder: "Stadtname",
        noCity: "Keine Stadt (nicht zugeordnet)",
        fromDate: "Ab {date}",
        untilDate: "Bis {date}",
      },
      cityEditor: {
        label: "Städte",
        empty: "Noch keine Städte hinzugefügt",
        addCity: "Stadt hinzufügen",
        editTitle: "Stadt bearbeiten",
        addTitle: "Stadt hinzufügen",
        cityNameLabel: "Stadtname *",
        cityNamePlaceholder: "z. B. Rom, Florenz",
        arrivalDateLabel: "Ankunftsdatum (optional)",
        departureDateLabel: "Abreisedatum (optional)",
        notSet: "Nicht festgelegt",
        fromDate: "Ab {date}",
        untilDate: "Bis {date}",
        done: "Fertig",
      },
      cityList: {
        createTitle: "Neue Stadtliste",
        addCityTitle: "Stadt hinzufügen",
        addCityPlaceholder: "Stadtname",
        addCityButton: "Stadt hinzufügen",
        adding: "Wird hinzugefügt...",
        linkTripTitle: "Mit Reise verknüpfen (optional)",
        noTripLinked: "Keine Reise verknüpft",
      },
    },
    alerts: {
      exportFailedTitle: "Export fehlgeschlagen",
      exportFailedMessage: "Export nicht möglich. Bitte versuche es erneut.",
      importComplete: "Import abgeschlossen",
      importCompletedWithErrors: "Import mit einigen Problemen abgeschlossen",
      importFailed: "Import fehlgeschlagen. Bitte versuche es erneut.",
      errorTitle: "Fehler",
      requiredTitle: "Erforderlich",
      invalidDateTitle: "Ungültiges Datum",
      permissionTitle: "Berechtigung erforderlich",
      deleteEntryTitle: "Erinnerung löschen",
      deleteEntryMessage: "Möchtest du diese Erinnerung wirklich löschen?",
      deletePhotoTitle: "Foto löschen",
      deletePhotoMessage: "Möchtest du dieses Foto wirklich löschen?",
      deleteChapterTitle: "Kapitel löschen",
      deleteChapterMessage:
        "Möchtest du dieses Kapitel wirklich löschen? Dadurch werden auch alle Erinnerungen gelöscht.",
      deleteTripTitle: "Kapitel löschen",
      deleteTripMessage:
        "Möchtest du dieses Kapitel wirklich löschen? Dadurch werden auch alle Erinnerungen gelöscht.",
      deleteListTitle: "Liste löschen",
      deleteListMessage:
        "Möchtest du „{name}“ wirklich löschen? Dadurch werden auch alle Städte in dieser Liste gelöscht.",
      deleteItemTitle: "{item} löschen",
      deleteItemMessage: "Möchtest du dieses {item} wirklich löschen?",
      deleteEntryFailed: "Erinnerung konnte nicht gelöscht werden",
      deleteMemoryFailed: "Erinnerung konnte nicht gelöscht werden",
      deletePhotoFailed: "Foto konnte nicht gelöscht werden",
      deleteChapterFailed: "Kapitel konnte nicht gelöscht werden",
      deleteTripFailed: "Kapitel konnte nicht gelöscht werden",
      deleteListFailed: "Liste konnte nicht gelöscht werden",
      createEntryFailed:
        "Eintrag konnte nicht erstellt werden. Bitte versuche es erneut.",
      updateEntryFailed:
        "Eintrag konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      createChapterFailed:
        "Kapitel konnte nicht erstellt werden. Bitte versuche es erneut.",
      updateChapterFailed:
        "Kapitel konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      createTripFailed:
        "Kapitel konnte nicht erstellt werden. Bitte versuche es erneut.",
      updateTripFailed:
        "Kapitel konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      createCityListFailed:
        "Städte-Liste konnte nicht erstellt werden. Bitte versuche es erneut.",
      createCityFailed: "Stadt konnte nicht erstellt werden. Bitte versuche es erneut.",
      addCityFailed: "Stadt konnte nicht hinzugefügt werden",
      permissionCameraMessage: "Kamerazugriff ist erforderlich, um Fotos aufzunehmen",
      invalidDateMessage: "Das Enddatum darf nicht vor dem Startdatum liegen",
      entryDateOutOfRangeTitle: "Datum außerhalb des Bereichs",
      entryDateOutOfRangeMessage: "Das Eintragsdatum muss zwischen {start} und {end} liegen.",
      requiredEntryTitle: "Bitte gib einen Titel ein",
      requiredChapterTitle: "Bitte gib einen Kapiteltitel ein",
      requiredTripTitle: "Bitte gib einen Kapiteltitel ein",
      requiredTripCity: "Bitte füge mindestens eine Stadt hinzu",
      requiredListName: "Bitte gib einen Listennamen ein",
      requiredCountry: "Bitte gib einen Ländernamen ein",
      requiredCityName: "Bitte gib einen Stadtnamen ein",
      noProfileFound: "Kein Babyprofil gefunden. Bitte zuerst eines anlegen.",
      nothingToShare: "Nichts zum Teilen",
      nothingToShareMessage: "Diese Stadt hat noch keine Einträge zum Teilen.",
      shareFailed: "Teilen fehlgeschlagen. Bitte versuche es erneut.",
      chapterLimitTitle: "Kapitellimit erreicht",
      chapterLimitMessage:
        "Kostenlose Nutzer können bis zu {limit} Kapitel erstellen. Upgrade auf Pro für unbegrenzte Kapitel.",
      chapterLimitUpgrade: "Auf Pro upgraden",
      tripLimitTitle: "Kapitellimit erreicht",
      tripLimitMessage:
        "Kostenlose Nutzer können bis zu {limit} Kapitel erstellen. Upgrade auf Pro für unbegrenzte Kapitel.",
      tripLimitUpgrade: "Auf Pro upgraden",
      backupReminderTitle: "Sichere deine Erinnerungen",
      backupReminderMessage:
        "Du hast {count} Kapitel erstellt! Erwäge, deine Daten zu exportieren.",
      backupReminderExport: "Jetzt exportieren",
      backupReminderLater: "Später",
      proFeatureTitle: "Pro-Funktion",
      proFeatureExport: "Export ist eine Pro-Funktion. Upgrade, um deine Daten zu exportieren.",
      proFeatureAdvancedSearch: "Erweiterte Suchfilter sind eine Pro-Funktion.",
      proFeatureDarkMode: "Dunkler Modus ist eine Pro-Funktion. Upgrade, um alle Designs freizuschalten.",
      purchasesUnavailableTitle: "Käufe nicht verfügbar",
      purchasesUnavailableMessage: "Käufe sind in diesem Build nicht verfügbar.",
      purchasesNotReadyTitle: "Käufe nicht bereit",
      purchasesNotReadyMessage: "Bitte versuche es in einem Moment erneut.",
      purchasesNotConfiguredTitle: "Käufe nicht verfügbar",
      purchasesNotConfiguredMessage: "RevenueCat ist noch nicht konfiguriert.",
      restoreTitle: "Wiederherstellen",
      restoreSuccessMessage: "Deine Käufe wurden erfolgreich wiederhergestellt.",
      restoreEmptyMessage: "Keine aktiven Abos zum Wiederherstellen.",
      restoreFailedMessage: "Wiederherstellung fehlgeschlagen. Bitte erneut versuchen.",
    },
    limitations: {
      title: "Gut zu wissen",
      photosNotBundled: "Fotos sind nicht in Exporten enthalten - nur Verweise auf lokale Dateien",
      noCloudSync: "Alle Daten werden nur lokal auf deinem Gerät gespeichert",
      freeTextCities:
        "Meilenstein-Listennamen sind Freitext — Duplikate gelten als separate Listen",
      noAutoBackup: "Keine automatischen Backups - denke daran, deine Daten regelmäßig zu exportieren",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Schluss mit dem Wühlen in Fotomappen",
          body: "Erinnerungen gehen in tausenden Bildern verloren. Halte Momente und Details in einem ruhigen Archiv fest.",
        },
        structuredArchive: {
          title: "Die Geschichte deines Babys, organisiert",
          body: "Erstelle ein Kapitel und füge Meilensteine und Notizen hinzu. Alles bleibt strukturiert und leicht wiederzufinden.",
        },
        fastSearch: {
          title: "In Sekunden finden",
          body: "Suche über Kapitel, Meilensteine und Notizen – sofort.",
        },
        bestOfList: {
          title: "Halte die bedeutungsvollen Momente fest",
          body: "Markiere wichtige Erinnerungen und füge kurze Notizen hinzu.",
        },
        noCompetition: {
          title: "Kein Feed. Kein Wettbewerb.",
          body: "Das ist dein privates Archiv. Deine Erinnerungen — nur für dich.",
        },
        privateOffline: {
          title: "Privat und offline-first",
          body: "Kein Konto nötig. Deine Daten bleiben auf deinem Gerät und funktionieren auch ohne Internet.",
        },
        simpleStart: {
          title: "Starte dein erstes Kapitel jetzt",
          body: "Erstelle in Sekunden ein Kapitel und füge deine erste Erinnerung hinzu.",
        },
      },
      createFirstTrip: "Erstes Kapitel erstellen",
      next: "Weiter",
      skip: "Überspringen",
      back: "Zurück",
    },
    shareContent: {
      locationLabel: "Ort",
      summaryLabel: "Zusammenfassung",
      noEntries: "Keine Einträge",
      otherEntries: "Andere Einträge",
      sharedFrom: "Geteilt von BabyLegacy",
      tripHighlights: "Kapitel-Highlights",
      cities: "Standorte",
      places: "Meilensteine",
      moments: "Notizen",
      moreItems: "+ {count} weitere",
      fromTrip: "Aus Kapitel",
      placesSection: "MEILENSTEINE",
      otherPlaces: "ANDERE MEILENSTEINE",
      momentsSection: "NOTIZEN",
      myRecommendations: "Meine Highlights",
      from: "Von",
      other: "Andere",
    },
  },
  it: {
    common: {
      appName: "BabyLegacy",
      done: "Fatto",
      cancel: "Annulla",
      delete: "Elimina",
      save: "Salva",
      add: "Aggiungi",
      create: "Crea",
      close: "Chiudi",
      saving: "Salvataggio...",
      creating: "Creazione...",
      adding: "Aggiunta...",
      entry: "ricordo",
      entries: "ricordi",
      memories: "Ricordi",
      shareTrip: "Condividi capitolo",
    },
    shareDialog: {
      title: "Condividi {name}",
      subtitle: "Scegli come condividere questo capitolo",
      hint: "I tuoi dati restano privati — la condivisione crea un file locale",
      optionTextTitle: "Elenco testuale",
      optionTextDescription: "Formato testo semplice, perfetto per le chat",
      optionImageTitle: "Scheda visiva",
      optionImageDescription: "Una bella scheda con i tuoi momenti migliori",
      optionPdfTitle: "Documento PDF",
      optionPdfDescription: "Capitolo completo con dettagli e note",
      dialogTitleTrip: "Condividi il capitolo {name}",
      dialogTitleCityRecommendations: "Condividi i momenti di {name}",
      dialogTitleCityGuide: "Condividi il capitolo {name}",
      dialogTitleCard: "Condividi la scheda di {name}",
    },
    tabs: {
      chapters: "Capitoli",
      trips: "Capitoli",
      search: "Cerca",
      insights: "Statistiche",
      settings: "Impostazioni",
    },
    navigation: {
      newChapter: "Nuovo capitolo",
      chapter: "Capitolo",
      editChapter: "Modifica capitolo",
      newTrip: "Nuovo capitolo",
      trip: "Capitolo",
      editTrip: "Modifica capitolo",
      newMemory: "Nuovo ricordo",
      memory: "Ricordo",
      editMemory: "Modifica ricordo",
      newEntry: "Nuovo ricordo",
      entry: "Ricordo",
      editEntry: "Modifica ricordo",
    },
    chapters: {
      addCover: "Aggiungi copertina",
      days: "{count} giorni",
      emptyTitle: "Nessun capitolo ancora",
      emptySubtitle: "Inizia a registrare i ricordi del tuo bambino",
      emptyButton: "Crea il tuo primo capitolo",
    },
    trips: {
      addCover: "Aggiungi copertina",
      days: "{count} giorni",
      emptyTitle: "Nessun capitolo ancora",
      emptySubtitle: "Inizia a registrare i ricordi del tuo bambino",
      emptyButton: "Crea il tuo primo capitolo",
    },
    settings: {
      preferences: "Preferenze",
      appearance: "Aspetto",
      language: "Lingua",
      chooseAppearance: "Scegli aspetto",
      chooseLanguage: "Scegli lingua",
      exportSection: "Esportazione",
      exportTitle: "Esporta tutti i dati",
      exportDescription:
        "Scarica i tuoi capitoli, ricordi e tag come JSON o XLS",
      exportButton: "Esporta JSON",
      exportButtonXls: "Esporta XLS",
      exportOpenButton: "Apri opzioni di esportazione",
      exportInfoTitle: "Perché esportare?",
      exportInfoDescription:
        "Crea un backup personale, passa a un nuovo telefono o analizza i ricordi in un foglio di calcolo. Le esportazioni restano sul dispositivo finché non le condividi.",
      exportPrivacyNote:
        "I file esportati possono includere note personali. Condividi con cautela.",
      exportPhotosNote:
        "Le foto non sono incluse nell'esportazione.",
      exportFormatsTitle: "Scegli un formato",
      exportFormatsDescription:
        "JSON è ideale per backup e reimportazione. XLS si apre facilmente in Excel o Google Sheets.",
      importSection: "Importazione",
      importTitle: "Importa dati",
      importDescription: "Importa i tuoi capitoli e ricordi da un file JSON.",
      importButton: "Importa JSON",
      importButtonImporting: "Importazione in corso...",
      dataSection: "Dati",
      dataTitle: "Esporta e importa",
      dataDescription: "Fai backup o trasferisci i tuoi ricordi con esportazione e importazione.",
      dataButton: "Mostra opzioni",
      supportSection: "Supporto",
      supportRate: "Dacci 5 stelle",
      supportShare: "Condividi l'app",
      supportContact: "Contattaci",
      supportShareMessage:
        "BabyLegacy - un archivio familiare privato che adoro: {link}",
      onboardingSection: "Introduzione",
      onboardingTitle: "Mostra di nuovo l'introduzione",
      onboardingDescription: "Rivedi l'introduzione in 7 schermate in qualsiasi momento.",
      onboardingButton: "Avvia introduzione",
      onboardingResetTitle: "Avvia l'introduzione?",
      onboardingResetMessage: "Questo mostrerà di nuovo il flusso di introduzione. Puoi saltare in qualsiasi momento.",
      onboardingResetAction: "Avvia",
      aboutSection: "Informazioni",
      version: "Versione",
      storage: "Archiviazione",
      privacy: "Privacy",
      storageValue: "I dati restano sul tuo dispositivo.",
      privacyValue: "Offline-first",
      footer: "BabyLegacy — il tuo archivio familiare privato",
      themeLight: "Chiaro",
      themeDark: "Scuro",
      themeSystem: "Sistema",
    },
    proBanner: {
      title: "Passa a Pro",
      subtitle: "Sblocca tutte le funzioni.",
      cta: "Passa a Pro",
      messages: [
        { title: "Passa a Pro", subtitle: "Sblocca tutte le funzioni." },
        { title: "Meno scroll, più significato", subtitle: "Trova i momenti importanti subito." },
        { title: "Ricorda tutto", subtitle: "Conserva i piccoli momenti al sicuro." },
        { title: "Il tuo archivio di famiglia", subtitle: "Accesso immediato a ogni capitolo." },
        { title: "Trova in pochi secondi", subtitle: "Cerca per titolo, note o tag." },
        { title: "Cresci senza limiti", subtitle: "Capitoli illimitati. Ricordi illimitati." },
      ],
    },
    labels: {
      date: "Data",
      startDate: "Data di inizio",
      endDate: "Data di fine",
    },
    placeholders: {
      search: "Cerca capitoli, ricordi, note...",
      tripTitle: "es. Primo anno",
      tripSummary: "Breve descrizione di questo capitolo...",
      chapterTitle: "es. 0–3 mesi",
      chapterDescription: "Breve descrizione di questo capitolo...",
      entryTitlePlace: "es. Primo sorriso",
      entryTitleMoment: "es. Un pomeriggio tranquillo",
      memoryTitleMilestone: "Primo sorriso, Primi passi...",
      memoryTitleNote: "Un pomeriggio tranquillo, Momento divertente...",
      entryNotes: "Aggiungi dettagli...",
      cityListName: "es. Traguardi, Tradizioni di famiglia",
      countryName: "es. Casa, dai nonni",
    },
    chapterForm: {
      titleLabel: "Titolo capitolo *",
      descriptionLabel: "Descrizione (opzionale)",
      coverImageLabel: "Immagine di copertina (opzionale)",
      changeCover: "Cambia",
      addCoverPlaceholder: "Tocca per aggiungere una copertina",
    },
    tripForm: {
      titleLabel: "Titolo capitolo *",
      summaryLabel: "Descrizione (opzionale)",
      coverImageLabel: "Immagine di copertina (opzionale)",
      changeCover: "Cambia",
      addCoverPlaceholder: "Tocca per aggiungere una copertina",
    },
    memoryForm: {
      titleLabel: "Titolo *",
      locationLabel: "Luogo",
      importanceLabel: "IMPORTANZA",
      descriptionLabel: "Descrizione",
      tagsLabel: "Tag",
      milestone: "Traguardo",
      note: "Nota",
    },
    entryForm: {
      titleLabel: "Titolo *",
      ratingLabel: "Importanza",
      notesLabel: "Note",
      tagsLabel: "Tag",
      photosLabel: "Foto ({count}/{max})",
      gallery: "Galleria",
      camera: "Fotocamera",
      tapToAddTags: "Tocca per aggiungere tag...",
      place: "Traguardo",
      moment: "Nota",
      moreTags: "+{count} in più",
      locationLabel: "Luogo",
      locationPlaceholder: "Aggiungi un luogo (opzionale)",
      locationHint: "Aggiungi un luogo se aiuta il ricordo",
    },
    memoryDetail: {
      descriptionTitle: "Descrizione",
      tagsTitle: "Tag",
    },
    entryDetail: {
      notesTitle: "Note",
      tagsTitle: "Tag",
      allPhotos: "Tutte le foto ({count})",
      created: "Creato: {date}",
      updated: "Aggiornato: {date}",
      locationTitle: "Posizione",
      openInMaps: "Apri in Mappe",
    },
    chapterDetail: {
      noPhoto: "Nessuna foto",
      notePill: "Nota",
      uncategorized: "Senza categoria",
      emptyTitle: "Nessun ricordo ancora",
      emptySubtitle: "Inizia ad aggiungere ricordi a questo capitolo",
      addFirstMemory: "Aggiungi il primo ricordo",
      addMemory: "Aggiungi ricordo",
    },
    tripDetail: {
      noPhoto: "Nessuna foto",
      notePill: "Nota",
      uncategorized: "Senza categoria",
      emptyTitle: "Nessun ricordo ancora",
      emptySubtitle: "Inizia ad aggiungere ricordi a questo capitolo",
      addFirstEntry: "Aggiungi il primo ricordo",
      addEntry: "Aggiungi ricordo",
    },
    memories: {
      memory: "Ricordo",
      milestone: "Traguardo",
      note: "Nota",
      notePill: "NOTA",
      noPhoto: "Nessuna foto",
    },
    cityLists: {
      title: "Liste città",
      listNameLabel: "Nome lista *",
      listTypeLabel: "Tipo lista",
      countryLabel: "Paese *",
      typeCustom: "Personalizzata",
      typeCountry: "Paese",
      typeHintCustom: "Crea un elenco personalizzato di città da monitorare",
      typeHintCountry: "Crea un elenco di città in un paese specifico",
      emptyTitle: "Nessuna lista città",
      emptyDescription:
        "Crea elenchi di città che vuoi visitare e monitora i progressi",
      createFirstList: "Crea la prima lista",
      progressVisited: "{visited}/{total} visitate ({percent}%)",
      detailProgress: "{visited} di {total} città visitate ({percent}%)",
      detailEmptyTitle: "Nessuna città",
      detailEmptyDescription:
        "Aggiungi le città che vuoi visitare e monitora i progressi",
      detailAddCity: "Aggiungi città",
      detailVisited: "Visitate",
      notFound: "Lista città non trovata",
      loading: "Caricamento...",
    },
    search: {
      emptyTitle: "Cerca i tuoi ricordi",
      emptySubtitle:
        "Trova capitoli e ricordi per titolo, descrizione, note o tag",
      noResultsTitle: "Nessun risultato",
      noResultsSubtitle: "Prova con parole chiave diverse",
      showLabel: "Mostra",
      memoryTypeLabel: "Tipo di ricordo",
      minImportanceLabel: "Importanza min.",
      entryTypeLabel: "Tipo di ricordo",
      minRatingLabel: "Importanza min.",
      tagsLabel: "Tag",
      clearFilters: "Cancella filtri",
      filterAll: "Tutti",
      filterChapters: "Capitoli",
      filterMemories: "Ricordi",
      filterTrips: "Capitoli",
      filterEntries: "Ricordi",
      filterAny: "Qualsiasi",
      filterMilestones: "Traguardi",
      filterNotes: "Note",
      filterPlaces: "Traguardi",
      filterMoments: "Note",
      matchedIn: "Corrispondenza in {field}:",
      inChapter: "in {chapter}",
      inTrip: "in {chapter}",
      matchFieldTitle: "titolo",
      matchFieldLocation: "località",
      matchFieldSummary: "descrizione",
      matchFieldNotes: "note",
      matchFieldTag: "tag",
      matchFieldCity: "città",
    },
    insights: {
      sectionStats: "Le tue statistiche",
      statsChapters: "Capitoli",
      statsMemories: "Ricordi",
      statsTrips: "Capitoli",
      statsEntries: "Ricordi",
      statsCities: "Luoghi",
      statsCountries: "Posizioni",
      statsPhotos: "Foto",
      statsImportant: "Importanti",
      statsTripDays: "Giorni capitolo",
      memoriesBreakdown: "{milestones} traguardi, {notes} note",
      entriesBreakdown: "{milestones} traguardi, {notes} note",
      highlightMostVisited: "Più visitato",
      highlightFirstTrip: "Primo capitolo",
      highlightFirstMemory: "Primo ricordo",
      highlightAvgRating: "Importanza media",
      highlightImportant: "Più importante",
      topTags: "Tag principali",
      cityProgress: "Liste traguardi",
      seeAll: "Vedi tutto",
      createFirstCityList: "Crea la tua prima lista traguardi",
      cityListsEmptyHint: "Monitora i traguardi che vuoi ricordare",
      cityListCount: "{visited}/{total} elementi",
      moreLists: "+{count} liste in più",
      achievements: "Obiettivi",
      viewAll: "Vedi tutto",
      noBadgesEarned: "Nessun badge ancora",
      badgesEmptyHint: "Continua a salvare ricordi per sbloccare obiettivi",
      moreBadges: "+{count} badge in più",
      badgesProgress: "{unlocked} di {total} badge ottenuti",
    },
    badges: {
      earned: "Ottenuto",
      locked: "Bloccato",
      allBadges: "Tutti i badge",
      badgesEarned: "Badge ottenuti",
      special: "Speciale",
      tagAdventures: "Traguardi dei tag",
      firstSteps: "Primi passi",
      tripMilestones: "Traguardi capitoli",
      placeMilestones: "Ricordi traguardi",
      entryMilestones: "Traguardi ricordi",
      countryMilestones: "Traguardi posizioni",
      photoMilestones: "Traguardi foto",
      cityMilestones: "Traguardi posizioni",
      cityListAchievements: "Obiettivi liste città",
      badgeUnlocked: "Badge sbloccato!",
    },
    badgeDetail: {
      congratulations: "Congratulazioni!",
      earnedOn: "Ottenuto il {date}",
      notYetEarned: "Non ancora ottenuto",
    },
    badgeItems: {
      first_trip: {
        title: "Primo viaggio",
        description: "Hai creato il tuo primo viaggio",
      },
      first_place: {
        title: "Primo luogo",
        description: "Hai salvato il tuo primo luogo",
      },
      first_moment: {
        title: "Primo momento",
        description: "Hai catturato il tuo primo momento",
      },
      first_tag: {
        title: "Primo tag",
        description: "Hai creato il tuo primo tag",
      },
      trips_3: {
        title: "Esploratore",
        description: "Registrati 5 viaggi",
      },
      trips_10: {
        title: "Avventuriero",
        description: "Registrati 15 viaggi",
      },
      trips_25: {
        title: "Giramondo",
        description: "Registrati 30 viaggi",
      },
      places_10: {
        title: "Cacciatore di luoghi",
        description: "Salvati 15 luoghi",
      },
      places_25: {
        title: "Collezionista di luoghi",
        description: "Salvati 40 luoghi",
      },
      places_100: {
        title: "Maestro dei luoghi",
        description: "Salvati 150 luoghi",
      },
      entries_25: {
        title: "Custode dei ricordi",
        description: "Create 40 voci",
      },
      entries_100: {
        title: "Storico",
        description: "Create 150 voci",
      },
      countries_3: {
        title: "Attraversa confini",
        description: "Visitati 5 paesi",
      },
      countries_5: {
        title: "Viaggiatore del mondo",
        description: "Visitati 8 paesi",
      },
      countries_10: {
        title: "Continentale",
        description: "Visitati 15 paesi",
      },
      photos_10: {
        title: "Fotografo in erba",
        description: "Scattate 25 foto",
      },
      photos_50: {
        title: "Fotografo",
        description: "Scattate 100 foto",
      },
      photos_200: {
        title: "Archivista di foto",
        description: "Scattate 400 foto",
      },
      cities_5: {
        title: "Saltatore di città",
        description: "Visitate 10 città",
      },
      cities_20: {
        title: "Esploratore urbano",
        description: "Visitate 40 città",
      },
      tag_pizza: {
        title: "Pellegrino della pizza",
        description: "Registrate 20 voci pizza",
      },
      tag_cafe: {
        title: "Frequentatore di caffè",
        description: "Registrate 25 voci caffè",
      },
      tag_museum: {
        title: "Esperto di musei",
        description: "Registrate 15 voci museo",
      },
      tag_beach: {
        title: "Cercatore di spiagge",
        description: "Registrate 12 voci spiaggia",
      },
      tag_nightlife: {
        title: "Nottambulo",
        description: "Registrate 12 voci vita notturna",
      },
      tag_street_food: {
        title: "Leggenda dello street food",
        description: "Registrate 25 voci cibo di strada",
      },
      tag_market: {
        title: "Esperto di mercati",
        description: "Registrate 12 voci mercato",
      },
      tag_temple: {
        title: "Cercatore di templi",
        description: "Registrate 10 voci tempio",
      },
      historian: {
        title: "Storico",
        description: "Registrate 40 voci di viaggi passati",
      },
      weekend_warrior: {
        title: "Guerriero del weekend",
        description: "Avviati 8 viaggi nel weekend",
      },
      weekend_master: {
        title: "Maestro del weekend",
        description: "Avviati 25 viaggi nel weekend",
      },
      long_haul: {
        title: "Lungo raggio",
        description: "Completati 5 viaggi di 7+ giorni",
      },
      marathon_traveler: {
        title: "Viaggiatore maratoneta",
        description: "Completati 15 viaggi di 7+ giorni",
      },
      quick_escape: {
        title: "Fuga veloce",
        description: "Completati 5 viaggi di 2 giorni o meno",
      },
      express_traveler: {
        title: "Viaggiatore express",
        description: "Completati 20 viaggi di 2 giorni o meno",
      },
      critic: {
        title: "Critico",
        description: "Valutate 20 voci",
      },
      taste_maker: {
        title: "Arbitro del gusto",
        description: "Valutate 100 voci",
      },
      five_star_finder: {
        title: "Cercatore di cinque stelle",
        description: "Trovate 10 esperienze a cinque stelle",
      },
      gold_standard: {
        title: "Standard d'oro",
        description: "Trovate 40 esperienze a cinque stelle",
      },
      high_standards: {
        title: "Standard elevati",
        description: "Mantieni una valutazione media di 4+",
      },
      note_taker: {
        title: "Annotatore",
        description: "Aggiunte note a 20 voci",
      },
      storyteller: {
        title: "Narratore",
        description: "Aggiunte note a 100 voci",
      },
      visual_logger: {
        title: "Diario visivo",
        description: "Aggiunte foto a 20 voci",
      },
      photo_journalist: {
        title: "Fotogiornalista",
        description: "Aggiunte foto a 100 voci",
      },
      organizer: {
        title: "Organizzatore",
        description: "Taggate 20 voci",
      },
      master_organizer: {
        title: "Organizzatore esperto",
        description: "Taggate 100 voci",
      },
      tag_creator: {
        title: "Creatore di tag",
        description: "Creati 20 tag unici",
      },
      taxonomy_expert: {
        title: "Esperto di tassonomia",
        description: "Creati 40 tag unici",
      },
      summer_lover: {
        title: "Amante dell'estate",
        description: "Fatti 5 viaggi nei mesi estivi",
      },
      sun_chaser: {
        title: "Inseguitore del sole",
        description: "Fatti 15 viaggi nei mesi estivi",
      },
      winter_explorer: {
        title: "Esploratore invernale",
        description: "Fatti 5 viaggi nei mesi invernali",
      },
      frost_seeker: {
        title: "Cercatore di gelo",
        description: "Fatti 15 viaggi nei mesi invernali",
      },
      city_hopper_trip: {
        title: "Saltatore di città",
        description: "Completati 2 viaggi con 3+ città",
      },
      grand_tour: {
        title: "Gran tour",
        description: "Completati 10 viaggi con 3+ città",
      },
      focused_traveler: {
        title: "Viaggiatore concentrato",
        description: "Completati 10 viaggi in una sola città",
      },
      deep_diver: {
        title: "Esploratore profondo",
        description: "Completati 25 viaggi in una sola città",
      },
      city_list_first: {
        title: "Creatore di liste",
        description: "Creata la tua prima lista di città",
      },
      city_list_halfway: {
        title: "A metà strada",
        description: "Completato il 50% di una lista di città",
      },
      city_list_complete: {
        title: "Conquistatore di liste",
        description: "Completata una lista di città al 100%",
      },
    },
    tags: {
      quick: {
        restaurant: "Ristorante",
        cafe: "Caffè",
        hotel: "Hotel",
        museum: "Museo",
        cityCenter: "Centro città",
        beach: "Spiaggia",
        sea: "Mare",
        park: "Parco",
        shopping: "Shopping",
        bar: "Bar",
        landmark: "Monumento",
        mosque: "Moschea",
        ship: "Nave",
        temple: "Tempio",
        market: "Mercato",
        nightlife: "Vita notturna",
        nature: "Natura",
        adventure: "Avventura",
        localFood: "Cucina locale",
        streetFood: "Cibo di strada",
        viewPoint: "Punto panoramico",
        historic: "Storico",
        art: "Arte",
        transport: "Trasporti",
      },
    },
    dialogs: {
      tagPicker: {
        title: "Aggiungi tag",
        selected: "Selezionati",
        addCustom: "Aggiungi tag personalizzato",
        customPlaceholder: "Digita un nome tag...",
        quickTags: "Tag rapidi",
        yourTags: "I tuoi tag",
      },
      cityPicker: {
        label: "Città",
        placeholder: "Seleziona una città",
        title: "Seleziona città",
        addCity: "Aggiungi città",
        cityNamePlaceholder: "Nome città",
        noCity: "Nessuna città (senza categoria)",
        fromDate: "Da {date}",
        untilDate: "Fino a {date}",
      },
      cityEditor: {
        label: "Città",
        empty: "Nessuna città ancora",
        addCity: "Aggiungi città",
        editTitle: "Modifica città",
        addTitle: "Aggiungi città",
        cityNameLabel: "Nome città *",
        cityNamePlaceholder: "es. Roma, Firenze",
        arrivalDateLabel: "Data di arrivo (opzionale)",
        departureDateLabel: "Data di partenza (opzionale)",
        notSet: "Non impostato",
        fromDate: "Da {date}",
        untilDate: "Fino a {date}",
        done: "Fatto",
      },
      cityList: {
        createTitle: "Nuova lista città",
        addCityTitle: "Aggiungi città",
        addCityPlaceholder: "Nome città",
        addCityButton: "Aggiungi città",
        adding: "Aggiunta...",
        linkTripTitle: "Collega al viaggio (opzionale)",
        noTripLinked: "Nessun viaggio collegato",
      },
    },
    alerts: {
      exportFailedTitle: "Esportazione non riuscita",
      exportFailedMessage: "Impossibile esportare i dati. Riprova.",
      importComplete: "Importazione completata",
      importCompletedWithErrors: "Importazione completata con alcuni problemi",
      importFailed: "Importazione non riuscita. Riprova.",
      errorTitle: "Errore",
      requiredTitle: "Obbligatorio",
      invalidDateTitle: "Data non valida",
      permissionTitle: "Permesso necessario",
      deleteEntryTitle: "Elimina ricordo",
      deleteEntryMessage: "Sei sicuro di voler eliminare questo ricordo?",
      deletePhotoTitle: "Elimina foto",
      deletePhotoMessage: "Sei sicuro di voler eliminare questa foto?",
      deleteChapterTitle: "Elimina capitolo",
      deleteChapterMessage:
        "Sei sicuro di voler eliminare questo capitolo? Verranno eliminati anche tutti i ricordi.",
      deleteTripTitle: "Elimina capitolo",
      deleteTripMessage:
        "Sei sicuro di voler eliminare questo capitolo? Verranno eliminati anche tutti i ricordi.",
      deleteListTitle: "Elimina lista",
      deleteListMessage:
        "Sei sicuro di voler eliminare \"{name}\"? Verranno eliminate anche tutte le città in questa lista.",
      deleteItemTitle: "Elimina {item}",
      deleteItemMessage: "Sei sicuro di voler eliminare questo {item}?",
      deleteEntryFailed: "Impossibile eliminare il ricordo",
      deleteMemoryFailed: "Impossibile eliminare il ricordo",
      deletePhotoFailed: "Impossibile eliminare la foto",
      deleteChapterFailed: "Impossibile eliminare il capitolo",
      deleteTripFailed: "Impossibile eliminare il capitolo",
      deleteListFailed: "Impossibile eliminare la lista",
      createEntryFailed: "Impossibile creare il ricordo. Riprova.",
      updateEntryFailed: "Impossibile aggiornare il ricordo. Riprova.",
      createChapterFailed: "Impossibile creare il capitolo. Riprova.",
      updateChapterFailed: "Impossibile aggiornare il capitolo. Riprova.",
      createTripFailed: "Impossibile creare il capitolo. Riprova.",
      updateTripFailed: "Impossibile aggiornare il capitolo. Riprova.",
      createCityListFailed: "Impossibile creare la lista di città. Riprova.",
      createCityFailed: "Impossibile creare la città. Riprova.",
      addCityFailed: "Impossibile aggiungere la città",
      permissionCameraMessage: "L'accesso alla fotocamera è necessario per scattare foto",
      invalidDateMessage: "La data di fine non può essere precedente alla data di inizio",
      entryDateOutOfRangeTitle: "Data fuori intervallo",
      entryDateOutOfRangeMessage: "La data della voce deve essere tra {start} e {end}.",
      requiredEntryTitle: "Inserisci un titolo",
      requiredChapterTitle: "Inserisci un titolo del capitolo",
      requiredTripTitle: "Inserisci un titolo del capitolo",
      requiredTripCity: "Aggiungi almeno una città",
      requiredListName: "Inserisci un nome per la lista",
      requiredCountry: "Inserisci un nome del paese",
      requiredCityName: "Inserisci un nome della città",
      noProfileFound: "Nessun profilo del bambino trovato. Creane uno prima.",
      nothingToShare: "Niente da condividere",
      nothingToShareMessage: "Questa città non ha ancora voci da condividere.",
      shareFailed: "Impossibile condividere. Riprova.",
      chapterLimitTitle: "Limite capitoli raggiunto",
      chapterLimitMessage:
        "Gli utenti gratuiti possono creare fino a {limit} capitoli. Passa a Pro per capitoli illimitati.",
      chapterLimitUpgrade: "Passa a Pro",
      tripLimitTitle: "Limite capitoli raggiunto",
      tripLimitMessage:
        "Gli utenti gratuiti possono creare fino a {limit} capitoli. Passa a Pro per capitoli illimitati.",
      tripLimitUpgrade: "Passa a Pro",
      backupReminderTitle: "Salva i tuoi ricordi",
      backupReminderMessage:
        "Hai creato {count} capitoli! Considera di esportare i tuoi dati per tenerli al sicuro.",
      backupReminderExport: "Esporta ora",
      backupReminderLater: "Più tardi",
      proFeatureTitle: "Funzione Pro",
      proFeatureExport: "L'esportazione è una funzione Pro. Passa a Pro per esportare i tuoi dati.",
      proFeatureAdvancedSearch: "I filtri di ricerca avanzati sono una funzione Pro.",
      proFeatureDarkMode: "La modalità scura è una funzione Pro. Passa a Pro per sbloccare tutti i temi.",
      purchasesUnavailableTitle: "Acquisti non disponibili",
      purchasesUnavailableMessage: "Gli acquisti non sono disponibili in questa build.",
      purchasesNotReadyTitle: "Acquisti non pronti",
      purchasesNotReadyMessage: "Riprova tra poco.",
      purchasesNotConfiguredTitle: "Acquisti non disponibili",
      purchasesNotConfiguredMessage: "RevenueCat non è ancora configurato.",
      restoreTitle: "Ripristina",
      restoreSuccessMessage: "I tuoi acquisti sono stati ripristinati.",
      restoreEmptyMessage: "Nessun abbonamento attivo da ripristinare.",
      restoreFailedMessage: "Ripristino non riuscito. Riprova.",
    },
    limitations: {
      title: "Da sapere",
      photosNotBundled: "Le foto non sono incluse nelle esportazioni - solo riferimenti ai file locali",
      noCloudSync: "Tutti i dati sono memorizzati solo localmente sul tuo dispositivo",
      freeTextCities:
        "I nomi delle liste di traguardi sono testo libero — i duplicati sono liste separate",
      noAutoBackup: "Nessun backup automatico - ricordati di esportare i dati regolarmente",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Basta rovistare tra le foto",
          body: "I ricordi si perdono tra migliaia di foto. Tieni momenti e dettagli in un archivio ordinato.",
        },
        structuredArchive: {
          title: "La storia del tuo bambino, organizzata",
          body: "Crea un capitolo, poi aggiungi traguardi e note. Tutto resta strutturato e facile da ritrovare.",
        },
        fastSearch: {
          title: "Trovalo in pochi secondi",
          body: "Cerca tra capitoli, traguardi e note — subito.",
        },
        bestOfList: {
          title: "Cattura i momenti importanti",
          body: "Segna i ricordi importanti e aggiungi note brevi.",
        },
        noCompetition: {
          title: "Nessun feed. Nessuna competizione.",
          body: "È il tuo archivio privato. I tuoi ricordi — solo per te.",
        },
        privateOffline: {
          title: "Privato e offline-first",
          body: "Nessun account richiesto. I tuoi dati restano sul dispositivo e funzionano anche offline.",
        },
        simpleStart: {
          title: "Inizia ora il tuo primo capitolo",
          body: "Crea un capitolo in pochi secondi e aggiungi il tuo primo ricordo.",
        },
      },
      createFirstTrip: "Crea il tuo primo capitolo",
      next: "Avanti",
      skip: "Salta",
      back: "Indietro",
    },
    shareContent: {
      locationLabel: "Posizione",
      summaryLabel: "Riepilogo",
      noEntries: "Nessuna voce",
      otherEntries: "Altre voci",
      sharedFrom: "Condiviso da BabyLegacy",
      tripHighlights: "Momenti salienti del capitolo",
      cities: "Posizioni",
      places: "Traguardi",
      moments: "Note",
      moreItems: "+ {count} altri",
      fromTrip: "Dal capitolo",
      placesSection: "TRAGUARDI",
      otherPlaces: "ALTRI TRAGUARDI",
      momentsSection: "NOTE",
      myRecommendations: "I miei momenti",
      from: "Da",
      other: "Altro",
    },
  },
  fr: {
    common: {
      appName: "BabyLegacy",
      done: "Terminé",
      cancel: "Annuler",
      delete: "Supprimer",
      save: "Enregistrer",
      add: "Ajouter",
      create: "Créer",
      close: "Fermer",
      saving: "Enregistrement...",
      creating: "Création...",
      adding: "Ajout...",
      entry: "souvenir",
      entries: "souvenirs",
      memories: "Souvenirs",
      shareTrip: "Partager le chapitre",
    },
    shareDialog: {
      title: "Partager {name}",
      subtitle: "Choisissez comment partager ce chapitre",
      hint: "Vos données restent privées — le partage crée un fichier local",
      optionTextTitle: "Liste texte",
      optionTextDescription: "Format texte simple, idéal pour les messageries",
      optionImageTitle: "Carte visuelle",
      optionImageDescription: "Une belle carte avec vos moments clés",
      optionPdfTitle: "Document PDF",
      optionPdfDescription: "Chapitre complet avec tous les détails et notes",
      dialogTitleTrip: "Partager le chapitre {name}",
      dialogTitleCityRecommendations: "Partager les moments de {name}",
      dialogTitleCityGuide: "Partager le chapitre {name}",
      dialogTitleCard: "Partager la carte de {name}",
    },
    tabs: {
      chapters: "Chapitres",
      trips: "Chapitres",
      search: "Recherche",
      insights: "Aperçus",
      settings: "Paramètres",
    },
    navigation: {
      newChapter: "Nouveau chapitre",
      chapter: "Chapitre",
      editChapter: "Modifier le chapitre",
      newTrip: "Nouveau chapitre",
      trip: "Chapitre",
      editTrip: "Modifier le chapitre",
      newMemory: "Nouveau souvenir",
      memory: "Souvenir",
      editMemory: "Modifier le souvenir",
      newEntry: "Nouveau souvenir",
      entry: "Souvenir",
      editEntry: "Modifier le souvenir",
    },
    chapters: {
      addCover: "Ajouter une couverture",
      days: "{count} jours",
      emptyTitle: "Aucun chapitre pour l'instant",
      emptySubtitle: "Commencez à enregistrer les souvenirs de votre bébé",
      emptyButton: "Créer votre premier chapitre",
    },
    trips: {
      addCover: "Ajouter une couverture",
      days: "{count} jours",
      emptyTitle: "Aucun chapitre pour l'instant",
      emptySubtitle: "Commencez à enregistrer les souvenirs de votre bébé",
      emptyButton: "Créer votre premier chapitre",
    },
    settings: {
      preferences: "Préférences",
      appearance: "Apparence",
      language: "Langue",
      chooseAppearance: "Choisir l'apparence",
      chooseLanguage: "Choisir la langue",
      exportSection: "Exportation",
      exportTitle: "Exporter toutes les données",
      exportDescription:
        "Téléchargez vos chapitres, souvenirs et tags en JSON ou XLS",
      exportButton: "Exporter JSON",
      exportButtonXls: "Exporter XLS",
      exportOpenButton: "Ouvrir les options d’export",
      exportInfoTitle: "Pourquoi exporter ?",
      exportInfoDescription:
        "Gardez une sauvegarde personnelle, changez de téléphone ou analysez vos souvenirs dans un tableur. Les exports restent sur votre appareil jusqu’à partage.",
      exportPrivacyNote:
        "Les fichiers exportés peuvent contenir des notes personnelles. Partagez prudemment.",
      exportPhotosNote:
        "Les photos ne sont pas incluses dans l’export.",
      exportFormatsTitle: "Choisir un format",
      exportFormatsDescription:
        "JSON est idéal pour les sauvegardes et la ré-importation. XLS s’ouvre facilement dans Excel ou Google Sheets.",
      importSection: "Importation",
      importTitle: "Importer les données",
      importDescription: "Importez vos chapitres et souvenirs depuis un fichier JSON.",
      importButton: "Importer JSON",
      importButtonImporting: "Importation en cours...",
      dataSection: "Données",
      dataTitle: "Exporter et importer",
      dataDescription: "Sauvegardez ou transférez vos souvenirs via export/import.",
      dataButton: "Afficher les options",
      supportSection: "Support",
      supportRate: "Nous donner 5 étoiles",
      supportShare: "Partager l'app",
      supportContact: "Nous contacter",
      supportShareMessage:
        "BabyLegacy - une archive familiale privée que j'adore : {link}",
      onboardingSection: "Introduction",
      onboardingTitle: "Afficher l'introduction à nouveau",
      onboardingDescription: "Rejouez l'introduction en 7 écrans à tout moment.",
      onboardingButton: "Démarrer l'introduction",
      onboardingResetTitle: "Démarrer l'introduction ?",
      onboardingResetMessage: "Cela relancera le flux d'introduction. Vous pouvez passer à tout moment.",
      onboardingResetAction: "Démarrer",
      aboutSection: "À propos",
      version: "Version",
      storage: "Stockage",
      privacy: "Confidentialité",
      storageValue: "Vos données restent sur votre appareil.",
      privacyValue: "Hors ligne",
      footer: "BabyLegacy — votre archive familiale privée",
      themeLight: "Clair",
      themeDark: "Sombre",
      themeSystem: "Système",
    },
    proBanner: {
      title: "Passer à Pro",
      subtitle: "Débloquez toutes les fonctionnalités.",
      cta: "Passer à Pro",
      messages: [
        { title: "Passer à Pro", subtitle: "Débloquez toutes les fonctionnalités." },
        { title: "Moins de scroll, plus de sens", subtitle: "Retrouvez les moments importants instantanément." },
        { title: "Souvenez-vous de tout", subtitle: "Gardez les petits moments en sécurité." },
        { title: "Votre archive familiale", subtitle: "Accès instantané à chaque chapitre." },
        { title: "Retrouvez en quelques secondes", subtitle: "Recherchez par titre, notes ou tags." },
        { title: "Grandissez sans limites", subtitle: "Chapitres illimités. Souvenirs illimités." },
      ],
    },
    labels: {
      date: "Date",
      startDate: "Date de début",
      endDate: "Date de fin",
    },
    placeholders: {
      search: "Rechercher chapitres, souvenirs, notes...",
      tripTitle: "ex. Première année",
      tripSummary: "Brève description de ce chapitre...",
      chapterTitle: "ex. 0–3 mois",
      chapterDescription: "Brève description de ce chapitre...",
      entryTitlePlace: "ex. Premier sourire",
      entryTitleMoment: "ex. Un après-midi calme",
      memoryTitleMilestone: "Premier sourire, Premiers pas...",
      memoryTitleNote: "Un après-midi calme, Moment drôle...",
      entryNotes: "Ajouter des détails...",
      cityListName: "ex. Étapes, Traditions familiales",
      countryName: "ex. Maison, chez mamie",
    },
    chapterForm: {
      titleLabel: "Titre du chapitre *",
      descriptionLabel: "Description (optionnelle)",
      coverImageLabel: "Image de couverture (optionnelle)",
      changeCover: "Modifier",
      addCoverPlaceholder: "Touchez pour ajouter une couverture",
    },
    tripForm: {
      titleLabel: "Titre du chapitre *",
      summaryLabel: "Description (optionnelle)",
      coverImageLabel: "Image de couverture (optionnelle)",
      changeCover: "Modifier",
      addCoverPlaceholder: "Touchez pour ajouter une couverture",
    },
    memoryForm: {
      titleLabel: "Titre *",
      locationLabel: "Lieu",
      importanceLabel: "IMPORTANCE",
      descriptionLabel: "Description",
      tagsLabel: "Tags",
      milestone: "Étape",
      note: "Note",
    },
    entryForm: {
      titleLabel: "Titre *",
      ratingLabel: "Importance",
      notesLabel: "Notes",
      tagsLabel: "Tags",
      photosLabel: "Photos ({count}/{max})",
      gallery: "Galerie",
      camera: "Appareil",
      tapToAddTags: "Touchez pour ajouter des tags...",
      place: "Étape",
      moment: "Note",
      moreTags: "+{count} de plus",
      locationLabel: "Lieu",
      locationPlaceholder: "Ajouter un lieu (optionnel)",
      locationHint: "Ajoutez un lieu si cela aide le souvenir",
    },
    memoryDetail: {
      descriptionTitle: "Description",
      tagsTitle: "Tags",
    },
    entryDetail: {
      notesTitle: "Notes",
      tagsTitle: "Tags",
      allPhotos: "Toutes les photos ({count})",
      created: "Créé : {date}",
      updated: "Mis à jour : {date}",
      locationTitle: "Emplacement",
      openInMaps: "Ouvrir dans Plans",
    },
    chapterDetail: {
      noPhoto: "Pas de photo",
      notePill: "Note",
      uncategorized: "Sans catégorie",
      emptyTitle: "Aucun souvenir",
      emptySubtitle: "Commencez à ajouter des souvenirs à ce chapitre",
      addFirstMemory: "Ajouter le premier souvenir",
      addMemory: "Ajouter un souvenir",
    },
    tripDetail: {
      noPhoto: "Pas de photo",
      notePill: "Note",
      uncategorized: "Sans catégorie",
      emptyTitle: "Aucun souvenir",
      emptySubtitle: "Commencez à ajouter des souvenirs à ce chapitre",
      addFirstEntry: "Ajouter le premier souvenir",
      addEntry: "Ajouter un souvenir",
    },
    memories: {
      memory: "Souvenir",
      milestone: "Étape",
      note: "Note",
      notePill: "NOTE",
      noPhoto: "Pas de photo",
    },
    cityLists: {
      title: "Listes de villes",
      listNameLabel: "Nom de liste *",
      listTypeLabel: "Type de liste",
      countryLabel: "Pays *",
      typeCustom: "Personnalisée",
      typeCountry: "Pays",
      typeHintCustom: "Créez une liste personnalisée de villes à suivre",
      typeHintCountry: "Créez une liste de villes dans un pays spécifique",
      emptyTitle: "Aucune liste de villes",
      emptyDescription:
        "Créez des listes de villes à visiter et suivez vos progrès",
      createFirstList: "Créer votre première liste",
      progressVisited: "{visited}/{total} visitées ({percent}%)",
      detailProgress: "{visited} sur {total} villes visitées ({percent}%)",
      detailEmptyTitle: "Aucune ville",
      detailEmptyDescription:
        "Ajoutez des villes à visiter et suivez vos progrès",
      detailAddCity: "Ajouter une ville",
      detailVisited: "Visitées",
      notFound: "Liste de villes introuvable",
      loading: "Chargement...",
    },
    search: {
      emptyTitle: "Recherchez vos souvenirs",
      emptySubtitle:
        "Trouvez des chapitres et souvenirs par titre, description, notes ou tags",
      noResultsTitle: "Aucun résultat",
      noResultsSubtitle: "Essayez d'autres mots-clés",
      showLabel: "Afficher",
      memoryTypeLabel: "Type de souvenir",
      minImportanceLabel: "Importance min.",
      entryTypeLabel: "Type de souvenir",
      minRatingLabel: "Importance min.",
      tagsLabel: "Tags",
      clearFilters: "Effacer les filtres",
      filterAll: "Tous",
      filterChapters: "Chapitres",
      filterMemories: "Souvenirs",
      filterTrips: "Chapitres",
      filterEntries: "Souvenirs",
      filterAny: "N'importe",
      filterMilestones: "Étapes",
      filterNotes: "Notes",
      filterPlaces: "Étapes",
      filterMoments: "Notes",
      matchedIn: "Correspondance dans {field}:",
      inChapter: "dans {chapter}",
      inTrip: "dans {chapter}",
      matchFieldTitle: "titre",
      matchFieldLocation: "lieu",
      matchFieldSummary: "description",
      matchFieldNotes: "notes",
      matchFieldTag: "tag",
      matchFieldCity: "ville",
    },
    insights: {
      sectionStats: "Vos statistiques",
      statsChapters: "Chapitres",
      statsMemories: "Souvenirs",
      statsTrips: "Chapitres",
      statsEntries: "Souvenirs",
      statsCities: "Lieux",
      statsCountries: "Positions",
      statsPhotos: "Photos",
      statsImportant: "Importants",
      statsTripDays: "Jours de chapitre",
      memoriesBreakdown: "{milestones} étapes, {notes} notes",
      entriesBreakdown: "{milestones} étapes, {notes} notes",
      highlightMostVisited: "Le plus visité",
      highlightFirstTrip: "Premier chapitre",
      highlightFirstMemory: "Premier souvenir",
      highlightAvgRating: "Importance moyenne",
      highlightImportant: "Le plus important",
      topTags: "Tags principaux",
      cityProgress: "Listes d’étapes",
      seeAll: "Voir tout",
      createFirstCityList: "Créez votre première liste d’étapes",
      cityListsEmptyHint: "Suivez les étapes que vous voulez retenir",
      cityListCount: "{visited}/{total} éléments",
      moreLists: "+{count} listes de plus",
      achievements: "Succès",
      viewAll: "Voir tout",
      noBadgesEarned: "Aucun badge gagné",
      badgesEmptyHint: "Continuez à enregistrer des souvenirs pour débloquer des succès",
      moreBadges: "+{count} badges de plus",
      badgesProgress: "{unlocked} sur {total} badges gagnés",
    },
    badges: {
      earned: "Obtenu",
      locked: "Verrouillé",
      allBadges: "Tous les badges",
      badgesEarned: "Badges obtenus",
      special: "Spécial",
      tagAdventures: "Étapes des tags",
      firstSteps: "Premiers pas",
      tripMilestones: "Étapes de chapitres",
      placeMilestones: "Souvenirs d’étapes",
      entryMilestones: "Étapes des souvenirs",
      countryMilestones: "Étapes des lieux",
      photoMilestones: "Étapes des photos",
      cityMilestones: "Étapes des lieux",
      cityListAchievements: "Succès des listes de villes",
      badgeUnlocked: "Badge débloqué !",
    },
    badgeDetail: {
      congratulations: "Félicitations !",
      earnedOn: "Obtenu le {date}",
      notYetEarned: "Pas encore obtenu",
    },
    badgeItems: {
      first_trip: {
        title: "Premier voyage",
        description: "Vous avez créé votre premier voyage",
      },
      first_place: {
        title: "Premier lieu",
        description: "Vous avez enregistré votre premier lieu",
      },
      first_moment: {
        title: "Premier moment",
        description: "Vous avez capturé votre premier moment",
      },
      first_tag: {
        title: "Premier tag",
        description: "Vous avez créé votre premier tag",
      },
      trips_3: {
        title: "Explorateur",
        description: "5 voyages enregistrés",
      },
      trips_10: {
        title: "Aventurier",
        description: "15 voyages enregistrés",
      },
      trips_25: {
        title: "Globe-trotter",
        description: "30 voyages enregistrés",
      },
      places_10: {
        title: "Chasseur de lieux",
        description: "15 lieux enregistrés",
      },
      places_25: {
        title: "Collectionneur de lieux",
        description: "40 lieux enregistrés",
      },
      places_100: {
        title: "Maître des lieux",
        description: "150 lieux enregistrés",
      },
      entries_25: {
        title: "Gardien de souvenirs",
        description: "40 entrées créées",
      },
      entries_100: {
        title: "Historien",
        description: "150 entrées créées",
      },
      countries_3: {
        title: "Franchisseur de frontières",
        description: "5 pays visités",
      },
      countries_5: {
        title: "Voyageur du monde",
        description: "8 pays visités",
      },
      countries_10: {
        title: "Continental",
        description: "15 pays visités",
      },
      photos_10: {
        title: "Photographe en herbe",
        description: "25 photos prises",
      },
      photos_50: {
        title: "Photographe",
        description: "100 photos prises",
      },
      photos_200: {
        title: "Archiviste photo",
        description: "400 photos prises",
      },
      cities_5: {
        title: "Sauteur de villes",
        description: "10 villes visitées",
      },
      cities_20: {
        title: "Explorateur urbain",
        description: "40 villes visitées",
      },
      tag_pizza: {
        title: "Pèlerin de la pizza",
        description: "20 entrées pizza enregistrées",
      },
      tag_cafe: {
        title: "Habitué du café",
        description: "25 entrées café enregistrées",
      },
      tag_museum: {
        title: "Expert des musées",
        description: "15 entrées musée enregistrées",
      },
      tag_beach: {
        title: "Aventurier des plages",
        description: "12 entrées plage enregistrées",
      },
      tag_nightlife: {
        title: "Oiseau de nuit",
        description: "12 entrées vie nocturne enregistrées",
      },
      tag_street_food: {
        title: "Légende du street food",
        description: "25 entrées cuisine de rue enregistrées",
      },
      tag_market: {
        title: "Expert des marchés",
        description: "12 entrées marché enregistrées",
      },
      tag_temple: {
        title: "Chercheur de temples",
        description: "10 entrées temple enregistrées",
      },
      historian: {
        title: "Historien",
        description: "40 entrées de voyages passés enregistrées",
      },
      weekend_warrior: {
        title: "Guerrier du week-end",
        description: "8 voyages commencés un week-end",
      },
      weekend_master: {
        title: "Maître du week-end",
        description: "25 voyages commencés un week-end",
      },
      long_haul: {
        title: "Long courrier",
        description: "5 voyages de 7 jours ou plus terminés",
      },
      marathon_traveler: {
        title: "Voyageur marathon",
        description: "15 voyages de 7 jours ou plus terminés",
      },
      quick_escape: {
        title: "Évasion rapide",
        description: "5 voyages de 2 jours ou moins terminés",
      },
      express_traveler: {
        title: "Voyageur express",
        description: "20 voyages de 2 jours ou moins terminés",
      },
      critic: {
        title: "Critique",
        description: "20 entrées notées",
      },
      taste_maker: {
        title: "Faiseur de goût",
        description: "100 entrées notées",
      },
      five_star_finder: {
        title: "Chasseur de cinq étoiles",
        description: "10 expériences cinq étoiles trouvées",
      },
      gold_standard: {
        title: "Standard d'or",
        description: "40 expériences cinq étoiles trouvées",
      },
      high_standards: {
        title: "Exigences élevées",
        description: "Maintenir une note moyenne de 4+",
      },
      note_taker: {
        title: "Preneur de notes",
        description: "Notes ajoutées à 20 entrées",
      },
      storyteller: {
        title: "Conteur",
        description: "Notes ajoutées à 100 entrées",
      },
      visual_logger: {
        title: "Journal visuel",
        description: "Photos ajoutées à 20 entrées",
      },
      photo_journalist: {
        title: "Photojournaliste",
        description: "Photos ajoutées à 100 entrées",
      },
      organizer: {
        title: "Organisateur",
        description: "20 entrées taguées",
      },
      master_organizer: {
        title: "Maître organisateur",
        description: "100 entrées taguées",
      },
      tag_creator: {
        title: "Créateur de tags",
        description: "20 tags uniques créés",
      },
      taxonomy_expert: {
        title: "Expert en taxonomie",
        description: "40 tags uniques créés",
      },
      summer_lover: {
        title: "Amoureux de l'été",
        description: "5 voyages effectués en été",
      },
      sun_chaser: {
        title: "Chasseur de soleil",
        description: "15 voyages effectués en été",
      },
      winter_explorer: {
        title: "Explorateur d'hiver",
        description: "5 voyages effectués en hiver",
      },
      frost_seeker: {
        title: "Chasseur de givre",
        description: "15 voyages effectués en hiver",
      },
      city_hopper_trip: {
        title: "Sauteur de villes",
        description: "2 voyages avec 3+ villes terminés",
      },
      grand_tour: {
        title: "Grand tour",
        description: "10 voyages avec 3+ villes terminés",
      },
      focused_traveler: {
        title: "Voyageur concentré",
        description: "10 voyages d'une seule ville terminés",
      },
      deep_diver: {
        title: "Explorateur en profondeur",
        description: "25 voyages d'une seule ville terminés",
      },
      city_list_first: {
        title: "Créateur de listes",
        description: "Créé votre première liste de villes",
      },
      city_list_halfway: {
        title: "À mi-parcours",
        description: "50% d'une liste de villes complétée",
      },
      city_list_complete: {
        title: "Conquérant de listes",
        description: "Liste de villes complétée à 100%",
      },
    },
    tags: {
      quick: {
        restaurant: "Restaurant",
        cafe: "Café",
        hotel: "Hôtel",
        museum: "Musée",
        cityCenter: "Centre-ville",
        beach: "Plage",
        sea: "Mer",
        park: "Parc",
        shopping: "Shopping",
        bar: "Bar",
        landmark: "Monument",
        mosque: "Mosquée",
        ship: "Bateau",
        temple: "Temple",
        market: "Marché",
        nightlife: "Vie nocturne",
        nature: "Nature",
        adventure: "Aventure",
        localFood: "Cuisine locale",
        streetFood: "Cuisine de rue",
        viewPoint: "Point de vue",
        historic: "Historique",
        art: "Art",
        transport: "Transport",
      },
    },
    dialogs: {
      tagPicker: {
        title: "Ajouter des tags",
        selected: "Sélectionnés",
        addCustom: "Ajouter un tag personnalisé",
        customPlaceholder: "Saisissez un nom de tag...",
        quickTags: "Tags rapides",
        yourTags: "Vos tags",
      },
      cityPicker: {
        label: "Ville",
        placeholder: "Sélectionnez une ville",
        title: "Sélectionner une ville",
        addCity: "Ajouter une ville",
        cityNamePlaceholder: "Nom de la ville",
        noCity: "Aucune ville (non catégorisé)",
        fromDate: "À partir du {date}",
        untilDate: "Jusqu'au {date}",
      },
      cityEditor: {
        label: "Villes",
        empty: "Aucune ville ajoutée",
        addCity: "Ajouter une ville",
        editTitle: "Modifier la ville",
        addTitle: "Ajouter une ville",
        cityNameLabel: "Nom de la ville *",
        cityNamePlaceholder: "ex. Rome, Florence",
        arrivalDateLabel: "Date d'arrivée (optionnelle)",
        departureDateLabel: "Date de départ (optionnelle)",
        notSet: "Non défini",
        fromDate: "À partir du {date}",
        untilDate: "Jusqu'au {date}",
        done: "Terminé",
      },
      cityList: {
        createTitle: "Nouvelle liste de villes",
        addCityTitle: "Ajouter une ville",
        addCityPlaceholder: "Nom de la ville",
        addCityButton: "Ajouter une ville",
        adding: "Ajout...",
        linkTripTitle: "Associer au voyage (optionnel)",
        noTripLinked: "Aucun voyage lié",
      },
    },
    alerts: {
      exportFailedTitle: "Échec de l'exportation",
      exportFailedMessage: "Impossible d'exporter les données. Veuillez réessayer.",
      importComplete: "Importation terminée",
      importCompletedWithErrors: "Importation terminée avec quelques problèmes",
      importFailed: "Échec de l'importation. Veuillez réessayer.",
      errorTitle: "Erreur",
      requiredTitle: "Obligatoire",
      invalidDateTitle: "Date invalide",
      permissionTitle: "Autorisation requise",
      deleteEntryTitle: "Supprimer le souvenir",
      deleteEntryMessage: "Voulez-vous vraiment supprimer ce souvenir ?",
      deletePhotoTitle: "Supprimer la photo",
      deletePhotoMessage: "Voulez-vous vraiment supprimer cette photo ?",
      deleteChapterTitle: "Supprimer le chapitre",
      deleteChapterMessage:
        "Voulez-vous vraiment supprimer ce chapitre ? Cela supprimera également tous les souvenirs.",
      deleteTripTitle: "Supprimer le chapitre",
      deleteTripMessage:
        "Voulez-vous vraiment supprimer ce chapitre ? Cela supprimera également tous les souvenirs.",
      deleteListTitle: "Supprimer la liste",
      deleteListMessage:
        "Voulez-vous vraiment supprimer \"{name}\" ? Cela supprimera également toutes les villes de cette liste.",
      deleteItemTitle: "Supprimer {item}",
      deleteItemMessage: "Voulez-vous vraiment supprimer cet(te) {item} ?",
      deleteEntryFailed: "Impossible de supprimer le souvenir",
      deleteMemoryFailed: "Impossible de supprimer le souvenir",
      deletePhotoFailed: "Impossible de supprimer la photo",
      deleteChapterFailed: "Impossible de supprimer le chapitre",
      deleteTripFailed: "Impossible de supprimer le chapitre",
      deleteListFailed: "Impossible de supprimer la liste",
      createEntryFailed: "Impossible de créer le souvenir. Veuillez réessayer.",
      updateEntryFailed: "Impossible de mettre à jour le souvenir. Veuillez réessayer.",
      createChapterFailed: "Impossible de créer le chapitre. Veuillez réessayer.",
      updateChapterFailed: "Impossible de mettre à jour le chapitre. Veuillez réessayer.",
      createTripFailed: "Impossible de créer le chapitre. Veuillez réessayer.",
      updateTripFailed: "Impossible de mettre à jour le chapitre. Veuillez réessayer.",
      createCityListFailed:
        "Impossible de créer la liste de villes. Veuillez réessayer.",
      createCityFailed: "Impossible de créer la ville. Veuillez réessayer.",
      addCityFailed: "Impossible d'ajouter la ville",
      permissionCameraMessage: "L'accès à la caméra est nécessaire pour prendre des photos",
      invalidDateMessage: "La date de fin ne peut pas être antérieure à la date de début",
      entryDateOutOfRangeTitle: "Date hors plage",
      entryDateOutOfRangeMessage: "La date de l'entrée doit être comprise entre {start} et {end}.",
      requiredEntryTitle: "Veuillez saisir un titre",
      requiredChapterTitle: "Veuillez saisir un titre de chapitre",
      requiredTripTitle: "Veuillez saisir un titre de chapitre",
      requiredTripCity: "Veuillez ajouter au moins une ville",
      requiredListName: "Veuillez saisir un nom de liste",
      requiredCountry: "Veuillez saisir un nom de pays",
      requiredCityName: "Veuillez saisir un nom de ville",
      noProfileFound: "Aucun profil bébé trouvé. Veuillez en créer un d'abord.",
      nothingToShare: "Rien à partager",
      nothingToShareMessage: "Cette ville n'a pas encore d'entrées à partager.",
      shareFailed: "Échec du partage. Veuillez réessayer.",
      chapterLimitTitle: "Limite de chapitres atteinte",
      chapterLimitMessage:
        "Les utilisateurs gratuits peuvent créer jusqu'à {limit} chapitres. Passez à Pro pour des chapitres illimités.",
      chapterLimitUpgrade: "Passer à Pro",
      tripLimitTitle: "Limite de chapitres atteinte",
      tripLimitMessage:
        "Les utilisateurs gratuits peuvent créer jusqu'à {limit} chapitres. Passez à Pro pour des chapitres illimités.",
      tripLimitUpgrade: "Passer à Pro",
      backupReminderTitle: "Sauvegardez vos souvenirs",
      backupReminderMessage:
        "Vous avez créé {count} chapitres ! Pensez à exporter vos données pour les protéger.",
      backupReminderExport: "Exporter maintenant",
      backupReminderLater: "Plus tard",
      proFeatureTitle: "Fonctionnalité Pro",
      proFeatureExport: "L'exportation est une fonctionnalité Pro. Passez à Pro pour exporter vos données.",
      proFeatureAdvancedSearch: "Les filtres de recherche avancés sont une fonctionnalité Pro.",
      proFeatureDarkMode: "Le mode sombre est une fonctionnalité Pro. Passez à Pro pour débloquer tous les thèmes.",
      purchasesUnavailableTitle: "Achats indisponibles",
      purchasesUnavailableMessage: "Les achats ne sont pas disponibles dans cette build.",
      purchasesNotReadyTitle: "Achats non prêts",
      purchasesNotReadyMessage: "Veuillez réessayer dans un instant.",
      purchasesNotConfiguredTitle: "Achats indisponibles",
      purchasesNotConfiguredMessage: "RevenueCat n’est pas encore configuré.",
      restoreTitle: "Restaurer",
      restoreSuccessMessage: "Vos achats ont été restaurés.",
      restoreEmptyMessage: "Aucun abonnement actif à restaurer.",
      restoreFailedMessage: "Échec de la restauration. Veuillez réessayer.",
    },
    limitations: {
      title: "Bon à savoir",
      photosNotBundled: "Les photos ne sont pas incluses dans les exportations - seulement les références aux fichiers locaux",
      noCloudSync: "Toutes les données sont stockées uniquement localement sur votre appareil",
      freeTextCities:
        "Les noms des listes d’étapes sont en texte libre — les doublons sont des listes distinctes",
      noAutoBackup: "Pas de sauvegarde automatique - pensez à exporter vos données régulièrement",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Arrêtez de fouiller dans vos photos",
          body: "Les souvenirs se perdent dans des milliers de photos. Gardez les moments et détails dans une archive claire.",
        },
        structuredArchive: {
          title: "L’histoire de votre bébé, organisée",
          body: "Créez un chapitre, puis ajoutez des étapes et des notes. Tout reste structuré et facile à retrouver.",
        },
        fastSearch: {
          title: "Retrouvez-le en quelques secondes",
          body: "Recherchez dans les chapitres, étapes et notes — instantanément.",
        },
        bestOfList: {
          title: "Capturez les moments importants",
          body: "Marquez les souvenirs importants et ajoutez de courtes notes.",
        },
        noCompetition: {
          title: "Pas de fil. Pas de compétition.",
          body: "C'est votre archive privée. Vos souvenirs — uniquement pour vous.",
        },
        privateOffline: {
          title: "Privé et hors ligne",
          body: "Aucun compte requis. Vos données restent sur votre appareil et fonctionnent même hors ligne.",
        },
        simpleStart: {
          title: "Commencez votre premier chapitre",
          body: "Créez un chapitre en quelques secondes et ajoutez votre premier souvenir.",
        },
      },
      createFirstTrip: "Créer votre premier chapitre",
      next: "Suivant",
      skip: "Passer",
      back: "Retour",
    },
    shareContent: {
      locationLabel: "Lieu",
      summaryLabel: "Résumé",
      noEntries: "Aucune entrée",
      otherEntries: "Autres entrées",
      sharedFrom: "Partagé depuis BabyLegacy",
      tripHighlights: "Points forts du chapitre",
      cities: "Positions",
      places: "Étapes",
      moments: "Notes",
      moreItems: "+ {count} autres",
      fromTrip: "Du chapitre",
      placesSection: "ÉTAPES",
      otherPlaces: "AUTRES ÉTAPES",
      momentsSection: "NOTES",
      myRecommendations: "Mes moments",
      from: "De",
      other: "Autre",
    },
  },
  es: {
    common: {
      appName: "BabyLegacy",
      done: "Listo",
      cancel: "Cancelar",
      delete: "Eliminar",
      save: "Guardar",
      add: "Agregar",
      create: "Crear",
      close: "Cerrar",
      saving: "Guardando...",
      creating: "Creando...",
      adding: "Agregando...",
      entry: "recuerdo",
      entries: "recuerdos",
      memories: "Recuerdos",
      shareTrip: "Compartir capítulo",
    },
    shareDialog: {
      title: "Compartir {name}",
      subtitle: "Elige cómo quieres compartir este capítulo",
      hint: "Tus datos se mantienen privados — compartir crea un archivo local",
      optionTextTitle: "Lista de texto",
      optionTextDescription: "Formato de texto simple, perfecto para mensajería",
      optionImageTitle: "Tarjeta visual",
      optionImageDescription: "Una tarjeta bonita con tus momentos destacados",
      optionPdfTitle: "Documento PDF",
      optionPdfDescription: "Capítulo completo con todos los detalles y notas",
      dialogTitleTrip: "Compartir capítulo {name}",
      dialogTitleCityRecommendations: "Compartir momentos de {name}",
      dialogTitleCityGuide: "Compartir capítulo de {name}",
      dialogTitleCard: "Compartir tarjeta de {name}",
    },
    tabs: {
      chapters: "Capítulos",
      trips: "Capítulos",
      search: "Buscar",
      insights: "Estadísticas",
      settings: "Ajustes",
    },
    navigation: {
      newChapter: "Nuevo capítulo",
      chapter: "Capítulo",
      editChapter: "Editar capítulo",
      newTrip: "Nuevo capítulo",
      trip: "Capítulo",
      editTrip: "Editar capítulo",
      newMemory: "Nuevo recuerdo",
      memory: "Recuerdo",
      editMemory: "Editar recuerdo",
      newEntry: "Nuevo recuerdo",
      entry: "Recuerdo",
      editEntry: "Editar recuerdo",
    },
    chapters: {
      addCover: "Agregar portada",
      days: "{count} días",
      emptyTitle: "Aún no hay capítulos",
      emptySubtitle: "Comienza a registrar los recuerdos de tu bebé",
      emptyButton: "Crea tu primer capítulo",
    },
    trips: {
      addCover: "Agregar portada",
      days: "{count} días",
      emptyTitle: "Aún no hay capítulos",
      emptySubtitle: "Comienza a registrar los recuerdos de tu bebé",
      emptyButton: "Crea tu primer capítulo",
    },
    settings: {
      preferences: "Preferencias",
      appearance: "Apariencia",
      language: "Idioma",
      chooseAppearance: "Elegir apariencia",
      chooseLanguage: "Elegir idioma",
      exportSection: "Exportación",
      exportTitle: "Exportar todos los datos",
      exportDescription:
        "Descarga tus capítulos, recuerdos y etiquetas en JSON o XLS",
      exportButton: "Exportar JSON",
      exportButtonXls: "Exportar XLS",
      exportOpenButton: "Abrir opciones de exportación",
      exportInfoTitle: "¿Por qué exportar?",
      exportInfoDescription:
        "Mantén una copia de seguridad, cambia de teléfono o analiza tus recuerdos en una hoja de cálculo. Las exportaciones se quedan en tu dispositivo hasta que las compartas.",
      exportPrivacyNote:
        "Los archivos exportados pueden incluir notas personales. Comparte con cuidado.",
      exportPhotosNote:
        "Las fotos no se incluyen en la exportación.",
      exportFormatsTitle: "Elige un formato",
      exportFormatsDescription:
        "JSON es ideal para copias de seguridad y reimportación. XLS se abre fácilmente en Excel o Google Sheets.",
      importSection: "Importación",
      importTitle: "Importar datos",
      importDescription: "Importa tus capítulos y recuerdos desde un archivo JSON.",
      importButton: "Importar JSON",
      importButtonImporting: "Importando...",
      dataSection: "Datos",
      dataTitle: "Exportar e importar",
      dataDescription: "Haz copia o traslada tus recuerdos con exportación e importación.",
      dataButton: "Ver opciones",
      supportSection: "Soporte",
      supportRate: "Danos 5 estrellas",
      supportShare: "Compartir la app",
      supportContact: "Contáctanos",
      supportShareMessage:
        "BabyLegacy - un archivo familiar privado que me encanta: {link}",
      onboardingSection: "Introducción",
      onboardingTitle: "Mostrar la introducción de nuevo",
      onboardingDescription: "Reproduce la introducción de 7 pantallas en cualquier momento.",
      onboardingButton: "Iniciar introducción",
      onboardingResetTitle: "¿Iniciar la introducción?",
      onboardingResetMessage: "Esto mostrará de nuevo el flujo de introducción. Puedes omitirlo en cualquier momento.",
      onboardingResetAction: "Iniciar",
      aboutSection: "Acerca de",
      version: "Versión",
      storage: "Almacenamiento",
      privacy: "Privacidad",
      storageValue: "Los datos permanecen en tu dispositivo.",
      privacyValue: "Sin conexión",
      footer: "BabyLegacy — tu archivo familiar privado",
      themeLight: "Claro",
      themeDark: "Oscuro",
      themeSystem: "Sistema",
    },
    proBanner: {
      title: "Hazte Pro",
      subtitle: "Desbloquea todas las funciones.",
      cta: "Hazte Pro",
      messages: [
        { title: "Hazte Pro", subtitle: "Desbloquea todas las funciones." },
        { title: "Menos scroll, más significado", subtitle: "Encuentra los momentos importantes al instante." },
        { title: "Recuerda todo", subtitle: "Guarda los pequeños momentos con seguridad." },
        { title: "Tu archivo familiar", subtitle: "Acceso instantáneo a cada capítulo." },
        { title: "Encuentra en segundos", subtitle: "Busca por título, notas o etiquetas." },
        { title: "Crece sin límites", subtitle: "Capítulos ilimitados. Recuerdos ilimitados." },
      ],
    },
    labels: {
      date: "Fecha",
      startDate: "Fecha de inicio",
      endDate: "Fecha de fin",
    },
    placeholders: {
      search: "Buscar capítulos, recuerdos, notas...",
      tripTitle: "p. ej., Primer año",
      tripSummary: "Breve descripción de este capítulo...",
      chapterTitle: "p. ej., 0–3 meses",
      chapterDescription: "Breve descripción de este capítulo...",
      entryTitlePlace: "p. ej., Primera sonrisa",
      entryTitleMoment: "p. ej., Una tarde tranquila",
      memoryTitleMilestone: "Primera sonrisa, Primeros pasos...",
      memoryTitleNote: "Una tarde tranquila, Momento divertido...",
      entryNotes: "Agregar detalles...",
      cityListName: "p. ej., Hitos, Tradiciones familiares",
      countryName: "p. ej., Casa, con la abuela",
    },
    chapterForm: {
      titleLabel: "Título del capítulo *",
      descriptionLabel: "Descripción (opcional)",
      coverImageLabel: "Imagen de portada (opcional)",
      changeCover: "Cambiar",
      addCoverPlaceholder: "Toca para agregar una portada",
    },
    tripForm: {
      titleLabel: "Título del capítulo *",
      summaryLabel: "Descripción (opcional)",
      coverImageLabel: "Imagen de portada (opcional)",
      changeCover: "Cambiar",
      addCoverPlaceholder: "Toca para agregar una portada",
    },
    memoryForm: {
      titleLabel: "Título *",
      locationLabel: "Lugar",
      importanceLabel: "IMPORTANCIA",
      descriptionLabel: "Descripción",
      tagsLabel: "Etiquetas",
      milestone: "Hito",
      note: "Nota",
    },
    entryForm: {
      titleLabel: "Título *",
      ratingLabel: "Importancia",
      notesLabel: "Notas",
      tagsLabel: "Etiquetas",
      photosLabel: "Fotos ({count}/{max})",
      gallery: "Galería",
      camera: "Cámara",
      tapToAddTags: "Toca para agregar etiquetas...",
      place: "Hito",
      moment: "Nota",
      moreTags: "+{count} más",
      locationLabel: "Lugar",
      locationPlaceholder: "Agregar lugar (opcional)",
      locationHint: "Agrega un lugar si ayuda al recuerdo",
    },
    memoryDetail: {
      descriptionTitle: "Descripción",
      tagsTitle: "Etiquetas",
    },
    entryDetail: {
      notesTitle: "Notas",
      tagsTitle: "Etiquetas",
      allPhotos: "Todas las fotos ({count})",
      created: "Creado: {date}",
      updated: "Actualizado: {date}",
      locationTitle: "Ubicación",
      openInMaps: "Abrir en Mapas",
    },
    chapterDetail: {
      noPhoto: "Sin foto",
      notePill: "Nota",
      uncategorized: "Sin categoría",
      emptyTitle: "Aún no hay recuerdos",
      emptySubtitle: "Empieza a añadir recuerdos a este capítulo",
      addFirstMemory: "Agregar el primer recuerdo",
      addMemory: "Agregar recuerdo",
    },
    tripDetail: {
      noPhoto: "Sin foto",
      notePill: "Nota",
      uncategorized: "Sin categoría",
      emptyTitle: "Aún no hay recuerdos",
      emptySubtitle: "Empieza a añadir recuerdos a este capítulo",
      addFirstEntry: "Agregar el primer recuerdo",
      addEntry: "Agregar recuerdo",
    },
    memories: {
      memory: "Recuerdo",
      milestone: "Hito",
      note: "Nota",
      notePill: "NOTA",
      noPhoto: "Sin foto",
    },
    cityLists: {
      title: "Listas de ciudades",
      listNameLabel: "Nombre de la lista *",
      listTypeLabel: "Tipo de lista",
      countryLabel: "País *",
      typeCustom: "Personalizada",
      typeCountry: "País",
      typeHintCustom: "Crea una lista personalizada de ciudades que quieres seguir",
      typeHintCountry: "Crea una lista de ciudades dentro de un país específico",
      emptyTitle: "Aún no hay listas de ciudades",
      emptyDescription:
        "Crea listas de ciudades que quieras visitar y sigue tu progreso",
      createFirstList: "Crea tu primera lista",
      progressVisited: "{visited}/{total} visitadas ({percent}%)",
      detailProgress: "{visited} de {total} ciudades visitadas ({percent}%)",
      detailEmptyTitle: "Aún no hay ciudades",
      detailEmptyDescription:
        "Agrega ciudades que quieras visitar y sigue tu progreso",
      detailAddCity: "Agregar ciudad",
      detailVisited: "Visitadas",
      notFound: "Lista de ciudades no encontrada",
      loading: "Cargando...",
    },
    search: {
      emptyTitle: "Busca tus recuerdos",
      emptySubtitle:
        "Encuentra capítulos y recuerdos por título, descripción, notas o etiquetas",
      noResultsTitle: "No se encontraron resultados",
      noResultsSubtitle: "Prueba con otras palabras clave",
      showLabel: "Mostrar",
      memoryTypeLabel: "Tipo de recuerdo",
      minImportanceLabel: "Importancia mín.",
      entryTypeLabel: "Tipo de recuerdo",
      minRatingLabel: "Importancia mín.",
      tagsLabel: "Etiquetas",
      clearFilters: "Limpiar filtros",
      filterAll: "Todos",
      filterChapters: "Capítulos",
      filterMemories: "Recuerdos",
      filterTrips: "Capítulos",
      filterEntries: "Recuerdos",
      filterAny: "Cualquiera",
      filterMilestones: "Hitos",
      filterNotes: "Notas",
      filterPlaces: "Hitos",
      filterMoments: "Notas",
      matchedIn: "Coincidencia en {field}:",
      inChapter: "en {chapter}",
      inTrip: "en {chapter}",
      matchFieldTitle: "título",
      matchFieldLocation: "ubicación",
      matchFieldSummary: "descripción",
      matchFieldNotes: "notas",
      matchFieldTag: "etiqueta",
      matchFieldCity: "ciudad",
    },
    insights: {
      sectionStats: "Tus estadísticas",
      statsChapters: "Capítulos",
      statsMemories: "Recuerdos",
      statsTrips: "Capítulos",
      statsEntries: "Recuerdos",
      statsCities: "Lugares",
      statsCountries: "Ubicaciones",
      statsPhotos: "Fotos",
      statsImportant: "Importantes",
      statsTripDays: "Días de capítulo",
      memoriesBreakdown: "{milestones} hitos, {notes} notas",
      entriesBreakdown: "{milestones} hitos, {notes} notas",
      highlightMostVisited: "Más visitado",
      highlightFirstTrip: "Primer capítulo",
      highlightFirstMemory: "Primer recuerdo",
      highlightAvgRating: "Importancia media",
      highlightImportant: "Más importante",
      topTags: "Etiquetas principales",
      cityProgress: "Listas de hitos",
      seeAll: "Ver todo",
      createFirstCityList: "Crea tu primera lista de hitos",
      cityListsEmptyHint: "Sigue los hitos que quieres recordar",
      cityListCount: "{visited}/{total} elementos",
      moreLists: "+{count} listas más",
      achievements: "Logros",
      viewAll: "Ver todo",
      noBadgesEarned: "Aún no has ganado insignias",
      badgesEmptyHint: "Sigue guardando recuerdos para desbloquear logros",
      moreBadges: "+{count} insignias más",
      badgesProgress: "{unlocked} de {total} insignias obtenidas",
    },
    badges: {
      earned: "Obtenida",
      locked: "Bloqueada",
      allBadges: "Todas las insignias",
      badgesEarned: "Insignias obtenidas",
      special: "Especial",
      tagAdventures: "Hitos de etiquetas",
      firstSteps: "Primeros pasos",
      tripMilestones: "Hitos de capítulos",
      placeMilestones: "Recuerdos de hitos",
      entryMilestones: "Hitos de recuerdos",
      countryMilestones: "Hitos de ubicaciones",
      photoMilestones: "Hitos de fotos",
      cityMilestones: "Hitos de ubicaciones",
      cityListAchievements: "Logros de listas de ciudades",
      badgeUnlocked: "¡Insignia desbloqueada!",
    },
    badgeDetail: {
      congratulations: "¡Felicidades!",
      earnedOn: "Obtenida el {date}",
      notYetEarned: "Aún no obtenida",
    },
    badgeItems: {
      first_trip: {
        title: "Primer viaje",
        description: "Creaste tu primer viaje",
      },
      first_place: {
        title: "Primer lugar",
        description: "Guardaste tu primer lugar",
      },
      first_moment: {
        title: "Primer momento",
        description: "Capturaste tu primer momento",
      },
      first_tag: {
        title: "Primera etiqueta",
        description: "Creaste tu primera etiqueta",
      },
      trips_3: {
        title: "Explorador",
        description: "Registraste 5 viajes",
      },
      trips_10: {
        title: "Aventurero",
        description: "Registraste 15 viajes",
      },
      trips_25: {
        title: "Trotamundos",
        description: "Registraste 30 viajes",
      },
      places_10: {
        title: "Cazador de lugares",
        description: "Guardaste 15 lugares",
      },
      places_25: {
        title: "Coleccionista de lugares",
        description: "Guardaste 40 lugares",
      },
      places_100: {
        title: "Maestro de lugares",
        description: "Guardaste 150 lugares",
      },
      entries_25: {
        title: "Guardián de recuerdos",
        description: "Creaste 40 entradas",
      },
      entries_100: {
        title: "Historiador",
        description: "Creaste 150 entradas",
      },
      countries_3: {
        title: "Cruza fronteras",
        description: "Visitaste 5 países",
      },
      countries_5: {
        title: "Viajero del mundo",
        description: "Visitaste 8 países",
      },
      countries_10: {
        title: "Continental",
        description: "Visitaste 15 países",
      },
      photos_10: {
        title: "Aficionado a la cámara",
        description: "Tomaste 25 fotos",
      },
      photos_50: {
        title: "Fotógrafo",
        description: "Tomaste 100 fotos",
      },
      photos_200: {
        title: "Archivista de fotos",
        description: "Tomaste 400 fotos",
      },
      cities_5: {
        title: "Saltador de ciudades",
        description: "Visitaste 10 ciudades",
      },
      cities_20: {
        title: "Explorador urbano",
        description: "Visitaste 40 ciudades",
      },
      tag_pizza: {
        title: "Peregrino de la pizza",
        description: "Registraste 20 entradas de pizza",
      },
      tag_cafe: {
        title: "Cliente habitual del café",
        description: "Registraste 25 entradas de café",
      },
      tag_museum: {
        title: "Experto en museos",
        description: "Registraste 15 entradas de museo",
      },
      tag_beach: {
        title: "Explorador de playas",
        description: "Registraste 12 entradas de playa",
      },
      tag_nightlife: {
        title: "Noctámbulo",
        description: "Registraste 12 entradas de vida nocturna",
      },
      tag_street_food: {
        title: "Leyenda del street food",
        description: "Registraste 25 entradas de comida callejera",
      },
      tag_market: {
        title: "Experto en mercados",
        description: "Registraste 12 entradas de mercado",
      },
      tag_temple: {
        title: "Buscador de templos",
        description: "Registraste 10 entradas de templo",
      },
      historian: {
        title: "Historiador",
        description: "Registraste 40 entradas de viajes pasados",
      },
      weekend_warrior: {
        title: "Guerrero de fin de semana",
        description: "Iniciaste 8 viajes en fin de semana",
      },
      weekend_master: {
        title: "Maestro del fin de semana",
        description: "Iniciaste 25 viajes en fin de semana",
      },
      long_haul: {
        title: "Largo recorrido",
        description: "Completaste 5 viajes de 7+ días",
      },
      marathon_traveler: {
        title: "Viajero maratonista",
        description: "Completaste 15 viajes de 7+ días",
      },
      quick_escape: {
        title: "Escape rápido",
        description: "Completaste 5 viajes de 2 días o menos",
      },
      express_traveler: {
        title: "Viajero exprés",
        description: "Completaste 20 viajes de 2 días o menos",
      },
      critic: {
        title: "Crítico",
        description: "Valoraste 20 entradas",
      },
      taste_maker: {
        title: "Creador de gusto",
        description: "Valoraste 100 entradas",
      },
      five_star_finder: {
        title: "Buscador de cinco estrellas",
        description: "Encontraste 10 experiencias de cinco estrellas",
      },
      gold_standard: {
        title: "Estándar de oro",
        description: "Encontraste 40 experiencias de cinco estrellas",
      },
      high_standards: {
        title: "Altos estándares",
        description: "Mantén una puntuación media de 4+",
      },
      note_taker: {
        title: "Tomador de notas",
        description: "Añadiste notas a 20 entradas",
      },
      storyteller: {
        title: "Narrador",
        description: "Añadiste notas a 100 entradas",
      },
      visual_logger: {
        title: "Diario visual",
        description: "Añadiste fotos a 20 entradas",
      },
      photo_journalist: {
        title: "Fotoperiodista",
        description: "Añadiste fotos a 100 entradas",
      },
      organizer: {
        title: "Organizador",
        description: "Etiquetaste 20 entradas",
      },
      master_organizer: {
        title: "Organizador experto",
        description: "Etiquetaste 100 entradas",
      },
      tag_creator: {
        title: "Creador de etiquetas",
        description: "Creaste 20 etiquetas únicas",
      },
      taxonomy_expert: {
        title: "Experto en taxonomía",
        description: "Creaste 40 etiquetas únicas",
      },
      summer_lover: {
        title: "Amante del verano",
        description: "Hiciste 5 viajes en meses de verano",
      },
      sun_chaser: {
        title: "Cazador del sol",
        description: "Hiciste 15 viajes en meses de verano",
      },
      winter_explorer: {
        title: "Explorador de invierno",
        description: "Hiciste 5 viajes en meses de invierno",
      },
      frost_seeker: {
        title: "Cazador de escarcha",
        description: "Hiciste 15 viajes en meses de invierno",
      },
      city_hopper_trip: {
        title: "Saltador de ciudades",
        description: "Completaste 2 viajes con 3+ ciudades",
      },
      grand_tour: {
        title: "Gran tour",
        description: "Completaste 10 viajes con 3+ ciudades",
      },
      focused_traveler: {
        title: "Viajero enfocado",
        description: "Completaste 10 viajes de una sola ciudad",
      },
      deep_diver: {
        title: "Explorador profundo",
        description: "Completaste 25 viajes de una sola ciudad",
      },
      city_list_first: {
        title: "Creador de listas",
        description: "Creaste tu primera lista de ciudades",
      },
      city_list_halfway: {
        title: "A mitad de camino",
        description: "Completaste el 50% de una lista de ciudades",
      },
      city_list_complete: {
        title: "Conquistador de listas",
        description: "Completaste una lista de ciudades al 100%",
      },
    },
    tags: {
      quick: {
        restaurant: "Restaurante",
        cafe: "Café",
        hotel: "Hotel",
        museum: "Museo",
        cityCenter: "Centro de la ciudad",
        beach: "Playa",
        sea: "Mar",
        park: "Parque",
        shopping: "Compras",
        bar: "Bar",
        landmark: "Monumento",
        mosque: "Mezquita",
        ship: "Barco",
        temple: "Templo",
        market: "Mercado",
        nightlife: "Vida nocturna",
        nature: "Naturaleza",
        adventure: "Aventura",
        localFood: "Comida local",
        streetFood: "Comida callejera",
        viewPoint: "Mirador",
        historic: "Histórico",
        art: "Arte",
        transport: "Transporte",
      },
    },
    dialogs: {
      tagPicker: {
        title: "Agregar etiquetas",
        selected: "Seleccionadas",
        addCustom: "Agregar etiqueta personalizada",
        customPlaceholder: "Escribe un nombre de etiqueta...",
        quickTags: "Etiquetas rápidas",
        yourTags: "Tus etiquetas",
      },
      cityPicker: {
        label: "Ciudad",
        placeholder: "Selecciona una ciudad",
        title: "Seleccionar ciudad",
        addCity: "Agregar ciudad",
        cityNamePlaceholder: "Nombre de la ciudad",
        noCity: "Sin ciudad (sin categoría)",
        fromDate: "Desde {date}",
        untilDate: "Hasta {date}",
      },
      cityEditor: {
        label: "Ciudades",
        empty: "Aún no hay ciudades",
        addCity: "Agregar ciudad",
        editTitle: "Editar ciudad",
        addTitle: "Agregar ciudad",
        cityNameLabel: "Nombre de la ciudad *",
        cityNamePlaceholder: "p. ej., Roma, Florencia",
        arrivalDateLabel: "Fecha de llegada (opcional)",
        departureDateLabel: "Fecha de salida (opcional)",
        notSet: "No establecido",
        fromDate: "Desde {date}",
        untilDate: "Hasta {date}",
        done: "Listo",
      },
      cityList: {
        createTitle: "Nueva lista de ciudades",
        addCityTitle: "Agregar ciudad",
        addCityPlaceholder: "Nombre de la ciudad",
        addCityButton: "Agregar ciudad",
        adding: "Agregando...",
        linkTripTitle: "Vincular al viaje (opcional)",
        noTripLinked: "Ningún viaje vinculado",
      },
    },
    alerts: {
      exportFailedTitle: "Error de exportación",
      exportFailedMessage: "No se pudieron exportar los datos. Inténtalo de nuevo.",
      importComplete: "Importación completada",
      importCompletedWithErrors: "Importación completada con algunos problemas",
      importFailed: "Error en la importación. Inténtalo de nuevo.",
      errorTitle: "Error",
      requiredTitle: "Obligatorio",
      invalidDateTitle: "Fecha inválida",
      permissionTitle: "Permiso necesario",
      deleteEntryTitle: "Eliminar recuerdo",
      deleteEntryMessage: "¿Seguro que quieres eliminar este recuerdo?",
      deletePhotoTitle: "Eliminar foto",
      deletePhotoMessage: "¿Seguro que quieres eliminar esta foto?",
      deleteChapterTitle: "Eliminar capítulo",
      deleteChapterMessage:
        "¿Seguro que quieres eliminar este capítulo? Esto también eliminará todos los recuerdos.",
      deleteTripTitle: "Eliminar capítulo",
      deleteTripMessage:
        "¿Seguro que quieres eliminar este capítulo? Esto también eliminará todos los recuerdos.",
      deleteListTitle: "Eliminar lista",
      deleteListMessage:
        "¿Seguro que quieres eliminar \"{name}\"? Esto también eliminará todas las ciudades de esta lista.",
      deleteItemTitle: "Eliminar {item}",
      deleteItemMessage: "¿Seguro que quieres eliminar este {item}?",
      deleteEntryFailed: "No se pudo eliminar el recuerdo",
      deleteMemoryFailed: "No se pudo eliminar el recuerdo",
      deletePhotoFailed: "No se pudo eliminar la foto",
      deleteChapterFailed: "No se pudo eliminar el capítulo",
      deleteTripFailed: "No se pudo eliminar el capítulo",
      deleteListFailed: "No se pudo eliminar la lista",
      createEntryFailed: "No se pudo crear el recuerdo. Inténtalo de nuevo.",
      updateEntryFailed: "No se pudo actualizar el recuerdo. Inténtalo de nuevo.",
      createChapterFailed: "No se pudo crear el capítulo. Inténtalo de nuevo.",
      updateChapterFailed: "No se pudo actualizar el capítulo. Inténtalo de nuevo.",
      createTripFailed: "No se pudo crear el capítulo. Inténtalo de nuevo.",
      updateTripFailed: "No se pudo actualizar el capítulo. Inténtalo de nuevo.",
      createCityListFailed:
        "No se pudo crear la lista de ciudades. Inténtalo de nuevo.",
      createCityFailed: "No se pudo crear la ciudad. Inténtalo de nuevo.",
      addCityFailed: "No se pudo agregar la ciudad",
      permissionCameraMessage: "Se requiere acceso a la cámara para tomar fotos",
      invalidDateMessage: "La fecha de fin no puede ser anterior a la fecha de inicio",
      entryDateOutOfRangeTitle: "Fecha fuera de rango",
      entryDateOutOfRangeMessage: "La fecha de la entrada debe estar entre {start} y {end}.",
      requiredEntryTitle: "Por favor, introduce un título",
      requiredChapterTitle: "Por favor, introduce un título del capítulo",
      requiredTripTitle: "Por favor, introduce un título del capítulo",
      requiredTripCity: "Por favor, agrega al menos una ciudad",
      requiredListName: "Por favor, introduce un nombre de lista",
      requiredCountry: "Por favor, introduce un nombre de país",
      requiredCityName: "Por favor, introduce un nombre de ciudad",
      noProfileFound: "No se encontró un perfil de bebé. Crea uno primero.",
      nothingToShare: "Nada que compartir",
      nothingToShareMessage: "Esta ciudad aún no tiene entradas para compartir.",
      shareFailed: "Error al compartir. Inténtalo de nuevo.",
      chapterLimitTitle: "Límite de capítulos alcanzado",
      chapterLimitMessage:
        "Los usuarios gratuitos pueden crear hasta {limit} capítulos. Mejora a Pro para capítulos ilimitados.",
      chapterLimitUpgrade: "Mejorar a Pro",
      tripLimitTitle: "Límite de capítulos alcanzado",
      tripLimitMessage:
        "Los usuarios gratuitos pueden crear hasta {limit} capítulos. Mejora a Pro para capítulos ilimitados.",
      tripLimitUpgrade: "Mejorar a Pro",
      backupReminderTitle: "Guarda tus recuerdos",
      backupReminderMessage:
        "¡Has creado {count} capítulos! Considera exportar tus datos para mantenerlos seguros.",
      backupReminderExport: "Exportar ahora",
      backupReminderLater: "Más tarde",
      proFeatureTitle: "Función Pro",
      proFeatureExport: "La exportación es una función Pro. Mejora a Pro para exportar tus datos.",
      proFeatureAdvancedSearch: "Los filtros de búsqueda avanzados son una función Pro.",
      proFeatureDarkMode: "El modo oscuro es una función Pro. Mejora a Pro para desbloquear todos los temas.",
      purchasesUnavailableTitle: "Compras no disponibles",
      purchasesUnavailableMessage: "Las compras no están disponibles en esta build.",
      purchasesNotReadyTitle: "Compras no listas",
      purchasesNotReadyMessage: "Inténtalo de nuevo en un momento.",
      purchasesNotConfiguredTitle: "Compras no disponibles",
      purchasesNotConfiguredMessage: "RevenueCat aún no está configurado.",
      restoreTitle: "Restaurar",
      restoreSuccessMessage: "Tus compras se restauraron correctamente.",
      restoreEmptyMessage: "No hay suscripciones activas para restaurar.",
      restoreFailedMessage: "Falló la restauración. Inténtalo de nuevo.",
    },
    limitations: {
      title: "Bueno saber",
      photosNotBundled: "Las fotos no se incluyen en las exportaciones - solo referencias a archivos locales",
      noCloudSync: "Todos los datos se almacenan solo localmente en tu dispositivo",
      freeTextCities:
        "Los nombres de las listas de hitos son texto libre — los duplicados son listas separadas",
      noAutoBackup: "Sin copias de seguridad automáticas - recuerda exportar tus datos regularmente",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Deja de buscar entre fotos",
          body: "Los recuerdos se pierden entre miles de fotos. Guarda momentos y detalles en un archivo ordenado.",
        },
        structuredArchive: {
          title: "La historia de tu bebé, organizada",
          body: "Crea un capítulo y luego añade hitos y notas. Todo queda estructurado y fácil de volver a ver.",
        },
        fastSearch: {
          title: "Encuéntralo en segundos",
          body: "Busca en capítulos, hitos y notas — al instante.",
        },
        bestOfList: {
          title: "Captura los momentos importantes",
          body: "Marca recuerdos importantes y añade notas breves.",
        },
        noCompetition: {
          title: "Sin feed. Sin competencia.",
          body: "Este es tu archivo privado. Tus recuerdos — solo para ti.",
        },
        privateOffline: {
          title: "Privado y sin conexión",
          body: "No se requiere cuenta. Tus datos se quedan en tu dispositivo y funcionan incluso sin conexión.",
        },
        simpleStart: {
          title: "Empieza tu primer capítulo",
          body: "Crea un capítulo en segundos y añade tu primer recuerdo.",
        },
      },
      createFirstTrip: "Crea tu primer capítulo",
      next: "Siguiente",
      skip: "Omitir",
      back: "Atrás",
    },
    shareContent: {
      locationLabel: "Ubicación",
      summaryLabel: "Resumen",
      noEntries: "Sin entradas",
      otherEntries: "Otras entradas",
      sharedFrom: "Compartido desde BabyLegacy",
      tripHighlights: "Momentos destacados del capítulo",
      cities: "Ubicaciones",
      places: "Hitos",
      moments: "Notas",
      moreItems: "+ {count} más",
      fromTrip: "Del capítulo",
      placesSection: "HITOS",
      otherPlaces: "OTROS HITOS",
      momentsSection: "NOTAS",
      myRecommendations: "Mis momentos",
      from: "De",
      other: "Otro",
    },
  },
  tr: {
    common: {
      appName: "BabyLegacy",
      done: "Tamam",
      cancel: "İptal",
      delete: "Sil",
      save: "Kaydet",
      add: "Ekle",
      create: "Oluştur",
      close: "Kapat",
      saving: "Kaydediliyor...",
      creating: "Oluşturuluyor...",
      adding: "Ekleniyor...",
      entry: "Anı",
      entries: "Anılar",
      memories: "Anılar",
      shareTrip: "Bölümü paylaş",
    },
    shareDialog: {
      title: "{name} paylaş",
      subtitle: "Bu bölümü nasıl paylaşmak istediğini seç",
      hint: "Verilerin gizli kalır — paylaşım yerel bir dosya oluşturur",
      optionTextTitle: "Metin listesi",
      optionTextDescription: "Basit metin formatı, mesajlaşma için ideal",
      optionImageTitle: "Görsel kart",
      optionImageDescription: "Öne çıkan anılarla şık bir kart",
      optionPdfTitle: "PDF belgesi",
      optionPdfDescription: "Tüm detaylar ve notlarla tam bölüm",
      dialogTitleTrip: "{name} bölümünü paylaş",
      dialogTitleCityRecommendations: "{name} öne çıkanlarını paylaş",
      dialogTitleCityGuide: "{name} bölümünü paylaş",
      dialogTitleCard: "{name} kartını paylaş",
    },
    tabs: {
      chapters: "Bölümler",
      trips: "Bölümler",
      search: "Arama",
      insights: "İstatistikler",
      settings: "Ayarlar",
    },
    navigation: {
      newChapter: "Yeni Bölüm",
      chapter: "Bölüm",
      editChapter: "Bölümü Düzenle",
      newTrip: "Yeni Bölüm",
      trip: "Bölüm",
      editTrip: "Bölümü Düzenle",
      newMemory: "Yeni Anı",
      memory: "Anı",
      editMemory: "Anıyı Düzenle",
      newEntry: "Yeni Anı",
      entry: "Anı",
      editEntry: "Anıyı Düzenle",
    },
    chapters: {
      addCover: "Kapak ekle",
      days: "{count} gün",
      emptyTitle: "Henüz bölüm yok",
      emptySubtitle: "Bebeğinizin anılarını kaydetmeye başlayın",
      emptyButton: "İlk Bölümünü Oluştur",
    },
    trips: {
      addCover: "Kapak ekle",
      days: "{count} gün",
      emptyTitle: "Henüz bölüm yok",
      emptySubtitle: "Bebeğinizin anılarını kaydetmeye başlayın",
      emptyButton: "İlk Bölümünü Oluştur",
    },
    settings: {
      preferences: "Tercihler",
      appearance: "Görünüm",
      language: "Dil",
      chooseAppearance: "Görünümü Seç",
      chooseLanguage: "Dili Seç",
      exportSection: "Dışa Aktar",
      exportTitle: "Tüm Verileri Dışa Aktar",
      exportDescription:
        "Bölümlerini, anılarını ve etiketlerini JSON veya XLS olarak indir",
      exportButton: "JSON Dışa Aktar",
      exportButtonXls: "XLS Dışa Aktar",
      exportOpenButton: "Dışa aktarma seçenekleri",
      exportInfoTitle: "Neden dışa aktar?",
      exportInfoDescription:
        "Kişisel bir yedek oluştur, yeni telefona geç ya da anılarını bir tabloda analiz et. Dışa aktarımlar sen paylaşana kadar cihazında kalır.",
      exportPrivacyNote:
        "Dışa aktarma dosyaları kişisel notlar içerebilir. Dikkatli paylaş.",
      exportPhotosNote:
        "Fotoğrafların kendisi dışa aktarıma dahil edilmez.",
      exportFormatsTitle: "Bir format seç",
      exportFormatsDescription:
        "JSON yedekleme ve yeniden içe aktarma için idealdir. XLS Excel veya Google Sheets’te kolayca açılır.",
      importSection: "İçe Aktar",
      importTitle: "Verileri İçe Aktar",
      importDescription: "JSON dosyasından kayıtlı bölümlerini ve anılarını içe aktar.",
      importButton: "JSON İçe Aktar",
      importButtonImporting: "İçe aktarılıyor...",
      dataSection: "Veriler",
      dataTitle: "Dışa Aktar ve İçe Aktar",
      dataDescription: "Anılarını dışa/içe aktarma ile yedekle veya taşı.",
      dataButton: "Seçenekleri gör",
      supportSection: "Destek",
      supportRate: "Bize 5 yıldız ver",
      supportShare: "Uygulamayı paylaş",
      supportContact: "Bizimle iletişime geç",
      supportShareMessage:
        "BabyLegacy - özel bir aile arşivi uygulaması buldum, bir bak: {link}",
      onboardingSection: "Tanıtım",
      onboardingTitle: "Tanıtımı tekrar göster",
      onboardingDescription: "7 ekranlık tanıtımı istediğin zaman tekrar oynat.",
      onboardingButton: "Tanıtımı başlat",
      onboardingResetTitle: "Tanıtım başlatılsın mı?",
      onboardingResetMessage: "Bu, tanıtım akışını yeniden gösterecek. İstediğin zaman atlayabilirsin.",
      onboardingResetAction: "Başlat",
      aboutSection: "Hakkında",
      version: "Sürüm",
      storage: "Depolama",
      privacy: "Gizlilik",
      storageValue: "Veriler cihazında kalır.",
      privacyValue: "Çevrimdışı",
      footer: "BabyLegacy — özel aile arşivin",
      themeLight: "Açık",
      themeDark: "Koyu",
      themeSystem: "Sistem",
    },
    proBanner: {
      title: "Pro'ya Geç",
      subtitle: "Tüm özelliklerin kilidini aç.",
      cta: "Pro'ya Geç",
      messages: [
        { title: "Pro'ya Geç", subtitle: "Tüm özelliklerin kilidini aç." },
        { title: "Daha az kaydır, daha çok anlam", subtitle: "Önemli anıları anında bul." },
        { title: "Her şeyi hatırla", subtitle: "Küçük anları güvenle sakla." },
        { title: "Aile arşivin", subtitle: "Her bölüme anında erişim." },
        { title: "Saniyeler içinde bul", subtitle: "Başlık, not veya etiketle ara." },
        { title: "Sınırsız büyü", subtitle: "Sınırsız bölüm. Sınırsız anı." },
      ],
    },
    labels: {
      date: "Tarih",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
    },
    placeholders: {
      search: "Bölümleri, anıları, notları ara...",
      tripTitle: "örn. İlk Yıl",
      tripSummary: "Bu bölümün kısa açıklaması...",
      chapterTitle: "örn. 0–3 Ay",
      chapterDescription: "Bu bölümün kısa açıklaması...",
      entryTitlePlace: "örn. İlk gülümseme",
      entryTitleMoment: "örn. Sakin bir öğleden sonra",
      memoryTitleMilestone: "İlk gülümseme, İlk adım...",
      memoryTitleNote: "Sakin bir öğleden sonra, Komik bir an...",
      entryNotes: "Detay ekle...",
      cityListName: "örn. Kilometre taşları, Aile gelenekleri",
      countryName: "örn. Ev, anneanne evi",
    },
    chapterForm: {
      titleLabel: "Bölüm Başlığı *",
      descriptionLabel: "Açıklama (isteğe bağlı)",
      coverImageLabel: "Kapak Görseli (isteğe bağlı)",
      changeCover: "Değiştir",
      addCoverPlaceholder: "Kapak görseli eklemek için dokun",
    },
    tripForm: {
      titleLabel: "Bölüm Başlığı *",
      summaryLabel: "Açıklama (isteğe bağlı)",
      coverImageLabel: "Kapak Görseli (isteğe bağlı)",
      changeCover: "Değiştir",
      addCoverPlaceholder: "Kapak görseli eklemek için dokun",
    },
    memoryForm: {
      titleLabel: "Başlık *",
      locationLabel: "Konum",
      importanceLabel: "ÖNEM",
      descriptionLabel: "Açıklama",
      tagsLabel: "Etiketler",
      milestone: "Kilometre Taşı",
      note: "Not",
    },
    entryForm: {
      titleLabel: "Başlık *",
      ratingLabel: "Önem",
      notesLabel: "Notlar",
      tagsLabel: "Etiketler",
      photosLabel: "Fotoğraflar ({count}/{max})",
      gallery: "Galeri",
      camera: "Kamera",
      tapToAddTags: "Etiket eklemek için dokun...",
      place: "Kilometre Taşı",
      moment: "Not",
      moreTags: "+{count} daha",
      locationLabel: "Konum",
      locationPlaceholder: "İsteğe bağlı konum ekle",
      locationHint: "Anıya yardımcı olacaksa konum ekle",
    },
    memoryDetail: {
      descriptionTitle: "Açıklama",
      tagsTitle: "Etiketler",
    },
    entryDetail: {
      notesTitle: "Notlar",
      tagsTitle: "Etiketler",
      allPhotos: "Tüm Fotoğraflar ({count})",
      created: "Oluşturuldu: {date}",
      updated: "Güncellendi: {date}",
      locationTitle: "Konum",
      openInMaps: "Haritada Aç",
    },
    chapterDetail: {
      noPhoto: "Fotoğraf yok",
      notePill: "Not",
      uncategorized: "Kategorisiz",
      emptyTitle: "Henüz anı yok",
      emptySubtitle: "Bu bölüme anılar eklemeye başla",
      addFirstMemory: "İlk Anıyı Ekle",
      addMemory: "Anı Ekle",
    },
    tripDetail: {
      noPhoto: "Fotoğraf yok",
      notePill: "Not",
      uncategorized: "Kategorisiz",
      emptyTitle: "Henüz anı yok",
      emptySubtitle: "Bu bölüme anılar eklemeye başla",
      addFirstEntry: "İlk Anıyı Ekle",
      addEntry: "Anı Ekle",
    },
    memories: {
      memory: "Anı",
      milestone: "Kilometre Taşı",
      note: "Not",
      notePill: "NOT",
      noPhoto: "Fotoğraf yok",
    },
    cityLists: {
      title: "Şehir Listeleri",
      listNameLabel: "Liste Adı *",
      listTypeLabel: "Liste Türü",
      countryLabel: "Ülke *",
      typeCustom: "Özel",
      typeCountry: "Ülke",
      typeHintCustom: "Takip etmek istediğin şehirler için özel bir liste oluştur",
      typeHintCountry: "Belirli bir ülke içindeki şehirler için liste oluştur",
      emptyTitle: "Henüz şehir listesi yok",
      emptyDescription:
        "Ziyaret etmek istediğin şehirlerin listesini oluştur ve ilerlemeni takip et",
      createFirstList: "İlk Listeyi Oluştur",
      progressVisited: "{visited}/{total} ziyaret edildi ({percent}%)",
      detailProgress: "{visited} / {total} şehir ziyaret edildi ({percent}%)",
      detailEmptyTitle: "Henüz şehir yok",
      detailEmptyDescription:
        "Ziyaret etmek istediğin şehirleri ekle ve ilerlemeni takip et",
      detailAddCity: "Şehir Ekle",
      detailVisited: "Ziyaret Edilenler",
      notFound: "Şehir listesi bulunamadı",
      loading: "Yükleniyor...",
    },
    search: {
      emptyTitle: "Anılarını ara",
      emptySubtitle:
        "Bölümleri ve anıları başlık, açıklama, not veya etiketle bul",
      noResultsTitle: "Sonuç bulunamadı",
      noResultsSubtitle: "Farklı anahtar kelimelerle dene",
      showLabel: "Göster",
      memoryTypeLabel: "Anı Türü",
      minImportanceLabel: "Min. Önem",
      entryTypeLabel: "Anı Türü",
      minRatingLabel: "Min. Önem",
      tagsLabel: "Etiketler",
      clearFilters: "Filtreleri temizle",
      filterAll: "Tümü",
      filterChapters: "Bölümler",
      filterMemories: "Anılar",
      filterTrips: "Bölümler",
      filterEntries: "Anılar",
      filterAny: "Herhangi",
      filterMilestones: "Kilometre Taşları",
      filterNotes: "Notlar",
      filterPlaces: "Kilometre Taşları",
      filterMoments: "Notlar",
      matchedIn: "Eşleştiği alan: {field}",
      inChapter: "{chapter} içinde",
      inTrip: "{chapter} içinde",
      matchFieldTitle: "başlık",
      matchFieldLocation: "konum",
      matchFieldSummary: "açıklama",
      matchFieldNotes: "notlar",
      matchFieldTag: "etiket",
      matchFieldCity: "şehir",
    },
    insights: {
      sectionStats: "İstatistiklerin",
      statsChapters: "Bölümler",
      statsMemories: "Anılar",
      statsTrips: "Bölümler",
      statsEntries: "Anılar",
      statsCities: "Yerler",
      statsCountries: "Konumlar",
      statsPhotos: "Fotoğraflar",
      statsImportant: "Önemli",
      statsTripDays: "Bölüm Günleri",
      memoriesBreakdown: "{milestones} kilometre taşı, {notes} not",
      entriesBreakdown: "{milestones} kilometre taşı, {notes} not",
      highlightMostVisited: "En Çok Ziyaret",
      highlightFirstTrip: "İlk Bölüm",
      highlightFirstMemory: "İlk Anı",
      highlightAvgRating: "Ort. Önem",
      highlightImportant: "En Önemli",
      topTags: "Öne Çıkan Etiketler",
      cityProgress: "Kilometre Taşı Listeleri",
      seeAll: "Tümünü Gör",
      createFirstCityList: "İlk kilometre taşı listeni oluştur",
      cityListsEmptyHint: "Kaydetmek istediğin kilometre taşlarını takip et",
      cityListCount: "{visited}/{total} öğe",
      moreLists: "+{count} liste daha",
      achievements: "Başarılar",
      viewAll: "Tümünü Gör",
      noBadgesEarned: "Henüz rozet kazanılmadı",
      badgesEmptyHint: "Başarıların kilidini açmak için anı eklemeye devam et",
      moreBadges: "+{count} rozet daha",
      badgesProgress: "{unlocked} / {total} rozet kazanıldı",
    },
    badges: {
      earned: "Kazanıldı",
      locked: "Kilitli",
      allBadges: "Tüm Rozetler",
      badgesEarned: "Kazanılan Rozetler",
      special: "Özel",
      tagAdventures: "Etiket Kilometre Taşları",
      firstSteps: "İlk Adımlar",
      tripMilestones: "Bölüm Kilometre Taşları",
      placeMilestones: "Kilometre Taşı Anıları",
      entryMilestones: "Anı Kilometre Taşları",
      countryMilestones: "Konum Kilometre Taşları",
      photoMilestones: "Fotoğraf Kilometre Taşları",
      cityMilestones: "Konum Kilometre Taşları",
      cityListAchievements: "Şehir Listesi Başarıları",
      badgeUnlocked: "Rozet Açıldı!",
    },
    badgeDetail: {
      congratulations: "Tebrikler!",
      earnedOn: "{date} tarihinde kazanıldı",
      notYetEarned: "Henüz kazanılmadı",
    },
    badgeItems: {
      first_trip: {
        title: "İlk Seyahat",
        description: "İlk seyahatini oluşturdun",
      },
      first_place: {
        title: "İlk Yer",
        description: "İlk yerini kaydettin",
      },
      first_moment: {
        title: "İlk An",
        description: "İlk anını yakaladın",
      },
      first_tag: {
        title: "İlk Etiket",
        description: "İlk etiketini oluşturdun",
      },
      trips_3: {
        title: "Kaşif",
        description: "5 seyahat kaydettin",
      },
      trips_10: {
        title: "Maceracı",
        description: "15 seyahat kaydettin",
      },
      trips_25: {
        title: "Dünya Gezgini",
        description: "30 seyahat kaydettin",
      },
      places_10: {
        title: "Yer Avcısı",
        description: "15 yer kaydettin",
      },
      places_25: {
        title: "Yer Koleksiyoncusu",
        description: "40 yer kaydettin",
      },
      places_100: {
        title: "Yer Ustası",
        description: "150 yer kaydettin",
      },
      entries_25: {
        title: "Anı Bekçisi",
        description: "40 kayıt oluşturdun",
      },
      entries_100: {
        title: "Tarihçi",
        description: "150 kayıt oluşturdun",
      },
      countries_3: {
        title: "Sınır Aşan",
        description: "5 ülke ziyaret ettin",
      },
      countries_5: {
        title: "Dünya Gezgini",
        description: "8 ülke ziyaret ettin",
      },
      countries_10: {
        title: "Kıtasal",
        description: "15 ülke ziyaret ettin",
      },
      photos_10: {
        title: "Fotoğraf Meraklısı",
        description: "25 fotoğraf çektin",
      },
      photos_50: {
        title: "Fotoğrafçı",
        description: "100 fotoğraf çektin",
      },
      photos_200: {
        title: "Fotoğraf Arşivcisi",
        description: "400 fotoğraf çektin",
      },
      cities_5: {
        title: "Şehir Gezgini",
        description: "10 şehir ziyaret ettin",
      },
      cities_20: {
        title: "Şehir Kaşifi",
        description: "40 şehir ziyaret ettin",
      },
      tag_pizza: {
        title: "Pizza Hacısı",
        description: "20 pizza kaydı oluşturdun",
      },
      tag_cafe: {
        title: "Kafe Müdavimi",
        description: "25 kafe kaydı oluşturdun",
      },
      tag_museum: {
        title: "Müze Uzmanı",
        description: "15 müze kaydı oluşturdun",
      },
      tag_beach: {
        title: "Plaj Gezgini",
        description: "12 plaj kaydı oluşturdun",
      },
      tag_nightlife: {
        title: "Gece Kuşu",
        description: "12 gece hayatı kaydı oluşturdun",
      },
      tag_street_food: {
        title: "Sokak Lezzeti Efsanesi",
        description: "25 sokak yemeği kaydı oluşturdun",
      },
      tag_market: {
        title: "Pazar Ustası",
        description: "12 pazar kaydı oluşturdun",
      },
      tag_temple: {
        title: "Tapınak Kaşifi",
        description: "10 tapınak kaydı oluşturdun",
      },
      historian: {
        title: "Tarihçi",
        description: "Geçmiş seyahatlerden 40 kayıt oluşturdun",
      },
      weekend_warrior: {
        title: "Hafta Sonu Savaşçısı",
        description: "Hafta sonu başlayan 8 seyahat yaptın",
      },
      weekend_master: {
        title: "Hafta Sonu Ustası",
        description: "Hafta sonu başlayan 25 seyahat yaptın",
      },
      long_haul: {
        title: "Uzun Yolcu",
        description: "7+ gün süren 5 seyahati tamamladın",
      },
      marathon_traveler: {
        title: "Maraton Gezgin",
        description: "7+ gün süren 15 seyahati tamamladın",
      },
      quick_escape: {
        title: "Hızlı Kaçış",
        description: "2 gün veya daha kısa 5 seyahati tamamladın",
      },
      express_traveler: {
        title: "Ekspres Gezgin",
        description: "2 gün veya daha kısa 20 seyahati tamamladın",
      },
      critic: {
        title: "Eleştirmen",
        description: "20 kaydı puanladın",
      },
      taste_maker: {
        title: "Zevk Belirleyici",
        description: "100 kaydı puanladın",
      },
      five_star_finder: {
        title: "Beş Yıldız Avcısı",
        description: "10 beş yıldızlı deneyim buldun",
      },
      gold_standard: {
        title: "Altın Standart",
        description: "40 beş yıldızlı deneyim buldun",
      },
      high_standards: {
        title: "Yüksek Standartlar",
        description: "Ortalama puanı 4+ seviyesinde tut",
      },
      note_taker: {
        title: "Not Tutucu",
        description: "20 kayda not ekledin",
      },
      storyteller: {
        title: "Hikâye Anlatıcısı",
        description: "100 kayda not ekledin",
      },
      visual_logger: {
        title: "Görsel Günlükçü",
        description: "20 kayda fotoğraf ekledin",
      },
      photo_journalist: {
        title: "Foto Muhabiri",
        description: "100 kayda fotoğraf ekledin",
      },
      organizer: {
        title: "Organizatör",
        description: "20 kaydı etiketledin",
      },
      master_organizer: {
        title: "Usta Organizatör",
        description: "100 kaydı etiketledin",
      },
      tag_creator: {
        title: "Etiket Üreticisi",
        description: "20 benzersiz etiket oluşturdun",
      },
      taxonomy_expert: {
        title: "Taksonomi Uzmanı",
        description: "40 benzersiz etiket oluşturdun",
      },
      summer_lover: {
        title: "Yaz Sever",
        description: "Yaz aylarında 5 seyahat yaptın",
      },
      sun_chaser: {
        title: "Güneş Avcısı",
        description: "Yaz aylarında 15 seyahat yaptın",
      },
      winter_explorer: {
        title: "Kış Kaşifi",
        description: "Kış aylarında 5 seyahat yaptın",
      },
      frost_seeker: {
        title: "Ayaz Avcısı",
        description: "Kış aylarında 15 seyahat yaptın",
      },
      city_hopper_trip: {
        title: "Şehir Atlama",
        description: "3+ şehirli 2 seyahati tamamladın",
      },
      grand_tour: {
        title: "Büyük Tur",
        description: "3+ şehirli 10 seyahati tamamladın",
      },
      focused_traveler: {
        title: "Odaklı Gezgin",
        description: "10 tek şehirlik seyahati tamamladın",
      },
      deep_diver: {
        title: "Derin Dalış",
        description: "25 tek şehirlik seyahati tamamladın",
      },
      city_list_first: {
        title: "Liste Oluşturucu",
        description: "İlk şehir listesini oluşturdun",
      },
      city_list_halfway: {
        title: "Yarı Yolda",
        description: "Bir şehir listesinin %50'sini tamamladın",
      },
      city_list_complete: {
        title: "Liste Fatihi",
        description: "Bir şehir listesini %100 tamamladın",
      },
    },
    tags: {
      quick: {
        restaurant: "Restoran",
        cafe: "Kafe",
        hotel: "Otel",
        museum: "Müze",
        cityCenter: "Şehir Merkezi",
        beach: "Plaj",
        sea: "Deniz",
        park: "Park",
        shopping: "Alışveriş",
        bar: "Bar",
        landmark: "Anıt",
        mosque: "Cami",
        ship: "Gemi",
        temple: "Tapınak",
        market: "Pazar",
        nightlife: "Gece Hayatı",
        nature: "Doğa",
        adventure: "Macera",
        localFood: "Yerel Yemek",
        streetFood: "Sokak Yemeği",
        viewPoint: "Manzara Noktası",
        historic: "Tarihi",
        art: "Sanat",
        transport: "Ulaşım",
      },
    },
    dialogs: {
      tagPicker: {
        title: "Etiket Ekle",
        selected: "Seçilenler",
        addCustom: "Özel Etiket Ekle",
        customPlaceholder: "Etiket adı yaz...",
        quickTags: "Hızlı Etiketler",
        yourTags: "Etiketlerin",
      },
      cityPicker: {
        label: "Şehir",
        placeholder: "Şehir seç",
        title: "Şehir Seç",
        addCity: "Şehir Ekle",
        cityNamePlaceholder: "Şehir adı",
        noCity: "Şehir yok (sınıflandırılmamış)",
        fromDate: "{date} tarihinden",
        untilDate: "{date} tarihine kadar",
      },
      cityEditor: {
        label: "Şehirler",
        empty: "Henüz şehir eklenmedi",
        addCity: "Şehir Ekle",
        editTitle: "Şehri Düzenle",
        addTitle: "Şehir Ekle",
        cityNameLabel: "Şehir Adı *",
        cityNamePlaceholder: "örn. Roma, Floransa",
        arrivalDateLabel: "Varış Tarihi (isteğe bağlı)",
        departureDateLabel: "Ayrılış Tarihi (isteğe bağlı)",
        notSet: "Belirlenmedi",
        fromDate: "{date} tarihinden",
        untilDate: "{date} tarihine kadar",
        done: "Tamam",
      },
      cityList: {
        createTitle: "Yeni Şehir Listesi",
        addCityTitle: "Şehir Ekle",
        addCityPlaceholder: "Şehir adı",
        addCityButton: "Şehir Ekle",
        adding: "Ekleniyor...",
        linkTripTitle: "Seyahate Bağla (İsteğe bağlı)",
        noTripLinked: "Bağlı seyahat yok",
      },
    },
    alerts: {
      exportFailedTitle: "Dışa aktarma başarısız",
      exportFailedMessage: "Veriler dışa aktarılamadı. Lütfen tekrar deneyin.",
      importComplete: "İçe aktarma tamamlandı",
      importCompletedWithErrors: "İçe aktarma bazı sorunlarla tamamlandı",
      importFailed: "İçe aktarma başarısız oldu. Lütfen tekrar dene.",
      errorTitle: "Hata",
      requiredTitle: "Gerekli",
      invalidDateTitle: "Geçersiz Tarih",
      permissionTitle: "İzin gerekli",
      deleteEntryTitle: "Anıyı Sil",
      deleteEntryMessage: "Bu anıyı silmek istediğinize emin misiniz?",
      deletePhotoTitle: "Fotoğrafı Sil",
      deletePhotoMessage: "Bu fotoğrafı silmek istediğinize emin misiniz?",
      deleteChapterTitle: "Bölümü Sil",
      deleteChapterMessage:
        "Bu bölümü silmek istediğinize emin misiniz? Bu işlem tüm anıları da silecektir.",
      deleteTripTitle: "Bölümü Sil",
      deleteTripMessage:
        "Bu bölümü silmek istediğinize emin misiniz? Bu işlem tüm anıları da silecektir.",
      deleteListTitle: "Listeyi Sil",
      deleteListMessage:
        "\"{name}\" listesini silmek istediğinize emin misiniz? Bu işlem listedeki tüm şehirleri de silecektir.",
      deleteItemTitle: "{item} Sil",
      deleteItemMessage: "Bu {item} öğesini silmek istediğinize emin misiniz?",
      deleteEntryFailed: "Anı silinemedi",
      deleteMemoryFailed: "Anı silinemedi",
      deletePhotoFailed: "Fotoğraf silinemedi",
      deleteChapterFailed: "Bölüm silinemedi",
      deleteTripFailed: "Bölüm silinemedi",
      deleteListFailed: "Liste silinemedi",
      createEntryFailed: "Anı oluşturulamadı. Lütfen tekrar deneyin.",
      updateEntryFailed: "Anı güncellenemedi. Lütfen tekrar deneyin.",
      createChapterFailed: "Bölüm oluşturulamadı. Lütfen tekrar deneyin.",
      updateChapterFailed: "Bölüm güncellenemedi. Lütfen tekrar deneyin.",
      createTripFailed: "Bölüm oluşturulamadı. Lütfen tekrar deneyin.",
      updateTripFailed: "Bölüm güncellenemedi. Lütfen tekrar deneyin.",
      createCityListFailed:
        "Şehir listesi oluşturulamadı. Lütfen tekrar deneyin.",
      createCityFailed: "Şehir oluşturulamadı. Lütfen tekrar deneyin.",
      addCityFailed: "Şehir eklenemedi",
      permissionCameraMessage: "Fotoğraf çekmek için kamera izni gerekli",
      invalidDateMessage: "Bitiş tarihi başlangıç tarihinden önce olamaz",
      entryDateOutOfRangeTitle: "Tarih aralık dışında",
      entryDateOutOfRangeMessage: "Kayıt tarihi {start} ile {end} arasında olmalı.",
      requiredEntryTitle: "Lütfen bir başlık girin",
      requiredChapterTitle: "Lütfen bir bölüm başlığı girin",
      requiredTripTitle: "Lütfen bir bölüm başlığı girin",
      requiredTripCity: "Lütfen en az bir şehir ekleyin",
      requiredListName: "Lütfen bir liste adı girin",
      requiredCountry: "Lütfen bir ülke adı girin",
      requiredCityName: "Lütfen bir şehir adı girin",
      noProfileFound: "Bebek profili bulunamadı. Lütfen önce oluşturun.",
      nothingToShare: "Paylaşılacak bir şey yok",
      nothingToShareMessage: "Bu şehirde henüz paylaşılacak kayıt yok.",
      shareFailed: "Paylaşma başarısız oldu. Lütfen tekrar deneyin.",
      chapterLimitTitle: "Bölüm Limitine Ulaşıldı",
      chapterLimitMessage:
        "Ücretsiz kullanıcılar en fazla {limit} bölüm oluşturabilir. Sınırsız bölüm için Pro'ya yükseltin.",
      chapterLimitUpgrade: "Pro'ya Yükselt",
      tripLimitTitle: "Bölüm Limitine Ulaşıldı",
      tripLimitMessage:
        "Ücretsiz kullanıcılar en fazla {limit} bölüm oluşturabilir. Sınırsız bölüm için Pro'ya yükseltin.",
      tripLimitUpgrade: "Pro'ya Yükselt",
      backupReminderTitle: "Anılarını Yedekle",
      backupReminderMessage:
        "{count} bölüm oluşturdun! Verilerini güvende tutmak için dışa aktarmayı düşün.",
      backupReminderExport: "Şimdi Dışa Aktar",
      backupReminderLater: "Daha Sonra",
      proFeatureTitle: "Pro Özellik",
      proFeatureExport: "Dışa aktarma bir Pro özelliğidir. Verilerini dışa aktarmak için Pro'ya yükseltin.",
      proFeatureAdvancedSearch: "Gelişmiş arama filtreleri bir Pro özelliğidir.",
      proFeatureDarkMode: "Karanlık mod bir Pro özelliğidir. Tüm temaları açmak için Pro'ya yükseltin.",
      purchasesUnavailableTitle: "Satın alımlar kullanılamıyor",
      purchasesUnavailableMessage: "Bu sürümde satın alımlar kullanılamıyor.",
      purchasesNotReadyTitle: "Satın alımlar hazır değil",
      purchasesNotReadyMessage: "Lütfen biraz sonra tekrar deneyin.",
      purchasesNotConfiguredTitle: "Satın alımlar kullanılamıyor",
      purchasesNotConfiguredMessage: "RevenueCat henüz yapılandırılmadı.",
      restoreTitle: "Geri Yükle",
      restoreSuccessMessage: "Satın alımların başarıyla geri yüklendi.",
      restoreEmptyMessage: "Geri yüklenecek aktif abonelik yok.",
      restoreFailedMessage: "Geri yükleme başarısız oldu. Lütfen tekrar deneyin.",
    },
    limitations: {
      title: "Bilmenizde Fayda Var",
      photosNotBundled: "Fotoğraflar dışa aktarmalara dahil değildir - sadece yerel dosya referansları",
      noCloudSync: "Tüm veriler yalnızca cihazınızda yerel olarak depolanır",
      freeTextCities:
        "Kilometre taşı listeleri serbest metin — yinelenenler ayrı listeler olarak değerlendirilir",
      noAutoBackup: "Otomatik yedekleme yok - verilerinizi düzenli olarak dışa aktarmayı unutmayın",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Fotoğraflarda kaybolmaya son",
          body: "Anılar binlerce fotoğraf arasında kaybolur. Anları ve detayları düzenli bir arşivde topla.",
        },
        structuredArchive: {
          title: "Bebeğinin hikayesi, düzenli",
          body: "Bir bölüm oluştur, sonra kilometre taşları ve notlar ekle. Her şey düzenli kalır ve kolayca geri dönülür.",
        },
        fastSearch: {
          title: "Saniyeler içinde bul",
          body: "Bölümlerde, kilometre taşlarında ve notlarda anında ara.",
        },
        bestOfList: {
          title: "Önemli anları yakala",
          body: "Önemli anıları işaretle ve kısa notlar ekle.",
        },
        noCompetition: {
          title: "Akış yok. Rekabet yok.",
          body: "Bu senin özel arşivin. Anıların — yalnızca sana ait.",
        },
        privateOffline: {
          title: "Özel ve çevrimdışı",
          body: "Hesap gerekmez. Verilerin cihazında kalır ve çevrimdışıyken bile çalışır.",
        },
        simpleStart: {
          title: "İlk bölümüne şimdi başla",
          body: "Birkaç saniyede bir bölüm oluştur ve ilk anını ekle.",
        },
      },
      createFirstTrip: "İlk bölümünü oluştur",
      next: "İleri",
      skip: "Atla",
      back: "Geri",
    },
    shareContent: {
      locationLabel: "Konum",
      summaryLabel: "Özet",
      noEntries: "Kayıt yok",
      otherEntries: "Diğer kayıtlar",
      sharedFrom: "BabyLegacy'den paylaşıldı",
      tripHighlights: "Bölüm Öne Çıkanları",
      cities: "Konumlar",
      places: "Kilometre Taşları",
      moments: "Notlar",
      moreItems: "+ {count} daha",
      fromTrip: "Bölümden",
      placesSection: "KİLOMETRE TAŞLARI",
      otherPlaces: "DİĞER KİLOMETRE TAŞLARI",
      momentsSection: "NOTLAR",
      myRecommendations: "Öne Çıkanlarım",
      from: "Kaynak",
      other: "Diğer",
    },
  },
};

const fallbackLocale: Locale = "en";

function getNestedValue(
  source: Record<string, unknown>,
  path: string,
): string | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === "object" &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source) as string | undefined;
}

function formatTemplate(value: string, params?: TranslationParams): string {
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, token) => {
    const replacement = params[token];
    return replacement === undefined ? match : String(replacement);
  });
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams,
): string {
  const table = translations[locale] || translations[fallbackLocale];
  const fallbackTable = translations[fallbackLocale];
  const raw =
    getNestedValue(table, key) ?? getNestedValue(fallbackTable, key) ?? key;
  return formatTemplate(raw, params);
}

export function normalizeLocale(input?: string): Locale {
  if (!input) return fallbackLocale;
  const normalized = input.toLowerCase().replace("_", "-").split("-")[0];
  return supportedLocales.includes(normalized as Locale)
    ? (normalized as Locale)
    : fallbackLocale;
}

export function getSystemLocale(): Locale {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    return normalizeLocale(resolved);
  } catch (error) {
    return fallbackLocale;
  }
}

export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "English",
    de: "Deutsch",
    it: "Italiano",
    fr: "Français",
    es: "Español",
    tr: "Türkçe",
  };
  return labels[locale];
}
