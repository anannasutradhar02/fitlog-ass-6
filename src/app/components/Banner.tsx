import Image from 'next/image';

export default function Hero() {
  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        
        {/* Left Content */}
        <div className="max-w-xl z-10">
          <span className="text-[#ccff00] text-xs font-bold tracking-widest uppercase bg-[#ccff00]/10 px-3 py-1 rounded-full">
            Workout Library
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4 mb-6 leading-tight">
            TRAIN WITH INTENT. <br />
            LOG EVERY SET.
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today’s plan, and watch the week’s work add up.
          </p>
          <a 
  href="#workouts-section"
  className="inline-block bg-[#ccff00] hover:bg-[#b3e600] text-black font-black text-xs px-8 py-4 rounded-xl transition cursor-pointer shadow-lg"
>
  BROWSE WORKOUTS
</a>
        </div>

        {/* Right Image */}
        <div className="mt-8 md:mt-0 relative w-full md:w-[450px] h-[300px] md:h-[350px] flex items-center justify-center">
          <Image 
            src="/banner.png" 
            alt="Workout Illustration" 
            fill
            className="object-contain"
          />
        </div>

      </div>
    </section>
  );
}