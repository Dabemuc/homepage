type Ordered = { id: number; display_order: number | null };

/**
 * Persists a list's current order as display_order 0..n-1 and returns the renumbered list.
 * Renumbering the whole list (not just swapped pairs) heals duplicate positions; only items
 * whose position actually changed are sent to the API.
 */
export async function persistOrder<T extends Ordered>(
  list: T[],
  update: (id: number, displayOrder: number) => Promise<unknown>
): Promise<T[]> {
  await Promise.all(list.map((item, i) => (item.display_order === i ? null : update(item.id, i))));
  return list.map((item, i) => ({ ...item, display_order: i }));
}

/** Returns a copy of the list with the items at a and b swapped. */
export function swapped<T>(list: T[], a: number, b: number): T[] {
  const next = [...list];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}
