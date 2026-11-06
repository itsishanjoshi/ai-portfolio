import Image from "next/image";

/*
 * Round close-up used for small avatars (nav, chat, about card).
 */
export default function Portrait({
  size = 40,
  ring = true,
  className = "",
}: {
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#0171E3]/20 via-[#856ED9]/20 to-[#329696]/20 ${
        ring ? "ring-2 ring-background outline outline-1 outline-border" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* zoomed on the face so it still reads at 32px */}
      <Image
        src="/profile.jpg"
        alt="Ishan Joshi"
        width={size * 4}
        height={size * 4}
        className="h-full w-full origin-[50%_28%] scale-[1.7] object-cover"
      />
    </span>
  );
}
