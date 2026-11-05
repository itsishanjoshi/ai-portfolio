import Image from "next/image";

/*
 * Hero avatar: Ishan's Bitmoji (public/avatar-full.png) standing in front of an animated
 * "neural" orbit. To swap the character, replace avatar-full.png (transparent PNG, ~3:4).
 */
const nodes = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return { x: 100 + Math.cos(a) * 78, y: 100 + Math.sin(a) * 78 };
});

export default function Avatar() {
  return (
    <div className="relative h-60 w-56 sm:h-80 sm:w-80" aria-hidden="true">
      {/* glow + orbit behind the figure */}
      <div className="absolute inset-[14%] rounded-full bg-gradient-to-br from-[#0171E3]/30 via-[#856ED9]/25 to-[#329696]/30 blur-2xl" />
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <g className="origin-center animate-spin-slow" style={{ transformBox: "fill-box" }}>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.16" strokeDasharray="2 7" strokeWidth="1.5" />
          <circle cx="192" cy="100" r="3.5" fill="#0171E3" />
          <circle cx="8" cy="100" r="2.5" fill="#856ED9" />
        </g>
        <g
          className="origin-center animate-spin-slow"
          style={{ transformBox: "fill-box", animationDirection: "reverse", animationDuration: "28s" }}
        >
          <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeOpacity="0.07" />
          {nodes.map((n, i) => (
            <circle key={`n${i}`} cx={n.x} cy={n.y} r={i % 2 ? 2 : 3} fill={i % 2 ? "#329696" : "#856ED9"} fillOpacity="0.6" />
          ))}
        </g>
      </svg>

      {/* the figure, with a soft ground shadow */}
      <div className="absolute inset-x-0 bottom-[4%] mx-auto h-3 w-24 rounded-[50%] bg-black/15 blur-md sm:w-32 dark:bg-black/50" />
      <div className="absolute inset-0 flex animate-float items-end justify-center pb-[5%]">
        <Image
          src="/avatar-full.png"
          alt=""
          width={526}
          height={718}
          priority
          sizes="(min-width: 640px) 240px, 170px"
          className="h-[92%] w-auto drop-shadow-xl select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
