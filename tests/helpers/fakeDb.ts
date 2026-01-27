export type TagRow = {
  id: string;
  name: string;
};

export type TripRow = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  summary: string | null;
  cover_image_uri: string | null;
  created_at: string;
  updated_at: string;
};

export type EntryRow = {
  id: string;
  trip_id: string;
  city_id: string | null;
  entry_type: string;
  title: string;
  notes: string | null;
  rating: number | null;
  date: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PhotoRow = {
  id: string;
  entry_id: string;
  uri: string;
  order_index: number;
};

function normalizeSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim().toLowerCase();
}

function key(a: string, b: string): string {
  return `${a}::${b}`;
}

export class FakeDb {
  tags = new Map<string, TagRow>();
  trips = new Map<string, TripRow>();
  entries = new Map<string, EntryRow>();
  tripTags = new Set<string>();
  entryTags = new Set<string>();
  entryPhotos = new Map<string, PhotoRow>();

  async getFirstAsync<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const query = normalizeSql(sql);

    if (query.startsWith("select id from tags where name")) {
      const name = String(params[0] ?? "");
      for (const tag of this.tags.values()) {
        if (tag.name === name) return { id: tag.id } as T;
      }
      return null;
    }

    if (query.startsWith("select id from tags where id")) {
      const id = String(params[0] ?? "");
      return this.tags.has(id) ? ({ id } as T) : null;
    }

    if (query.startsWith("select id from trips where id")) {
      const id = String(params[0] ?? "");
      return this.trips.has(id) ? ({ id } as T) : null;
    }

    if (query.startsWith("select id from entries where id")) {
      const id = String(params[0] ?? "");
      return this.entries.has(id) ? ({ id } as T) : null;
    }

    if (query.startsWith("select * from trips where id")) {
      const id = String(params[0] ?? "");
      return (this.trips.get(id) ?? null) as T | null;
    }

    if (query.startsWith("select * from entries where id")) {
      const id = String(params[0] ?? "");
      return (this.entries.get(id) ?? null) as T | null;
    }

    return null;
  }

  async getAllAsync<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const query = normalizeSql(sql);

    if (query.includes("from entry_photos")) {
      const entryId = String(params[0] ?? "");
      const rows = Array.from(this.entryPhotos.values()).filter(
        (photo) => photo.entry_id === entryId,
      );
      return rows as T[];
    }

    return [];
  }

  async runAsync(sql: string, params: unknown[] = []): Promise<{ changes: number }>
  {
    const query = normalizeSql(sql);

    if (query.startsWith("insert into tags")) {
      const [id, name] = params as [string, string];
      if (this.tags.has(id)) return { changes: 0 };
      this.tags.set(id, { id, name });
      return { changes: 1 };
    }

    if (query.startsWith("update tags set")) {
      const [name, id] = params as [string, string];
      const existing = this.tags.get(id);
      if (!existing) return { changes: 0 };
      this.tags.set(id, { ...existing, name });
      return { changes: 1 };
    }

    if (query.startsWith("insert into trips")) {
      const [
        id,
        title,
        startDate,
        endDate,
        location,
        summary,
        coverImageUri,
        createdAt,
        updatedAt,
      ] = params as [
        string,
        string,
        string,
        string,
        string,
        string | null,
        string | null,
        string,
        string,
      ];
      if (this.trips.has(id)) return { changes: 0 };
      this.trips.set(id, {
        id,
        title,
        start_date: startDate,
        end_date: endDate,
        location,
        summary,
        cover_image_uri: coverImageUri,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      return { changes: 1 };
    }

    if (query.startsWith("update trips set")) {
      const [
        title,
        startDate,
        endDate,
        location,
        summary,
        coverImageUri,
        updatedAt,
        id,
      ] = params as [
        string,
        string,
        string,
        string,
        string | null,
        string | null,
        string,
        string,
      ];
      const existing = this.trips.get(id);
      if (!existing) return { changes: 0 };
      this.trips.set(id, {
        ...existing,
        title,
        start_date: startDate,
        end_date: endDate,
        location,
        summary,
        cover_image_uri: coverImageUri,
        updated_at: updatedAt,
      });
      return { changes: 1 };
    }

    if (query.startsWith("delete from trip_tags")) {
      const tripId = String(params[0] ?? "");
      const before = this.tripTags.size;
      for (const value of Array.from(this.tripTags)) {
        if (value.startsWith(`${tripId}::`)) {
          this.tripTags.delete(value);
        }
      }
      return { changes: before - this.tripTags.size };
    }

    if (query.startsWith("insert or ignore into trip_tags")) {
      const [tripId, tagId] = params as [string, string];
      const composite = key(tripId, tagId);
      if (this.tripTags.has(composite)) return { changes: 0 };
      this.tripTags.add(composite);
      return { changes: 1 };
    }

    if (query.startsWith("insert into trip_tags")) {
      const [tripId, tagId] = params as [string, string];
      const composite = key(tripId, tagId);
      if (this.tripTags.has(composite)) return { changes: 0 };
      this.tripTags.add(composite);
      return { changes: 1 };
    }

    if (query.startsWith("insert into entries")) {
      const id = String(params[0]);
      if (this.entries.has(id)) return { changes: 0 };

      if (params.length >= 14) {
        const [
          entryId,
          tripId,
          cityId,
          entryType,
          title,
          notes,
          rating,
          date,
          locationName,
          latitude,
          longitude,
          mapUrl,
          createdAt,
          updatedAt,
        ] = params as [
          string,
          string,
          string | null,
          string,
          string,
          string | null,
          number | null,
          string,
          string | null,
          number | null,
          number | null,
          string | null,
          string,
          string,
        ];
        this.entries.set(entryId, {
          id: entryId,
          trip_id: tripId,
          city_id: cityId,
          entry_type: entryType,
          title,
          notes,
          rating,
          date,
          location_name: locationName,
          latitude,
          longitude,
          map_url: mapUrl,
          created_at: createdAt,
          updated_at: updatedAt,
        });
      } else {
        const [
          entryId,
          tripId,
          cityId,
          entryType,
          title,
          notes,
          rating,
          date,
          createdAt,
          updatedAt,
        ] = params as [
          string,
          string,
          string | null,
          string,
          string,
          string | null,
          number | null,
          string,
          string,
          string,
        ];
        this.entries.set(entryId, {
          id: entryId,
          trip_id: tripId,
          city_id: cityId,
          entry_type: entryType,
          title,
          notes,
          rating,
          date,
          location_name: null,
          latitude: null,
          longitude: null,
          map_url: null,
          created_at: createdAt,
          updated_at: updatedAt,
        });
      }
      return { changes: 1 };
    }

    if (query.startsWith("update entries set")) {
      if (query.includes("trip_id")) {
        const [
          tripId,
          cityId,
          entryType,
          title,
          notes,
          rating,
          date,
          updatedAt,
          id,
        ] = params as [
          string,
          string | null,
          string,
          string,
          string | null,
          number | null,
          string,
          string,
          string,
        ];
        const existing = this.entries.get(id);
        if (!existing) return { changes: 0 };
        this.entries.set(id, {
          ...existing,
          trip_id: tripId,
          city_id: cityId,
          entry_type: entryType,
          title,
          notes,
          rating,
          date,
          updated_at: updatedAt,
        });
        return { changes: 1 };
      }

      const [
        cityId,
        entryType,
        title,
        notes,
        rating,
        date,
        locationName,
        latitude,
        longitude,
        mapUrl,
        updatedAt,
        id,
      ] = params as [
        string | null,
        string,
        string,
        string | null,
        number | null,
        string,
        string | null,
        number | null,
        number | null,
        string | null,
        string,
        string,
      ];
      const existing = this.entries.get(id);
      if (!existing) return { changes: 0 };
      this.entries.set(id, {
        ...existing,
        city_id: cityId,
        entry_type: entryType,
        title,
        notes,
        rating,
        date,
        location_name: locationName,
        latitude,
        longitude,
        map_url: mapUrl,
        updated_at: updatedAt,
      });
      return { changes: 1 };
    }

    if (query.startsWith("delete from entry_tags")) {
      const entryId = String(params[0] ?? "");
      const before = this.entryTags.size;
      for (const value of Array.from(this.entryTags)) {
        if (value.startsWith(`${entryId}::`)) {
          this.entryTags.delete(value);
        }
      }
      return { changes: before - this.entryTags.size };
    }

    if (query.startsWith("insert or ignore into entry_tags")) {
      const [entryId, tagId] = params as [string, string];
      const composite = key(entryId, tagId);
      if (this.entryTags.has(composite)) return { changes: 0 };
      this.entryTags.add(composite);
      return { changes: 1 };
    }

    if (query.startsWith("delete from entry_photos")) {
      const entryId = String(params[0] ?? "");
      const before = this.entryPhotos.size;
      for (const [photoId, photo] of Array.from(this.entryPhotos.entries())) {
        if (photo.entry_id === entryId) {
          this.entryPhotos.delete(photoId);
        }
      }
      return { changes: before - this.entryPhotos.size };
    }

    if (query.startsWith("insert into entry_photos")) {
      const [id, entryId, uri, orderIndex] = params as [
        string,
        string,
        string,
        number,
      ];
      if (this.entryPhotos.has(id)) return { changes: 0 };
      this.entryPhotos.set(id, {
        id,
        entry_id: entryId,
        uri,
        order_index: orderIndex,
      });
      return { changes: 1 };
    }

    if (query.startsWith("delete from entries where id")) {
      const id = String(params[0] ?? "");
      const hadEntry = this.entries.delete(id);
      return { changes: hadEntry ? 1 : 0 };
    }

    if (query.startsWith("delete from trips where id")) {
      const id = String(params[0] ?? "");
      const hadTrip = this.trips.delete(id);
      return { changes: hadTrip ? 1 : 0 };
    }

    return { changes: 0 };
  }
}
