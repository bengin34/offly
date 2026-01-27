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
    trips: string;
    search: string;
    insights: string;
    settings: string;
  };
  navigation: {
    newTrip: string;
    trip: string;
    editTrip: string;
    newEntry: string;
    entry: string;
    editEntry: string;
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
    entryTitlePlace: string;
    entryTitleMoment: string;
    entryNotes: string;
    cityListName: string;
    countryName: string;
  };
  tripForm: {
    titleLabel: string;
    summaryLabel: string;
    coverImageLabel: string;
    changeCover: string;
    addCoverPlaceholder: string;
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
  entryDetail: {
    notesTitle: string;
    tagsTitle: string;
    allPhotos: string;
    created: string;
    updated: string;
    locationTitle: string;
    openInMaps: string;
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
    entryTypeLabel: string;
    minRatingLabel: string;
    tagsLabel: string;
    clearFilters: string;
    filterAll: string;
    filterTrips: string;
    filterEntries: string;
    filterAny: string;
    filterPlaces: string;
    filterMoments: string;
    matchedIn: string;
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
    statsTrips: string;
    statsEntries: string;
    statsCities: string;
    statsCountries: string;
    statsPhotos: string;
    statsTripDays: string;
    entriesBreakdown: string;
    highlightMostVisited: string;
    highlightFirstTrip: string;
    highlightAvgRating: string;
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
    deleteTripTitle: string;
    deleteTripMessage: string;
    deleteListTitle: string;
    deleteListMessage: string;
    deleteItemTitle: string;
    deleteItemMessage: string;
    deleteEntryFailed: string;
    deletePhotoFailed: string;
    deleteTripFailed: string;
    deleteListFailed: string;
    createEntryFailed: string;
    updateEntryFailed: string;
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
    requiredTripTitle: string;
    requiredTripCity: string;
    requiredListName: string;
    requiredCountry: string;
    requiredCityName: string;
    nothingToShare: string;
    nothingToShareMessage: string;
    shareFailed: string;
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
      appName: "VoyageLog",
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
      entry: "entry",
      entries: "entries",
      shareTrip: "Share trip",
    },
    shareDialog: {
      title: "Share {name}",
      subtitle: "Choose how you want to share your recommendations",
      hint: "Your data stays private — sharing creates a local file",
      optionTextTitle: "Text List",
      optionTextDescription: "Simple text format, perfect for messaging apps",
      optionImageTitle: "Visual Card",
      optionImageDescription: "Beautiful card with your top spots",
      optionPdfTitle: "PDF Document",
      optionPdfDescription: "Full guide with all details and notes",
      dialogTitleTrip: "Share {name} Trip",
      dialogTitleCityRecommendations: "Share {name} Recommendations",
      dialogTitleCityGuide: "Share {name} Guide",
      dialogTitleCard: "Share {name} Card",
    },
    tabs: {
      trips: "Trips",
      search: "Search",
      insights: "Insights",
      settings: "Settings",
    },
    navigation: {
      newTrip: "New Trip",
      trip: "Trip",
      editTrip: "Edit Trip",
      newEntry: "New Entry",
      entry: "Entry",
      editEntry: "Edit Entry",
    },
    trips: {
      addCover: "Add a cover",
      days: "{count} days",
      emptyTitle: "No trips yet",
      emptySubtitle: "Start recording your travel memories",
      emptyButton: "Add Your First Trip",
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
        "Download your trips, entries, and tags as JSON or XLS",
      exportButton: "Export JSON",
      exportButtonXls: "Export XLS",
      exportOpenButton: "Open export options",
      exportInfoTitle: "Why export?",
      exportInfoDescription:
        "Keep a personal backup, move to a new phone, or analyze your trips in a spreadsheet. Exports stay on your device until you share them.",
      exportPrivacyNote:
        "Export files can include personal notes. Share carefully.",
      exportPhotosNote:
        "Photos are not included in exports.",
      exportFormatsTitle: "Choose a format",
      exportFormatsDescription:
        "JSON is best for backups and re-import. XLS opens easily in Excel or Google Sheets.",
      importSection: "Import",
      importTitle: "Import Data",
      importDescription: "Bring in your saved trips from a JSON file.",
      importButton: "Import JSON",
      importButtonImporting: "Importing...",
      dataSection: "Data",
      dataTitle: "Export & Import",
      dataDescription: "Back up or move your trips using export and import.",
      dataButton: "Show options",
      supportSection: "Support",
      supportRate: "Rate us 5 stars",
      supportShare: "Share the app",
      supportContact: "Contact us",
      supportShareMessage:
        "VoyageLog - I found a great travel journaling app, take a look: {link}",
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
      footer: "VoyageLog - Your personal travel memory system",
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
          title: "Tired of scrolling?",
          subtitle: "Stop digging through 2000 photos.",
        },
        {
          title: "Remember everything",
          subtitle: "Never forget that perfect café again.",
        },
        {
          title: "Your travel brain",
          subtitle: "Instant recall for every trip.",
        },
        {
          title: "Where was that place?",
          subtitle: "Find any memory in seconds.",
        },
        {
          title: "Travel smarter",
          subtitle: "Unlimited trips. Unlimited memories.",
        },
      ],
    },
    labels: {
      date: "Date",
      startDate: "Start Date",
      endDate: "End Date",
    },
    placeholders: {
      search: "Search trips, places, notes...",
      tripTitle: "e.g., Summer in Italy",
      tripSummary: "Brief description of your trip...",
      entryTitlePlace: "e.g., Trattoria da Luigi",
      entryTitleMoment: "e.g., Sunset at the Colosseum",
      entryNotes: "What made this memorable?",
      cityListName: "e.g., Italy Cities, Japan 2025",
      countryName: "e.g., Italy, Japan, France",
    },
    tripForm: {
      titleLabel: "Title *",
      summaryLabel: "Summary (optional)",
      coverImageLabel: "Cover Image (optional)",
      changeCover: "Change",
      addCoverPlaceholder: "Tap to add cover image",
    },
    entryForm: {
      titleLabel: "Title *",
      ratingLabel: "Rating",
      notesLabel: "Notes",
      tagsLabel: "Tags",
      photosLabel: "Photos ({count}/{max})",
      gallery: "Gallery",
      camera: "Camera",
      tapToAddTags: "Tap to add tags...",
      place: "Place",
      moment: "Moment",
      moreTags: "+{count} more",
      locationLabel: "Location",
      locationPlaceholder: "Paste map link or enter place name",
      locationHint: "Paste a Google Maps or Apple Maps link",
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
    tripDetail: {
      noPhoto: "No photo",
      notePill: "Note",
      uncategorized: "Uncategorized",
      emptyTitle: "No entries yet",
      emptySubtitle: "Start adding places and moments from your trip",
      addFirstEntry: "Add First Entry",
      addEntry: "Add Entry",
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
        "Find trips, places, and moments by name, location, notes, or tags",
      noResultsTitle: "No results found",
      noResultsSubtitle: "Try searching with different keywords",
      showLabel: "Show",
      entryTypeLabel: "Entry Type",
      minRatingLabel: "Min Rating",
      tagsLabel: "Tags",
      clearFilters: "Clear filters",
      filterAll: "All",
      filterTrips: "Trips",
      filterEntries: "Entries",
      filterAny: "Any",
      filterPlaces: "Places",
      filterMoments: "Moments",
      matchedIn: "Matched in {field}:",
      inTrip: "in {trip}",
      matchFieldTitle: "title",
      matchFieldLocation: "location",
      matchFieldSummary: "summary",
      matchFieldNotes: "notes",
      matchFieldTag: "tag",
      matchFieldCity: "city",
    },
    insights: {
      sectionStats: "Your Travel Stats",
      statsTrips: "Trips",
      statsEntries: "Entries",
      statsCities: "Cities",
      statsCountries: "Countries",
      statsPhotos: "Photos",
      statsTripDays: "Trip Days",
      entriesBreakdown: "{places} places, {moments} moments",
      highlightMostVisited: "Most Visited",
      highlightFirstTrip: "First Trip",
      highlightAvgRating: "Avg Rating",
      topTags: "Top Tags",
      cityProgress: "City Progress",
      seeAll: "See All",
      createFirstCityList: "Create your first city list",
      cityListsEmptyHint: "Track cities you want to visit and your progress",
      cityListCount: "{visited}/{total} cities",
      moreLists: "+{count} more lists",
      achievements: "Achievements",
      viewAll: "View All",
      noBadgesEarned: "No badges earned yet",
      badgesEmptyHint: "Keep traveling to unlock achievements",
      moreBadges: "+{count} more badges",
      badgesProgress: "{unlocked} of {total} badges earned",
    },
    badges: {
      earned: "Earned",
      locked: "Locked",
      allBadges: "All Badges",
      badgesEarned: "Badges Earned",
      special: "Special",
      tagAdventures: "Tag Adventures",
      firstSteps: "First Steps",
      tripMilestones: "Trip Milestones",
      placeMilestones: "Place Milestones",
      entryMilestones: "Entry Milestones",
      countryMilestones: "Country Milestones",
      photoMilestones: "Photo Milestones",
      cityMilestones: "City Milestones",
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
      deleteEntryTitle: "Delete Entry",
      deleteEntryMessage: "Are you sure you want to delete this entry?",
      deletePhotoTitle: "Delete Photo",
      deletePhotoMessage: "Are you sure you want to delete this photo?",
      deleteTripTitle: "Delete Trip",
      deleteTripMessage:
        "Are you sure you want to delete this trip? This will also delete all entries.",
      deleteListTitle: "Delete List",
      deleteListMessage:
        "Are you sure you want to delete \"{name}\"? This will also delete all cities in this list.",
      deleteItemTitle: "Delete {item}",
      deleteItemMessage: "Are you sure you want to delete this {item}?",
      deleteEntryFailed: "Failed to delete entry",
      deletePhotoFailed: "Failed to delete photo",
      deleteTripFailed: "Failed to delete trip",
      deleteListFailed: "Failed to delete list",
      createEntryFailed: "Failed to create entry. Please try again.",
      updateEntryFailed: "Failed to update entry. Please try again.",
      createTripFailed: "Failed to create trip. Please try again.",
      updateTripFailed: "Failed to update trip. Please try again.",
      createCityListFailed: "Failed to create city list. Please try again.",
      createCityFailed: "Failed to create city. Please try again.",
      addCityFailed: "Failed to add city",
      permissionCameraMessage: "Camera access is required to take photos",
      invalidDateMessage: "End date cannot be before start date",
      entryDateOutOfRangeTitle: "Date out of range",
      entryDateOutOfRangeMessage: "Entry date must be between {start} and {end}.",
      requiredEntryTitle: "Please enter a title",
      requiredTripTitle: "Please enter a trip title",
      requiredTripCity: "Please add at least one city",
      requiredListName: "Please enter a list name",
      requiredCountry: "Please enter a country name",
      requiredCityName: "Please enter a city name",
      nothingToShare: "Nothing to Share",
      nothingToShareMessage: "This city has no entries to share yet.",
      shareFailed: "Failed to share. Please try again.",
      tripLimitTitle: "Trip Limit Reached",
      tripLimitMessage: "Free users can create up to {limit} trips. Upgrade to Pro for unlimited trips.",
      tripLimitUpgrade: "Upgrade to Pro",
      backupReminderTitle: "Back Up Your Memories",
      backupReminderMessage: "You've logged {count} trips! Consider exporting your data to keep it safe.",
      backupReminderExport: "Export Now",
      backupReminderLater: "Later",
      proFeatureTitle: "Pro Feature",
      proFeatureExport: "Export is a Pro feature. Upgrade to export your travel data.",
      proFeatureAdvancedSearch: "Advanced search filters are a Pro feature.",
      proFeatureDarkMode: "Dark mode is a Pro feature. Upgrade to unlock all themes.",
    },
    limitations: {
      title: "Good to Know",
      photosNotBundled: "Photos are not included in exports - only references to local files",
      noCloudSync: "All data is stored locally on your device only",
      freeTextCities: "City names are free text - 'Milan' and 'Milano' are treated as different cities",
      noAutoBackup: "No automatic backups - remember to export your data regularly",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Stop digging through travel photos",
          body: "Trips get lost in thousands of pictures. Keep the places and details in one clean travel archive.",
        },
        structuredArchive: {
          title: "Your travel history, organized",
          body: "Create a trip, then add places and moments. Everything stays structured and easy to revisit.",
        },
        fastSearch: {
          title: "Find it in seconds",
          body: "\"Where was that pizza place in Milan?\" Search across your trips, places, and notes - instantly.",
        },
        bestOfList: {
          title: "Build your personal best-of list",
          body: "Rate places and add short notes. VoyageLog keeps your favorites easy to find later.",
        },
        noCompetition: {
          title: "No feed. No competition.",
          body: "This is your private journey. Your cities, your ratings, your memories—only for you.",
        },
        privateOffline: {
          title: "Private and offline-first",
          body: "No account required. Your data stays on your device and works even when you’re offline.",
        },
        simpleStart: {
          title: "Start your first trip now",
          body: "Create a trip in seconds and add your first place. You can build the details over time.",
        },
      },
      createFirstTrip: "Explore the app",
      next: "Next",
      skip: "Skip",
      back: "Back",
    },
    shareContent: {
      locationLabel: "Location",
      summaryLabel: "Summary",
      noEntries: "No entries",
      otherEntries: "Other Entries",
      sharedFrom: "Shared from VoyageLog",
      tripHighlights: "Trip Highlights",
      cities: "Cities",
      places: "Places",
      moments: "Moments",
      moreItems: "+ {count} more",
      fromTrip: "From trip",
      placesSection: "PLACES",
      otherPlaces: "OTHER PLACES",
      momentsSection: "MOMENTS",
      myRecommendations: "My Recommendations",
      from: "From",
      other: "Other",
    },
  },
  de: {
    common: {
      appName: "VoyageLog",
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
      entry: "Eintrag",
      entries: "Einträge",
      shareTrip: "Reise teilen",
    },
    shareDialog: {
      title: "{name} teilen",
      subtitle: "Wähle aus, wie du deine Empfehlungen teilen möchtest",
      hint: "Deine Daten bleiben privat — beim Teilen wird eine lokale Datei erstellt",
      optionTextTitle: "Textliste",
      optionTextDescription: "Einfaches Textformat, ideal für Messenger",
      optionImageTitle: "Visuelle Karte",
      optionImageDescription: "Schöne Karte mit deinen Top-Spots",
      optionPdfTitle: "PDF-Dokument",
      optionPdfDescription: "Vollständiger Guide mit allen Details und Notizen",
      dialogTitleTrip: "Reise {name} teilen",
      dialogTitleCityRecommendations: "{name}-Empfehlungen teilen",
      dialogTitleCityGuide: "{name}-Guide teilen",
      dialogTitleCard: "{name}-Karte teilen",
    },
    tabs: {
      trips: "Reisen",
      search: "Suche",
      insights: "Einblicke",
      settings: "Einstellungen",
    },
    navigation: {
      newTrip: "Neue Reise",
      trip: "Reise",
      editTrip: "Reise bearbeiten",
      newEntry: "Neuer Eintrag",
      entry: "Eintrag",
      editEntry: "Eintrag bearbeiten",
    },
    trips: {
      addCover: "Titelbild hinzufügen",
      days: "{count} Tage",
      emptyTitle: "Noch keine Reisen",
      emptySubtitle: "Beginne, deine Reisemomente festzuhalten",
      emptyButton: "Erste Reise hinzufügen",
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
        "Lade deine Reisen, Einträge und Tags als JSON oder XLS herunter",
      exportButton: "JSON exportieren",
      exportButtonXls: "XLS exportieren",
      exportOpenButton: "Exportoptionen öffnen",
      exportInfoTitle: "Warum exportieren?",
      exportInfoDescription:
        "Erstelle ein persönliches Backup, wechsle auf ein neues Gerät oder analysiere deine Reisen in einer Tabelle. Exporte bleiben auf deinem Gerät, bis du sie teilst.",
      exportPrivacyNote:
        "Exportdateien können persönliche Notizen enthalten. Bitte vorsichtig teilen.",
      exportPhotosNote:
        "Fotos werden nicht exportiert.",
      exportFormatsTitle: "Format auswählen",
      exportFormatsDescription:
        "JSON eignet sich für Backups und Re-Import. XLS lässt sich leicht in Excel oder Google Sheets öffnen.",
      importSection: "Import",
      importTitle: "Daten importieren",
      importDescription: "Importiere deine gespeicherten Reisen aus einer JSON-Datei.",
      importButton: "JSON importieren",
      importButtonImporting: "Importiere...",
      dataSection: "Daten",
      dataTitle: "Export & Import",
      dataDescription: "Sichere oder übertrage deine Reisen per Export/Import.",
      dataButton: "Optionen anzeigen",
      supportSection: "Support",
      supportRate: "Gib uns 5 Sterne",
      supportShare: "App teilen",
      supportContact: "Kontakt",
      supportShareMessage:
        "VoyageLog - Ich habe eine tolle Reisejournal-App gefunden, schau mal: {link}",
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
      footer: "VoyageLog - Dein persönliches Reiserinnerungssystem",
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
        { title: "Genug vom Scrollen?", subtitle: "Hör auf, dich durch 2000 Fotos zu wühlen." },
        { title: "Alles merken", subtitle: "Vergiss dieses perfekte Café nie wieder." },
        { title: "Dein Reisegehirn", subtitle: "Sofortiger Abruf für jede Reise." },
        { title: "Wo war das nochmal?", subtitle: "Finde jede Erinnerung in Sekunden." },
        { title: "Reise smarter", subtitle: "Unbegrenzte Reisen. Unbegrenzte Erinnerungen." },
      ],
    },
    labels: {
      date: "Datum",
      startDate: "Startdatum",
      endDate: "Enddatum",
    },
    placeholders: {
      search: "Reisen, Orte, Notizen suchen...",
      tripTitle: "z. B. Sommer in Italien",
      tripSummary: "Kurze Beschreibung deiner Reise...",
      entryTitlePlace: "z. B. Trattoria da Luigi",
      entryTitleMoment: "z. B. Sonnenuntergang am Kolosseum",
      entryNotes: "Was machte das besonders?",
      cityListName: "z. B. Italien-Städte, Japan 2025",
      countryName: "z. B. Italien, Japan, Frankreich",
    },
    tripForm: {
      titleLabel: "Titel *",
      summaryLabel: "Zusammenfassung (optional)",
      coverImageLabel: "Titelbild (optional)",
      changeCover: "Ändern",
      addCoverPlaceholder: "Tippe, um ein Titelbild hinzuzufügen",
    },
    entryForm: {
      titleLabel: "Titel *",
      ratingLabel: "Bewertung",
      notesLabel: "Notizen",
      tagsLabel: "Tags",
      photosLabel: "Fotos ({count}/{max})",
      gallery: "Galerie",
      camera: "Kamera",
      tapToAddTags: "Tippe, um Tags hinzuzufügen...",
      place: "Ort",
      moment: "Moment",
      moreTags: "+{count} mehr",
      locationLabel: "Standort",
      locationPlaceholder: "Kartenlink einfügen oder Ortsname eingeben",
      locationHint: "Füge einen Google Maps oder Apple Maps Link ein",
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
    tripDetail: {
      noPhoto: "Kein Foto",
      notePill: "Notiz",
      uncategorized: "Ohne Kategorie",
      emptyTitle: "Noch keine Einträge",
      emptySubtitle: "Füge Orte und Momente deiner Reise hinzu",
      addFirstEntry: "Ersten Eintrag hinzufügen",
      addEntry: "Eintrag hinzufügen",
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
        "Finde Reisen, Orte und Momente nach Name, Ort, Notizen oder Tags",
      noResultsTitle: "Keine Ergebnisse gefunden",
      noResultsSubtitle: "Versuche andere Suchbegriffe",
      showLabel: "Anzeigen",
      entryTypeLabel: "Eintragstyp",
      minRatingLabel: "Min. Bewertung",
      tagsLabel: "Tags",
      clearFilters: "Filter zurücksetzen",
      filterAll: "Alle",
      filterTrips: "Reisen",
      filterEntries: "Einträge",
      filterAny: "Beliebig",
      filterPlaces: "Orte",
      filterMoments: "Momente",
      matchedIn: "Gefunden in {field}:",
      inTrip: "in {trip}",
      matchFieldTitle: "Titel",
      matchFieldLocation: "Ort",
      matchFieldSummary: "Zusammenfassung",
      matchFieldNotes: "Notizen",
      matchFieldTag: "Tag",
      matchFieldCity: "Stadt",
    },
    insights: {
      sectionStats: "Deine Reisestatistiken",
      statsTrips: "Reisen",
      statsEntries: "Einträge",
      statsCities: "Städte",
      statsCountries: "Länder",
      statsPhotos: "Fotos",
      statsTripDays: "Reisetage",
      entriesBreakdown: "{places} Orte, {moments} Momente",
      highlightMostVisited: "Am häufigsten besucht",
      highlightFirstTrip: "Erste Reise",
      highlightAvgRating: "Ø Bewertung",
      topTags: "Top-Tags",
      cityProgress: "Stadtfortschritt",
      seeAll: "Alle ansehen",
      createFirstCityList: "Erstelle deine erste Stadtliste",
      cityListsEmptyHint:
        "Verfolge Städte, die du besuchen möchtest, und deinen Fortschritt",
      cityListCount: "{visited}/{total} Städte",
      moreLists: "+{count} weitere Listen",
      achievements: "Erfolge",
      viewAll: "Alle anzeigen",
      noBadgesEarned: "Noch keine Abzeichen verdient",
      badgesEmptyHint: "Reise weiter, um Erfolge freizuschalten",
      moreBadges: "+{count} weitere Abzeichen",
      badgesProgress: "{unlocked} von {total} Abzeichen verdient",
    },
    badges: {
      earned: "Verdient",
      locked: "Gesperrt",
      allBadges: "Alle Abzeichen",
      badgesEarned: "Verdiente Abzeichen",
      special: "Spezial",
      tagAdventures: "Tag-Abenteuer",
      firstSteps: "Erste Schritte",
      tripMilestones: "Reise-Meilensteine",
      placeMilestones: "Orte-Meilensteine",
      entryMilestones: "Eintrag-Meilensteine",
      countryMilestones: "Länder-Meilensteine",
      photoMilestones: "Foto-Meilensteine",
      cityMilestones: "Städte-Meilensteine",
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
      deleteEntryTitle: "Eintrag löschen",
      deleteEntryMessage: "Möchtest du diesen Eintrag wirklich löschen?",
      deletePhotoTitle: "Foto löschen",
      deletePhotoMessage: "Möchtest du dieses Foto wirklich löschen?",
      deleteTripTitle: "Reise löschen",
      deleteTripMessage:
        "Möchtest du diese Reise wirklich löschen? Dadurch werden auch alle Einträge gelöscht.",
      deleteListTitle: "Liste löschen",
      deleteListMessage:
        "Möchtest du „{name}“ wirklich löschen? Dadurch werden auch alle Städte in dieser Liste gelöscht.",
      deleteItemTitle: "{item} löschen",
      deleteItemMessage: "Möchtest du dieses {item} wirklich löschen?",
      deleteEntryFailed: "Eintrag konnte nicht gelöscht werden",
      deletePhotoFailed: "Foto konnte nicht gelöscht werden",
      deleteTripFailed: "Reise konnte nicht gelöscht werden",
      deleteListFailed: "Liste konnte nicht gelöscht werden",
      createEntryFailed:
        "Eintrag konnte nicht erstellt werden. Bitte versuche es erneut.",
      updateEntryFailed:
        "Eintrag konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      createTripFailed:
        "Reise konnte nicht erstellt werden. Bitte versuche es erneut.",
      updateTripFailed:
        "Reise konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      createCityListFailed:
        "Städte-Liste konnte nicht erstellt werden. Bitte versuche es erneut.",
      createCityFailed: "Stadt konnte nicht erstellt werden. Bitte versuche es erneut.",
      addCityFailed: "Stadt konnte nicht hinzugefügt werden",
      permissionCameraMessage: "Kamerazugriff ist erforderlich, um Fotos aufzunehmen",
      invalidDateMessage: "Das Enddatum darf nicht vor dem Startdatum liegen",
      entryDateOutOfRangeTitle: "Datum außerhalb des Bereichs",
      entryDateOutOfRangeMessage: "Das Eintragsdatum muss zwischen {start} und {end} liegen.",
      requiredEntryTitle: "Bitte gib einen Titel ein",
      requiredTripTitle: "Bitte gib einen Reisetitel ein",
      requiredTripCity: "Bitte füge mindestens eine Stadt hinzu",
      requiredListName: "Bitte gib einen Listennamen ein",
      requiredCountry: "Bitte gib einen Ländernamen ein",
      requiredCityName: "Bitte gib einen Stadtnamen ein",
      nothingToShare: "Nichts zum Teilen",
      nothingToShareMessage: "Diese Stadt hat noch keine Einträge zum Teilen.",
      shareFailed: "Teilen fehlgeschlagen. Bitte versuche es erneut.",
      tripLimitTitle: "Reiselimit erreicht",
      tripLimitMessage: "Kostenlose Nutzer können bis zu {limit} Reisen erstellen. Upgrade auf Pro für unbegrenzte Reisen.",
      tripLimitUpgrade: "Auf Pro upgraden",
      backupReminderTitle: "Sichere deine Erinnerungen",
      backupReminderMessage: "Du hast {count} Reisen erfasst! Erwäge, deine Daten zu exportieren.",
      backupReminderExport: "Jetzt exportieren",
      backupReminderLater: "Später",
      proFeatureTitle: "Pro-Funktion",
      proFeatureExport: "Export ist eine Pro-Funktion. Upgrade, um deine Reisedaten zu exportieren.",
      proFeatureAdvancedSearch: "Erweiterte Suchfilter sind eine Pro-Funktion.",
      proFeatureDarkMode: "Dunkler Modus ist eine Pro-Funktion. Upgrade, um alle Designs freizuschalten.",
    },
    limitations: {
      title: "Gut zu wissen",
      photosNotBundled: "Fotos sind nicht in Exporten enthalten - nur Verweise auf lokale Dateien",
      noCloudSync: "Alle Daten werden nur lokal auf deinem Gerät gespeichert",
      freeTextCities: "Städtenamen sind Freitext - 'Milan' und 'Milano' werden als verschiedene Städte behandelt",
      noAutoBackup: "Keine automatischen Backups - denke daran, deine Daten regelmäßig zu exportieren",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Schluss mit dem Wühlen in Reisefotos",
          body: "Reisen gehen in tausenden Bildern verloren. Halte Orte und Details in einem übersichtlichen Reisearchiv.",
        },
        structuredArchive: {
          title: "Deine Reisehistorie, organisiert",
          body: "Erstelle eine Reise und füge dann Orte und Momente hinzu. Alles bleibt strukturiert und leicht wiederzufinden.",
        },
        fastSearch: {
          title: "In Sekunden finden",
          body: "\"Wo war diese Pizzeria in Mailand?\" Suche über deine Reisen, Orte und Notizen – sofort.",
        },
        bestOfList: {
          title: "Erstelle deine persönliche Best-of-Liste",
          body: "Bewerte Orte und füge kurze Notizen hinzu. VoyageLog hält deine Favoriten später leicht auffindbar.",
        },
        noCompetition: {
          title: "Kein Feed. Kein Wettbewerb.",
          body: "Das ist deine private Reise. Deine Städte, deine Bewertungen, deine Erinnerungen—nur für dich.",
        },
        privateOffline: {
          title: "Privat und offline-first",
          body: "Kein Konto nötig. Deine Daten bleiben auf deinem Gerät und funktionieren auch ohne Internet.",
        },
        simpleStart: {
          title: "Starte deine erste Reise jetzt",
          body: "Erstelle in Sekunden eine Reise und füge deinen ersten Ort hinzu. Details kannst du später ergänzen.",
        },
      },
      createFirstTrip: "App entdecken",
      next: "Weiter",
      skip: "Überspringen",
      back: "Zurück",
    },
    shareContent: {
      locationLabel: "Ort",
      summaryLabel: "Zusammenfassung",
      noEntries: "Keine Einträge",
      otherEntries: "Andere Einträge",
      sharedFrom: "Geteilt von VoyageLog",
      tripHighlights: "Reise-Highlights",
      cities: "Städte",
      places: "Orte",
      moments: "Momente",
      moreItems: "+ {count} weitere",
      fromTrip: "Von Reise",
      placesSection: "ORTE",
      otherPlaces: "ANDERE ORTE",
      momentsSection: "MOMENTE",
      myRecommendations: "Meine Empfehlungen",
      from: "Von",
      other: "Andere",
    },
  },
  it: {
    common: {
      appName: "VoyageLog",
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
      entry: "voce",
      entries: "voci",
      shareTrip: "Condividi viaggio",
    },
    shareDialog: {
      title: "Condividi {name}",
      subtitle: "Scegli come condividere i tuoi suggerimenti",
      hint: "I tuoi dati restano privati — la condivisione crea un file locale",
      optionTextTitle: "Elenco testuale",
      optionTextDescription: "Formato testo semplice, perfetto per le chat",
      optionImageTitle: "Scheda visiva",
      optionImageDescription: "Una bella scheda con i tuoi posti migliori",
      optionPdfTitle: "Documento PDF",
      optionPdfDescription: "Guida completa con dettagli e note",
      dialogTitleTrip: "Condividi il viaggio {name}",
      dialogTitleCityRecommendations: "Condividi i consigli su {name}",
      dialogTitleCityGuide: "Condividi la guida di {name}",
      dialogTitleCard: "Condividi la scheda di {name}",
    },
    tabs: {
      trips: "Viaggi",
      search: "Cerca",
      insights: "Statistiche",
      settings: "Impostazioni",
    },
    navigation: {
      newTrip: "Nuovo viaggio",
      trip: "Viaggio",
      editTrip: "Modifica viaggio",
      newEntry: "Nuova voce",
      entry: "Voce",
      editEntry: "Modifica voce",
    },
    trips: {
      addCover: "Aggiungi copertina",
      days: "{count} giorni",
      emptyTitle: "Nessun viaggio ancora",
      emptySubtitle: "Inizia a registrare i tuoi ricordi di viaggio",
      emptyButton: "Aggiungi il tuo primo viaggio",
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
        "Scarica i tuoi viaggi, voci e tag come JSON o XLS",
      exportButton: "Esporta JSON",
      exportButtonXls: "Esporta XLS",
      exportOpenButton: "Apri opzioni di esportazione",
      exportInfoTitle: "Perché esportare?",
      exportInfoDescription:
        "Crea un backup personale, passa a un nuovo telefono o analizza i viaggi in un foglio di calcolo. Le esportazioni restano sul dispositivo finché non le condividi.",
      exportPrivacyNote:
        "I file esportati possono includere note personali. Condividi con cautela.",
      exportPhotosNote:
        "Le foto non sono incluse nell'esportazione.",
      exportFormatsTitle: "Scegli un formato",
      exportFormatsDescription:
        "JSON è ideale per backup e reimportazione. XLS si apre facilmente in Excel o Google Sheets.",
      importSection: "Importazione",
      importTitle: "Importa dati",
      importDescription: "Importa i tuoi viaggi salvati da un file JSON.",
      importButton: "Importa JSON",
      importButtonImporting: "Importazione in corso...",
      dataSection: "Dati",
      dataTitle: "Esporta e importa",
      dataDescription: "Fai backup o trasferisci i tuoi viaggi con esportazione e importazione.",
      dataButton: "Mostra opzioni",
      supportSection: "Supporto",
      supportRate: "Dacci 5 stelle",
      supportShare: "Condividi l'app",
      supportContact: "Contattaci",
      supportShareMessage:
        "VoyageLog - Ho trovato un'ottima app per tenere traccia dei viaggi, dai un'occhiata: {link}",
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
      footer: "VoyageLog - Il tuo sistema personale di ricordi di viaggio",
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
        { title: "Stanco di scorrere?", subtitle: "Smetti di cercare tra 2000 foto." },
        { title: "Ricorda tutto", subtitle: "Non dimenticare mai più quel caffè perfetto." },
        { title: "Il tuo cervello di viaggio", subtitle: "Richiamo immediato per ogni viaggio." },
        { title: "Dov'era quel posto?", subtitle: "Trova qualsiasi ricordo in pochi secondi." },
        { title: "Viaggia più smart", subtitle: "Viaggi illimitati. Ricordi illimitati." },
      ],
    },
    labels: {
      date: "Data",
      startDate: "Data di inizio",
      endDate: "Data di fine",
    },
    placeholders: {
      search: "Cerca viaggi, luoghi, note...",
      tripTitle: "es. Estate in Italia",
      tripSummary: "Breve descrizione del tuo viaggio...",
      entryTitlePlace: "es. Trattoria da Luigi",
      entryTitleMoment: "es. Tramonto al Colosseo",
      entryNotes: "Cosa lo ha reso memorabile?",
      cityListName: "es. Città d'Italia, Giappone 2025",
      countryName: "es. Italia, Giappone, Francia",
    },
    tripForm: {
      titleLabel: "Titolo *",
      summaryLabel: "Riepilogo (opzionale)",
      coverImageLabel: "Immagine di copertina (opzionale)",
      changeCover: "Cambia",
      addCoverPlaceholder: "Tocca per aggiungere una copertina",
    },
    entryForm: {
      titleLabel: "Titolo *",
      ratingLabel: "Valutazione",
      notesLabel: "Note",
      tagsLabel: "Tag",
      photosLabel: "Foto ({count}/{max})",
      gallery: "Galleria",
      camera: "Fotocamera",
      tapToAddTags: "Tocca per aggiungere tag...",
      place: "Luogo",
      moment: "Momento",
      moreTags: "+{count} in più",
      locationLabel: "Posizione",
      locationPlaceholder: "Incolla link mappa o inserisci nome luogo",
      locationHint: "Incolla un link di Google Maps o Apple Maps",
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
    tripDetail: {
      noPhoto: "Nessuna foto",
      notePill: "Nota",
      uncategorized: "Senza categoria",
      emptyTitle: "Nessuna voce ancora",
      emptySubtitle: "Inizia ad aggiungere luoghi e momenti dal tuo viaggio",
      addFirstEntry: "Aggiungi la prima voce",
      addEntry: "Aggiungi voce",
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
        "Trova viaggi, luoghi e momenti per nome, località, note o tag",
      noResultsTitle: "Nessun risultato",
      noResultsSubtitle: "Prova con parole chiave diverse",
      showLabel: "Mostra",
      entryTypeLabel: "Tipo di voce",
      minRatingLabel: "Valutazione min.",
      tagsLabel: "Tag",
      clearFilters: "Cancella filtri",
      filterAll: "Tutti",
      filterTrips: "Viaggi",
      filterEntries: "Voci",
      filterAny: "Qualsiasi",
      filterPlaces: "Luoghi",
      filterMoments: "Momenti",
      matchedIn: "Corrispondenza in {field}:",
      inTrip: "in {trip}",
      matchFieldTitle: "titolo",
      matchFieldLocation: "località",
      matchFieldSummary: "riepilogo",
      matchFieldNotes: "note",
      matchFieldTag: "tag",
      matchFieldCity: "città",
    },
    insights: {
      sectionStats: "Le tue statistiche di viaggio",
      statsTrips: "Viaggi",
      statsEntries: "Voci",
      statsCities: "Città",
      statsCountries: "Paesi",
      statsPhotos: "Foto",
      statsTripDays: "Giorni di viaggio",
      entriesBreakdown: "{places} luoghi, {moments} momenti",
      highlightMostVisited: "Più visitato",
      highlightFirstTrip: "Primo viaggio",
      highlightAvgRating: "Valutazione media",
      topTags: "Tag principali",
      cityProgress: "Progresso città",
      seeAll: "Vedi tutto",
      createFirstCityList: "Crea la tua prima lista di città",
      cityListsEmptyHint: "Monitora le città che vuoi visitare e i tuoi progressi",
      cityListCount: "{visited}/{total} città",
      moreLists: "+{count} liste in più",
      achievements: "Obiettivi",
      viewAll: "Vedi tutto",
      noBadgesEarned: "Nessun badge ancora",
      badgesEmptyHint: "Continua a viaggiare per sbloccare obiettivi",
      moreBadges: "+{count} badge in più",
      badgesProgress: "{unlocked} di {total} badge ottenuti",
    },
    badges: {
      earned: "Ottenuto",
      locked: "Bloccato",
      allBadges: "Tutti i badge",
      badgesEarned: "Badge ottenuti",
      special: "Speciale",
      tagAdventures: "Avventure dei tag",
      firstSteps: "Primi passi",
      tripMilestones: "Traguardi di viaggio",
      placeMilestones: "Traguardi dei luoghi",
      entryMilestones: "Traguardi delle voci",
      countryMilestones: "Traguardi dei paesi",
      photoMilestones: "Traguardi delle foto",
      cityMilestones: "Traguardi delle città",
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
      deleteEntryTitle: "Elimina voce",
      deleteEntryMessage: "Sei sicuro di voler eliminare questa voce?",
      deletePhotoTitle: "Elimina foto",
      deletePhotoMessage: "Sei sicuro di voler eliminare questa foto?",
      deleteTripTitle: "Elimina viaggio",
      deleteTripMessage:
        "Sei sicuro di voler eliminare questo viaggio? Verranno eliminate anche tutte le voci.",
      deleteListTitle: "Elimina lista",
      deleteListMessage:
        "Sei sicuro di voler eliminare \"{name}\"? Verranno eliminate anche tutte le città in questa lista.",
      deleteItemTitle: "Elimina {item}",
      deleteItemMessage: "Sei sicuro di voler eliminare questo {item}?",
      deleteEntryFailed: "Impossibile eliminare la voce",
      deletePhotoFailed: "Impossibile eliminare la foto",
      deleteTripFailed: "Impossibile eliminare il viaggio",
      deleteListFailed: "Impossibile eliminare la lista",
      createEntryFailed: "Impossibile creare la voce. Riprova.",
      updateEntryFailed: "Impossibile aggiornare la voce. Riprova.",
      createTripFailed: "Impossibile creare il viaggio. Riprova.",
      updateTripFailed: "Impossibile aggiornare il viaggio. Riprova.",
      createCityListFailed: "Impossibile creare la lista di città. Riprova.",
      createCityFailed: "Impossibile creare la città. Riprova.",
      addCityFailed: "Impossibile aggiungere la città",
      permissionCameraMessage: "L'accesso alla fotocamera è necessario per scattare foto",
      invalidDateMessage: "La data di fine non può essere precedente alla data di inizio",
      entryDateOutOfRangeTitle: "Data fuori intervallo",
      entryDateOutOfRangeMessage: "La data della voce deve essere tra {start} e {end}.",
      requiredEntryTitle: "Inserisci un titolo",
      requiredTripTitle: "Inserisci un titolo del viaggio",
      requiredTripCity: "Aggiungi almeno una città",
      requiredListName: "Inserisci un nome per la lista",
      requiredCountry: "Inserisci un nome del paese",
      requiredCityName: "Inserisci un nome della città",
      nothingToShare: "Niente da condividere",
      nothingToShareMessage: "Questa città non ha ancora voci da condividere.",
      shareFailed: "Impossibile condividere. Riprova.",
      tripLimitTitle: "Limite viaggi raggiunto",
      tripLimitMessage: "Gli utenti gratuiti possono creare fino a {limit} viaggi. Passa a Pro per viaggi illimitati.",
      tripLimitUpgrade: "Passa a Pro",
      backupReminderTitle: "Salva i tuoi ricordi",
      backupReminderMessage: "Hai registrato {count} viaggi! Considera di esportare i tuoi dati per tenerli al sicuro.",
      backupReminderExport: "Esporta ora",
      backupReminderLater: "Più tardi",
      proFeatureTitle: "Funzione Pro",
      proFeatureExport: "L'esportazione è una funzione Pro. Passa a Pro per esportare i tuoi dati di viaggio.",
      proFeatureAdvancedSearch: "I filtri di ricerca avanzati sono una funzione Pro.",
      proFeatureDarkMode: "La modalità scura è una funzione Pro. Passa a Pro per sbloccare tutti i temi.",
    },
    limitations: {
      title: "Da sapere",
      photosNotBundled: "Le foto non sono incluse nelle esportazioni - solo riferimenti ai file locali",
      noCloudSync: "Tutti i dati sono memorizzati solo localmente sul tuo dispositivo",
      freeTextCities: "I nomi delle città sono testo libero - 'Milan' e 'Milano' sono trattate come città diverse",
      noAutoBackup: "Nessun backup automatico - ricordati di esportare i dati regolarmente",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Basta rovistare tra le foto di viaggio",
          body: "I viaggi si perdono tra migliaia di foto. Tieni luoghi e dettagli in un archivio di viaggio ordinato.",
        },
        structuredArchive: {
          title: "La tua storia di viaggio, organizzata",
          body: "Crea un viaggio, poi aggiungi luoghi e momenti. Tutto resta strutturato e facile da ritrovare.",
        },
        fastSearch: {
          title: "Trovalo in pochi secondi",
          body: "\"Dov'era quella pizzeria a Milano?\" Cerca tra viaggi, luoghi e note — subito.",
        },
        bestOfList: {
          title: "Crea la tua lista dei migliori",
          body: "Valuta i luoghi e aggiungi brevi note. VoyageLog mantiene i tuoi preferiti facili da ritrovare.",
        },
        noCompetition: {
          title: "Nessun feed. Nessuna competizione.",
          body: "È il tuo viaggio privato. Le tue città, le tue valutazioni, i tuoi ricordi—solo per te.",
        },
        privateOffline: {
          title: "Privato e offline-first",
          body: "Nessun account richiesto. I tuoi dati restano sul dispositivo e funzionano anche offline.",
        },
        simpleStart: {
          title: "Inizia ora il tuo primo viaggio",
          body: "Crea un viaggio in pochi secondi e aggiungi il tuo primo luogo. Puoi completare i dettagli nel tempo.",
        },
      },
      createFirstTrip: "Esplora l'app",
      next: "Avanti",
      skip: "Salta",
      back: "Indietro",
    },
    shareContent: {
      locationLabel: "Posizione",
      summaryLabel: "Riepilogo",
      noEntries: "Nessuna voce",
      otherEntries: "Altre voci",
      sharedFrom: "Condiviso da VoyageLog",
      tripHighlights: "Momenti salienti del viaggio",
      cities: "Città",
      places: "Luoghi",
      moments: "Momenti",
      moreItems: "+ {count} altri",
      fromTrip: "Dal viaggio",
      placesSection: "LUOGHI",
      otherPlaces: "ALTRI LUOGHI",
      momentsSection: "MOMENTI",
      myRecommendations: "I miei consigli",
      from: "Da",
      other: "Altro",
    },
  },
  fr: {
    common: {
      appName: "VoyageLog",
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
      entry: "entrée",
      entries: "entrées",
      shareTrip: "Partager le voyage",
    },
    shareDialog: {
      title: "Partager {name}",
      subtitle: "Choisissez comment partager vos recommandations",
      hint: "Vos données restent privées — le partage crée un fichier local",
      optionTextTitle: "Liste texte",
      optionTextDescription: "Format texte simple, idéal pour les messageries",
      optionImageTitle: "Carte visuelle",
      optionImageDescription: "Une belle carte avec vos meilleurs endroits",
      optionPdfTitle: "Document PDF",
      optionPdfDescription: "Guide complet avec tous les détails et notes",
      dialogTitleTrip: "Partager le voyage {name}",
      dialogTitleCityRecommendations: "Partager les recommandations de {name}",
      dialogTitleCityGuide: "Partager le guide de {name}",
      dialogTitleCard: "Partager la carte de {name}",
    },
    tabs: {
      trips: "Voyages",
      search: "Recherche",
      insights: "Aperçus",
      settings: "Paramètres",
    },
    navigation: {
      newTrip: "Nouveau voyage",
      trip: "Voyage",
      editTrip: "Modifier le voyage",
      newEntry: "Nouvelle entrée",
      entry: "Entrée",
      editEntry: "Modifier l'entrée",
    },
    trips: {
      addCover: "Ajouter une couverture",
      days: "{count} jours",
      emptyTitle: "Aucun voyage pour l'instant",
      emptySubtitle: "Commencez à enregistrer vos souvenirs de voyage",
      emptyButton: "Ajouter votre premier voyage",
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
        "Téléchargez vos voyages, entrées et tags en JSON ou XLS",
      exportButton: "Exporter JSON",
      exportButtonXls: "Exporter XLS",
      exportOpenButton: "Ouvrir les options d’export",
      exportInfoTitle: "Pourquoi exporter ?",
      exportInfoDescription:
        "Gardez une sauvegarde personnelle, changez de téléphone ou analysez vos voyages dans un tableur. Les exports restent sur votre appareil jusqu’à partage.",
      exportPrivacyNote:
        "Les fichiers exportés peuvent contenir des notes personnelles. Partagez prudemment.",
      exportPhotosNote:
        "Les photos ne sont pas incluses dans l’export.",
      exportFormatsTitle: "Choisir un format",
      exportFormatsDescription:
        "JSON est idéal pour les sauvegardes et la ré-importation. XLS s’ouvre facilement dans Excel ou Google Sheets.",
      importSection: "Importation",
      importTitle: "Importer les données",
      importDescription: "Importez vos voyages enregistrés depuis un fichier JSON.",
      importButton: "Importer JSON",
      importButtonImporting: "Importation en cours...",
      dataSection: "Données",
      dataTitle: "Exporter et importer",
      dataDescription: "Sauvegardez ou transférez vos voyages via export/import.",
      dataButton: "Afficher les options",
      supportSection: "Support",
      supportRate: "Nous donner 5 étoiles",
      supportShare: "Partager l'app",
      supportContact: "Nous contacter",
      supportShareMessage:
        "VoyageLog - J'ai trouvé une super app de journal de voyage, jette un œil : {link}",
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
      footer: "VoyageLog - Votre système personnel de souvenirs de voyage",
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
        { title: "Marre de scroller ?", subtitle: "Arrêtez de fouiller parmi 2000 photos." },
        { title: "Souvenez-vous de tout", subtitle: "N'oubliez plus jamais ce café parfait." },
        { title: "Votre cerveau de voyage", subtitle: "Rappel instantané pour chaque voyage." },
        { title: "Où était cet endroit ?", subtitle: "Retrouvez n'importe quel souvenir en quelques secondes." },
        { title: "Voyagez plus malin", subtitle: "Voyages illimités. Souvenirs illimités." },
      ],
    },
    labels: {
      date: "Date",
      startDate: "Date de début",
      endDate: "Date de fin",
    },
    placeholders: {
      search: "Rechercher voyages, lieux, notes...",
      tripTitle: "ex. Été en Italie",
      tripSummary: "Brève description de votre voyage...",
      entryTitlePlace: "ex. Trattoria da Luigi",
      entryTitleMoment: "ex. Coucher de soleil au Colisée",
      entryNotes: "Qu'est-ce qui l'a rendu mémorable ?",
      cityListName: "ex. Villes d'Italie, Japon 2025",
      countryName: "ex. Italie, Japon, France",
    },
    tripForm: {
      titleLabel: "Titre *",
      summaryLabel: "Résumé (optionnel)",
      coverImageLabel: "Image de couverture (optionnelle)",
      changeCover: "Modifier",
      addCoverPlaceholder: "Touchez pour ajouter une couverture",
    },
    entryForm: {
      titleLabel: "Titre *",
      ratingLabel: "Note",
      notesLabel: "Notes",
      tagsLabel: "Tags",
      photosLabel: "Photos ({count}/{max})",
      gallery: "Galerie",
      camera: "Appareil",
      tapToAddTags: "Touchez pour ajouter des tags...",
      place: "Lieu",
      moment: "Moment",
      moreTags: "+{count} de plus",
      locationLabel: "Emplacement",
      locationPlaceholder: "Collez un lien de carte ou entrez un nom de lieu",
      locationHint: "Collez un lien Google Maps ou Apple Maps",
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
    tripDetail: {
      noPhoto: "Pas de photo",
      notePill: "Note",
      uncategorized: "Sans catégorie",
      emptyTitle: "Aucune entrée pour l'instant",
      emptySubtitle: "Commencez à ajouter des lieux et des moments de votre voyage",
      addFirstEntry: "Ajouter la première entrée",
      addEntry: "Ajouter une entrée",
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
        "Trouvez des voyages, lieux et moments par nom, lieu, notes ou tags",
      noResultsTitle: "Aucun résultat",
      noResultsSubtitle: "Essayez d'autres mots-clés",
      showLabel: "Afficher",
      entryTypeLabel: "Type d'entrée",
      minRatingLabel: "Note min.",
      tagsLabel: "Tags",
      clearFilters: "Effacer les filtres",
      filterAll: "Tous",
      filterTrips: "Voyages",
      filterEntries: "Entrées",
      filterAny: "N'importe",
      filterPlaces: "Lieux",
      filterMoments: "Moments",
      matchedIn: "Correspondance dans {field}:",
      inTrip: "dans {trip}",
      matchFieldTitle: "titre",
      matchFieldLocation: "lieu",
      matchFieldSummary: "résumé",
      matchFieldNotes: "notes",
      matchFieldTag: "tag",
      matchFieldCity: "ville",
    },
    insights: {
      sectionStats: "Vos statistiques de voyage",
      statsTrips: "Voyages",
      statsEntries: "Entrées",
      statsCities: "Villes",
      statsCountries: "Pays",
      statsPhotos: "Photos",
      statsTripDays: "Jours de voyage",
      entriesBreakdown: "{places} lieux, {moments} moments",
      highlightMostVisited: "Le plus visité",
      highlightFirstTrip: "Premier voyage",
      highlightAvgRating: "Note moyenne",
      topTags: "Tags principaux",
      cityProgress: "Progrès des villes",
      seeAll: "Voir tout",
      createFirstCityList: "Créez votre première liste de villes",
      cityListsEmptyHint: "Suivez les villes que vous souhaitez visiter et vos progrès",
      cityListCount: "{visited}/{total} villes",
      moreLists: "+{count} listes de plus",
      achievements: "Succès",
      viewAll: "Voir tout",
      noBadgesEarned: "Aucun badge gagné",
      badgesEmptyHint: "Continuez à voyager pour débloquer des succès",
      moreBadges: "+{count} badges de plus",
      badgesProgress: "{unlocked} sur {total} badges gagnés",
    },
    badges: {
      earned: "Obtenu",
      locked: "Verrouillé",
      allBadges: "Tous les badges",
      badgesEarned: "Badges obtenus",
      special: "Spécial",
      tagAdventures: "Aventures des tags",
      firstSteps: "Premiers pas",
      tripMilestones: "Étapes de voyage",
      placeMilestones: "Étapes des lieux",
      entryMilestones: "Étapes des entrées",
      countryMilestones: "Étapes des pays",
      photoMilestones: "Étapes des photos",
      cityMilestones: "Étapes des villes",
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
      deleteEntryTitle: "Supprimer l'entrée",
      deleteEntryMessage: "Voulez-vous vraiment supprimer cette entrée ?",
      deletePhotoTitle: "Supprimer la photo",
      deletePhotoMessage: "Voulez-vous vraiment supprimer cette photo ?",
      deleteTripTitle: "Supprimer le voyage",
      deleteTripMessage:
        "Voulez-vous vraiment supprimer ce voyage ? Cela supprimera également toutes les entrées.",
      deleteListTitle: "Supprimer la liste",
      deleteListMessage:
        "Voulez-vous vraiment supprimer \"{name}\" ? Cela supprimera également toutes les villes de cette liste.",
      deleteItemTitle: "Supprimer {item}",
      deleteItemMessage: "Voulez-vous vraiment supprimer cet(te) {item} ?",
      deleteEntryFailed: "Impossible de supprimer l'entrée",
      deletePhotoFailed: "Impossible de supprimer la photo",
      deleteTripFailed: "Impossible de supprimer le voyage",
      deleteListFailed: "Impossible de supprimer la liste",
      createEntryFailed: "Impossible de créer l'entrée. Veuillez réessayer.",
      updateEntryFailed: "Impossible de mettre à jour l'entrée. Veuillez réessayer.",
      createTripFailed: "Impossible de créer le voyage. Veuillez réessayer.",
      updateTripFailed: "Impossible de mettre à jour le voyage. Veuillez réessayer.",
      createCityListFailed:
        "Impossible de créer la liste de villes. Veuillez réessayer.",
      createCityFailed: "Impossible de créer la ville. Veuillez réessayer.",
      addCityFailed: "Impossible d'ajouter la ville",
      permissionCameraMessage: "L'accès à la caméra est nécessaire pour prendre des photos",
      invalidDateMessage: "La date de fin ne peut pas être antérieure à la date de début",
      entryDateOutOfRangeTitle: "Date hors plage",
      entryDateOutOfRangeMessage: "La date de l'entrée doit être comprise entre {start} et {end}.",
      requiredEntryTitle: "Veuillez saisir un titre",
      requiredTripTitle: "Veuillez saisir un titre de voyage",
      requiredTripCity: "Veuillez ajouter au moins une ville",
      requiredListName: "Veuillez saisir un nom de liste",
      requiredCountry: "Veuillez saisir un nom de pays",
      requiredCityName: "Veuillez saisir un nom de ville",
      nothingToShare: "Rien à partager",
      nothingToShareMessage: "Cette ville n'a pas encore d'entrées à partager.",
      shareFailed: "Échec du partage. Veuillez réessayer.",
      tripLimitTitle: "Limite de voyages atteinte",
      tripLimitMessage: "Les utilisateurs gratuits peuvent créer jusqu'à {limit} voyages. Passez à Pro pour des voyages illimités.",
      tripLimitUpgrade: "Passer à Pro",
      backupReminderTitle: "Sauvegardez vos souvenirs",
      backupReminderMessage: "Vous avez enregistré {count} voyages ! Pensez à exporter vos données pour les protéger.",
      backupReminderExport: "Exporter maintenant",
      backupReminderLater: "Plus tard",
      proFeatureTitle: "Fonctionnalité Pro",
      proFeatureExport: "L'exportation est une fonctionnalité Pro. Passez à Pro pour exporter vos données de voyage.",
      proFeatureAdvancedSearch: "Les filtres de recherche avancés sont une fonctionnalité Pro.",
      proFeatureDarkMode: "Le mode sombre est une fonctionnalité Pro. Passez à Pro pour débloquer tous les thèmes.",
    },
    limitations: {
      title: "Bon à savoir",
      photosNotBundled: "Les photos ne sont pas incluses dans les exportations - seulement les références aux fichiers locaux",
      noCloudSync: "Toutes les données sont stockées uniquement localement sur votre appareil",
      freeTextCities: "Les noms de villes sont en texte libre - 'Milan' et 'Milano' sont traités comme des villes différentes",
      noAutoBackup: "Pas de sauvegarde automatique - pensez à exporter vos données régulièrement",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Arrêtez de fouiller dans vos photos de voyage",
          body: "Les voyages se perdent dans des milliers de photos. Gardez les lieux et les détails dans une archive de voyage claire.",
        },
        structuredArchive: {
          title: "Votre historique de voyage, organisé",
          body: "Créez un voyage, puis ajoutez des lieux et des moments. Tout reste structuré et facile à retrouver.",
        },
        fastSearch: {
          title: "Retrouvez-le en quelques secondes",
          body: "\"Où était cette pizzeria à Milan ?\" Recherchez dans vos voyages, lieux et notes — instantanément.",
        },
        bestOfList: {
          title: "Créez votre liste personnelle des meilleurs",
          body: "Notez les lieux et ajoutez de courtes notes. VoyageLog garde vos favoris faciles à retrouver plus tard.",
        },
        noCompetition: {
          title: "Pas de fil. Pas de compétition.",
          body: "C'est votre voyage privé. Vos villes, vos évaluations, vos souvenirs—uniquement pour vous.",
        },
        privateOffline: {
          title: "Privé et hors ligne",
          body: "Aucun compte requis. Vos données restent sur votre appareil et fonctionnent même hors ligne.",
        },
        simpleStart: {
          title: "Commencez votre premier voyage maintenant",
          body: "Créez un voyage en quelques secondes et ajoutez votre premier lieu. Vous pouvez enrichir les détails au fil du temps.",
        },
      },
      createFirstTrip: "Découvrir l'application",
      next: "Suivant",
      skip: "Passer",
      back: "Retour",
    },
    shareContent: {
      locationLabel: "Lieu",
      summaryLabel: "Résumé",
      noEntries: "Aucune entrée",
      otherEntries: "Autres entrées",
      sharedFrom: "Partagé depuis VoyageLog",
      tripHighlights: "Points forts du voyage",
      cities: "Villes",
      places: "Lieux",
      moments: "Moments",
      moreItems: "+ {count} autres",
      fromTrip: "Du voyage",
      placesSection: "LIEUX",
      otherPlaces: "AUTRES LIEUX",
      momentsSection: "MOMENTS",
      myRecommendations: "Mes recommandations",
      from: "De",
      other: "Autre",
    },
  },
  es: {
    common: {
      appName: "VoyageLog",
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
      entry: "entrada",
      entries: "entradas",
      shareTrip: "Compartir viaje",
    },
    shareDialog: {
      title: "Compartir {name}",
      subtitle: "Elige cómo quieres compartir tus recomendaciones",
      hint: "Tus datos se mantienen privados — compartir crea un archivo local",
      optionTextTitle: "Lista de texto",
      optionTextDescription: "Formato de texto simple, perfecto para mensajería",
      optionImageTitle: "Tarjeta visual",
      optionImageDescription: "Una tarjeta bonita con tus mejores lugares",
      optionPdfTitle: "Documento PDF",
      optionPdfDescription: "Guía completa con todos los detalles y notas",
      dialogTitleTrip: "Compartir viaje {name}",
      dialogTitleCityRecommendations: "Compartir recomendaciones de {name}",
      dialogTitleCityGuide: "Compartir guía de {name}",
      dialogTitleCard: "Compartir tarjeta de {name}",
    },
    tabs: {
      trips: "Viajes",
      search: "Buscar",
      insights: "Estadísticas",
      settings: "Ajustes",
    },
    navigation: {
      newTrip: "Nuevo viaje",
      trip: "Viaje",
      editTrip: "Editar viaje",
      newEntry: "Nueva entrada",
      entry: "Entrada",
      editEntry: "Editar entrada",
    },
    trips: {
      addCover: "Agregar portada",
      days: "{count} días",
      emptyTitle: "Aún no hay viajes",
      emptySubtitle: "Empieza a registrar tus recuerdos de viaje",
      emptyButton: "Agregar tu primer viaje",
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
        "Descarga tus viajes, entradas y etiquetas en JSON o XLS",
      exportButton: "Exportar JSON",
      exportButtonXls: "Exportar XLS",
      exportOpenButton: "Abrir opciones de exportación",
      exportInfoTitle: "¿Por qué exportar?",
      exportInfoDescription:
        "Mantén una copia de seguridad, cambia de teléfono o analiza tus viajes en una hoja de cálculo. Las exportaciones se quedan en tu dispositivo hasta que las compartas.",
      exportPrivacyNote:
        "Los archivos exportados pueden incluir notas personales. Comparte con cuidado.",
      exportPhotosNote:
        "Las fotos no se incluyen en la exportación.",
      exportFormatsTitle: "Elige un formato",
      exportFormatsDescription:
        "JSON es ideal para copias de seguridad y reimportación. XLS se abre fácilmente en Excel o Google Sheets.",
      importSection: "Importación",
      importTitle: "Importar datos",
      importDescription: "Importa tus viajes guardados desde un archivo JSON.",
      importButton: "Importar JSON",
      importButtonImporting: "Importando...",
      dataSection: "Datos",
      dataTitle: "Exportar e importar",
      dataDescription: "Haz copia o traslada tus viajes con exportación e importación.",
      dataButton: "Ver opciones",
      supportSection: "Soporte",
      supportRate: "Danos 5 estrellas",
      supportShare: "Compartir la app",
      supportContact: "Contáctanos",
      supportShareMessage:
        "VoyageLog - Encontré una gran app para registrar viajes, échale un vistazo: {link}",
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
      footer: "VoyageLog - Tu sistema personal de recuerdos de viaje",
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
        { title: "¿Cansado de desplazarte?", subtitle: "Deja de buscar entre 2000 fotos." },
        { title: "Recuerda todo", subtitle: "No olvides nunca ese café perfecto." },
        { title: "Tu cerebro viajero", subtitle: "Recuerdo instantáneo de cada viaje." },
        { title: "¿Dónde estaba ese lugar?", subtitle: "Encuentra cualquier recuerdo en segundos." },
        { title: "Viaja mejor", subtitle: "Viajes ilimitados. Recuerdos ilimitados." },
      ],
    },
    labels: {
      date: "Fecha",
      startDate: "Fecha de inicio",
      endDate: "Fecha de fin",
    },
    placeholders: {
      search: "Buscar viajes, lugares, notas...",
      tripTitle: "p. ej., Verano en Italia",
      tripSummary: "Breve descripción de tu viaje...",
      entryTitlePlace: "p. ej., Trattoria da Luigi",
      entryTitleMoment: "p. ej., Atardecer en el Coliseo",
      entryNotes: "¿Qué lo hizo memorable?",
      cityListName: "p. ej., Ciudades de Italia, Japón 2025",
      countryName: "p. ej., Italia, Japón, Francia",
    },
    tripForm: {
      titleLabel: "Título *",
      summaryLabel: "Resumen (opcional)",
      coverImageLabel: "Imagen de portada (opcional)",
      changeCover: "Cambiar",
      addCoverPlaceholder: "Toca para agregar una portada",
    },
    entryForm: {
      titleLabel: "Título *",
      ratingLabel: "Puntuación",
      notesLabel: "Notas",
      tagsLabel: "Etiquetas",
      photosLabel: "Fotos ({count}/{max})",
      gallery: "Galería",
      camera: "Cámara",
      tapToAddTags: "Toca para agregar etiquetas...",
      place: "Lugar",
      moment: "Momento",
      moreTags: "+{count} más",
      locationLabel: "Ubicación",
      locationPlaceholder: "Pega enlace de mapa o ingresa nombre del lugar",
      locationHint: "Pega un enlace de Google Maps o Apple Maps",
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
    tripDetail: {
      noPhoto: "Sin foto",
      notePill: "Nota",
      uncategorized: "Sin categoría",
      emptyTitle: "Aún no hay entradas",
      emptySubtitle: "Empieza a añadir lugares y momentos de tu viaje",
      addFirstEntry: "Agregar la primera entrada",
      addEntry: "Agregar entrada",
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
        "Encuentra viajes, lugares y momentos por nombre, ubicación, notas o etiquetas",
      noResultsTitle: "No se encontraron resultados",
      noResultsSubtitle: "Prueba con otras palabras clave",
      showLabel: "Mostrar",
      entryTypeLabel: "Tipo de entrada",
      minRatingLabel: "Puntuación mín.",
      tagsLabel: "Etiquetas",
      clearFilters: "Limpiar filtros",
      filterAll: "Todos",
      filterTrips: "Viajes",
      filterEntries: "Entradas",
      filterAny: "Cualquiera",
      filterPlaces: "Lugares",
      filterMoments: "Momentos",
      matchedIn: "Coincidencia en {field}:",
      inTrip: "en {trip}",
      matchFieldTitle: "título",
      matchFieldLocation: "ubicación",
      matchFieldSummary: "resumen",
      matchFieldNotes: "notas",
      matchFieldTag: "etiqueta",
      matchFieldCity: "ciudad",
    },
    insights: {
      sectionStats: "Tus estadísticas de viaje",
      statsTrips: "Viajes",
      statsEntries: "Entradas",
      statsCities: "Ciudades",
      statsCountries: "Países",
      statsPhotos: "Fotos",
      statsTripDays: "Días de viaje",
      entriesBreakdown: "{places} lugares, {moments} momentos",
      highlightMostVisited: "Más visitado",
      highlightFirstTrip: "Primer viaje",
      highlightAvgRating: "Puntuación media",
      topTags: "Etiquetas principales",
      cityProgress: "Progreso de ciudades",
      seeAll: "Ver todo",
      createFirstCityList: "Crea tu primera lista de ciudades",
      cityListsEmptyHint: "Sigue las ciudades que quieres visitar y tu progreso",
      cityListCount: "{visited}/{total} ciudades",
      moreLists: "+{count} listas más",
      achievements: "Logros",
      viewAll: "Ver todo",
      noBadgesEarned: "Aún no has ganado insignias",
      badgesEmptyHint: "Sigue viajando para desbloquear logros",
      moreBadges: "+{count} insignias más",
      badgesProgress: "{unlocked} de {total} insignias obtenidas",
    },
    badges: {
      earned: "Obtenida",
      locked: "Bloqueada",
      allBadges: "Todas las insignias",
      badgesEarned: "Insignias obtenidas",
      special: "Especial",
      tagAdventures: "Aventuras de etiquetas",
      firstSteps: "Primeros pasos",
      tripMilestones: "Hitos de viajes",
      placeMilestones: "Hitos de lugares",
      entryMilestones: "Hitos de entradas",
      countryMilestones: "Hitos de países",
      photoMilestones: "Hitos de fotos",
      cityMilestones: "Hitos de ciudades",
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
      deleteEntryTitle: "Eliminar entrada",
      deleteEntryMessage: "¿Seguro que quieres eliminar esta entrada?",
      deletePhotoTitle: "Eliminar foto",
      deletePhotoMessage: "¿Seguro que quieres eliminar esta foto?",
      deleteTripTitle: "Eliminar viaje",
      deleteTripMessage:
        "¿Seguro que quieres eliminar este viaje? Esto también eliminará todas las entradas.",
      deleteListTitle: "Eliminar lista",
      deleteListMessage:
        "¿Seguro que quieres eliminar \"{name}\"? Esto también eliminará todas las ciudades de esta lista.",
      deleteItemTitle: "Eliminar {item}",
      deleteItemMessage: "¿Seguro que quieres eliminar este {item}?",
      deleteEntryFailed: "No se pudo eliminar la entrada",
      deletePhotoFailed: "No se pudo eliminar la foto",
      deleteTripFailed: "No se pudo eliminar el viaje",
      deleteListFailed: "No se pudo eliminar la lista",
      createEntryFailed: "No se pudo crear la entrada. Inténtalo de nuevo.",
      updateEntryFailed: "No se pudo actualizar la entrada. Inténtalo de nuevo.",
      createTripFailed: "No se pudo crear el viaje. Inténtalo de nuevo.",
      updateTripFailed: "No se pudo actualizar el viaje. Inténtalo de nuevo.",
      createCityListFailed:
        "No se pudo crear la lista de ciudades. Inténtalo de nuevo.",
      createCityFailed: "No se pudo crear la ciudad. Inténtalo de nuevo.",
      addCityFailed: "No se pudo agregar la ciudad",
      permissionCameraMessage: "Se requiere acceso a la cámara para tomar fotos",
      invalidDateMessage: "La fecha de fin no puede ser anterior a la fecha de inicio",
      entryDateOutOfRangeTitle: "Fecha fuera de rango",
      entryDateOutOfRangeMessage: "La fecha de la entrada debe estar entre {start} y {end}.",
      requiredEntryTitle: "Por favor, introduce un título",
      requiredTripTitle: "Por favor, introduce un título del viaje",
      requiredTripCity: "Por favor, agrega al menos una ciudad",
      requiredListName: "Por favor, introduce un nombre de lista",
      requiredCountry: "Por favor, introduce un nombre de país",
      requiredCityName: "Por favor, introduce un nombre de ciudad",
      nothingToShare: "Nada que compartir",
      nothingToShareMessage: "Esta ciudad aún no tiene entradas para compartir.",
      shareFailed: "Error al compartir. Inténtalo de nuevo.",
      tripLimitTitle: "Límite de viajes alcanzado",
      tripLimitMessage: "Los usuarios gratuitos pueden crear hasta {limit} viajes. Mejora a Pro para viajes ilimitados.",
      tripLimitUpgrade: "Mejorar a Pro",
      backupReminderTitle: "Guarda tus recuerdos",
      backupReminderMessage: "¡Has registrado {count} viajes! Considera exportar tus datos para mantenerlos seguros.",
      backupReminderExport: "Exportar ahora",
      backupReminderLater: "Más tarde",
      proFeatureTitle: "Función Pro",
      proFeatureExport: "La exportación es una función Pro. Mejora a Pro para exportar tus datos de viaje.",
      proFeatureAdvancedSearch: "Los filtros de búsqueda avanzados son una función Pro.",
      proFeatureDarkMode: "El modo oscuro es una función Pro. Mejora a Pro para desbloquear todos los temas.",
    },
    limitations: {
      title: "Bueno saber",
      photosNotBundled: "Las fotos no se incluyen en las exportaciones - solo referencias a archivos locales",
      noCloudSync: "Todos los datos se almacenan solo localmente en tu dispositivo",
      freeTextCities: "Los nombres de ciudades son texto libre - 'Milan' y 'Milano' se tratan como ciudades diferentes",
      noAutoBackup: "Sin copias de seguridad automáticas - recuerda exportar tus datos regularmente",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Deja de buscar entre fotos de viaje",
          body: "Los viajes se pierden entre miles de fotos. Mantén lugares y detalles en un archivo de viaje ordenado.",
        },
        structuredArchive: {
          title: "Tu historial de viajes, organizado",
          body: "Crea un viaje y luego añade lugares y momentos. Todo queda estructurado y fácil de volver a ver.",
        },
        fastSearch: {
          title: "Encuéntralo en segundos",
          body: "\"¿Dónde estaba esa pizzería en Milán?\" Busca en tus viajes, lugares y notas—al instante.",
        },
        bestOfList: {
          title: "Crea tu lista personal de favoritos",
          body: "Califica lugares y añade notas breves. VoyageLog mantiene tus favoritos fáciles de encontrar después.",
        },
        noCompetition: {
          title: "Sin feed. Sin competencia.",
          body: "Este es tu viaje privado. Tus ciudades, tus valoraciones, tus recuerdos—solo para ti.",
        },
        privateOffline: {
          title: "Privado y sin conexión",
          body: "No se requiere cuenta. Tus datos se quedan en tu dispositivo y funcionan incluso sin conexión.",
        },
        simpleStart: {
          title: "Empieza tu primer viaje ahora",
          body: "Crea un viaje en segundos y añade tu primer lugar. Puedes completar los detalles con el tiempo.",
        },
      },
      createFirstTrip: "Explorar la app",
      next: "Siguiente",
      skip: "Omitir",
      back: "Atrás",
    },
    shareContent: {
      locationLabel: "Ubicación",
      summaryLabel: "Resumen",
      noEntries: "Sin entradas",
      otherEntries: "Otras entradas",
      sharedFrom: "Compartido desde VoyageLog",
      tripHighlights: "Momentos destacados del viaje",
      cities: "Ciudades",
      places: "Lugares",
      moments: "Momentos",
      moreItems: "+ {count} más",
      fromTrip: "Del viaje",
      placesSection: "LUGARES",
      otherPlaces: "OTROS LUGARES",
      momentsSection: "MOMENTOS",
      myRecommendations: "Mis recomendaciones",
      from: "De",
      other: "Otro",
    },
  },
  tr: {
    common: {
      appName: "VoyageLog",
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
      entry: "Kayıt",
      entries: "Kayıtlar",
      shareTrip: "Seyahati paylaş",
    },
    shareDialog: {
      title: "{name} paylaş",
      subtitle: "Önerilerini nasıl paylaşmak istediğini seç",
      hint: "Verilerin gizli kalır — paylaşım yerel bir dosya oluşturur",
      optionTextTitle: "Metin listesi",
      optionTextDescription: "Basit metin formatı, mesajlaşma için ideal",
      optionImageTitle: "Görsel kart",
      optionImageDescription: "En iyi noktalarını içeren şık bir kart",
      optionPdfTitle: "PDF belgesi",
      optionPdfDescription: "Tüm detaylar ve notlarla tam rehber",
      dialogTitleTrip: "{name} seyahatini paylaş",
      dialogTitleCityRecommendations: "{name} önerilerini paylaş",
      dialogTitleCityGuide: "{name} rehberini paylaş",
      dialogTitleCard: "{name} kartını paylaş",
    },
    tabs: {
      trips: "Seyahatler",
      search: "Arama",
      insights: "İstatistikler",
      settings: "Ayarlar",
    },
    navigation: {
      newTrip: "Yeni Seyahat",
      trip: "Seyahat",
      editTrip: "Seyahati Düzenle",
      newEntry: "Yeni Kayıt",
      entry: "Kayıt",
      editEntry: "Kaydı Düzenle",
    },
    trips: {
      addCover: "Kapak ekle",
      days: "{count} gün",
      emptyTitle: "Henüz seyahat yok",
      emptySubtitle: "Seyahat anılarını kaydetmeye başla",
      emptyButton: "İlk seyahatini ekle",
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
        "Seyahatlerini, kayıtlarını ve etiketlerini JSON veya XLS olarak indir",
      exportButton: "JSON Dışa Aktar",
      exportButtonXls: "XLS Dışa Aktar",
      exportOpenButton: "Dışa aktarma seçenekleri",
      exportInfoTitle: "Neden dışa aktar?",
      exportInfoDescription:
        "Kişisel bir yedek oluştur, yeni telefona geç ya da seyahatlerini bir tabloda analiz et. Dışa aktarımlar sen paylaşana kadar cihazında kalır.",
      exportPrivacyNote:
        "Dışa aktarma dosyaları kişisel notlar içerebilir. Dikkatli paylaş.",
      exportPhotosNote:
        "Fotoğrafların kendisi dışa aktarıma dahil edilmez.",
      exportFormatsTitle: "Bir format seç",
      exportFormatsDescription:
        "JSON yedekleme ve yeniden içe aktarma için idealdir. XLS Excel veya Google Sheets’te kolayca açılır.",
      importSection: "İçe Aktar",
      importTitle: "Verileri İçe Aktar",
      importDescription: "JSON dosyasından kayıtlı seyahatlerini içe aktar.",
      importButton: "JSON İçe Aktar",
      importButtonImporting: "İçe aktarılıyor...",
      dataSection: "Veriler",
      dataTitle: "Dışa Aktar ve İçe Aktar",
      dataDescription: "Seyahatlerini dışa/içe aktarma ile yedekle veya taşı.",
      dataButton: "Seçenekleri gör",
      supportSection: "Destek",
      supportRate: "Bize 5 yıldız ver",
      supportShare: "Uygulamayı paylaş",
      supportContact: "Bizimle iletişime geç",
      supportShareMessage:
        "VoyageLog - Harika bir seyahat kayıt uygulaması buldum, buna bir bak: {link}",
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
      footer: "VoyageLog - Kişisel seyahat hafızan",
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
        { title: "Sürekli kaydırmaktan sıkıldın mı?", subtitle: "2000 fotoğraf arasında kaybolma." },
        { title: "Her şeyi hatırla", subtitle: "O mükemmel kafeyi bir daha unutma." },
        { title: "Seyahat hafızan", subtitle: "Her yolculuk detayını anında hatırla." },
        { title: "O yer neredeydi?", subtitle: "Her anıyı saniyeler içinde bul." },
        { title: "Daha akıllı seyahat et", subtitle: "Sınırsız seyahat. Sınırsız anı." },
      ],
    },
    labels: {
      date: "Tarih",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
    },
    placeholders: {
      search: "Seyahatleri, yerleri, notları ara...",
      tripTitle: "örn. İtalya'da Yaz",
      tripSummary: "Seyahatinin kısa özeti...",
      entryTitlePlace: "örn. Trattoria da Luigi",
      entryTitleMoment: "örn. Kolezyum'da gün batımı",
      entryNotes: "Bunu özel yapan neydi?",
      cityListName: "örn. İtalya Şehirleri, Japonya 2025",
      countryName: "örn. İtalya, Japonya, Fransa",
    },
    tripForm: {
      titleLabel: "Başlık *",
      summaryLabel: "Özet (isteğe bağlı)",
      coverImageLabel: "Kapak Görseli (isteğe bağlı)",
      changeCover: "Değiştir",
      addCoverPlaceholder: "Kapak görseli eklemek için dokun",
    },
    entryForm: {
      titleLabel: "Başlık *",
      ratingLabel: "Puan",
      notesLabel: "Notlar",
      tagsLabel: "Etiketler",
      photosLabel: "Fotoğraflar ({count}/{max})",
      gallery: "Galeri",
      camera: "Kamera",
      tapToAddTags: "Etiket eklemek için dokun...",
      place: "Yer",
      moment: "An",
      moreTags: "+{count} daha",
      locationLabel: "Konum",
      locationPlaceholder: "Harita linki yapıştır veya yer adı gir",
      locationHint: "Google Maps veya Apple Maps linki yapıştır",
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
    tripDetail: {
      noPhoto: "Fotoğraf yok",
      notePill: "Not",
      uncategorized: "Kategorisiz",
      emptyTitle: "Henüz kayıt yok",
      emptySubtitle: "Seyahatinden yerler ve anlar eklemeye başla",
      addFirstEntry: "İlk Kaydı Ekle",
      addEntry: "Kayıt Ekle",
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
        "Seyahatleri, yerleri ve anları ad, konum, not veya etiketle bul",
      noResultsTitle: "Sonuç bulunamadı",
      noResultsSubtitle: "Farklı anahtar kelimelerle dene",
      showLabel: "Göster",
      entryTypeLabel: "Kayıt Türü",
      minRatingLabel: "Min. Puan",
      tagsLabel: "Etiketler",
      clearFilters: "Filtreleri temizle",
      filterAll: "Tümü",
      filterTrips: "Seyahatler",
      filterEntries: "Kayıtlar",
      filterAny: "Herhangi",
      filterPlaces: "Yerler",
      filterMoments: "Anlar",
      matchedIn: "Eşleştiği alan: {field}",
      inTrip: "{trip} içinde",
      matchFieldTitle: "başlık",
      matchFieldLocation: "konum",
      matchFieldSummary: "özet",
      matchFieldNotes: "notlar",
      matchFieldTag: "etiket",
      matchFieldCity: "şehir",
    },
    insights: {
      sectionStats: "Seyahat İstatistiklerin",
      statsTrips: "Seyahatler",
      statsEntries: "Kayıtlar",
      statsCities: "Şehirler",
      statsCountries: "Ülkeler",
      statsPhotos: "Fotoğraflar",
      statsTripDays: "Seyahat Günleri",
      entriesBreakdown: "{places} yer, {moments} an",
      highlightMostVisited: "En Çok Ziyaret",
      highlightFirstTrip: "İlk Seyahat",
      highlightAvgRating: "Ort. Puan",
      topTags: "Öne Çıkan Etiketler",
      cityProgress: "Şehir İlerlemesi",
      seeAll: "Tümünü Gör",
      createFirstCityList: "İlk şehir listeni oluştur",
      cityListsEmptyHint: "Ziyaret etmek istediğin şehirleri ve ilerlemeni takip et",
      cityListCount: "{visited}/{total} şehir",
      moreLists: "+{count} liste daha",
      achievements: "Başarılar",
      viewAll: "Tümünü Gör",
      noBadgesEarned: "Henüz rozet kazanılmadı",
      badgesEmptyHint: "Başarıların kilidini açmak için seyahat etmeye devam et",
      moreBadges: "+{count} rozet daha",
      badgesProgress: "{unlocked} / {total} rozet kazanıldı",
    },
    badges: {
      earned: "Kazanıldı",
      locked: "Kilitli",
      allBadges: "Tüm Rozetler",
      badgesEarned: "Kazanılan Rozetler",
      special: "Özel",
      tagAdventures: "Etiket Maceraları",
      firstSteps: "İlk Adımlar",
      tripMilestones: "Seyahat Kilometre Taşları",
      placeMilestones: "Yer Kilometre Taşları",
      entryMilestones: "Kayıt Kilometre Taşları",
      countryMilestones: "Ülke Kilometre Taşları",
      photoMilestones: "Fotoğraf Kilometre Taşları",
      cityMilestones: "Şehir Kilometre Taşları",
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
      deleteEntryTitle: "Kaydı Sil",
      deleteEntryMessage: "Bu kaydı silmek istediğinize emin misiniz?",
      deletePhotoTitle: "Fotoğrafı Sil",
      deletePhotoMessage: "Bu fotoğrafı silmek istediğinize emin misiniz?",
      deleteTripTitle: "Seyahati Sil",
      deleteTripMessage:
        "Bu seyahati silmek istediğinize emin misiniz? Bu işlem tüm kayıtları da silecektir.",
      deleteListTitle: "Listeyi Sil",
      deleteListMessage:
        "\"{name}\" listesini silmek istediğinize emin misiniz? Bu işlem listedeki tüm şehirleri de silecektir.",
      deleteItemTitle: "{item} Sil",
      deleteItemMessage: "Bu {item} öğesini silmek istediğinize emin misiniz?",
      deleteEntryFailed: "Kayıt silinemedi",
      deletePhotoFailed: "Fotoğraf silinemedi",
      deleteTripFailed: "Seyahat silinemedi",
      deleteListFailed: "Liste silinemedi",
      createEntryFailed: "Kayıt oluşturulamadı. Lütfen tekrar deneyin.",
      updateEntryFailed: "Kayıt güncellenemedi. Lütfen tekrar deneyin.",
      createTripFailed: "Seyahat oluşturulamadı. Lütfen tekrar deneyin.",
      updateTripFailed: "Seyahat güncellenemedi. Lütfen tekrar deneyin.",
      createCityListFailed:
        "Şehir listesi oluşturulamadı. Lütfen tekrar deneyin.",
      createCityFailed: "Şehir oluşturulamadı. Lütfen tekrar deneyin.",
      addCityFailed: "Şehir eklenemedi",
      permissionCameraMessage: "Fotoğraf çekmek için kamera izni gerekli",
      invalidDateMessage: "Bitiş tarihi başlangıç tarihinden önce olamaz",
      entryDateOutOfRangeTitle: "Tarih aralık dışında",
      entryDateOutOfRangeMessage: "Kayıt tarihi {start} ile {end} arasında olmalı.",
      requiredEntryTitle: "Lütfen bir başlık girin",
      requiredTripTitle: "Lütfen bir seyahat başlığı girin",
      requiredTripCity: "Lütfen en az bir şehir ekleyin",
      requiredListName: "Lütfen bir liste adı girin",
      requiredCountry: "Lütfen bir ülke adı girin",
      requiredCityName: "Lütfen bir şehir adı girin",
      nothingToShare: "Paylaşılacak bir şey yok",
      nothingToShareMessage: "Bu şehirde henüz paylaşılacak kayıt yok.",
      shareFailed: "Paylaşma başarısız oldu. Lütfen tekrar deneyin.",
      tripLimitTitle: "Seyahat Limitine Ulaşıldı",
      tripLimitMessage: "Ücretsiz kullanıcılar en fazla {limit} seyahat oluşturabilir. Sınırsız seyahat için Pro'ya yükseltin.",
      tripLimitUpgrade: "Pro'ya Yükselt",
      backupReminderTitle: "Anılarını Yedekle",
      backupReminderMessage: "{count} seyahat kaydettin! Verilerini güvende tutmak için dışa aktarmayı düşün.",
      backupReminderExport: "Şimdi Dışa Aktar",
      backupReminderLater: "Daha Sonra",
      proFeatureTitle: "Pro Özellik",
      proFeatureExport: "Dışa aktarma bir Pro özelliğidir. Seyahat verilerini dışa aktarmak için Pro'ya yükseltin.",
      proFeatureAdvancedSearch: "Gelişmiş arama filtreleri bir Pro özelliğidir.",
      proFeatureDarkMode: "Karanlık mod bir Pro özelliğidir. Tüm temaları açmak için Pro'ya yükseltin.",
    },
    limitations: {
      title: "Bilmenizde Fayda Var",
      photosNotBundled: "Fotoğraflar dışa aktarmalara dahil değildir - sadece yerel dosya referansları",
      noCloudSync: "Tüm veriler yalnızca cihazınızda yerel olarak depolanır",
      freeTextCities: "Şehir adları serbest metin - 'Milan' ve 'Milano' farklı şehirler olarak değerlendirilir",
      noAutoBackup: "Otomatik yedekleme yok - verilerinizi düzenli olarak dışa aktarmayı unutmayın",
    },
    onboarding: {
      screens: {
        photoOverload: {
          title: "Seyahat fotoğraflarında kaybolmaya son",
          body: "Seyahatler binlerce fotoğraf arasında kaybolur. Yerleri ve detayları düzenli bir seyahat arşivinde topla.",
        },
        structuredArchive: {
          title: "Düzenli seyahat geçmişi",
          body: "Bir seyahat oluştur, sonra yerler ve anlar ekle. Her şey düzenli kalır ve kolayca geri dönülür.",
        },
        fastSearch: {
          title: "Saniyeler içinde bul",
          body: "\"Milano'daki o pizzacı neredeydi?\" Seyahatlerinde, yerlerinde ve notlarında anında ara.",
        },
        bestOfList: {
          title: "Kişisel en-iyiler listen",
          body: "Yerleri puanla ve kısa notlar ekle. VoyageLog favorilerini daha sonra kolayca bulmanı sağlar.",
        },
        noCompetition: {
          title: "Akış yok. Rekabet yok.",
          body: "Bu senin özel yolculuğun. Şehirlerin, puanların, anıların—yalnızca sana ait.",
        },
        privateOffline: {
          title: "Özel ve çevrimdışı",
          body: "Hesap gerekmez. Verilerin cihazında kalır ve çevrimdışıyken bile çalışır.",
        },
        simpleStart: {
          title: "İlk seyahatine şimdi başla",
          body: "Birkaç saniyede bir seyahat oluştur ve ilk yerini ekle. Detayları zamanla tamamlayabilirsin.",
        },
      },
      createFirstTrip: "Uygulamayı keşfet",
      next: "İleri",
      skip: "Atla",
      back: "Geri",
    },
    shareContent: {
      locationLabel: "Konum",
      summaryLabel: "Özet",
      noEntries: "Kayıt yok",
      otherEntries: "Diğer kayıtlar",
      sharedFrom: "VoyageLog'dan paylaşıldı",
      tripHighlights: "Seyahat Öne Çıkanları",
      cities: "Şehirler",
      places: "Mekanlar",
      moments: "Anlar",
      moreItems: "+ {count} daha",
      fromTrip: "Seyahatten",
      placesSection: "MEKANLAR",
      otherPlaces: "DİĞER MEKANLAR",
      momentsSection: "ANLAR",
      myRecommendations: "Önerilerim",
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
