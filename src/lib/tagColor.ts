const TAG_PALETTES = [
  "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
  "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300",
  "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
];

export function tagColor(tag: string): string {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = (h * 31 + tag.charCodeAt(i)) & 0xffff;
  }
  return TAG_PALETTES[h % TAG_PALETTES.length];
}
