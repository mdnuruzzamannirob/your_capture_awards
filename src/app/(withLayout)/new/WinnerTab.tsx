import { IconPlaceholder } from './IconPlaceholder';

const WINNERS = [
  {
    badge: 'shield-star',
    title: 'Top photographer winner',
    name: 'Deja vu',
    location: 'East Timor',
    level: 'Guru IV',
    rewards: '30 coins - 25 boosts - 20 keys',
    thumbs: 4,
  },
  {
    badge: 'photo-star',
    title: 'Top photo winner',
    name: 'Andrew So',
    location: 'Reunion',
    level: 'Guru VII',
    rewards: '30 coins - 25 boosts - 20 keys',
    thumbs: 0,
  },
  {
    badge: 'award',
    title: "Guru's top pick winner",
    name: 'Dean Darling',
    location: 'Portugal',
    level: 'Guru II',
    rewards: '30 coins - 25 boosts - 20 keys',
    thumbs: 0,
  },
];

export function WinnerTab() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {WINNERS.map((w) => (
        <div key={w.title} className="border-border bg-surface space-y-2.5 rounded-lg border p-3">
          <div className="flex flex-col items-center gap-1">
            <IconPlaceholder name={w.badge} size="sm" />
            <p className="text-center text-sm font-medium">{w.title}</p>
          </div>

          <div className="border-border flex h-40 items-center justify-center rounded-lg border">
            <IconPlaceholder name="photo" />
          </div>

          {w.thumbs > 0 && (
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: w.thumbs }).map((_, i) => (
                <div
                  key={i}
                  className="border-border flex aspect-square items-center justify-center rounded border"
                >
                  <IconPlaceholder name="photo" size="sm" />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <div className="border-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
              <IconPlaceholder name="user" size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{w.name}</p>
              <p className="text-muted-foreground truncate text-[11px]">
                {w.location} - {w.level}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground text-right text-[11px]">{w.rewards}</p>
        </div>
      ))}
    </div>
  );
}
