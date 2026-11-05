import Image from "next/image";

/*
 * Round portrait used for small avatars (chat, about card).
 * `src` defaults to the Bitmoji head; pass "/profile.jpg" to show the real photo.
 */
export default function Portrait({
  size = 40,
  src = "/avatar-head.png",
  ring = true,
  className = "",
}: {
  size?: number;
  src?: string;
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
      <Image src={src} alt="Ishan Joshi" width={size * 2} height={size * 2} className="h-full w-full object-cover" />
    </span>
  );
}
