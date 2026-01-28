# BabyLegacy — Final Concept Implementation Plan

## Current State

The app already has a working MVP with:
- Baby profile (single), chapters, memories (milestone/note), search, export/import, paywall, badges, onboarding
- SQLite + Zustand + Expo Router architecture
- All travel terminology already replaced with baby domain terms

## What the "Final Concept" Adds

The Final Concept introduces **3 major new features** on top of the existing MVP:

1. **Pregnancy Mode** (EDD-based onboarding + pregnancy journal)
2. **Age-Locked Vaults** (letters that unlock at target ages)
3. **Mode Switching** (pregnant → born transition)

Plus updates to: onboarding flow, home screen, data model, export, search.

---

## Implementation Milestones

### Milestone 1 — Data Model & Schema Extensions
> New tables, types, and repositories for pregnancy mode + vaults

- [ ] **1.1** Add `edd` (estimated due date) and `mode` (`pregnant` | `born`) fields to `BabyProfile` type and schema
- [ ] **1.2** Create `vaults` table: `id, baby_id, target_age_years, unlock_date, status (locked|unlocked), created_at, updated_at`
- [ ] **1.3** Extend `memories` table: change `chapter_id` to `parent_id` + add `parent_type` (`chapter` | `vault` | `pregnancy_journal`) — OR keep `chapter_id` nullable and add `vault_id` nullable (simpler migration)
  - **Decision: Use nullable `vault_id` column + `is_pregnancy_journal` boolean on memory** (avoids breaking existing chapter FK)
- [ ] **1.4** Add `memory_type` value `letter` alongside existing `milestone` | `note`
- [ ] **1.5** Create `VaultRepository.ts` with CRUD + unlock logic
- [ ] **1.6** Update `BabyProfileRepository.ts` to handle `edd`, `mode` fields
- [ ] **1.7** Update `MemoryRepository.ts` to support vault entries + pregnancy journal entries
- [ ] **1.8** Update `SearchRepository.ts` to include vault entries + pregnancy journal in search
- [ ] **1.9** Update `StatsRepository.ts` to count vaults + vault entries
- [ ] **1.10** Write DB migration (ALTER TABLE statements for existing installs)

### Milestone 2 — Onboarding Refactor
> New 2-step mode selection onboarding

- [ ] **2.1** Create `BabySetupScreen` — mode picker ("Baby is born" / "I'm pregnant") + date input (DOB or EDD) + optional name
- [ ] **2.2** Update `onboardingStore.ts` to persist selected mode + date alongside profile creation
- [ ] **2.3** Wire onboarding: after carousel pages → `BabySetupScreen` → paywall → home
- [ ] **2.4** Update `_layout.tsx` routing to include baby setup step
- [ ] **2.5** Create default vaults (1yr, 5yr, 18yr) after profile setup

### Milestone 3 — Home Screen (Context-Aware)
> Home adapts based on mode (pregnant vs born)

- [ ] **3.1** Refactor `app/(tabs)/index.tsx` to show context-aware sections:
  - **Pregnant mode**: Pregnancy Journal section + Vaults section + quick search
  - **Born mode**: Chapters section (existing) + Vaults section + quick search
- [ ] **3.2** Add "Pregnancy Journal" section card on home (pregnant mode)
- [ ] **3.3** Add "Vaults" section/cards on home (both modes)
- [ ] **3.4** Keep existing chapters list as a section within born mode

### Milestone 4 — Pregnancy Journal
> Free-form entries for pregnancy mode

- [ ] **4.1** Create `app/pregnancy-journal.tsx` — list view of pregnancy journal entries
- [ ] **4.2** Create `app/pregnancy-journal/new.tsx` — add entry (reuse memory form with simplified fields)
- [ ] **4.3** Entries are memories with `is_pregnancy_journal = true`, no chapter required
- [ ] **4.4** Support milestone + note types in pregnancy journal

### Milestone 5 — Vaults (Age-Locked Letters)
> Core vault feature

- [ ] **5.1** Create `app/vault/index.tsx` — vaults list screen (shows all vaults with lock status)
- [ ] **5.2** Create `app/vault/[id].tsx` — vault detail:
  - **Locked**: show target age, unlock date, entry count, last saved date, "Add letter" button
  - **Unlocked**: show full chronological entry list
- [ ] **5.3** Create `app/vault/new-entry.tsx` — add letter entry to vault (title + body + date)
- [ ] **5.4** Implement unlock logic: compare current date to `unlock_date` (derived from DOB + target years)
- [ ] **5.5** When vault unlocks, update status and show entries
- [ ] **5.6** Recalculate unlock dates when DOB changes (mode switch)

### Milestone 6 — Mode Switching (Pregnant → Born)
> Allow user to transition from pregnant to born

- [ ] **6.1** Add "Baby is born!" action in Settings or Profile section
- [ ] **6.2** On switch: prompt for DOB, update profile mode to `born`, set `birthdate`
- [ ] **6.3** Move pregnancy journal entries under a special "Before you were born" chapter (auto-created)
- [ ] **6.4** Recalculate vault unlock dates using actual DOB instead of EDD
- [ ] **6.5** Home screen automatically switches to born layout

### Milestone 7 — Export & Search Updates
> Extend existing features to cover new data

- [ ] **7.1** Update `export.ts` to include vaults + vault entries + pregnancy journal entries in JSON export
- [ ] **7.2** Update `import.ts` to restore vaults + vault entries + pregnancy journal
- [ ] **7.3** Update search to include vault entries (title, body) + pregnancy journal entries
- [ ] **7.4** Add search filter for section: chapters / pregnancy journal / vaults
- [ ] **7.5** Update `ExportData` type to include vaults

### Milestone 8 — Backup & Restore UX
> Last backup date + restore flow

- [ ] **8.1** Track and display "Last backup date" in Settings
- [ ] **8.2** Add "Restore from backup" option in Settings (import JSON file)
- [ ] **8.3** Store last backup timestamp in local storage (Zustand or file)

### Milestone 9 — Polish & Gating
> Copy, limits, feature flags for new features

- [ ] **9.1** Update `limits.ts` — add free limits for vaults if needed (or keep vaults unlimited in free)
- [ ] **9.2** Update paywall triggers for vault/pregnancy journal usage
- [ ] **9.3** Add English copy for all new screens (pregnancy journal, vaults, mode switch, "Before you were born")
- [ ] **9.4** Update Insights tab to show vault stats
- [ ] **9.5** Empty states for pregnancy journal + vaults
- [ ] **9.6** QA: ensure no travel-domain wording remains

---

## File Change Summary

### New Files
| File | Purpose |
|------|---------|
| `app/pregnancy-journal.tsx` | Pregnancy journal entries list |
| `app/pregnancy-journal/new.tsx` | Add pregnancy journal entry |
| `app/vault/index.tsx` | Vaults list |
| `app/vault/[id].tsx` | Vault detail (locked/unlocked) |
| `app/vault/new-entry.tsx` | Add letter to vault |
| `app/baby-setup.tsx` | Onboarding baby setup (mode + date) |
| `src/db/repositories/VaultRepository.ts` | Vault CRUD + unlock logic |

### Modified Files
| File | Changes |
|------|---------|
| `src/types/index.ts` | Add Vault, LetterEntry types; extend BabyProfile with edd/mode; extend Memory with vault_id/is_pregnancy_journal |
| `src/db/schema.ts` | Add vaults table; ALTER baby_profiles + memories |
| `src/db/database.ts` | Run new migrations |
| `src/db/repositories/BabyProfileRepository.ts` | Handle edd, mode fields |
| `src/db/repositories/MemoryRepository.ts` | Support vault + pregnancy journal entries |
| `src/db/repositories/SearchRepository.ts` | Search vaults + pregnancy journal |
| `src/db/repositories/StatsRepository.ts` | Count vaults |
| `src/db/repositories/index.ts` | Export VaultRepository |
| `src/stores/onboardingStore.ts` | Store mode + date during setup |
| `src/utils/export.ts` | Include vaults in export |
| `src/utils/import.ts` | Restore vaults on import |
| `app/_layout.tsx` | Add routes for new screens |
| `app/(tabs)/index.tsx` | Context-aware home (pregnant vs born) |
| `app/(tabs)/settings.tsx` | Add mode switch, last backup date, restore |
| `app/(tabs)/search.tsx` | New section filters |
| `app/(tabs)/insights.tsx` | Vault stats |
| `app/onboarding.tsx` | Wire to baby-setup after carousel |
| `src/constants/limits.ts` | Vault limits if needed |
| `src/localization/index.ts` | English strings for new features |

---

## Implementation Order

Execute milestones 1→2→3→4→5→6→7→8→9 sequentially. Within each milestone, tasks can mostly be done in order listed.

**Critical path**: Milestone 1 (schema) blocks everything. Milestone 2 (onboarding) blocks 3 (home). Milestones 4 and 5 can be parallel after 1+3. Milestone 6 depends on 4+5. Milestones 7-9 are polish after core features.
