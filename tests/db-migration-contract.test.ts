import {
  CREATE_CHAPTERS_TABLE,
  CREATE_MEMORIES_TABLE,
  ALTER_CHAPTERS_ADD_ARCHIVED_AT,
  ALTER_MEMORIES_ADD_BABY_ID,
  BACKFILL_MEMORIES_BABY_ID_FROM_CHAPTERS,
  BACKFILL_MEMORIES_BABY_ID_FROM_VAULTS,
  BACKFILL_MEMORIES_BABY_ID_DEFAULT,
  UPGRADE_MIGRATIONS,
} from '../src/db/schema';

describe('db migration contract', () => {
  it('defines archived chapter support in base and upgrade schema', () => {
    expect(CREATE_CHAPTERS_TABLE).toContain('archived_at');
    expect(ALTER_CHAPTERS_ADD_ARCHIVED_AT).toContain('ALTER TABLE chapters ADD COLUMN archived_at');
    expect(UPGRADE_MIGRATIONS).toContain(ALTER_CHAPTERS_ADD_ARCHIVED_AT);
  });

  it('defines baby_id support and backfill for memories', () => {
    expect(CREATE_MEMORIES_TABLE).toContain('baby_id');
    expect(ALTER_MEMORIES_ADD_BABY_ID).toContain('ALTER TABLE memories ADD COLUMN baby_id');
    expect(UPGRADE_MIGRATIONS).toContain(ALTER_MEMORIES_ADD_BABY_ID);

    expect(UPGRADE_MIGRATIONS).toContain(BACKFILL_MEMORIES_BABY_ID_FROM_CHAPTERS);
    expect(UPGRADE_MIGRATIONS).toContain(BACKFILL_MEMORIES_BABY_ID_FROM_VAULTS);
    expect(UPGRADE_MIGRATIONS).toContain(BACKFILL_MEMORIES_BABY_ID_DEFAULT);
  });
});
