import Icon, { type IconName } from "./Icons";
import Reveal from "./Reveal";

export default function SectionHeading({
  icon,
  color,
  eyebrow,
  title,
  intro,
}: {
  icon: IconName;
  color: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted backdrop-blur-lg">
        <Icon name={icon} color={color} className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-base text-muted md:text-lg">{intro}</p>}
    </Reveal>
  );
}
