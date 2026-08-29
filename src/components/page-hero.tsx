export function PageHero({
  index,
  title,
  subtitle,
  children,
  compact = false,
}: {
  index: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "mx-auto max-w-5xl px-4 pt-7 pb-5 sm:px-6"
          : "mx-auto max-w-5xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16"
      }
    >
      <div className="flex items-start gap-4">
        <span className="mono pt-2 text-sm text-mint">{index}</span>
        <div>
          <h1
            className={
              compact
                ? "display text-3xl text-white sm:text-5xl"
                : "display text-4xl text-white sm:text-6xl"
            }
          >
            {title}
          </h1>
          <p
            className={
              compact
                ? "mt-2 max-w-xl text-sm leading-6 text-mute"
                : "mt-4 max-w-xl text-sm leading-6 text-mute"
            }
          >
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
