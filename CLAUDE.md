this is  that contains a travel memory app named VoyageLog / TravelMemory).

MISSION
Refactor this code to create a NEW sibling app “BabyLegacy” by reusing the SAME core architecture and logic as the travel app, but adapted to a baby growth memory / family legacy archive domain.

HARD RULES
- Default to offline-first, local-only storage. No cloud sync, no account.
- Do not add heavy dependencies.



this code was existing travel app, 
now it is a    NEW app, created by cloning/adapting the travel app




1.  refactoring it to the baby domain.
2. Update root configuration so new app can be built/run independently (scripts, paths, workspace settings).


TASK 2 — BabyLegacy MVP requirements
Use the same navigation and UX patterns as travel app:
- Trip => Chapter (time period)
- Place/Moment => Memory entry
- Ratings => Meaning / Importance (optional)
- City lists => Milestone lists (user-defined)
- Search remains core
- Export remains core (user-initiated local file)

DATA MODEL (local storage)
- BabyProfile:
  id, name (optional), birthdate (optional), avatar (optional)
- Chapter:
  id, babyId, title, startDate, endDate (optional), description (optional), tags (optional)
  Examples: “0–3 months”, “First Year”, “Summer 2026”
- MemoryEntry:
  id, chapterId, type (Milestone | Note | PhotoOptional), date, title, description, tags
  meaning (optional: 1–5 or boolean ‘Important’)
  attachments placeholder only (avoid complex media unless already exists)

SCREENS (MVP)
1) Baby Profiles multi-profile setup ( multi pro default one baby )
  implement single-profile but architect so multi-profile can be added later.
2) Chapters list (like Trips list)
3) Chapter details (like Trip details) with entries grouped by date
4) Add entry flow: Milestone / Note (PhotoOptional only if already supported)
5) Search: global search across chapters + entries + notes
6) Export: basic JSON export (and PDF only if the travel app already supports it cleanly) ( SHould be in the settings )

COPY / BRANDING (BabyLegacy only)
Replace all travel terms in the baby app UI and copy:
- Trips => Chapters
- Places => Memories / Milestones
- City lists => Milestone lists
Use calm, respectful tone. Not “cute social baby app”.
Examples:
- “Create your first chapter”
- “Add a milestone”
- “Search your family memories”
- “Private by default”

MONETIZATION (MVP)
Plans: Free + Pro Yearly + Pro Lifetime.
- If paywall plumbing exists in travel app, reuse it. ( I will create via Revenuecat new paywall UI )
- If not, create feature flags + UI placeholder so it can be wired later.
In MVP, Pro unlocks:
- Unlimited chapters/entries
- Advanced search filters
- Export formats
(Revenuecat wiring will be handled later by me; just prepare structure and flags.)


OUTPUT REQUIREMENTS
At the end, provide:
- Code refactor, production ready codebase




BabyLegacy Roadmap & MVP Plan (v1.0)

Product Summary

BabyLegacy is an offline-first, private family memory archive for capturing a baby’s growth in a structured way.
It is not a social app and not a photo editor. The focus is on context + milestones + notes and making memories easy to find later (search + timeline). Data stays on-device by default, with user-initiated export.

⸻

MVP Goals (What ships in v1.0)

Core value proposition
	•	Create a family legacy archive: chapters (time periods) + memories (milestones/notes)
	•	Quickly find any memory later via search
	•	Keep it private, offline-first, and exportable

MVP Features

1) Baby profile (MVP: single profile)
	•	Single baby profile (name optional; birthdate optional)
	•	Architecture supports multi-profile later (babyId in data model)

2) Chapters (replaces trips)
	•	Create / edit / delete Chapters
	•	Fields: title, start date, (optional end date), optional description/tags
	•	Default templates (optional): “0–3 months”, “First year”, “Summer 2026”

3) Memory entries (replaces places/moments)
	•	Add / edit / delete Memory Entries within a chapter
	•	Types: Milestone and Note (PhotoOptional only if existing media support is already stable)
	•	Fields: date, title, description, tags, meaning/importance (optional)

4) Chapter details (timeline-like)
	•	Chapter detail view showing entries grouped by date
	•	Fast add entry CTA

5) Global search (killer feature)
	•	Search across chapters and entries:
	•	title, notes/description, tags
	•	Basic filters (MVP):
	•	type: milestone vs note
	•	chapter selection

6) Export (user-initiated, local)
	•	Export to JSON (MVP baseline)
	•	PDF export only if travel app already supports it cleanly (otherwise V2)

7) Offline-first & privacy-first baseline
	•	Local-only storage by default
	•	No account/login
	•	No social sharing feed
	•	Optional export is user-controlled

8) Monetization plumbing (MVP-level)
	•	Plans: Free + Pro Yearly + Pro Lifetime
	•	If existing paywall exists in travel app: reuse UI + gating pattern
	•	If not: implement feature flags + placeholder paywall screen (RevenueCat wiring later)

Pro unlocks in MVP:
	•	Unlimited chapters/entries
	•	Advanced search filters (more than MVP basic)
	•	Export formats (keep JSON in free if you want anti-lock-in; Pro can unlock richer export)

⸻

What’s Out of Scope (MVP)
   - DO NOT HANDLE LOCALIZATION.... JUST IMPLEMENT ENGLISH I WILL DO IT LATER MY SELF

	•	Cloud sync or account system
	•	Family collaboration / shared live albums
	•	Social feed, likes, followers, public sharing
	•	Photo editing, templates, stickers, “IG story” creation
	•	Complex media library management (bulk import, auto-tagging)
	•	Reminders, push notifications (unless trivial)
	•	Encrypted backup/sync (V2)
	•	Full multi-baby profile UX (V2; MVP keeps model ready)

⸻

V2 Backlog (Next best improvements)

V2.1 — “Trust & longevity”
	•	Multi-baby profiles (profiles list + switcher)
	•	Backup UX: guided export + restore flow
	•	“Data safety” education screen (non-invasive)

V2.2 — “Keepsake outputs”
	•	PDF keepsake templates (monthly/yearly recap)
	•	Printable timeline / memory book format
	•	Export with selected photos (if media exists)

V2.3 — “Capture speed”
	•	Quick capture widgets / shortcuts
	•	Optional reminders (weekly “add a memory”)
	•	Tag suggestions / structured milestone prompts

V2.4 — “Optional secure sync”
	•	Encrypted sync (opt-in only)
	•	Multi-device restore (privacy-first, no default cloud)

⸻

Risks & Mitigations

Risk 1: High privacy expectations
	•	Mitigation: Offline-first, no account, clear privacy copy, local-only defaults, user-initiated export only.

Risk 2: Users expect a photo-focused “baby app”
	•	Mitigation: Positioning: “family archive” not “photo editor”.
In-app onboarding + store screenshots emphasize memories + notes + milestones + search.

Risk 3: Data loss anxiety (high-stakes emotional domain)
	•	Mitigation: Early “Export / Backup” visibility, gentle prompts, clear restore instructions (V2), and stable local storage.

Risk 4: Tone risk (too cute / cringe)
	•	Mitigation: Calm, respectful, minimal UI; avoid overly sentimental copy and gimmicks.

Risk 5: Scope creep (media features)
	•	Mitigation: MVP keeps photo optional and minimal; ship timeline+search first; expand media in V2.

⸻

MVP QA Checklist

Core flows
	•	Create baby profile (or default profile) works
	•	Create/edit/delete chapter works
	•	Add/edit/delete milestone entry works
	•	Add/edit/delete note entry works
	•	Chapter details groups by date correctly

Search
	•	Search finds entries by title, note text, tags
	•	Search handles empty state and no results cleanly
	•	Filters (type/chapter) work

Offline & storage
	•	Works without network permission
	•	Local persistence is reliable across app restarts
	•	No crash on large datasets (basic performance sanity)

Export
	•	JSON export includes baby profile, chapters, entries (and attachments metadata if any)
	•	Export produces a shareable local file
	•	Export respects privacy (no implicit upload)

Monetization gating
	•	Free limits enforced correctly (if using limits)
	•	Pro unlock switches the gating correctly (feature flags)
	•	Paywall doesn’t block core onboarding / basic value

App quality
	•	Copy is baby-domain (no “trip/city/travel” leftovers)
	•	Icons and labels consistent
	•	No dead screens, no broken links

⸻

Suggested MVP Milestones (Engineering Roadmap)



Milestone 2 — Core model + screens 
	•	Chapters list + chapter details
	•	Add entry flow

Milestone 3 — Search + export baseline
	•	Global search
	•	JSON export 

Milestone 4 — Polish + gating 
	•	Copy cleanup, empty states
	•	Paywall placeholder + Pro gates
	•	QA pass + performance sanity

⸻

MVP Success Criteria (What “done” means)
	•	A user can create chapters and memories in under 2 minutes
	•	A user can search and find a memory in under 5 seconds
	•	Data remains private/offline-first by default
	•	Export works reliably (JSON baseline)
	•	No travel-domain wording remains in BabyLegacy app UI


	BabyLegacy MVP & Project Roadmap (Updated)

Product Summary

BabyLegacy is a private, offline-first family legacy archive for capturing a child’s story over time.
It is not a social baby app and not a photo editor. The focus is on memories with context (notes + milestones + optional photos), fast retrieval (search), and future-facing writing (age-locked letters).

Core promise:
	•	Write now. Keep forever. Unlock later.
	•	Data stays on-device by default, with user-initiated backup export + restore import.

⸻

Final Concept (Latest Decisions)

One app, two entry modes

BabyLegacy is one app with two onboarding modes:
	1.	Pregnant mode (EDD-based)
	•	Due date (estimated) anchors pregnancy journaling and estimated age locks.
	2.	Born mode (DOB-based)
	•	Birth date anchors chapters, milestones, and exact age locks.

Users can start during pregnancy and later switch to “Born” by entering DOB. Pregnancy content becomes “Before you were born”.

Age-Locked Letters (Vaults)

Users can write unlimited entries under age targets:
	•	Example vaults: 1 year, 5 years, 18 years (default set recommended)
	•	Each vault holds unlimited entries.
	•	Vault remains locked until target date; on unlock day, entries become visible in creation order (chronological).

Data portability (critical)

Because the app is offline-first, MVP must support phone migration:
	•	Backup export (user-initiated local file)
	•	Restore import on new device
	•	Show “Last backup date” and simple backup guidance
	•	No cloud sync in MVP

⸻

MVP Goals (v1.0)
	1.	Enable users to create a calm, trusted legacy archive (not social, not cute).
	2.	Support both pregnancy journaling and post-birth memory logging within a single archive.
	3.	Make it easy to capture and easy to find later (search).
	4.	Provide backup/restore so memories survive device changes.
	5.	Ship a clean, maintainable MVP that can expand into V2 (multi-profile, keepsake exports, encryption).

⸻

MVP Scope (What ships)

A) Onboarding & Modes

Onboarding flow (MVP)
	•	Step 1: Choose mode:
	•	“Baby is born”
	•	“I’m pregnant”
	•	Step 2: Date:
	•	Born → DOB (Birth date)
	•	Pregnant → EDD (Due date)
	•	Optional: baby name/nickname

Mode switching
	•	If user started Pregnant:
	•	Later: “Baby is born” → set DOB
	•	Pregnancy journal moves under “Before you were born”
	•	Age locks become exact using DOB (previously estimated using EDD)

⸻

B) Core Data Model (local storage)
	•	BabyProfile
	•	id, name (optional), dob (optional), edd (optional), avatar (optional), timezone (device default)
	•	Chapter (replaces trips; post-birth timeline organization)
	•	id, babyId, title, startDate, endDate (optional), description (optional), tags (optional)
	•	Examples: “0–3 months”, “First year”, “Summer 2026”
	•	MemoryEntry
	•	id, parentId (chapterId OR pregnancyJournalId OR vaultId)
	•	type: Milestone | Note | LetterEntry
	•	date, title (optional), body, tags (optional)
	•	meaning/importance (optional)
	•	photo optional (only if already stable; otherwise V2)
	•	Vault
	•	id, babyId, targetAgeYears (e.g., 5, 18), unlockDate (derived), status (locked/unlocked)
	•	count, lastSavedAt (for locked UI)

⸻

C) Screens (MVP)
	1.	Home
	•	Context-aware sections:
	•	Pregnant: Pregnancy Journal + Vaults + Search
	•	Born: Chapters + Vaults + Search
	2.	Pregnancy Journal
	•	Free-form entries (MVP)
	•	Optional prompts (lightweight)
	3.	Chapters list
	•	Create/edit chapters
	•	Show chapter title + date range + entry count
	4.	Chapter details
	•	Entries grouped by date
	•	Quick add Milestone / Note
	5.	Vaults list
	•	Default vaults: 1, 5, 18 years (configurable later)
	6.	Vault detail
	•	Locked: show unlock date + entry count + last saved
	•	Add entry always available
	•	Unlocked: show full entry list chronologically
	7.	Global Search
	•	Search across chapters, pregnancy journal, and vault entries
	•	Minimal filters (type, section)
	8.	Backup & Restore
	•	Export backup file (JSON/ZIP)
	•	Import backup file
	•	Last backup date indicator
	9.	Paywall (UI + gating structure)
	•	Free + Pro Yearly + Pro Lifetime
	•	RevenueCat wiring later (placeholder + feature flags acceptable)

⸻

D) Monetization (MVP)

Plans:
	•	Free
	•	Pro Yearly (subscription)
	•	Pro Lifetime (one-time purchase)

MVP Pro unlocks:
	•	Unlimited chapters and entries
	•	Advanced search filters
	•	Enhanced export formats (e.g., PDF later) / unlimited exports

Recommendation (trust-first):
	•	Keep basic backup export/import available to Free to avoid “hostage data” perception.
	•	Put premium value into:
	•	unlimited content
	•	advanced search
	•	keepsake formats (V2)
	•	optional encrypted backup (V2)
