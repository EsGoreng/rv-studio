import { VideoPlaylist } from "@/components/ui/video-playlist";
import { SAMPLE_PLAYLIST } from "@/constants/video-playlist";

interface VideoShowcaseSectionProps {
  title?: string;
  description?: string;
  hideOnStart?: boolean;
}

export function VideoShowcaseSection({
  title = "Featured Cinematic Works",
  description = "Explore our latest videography, yearbook documentaries, and event highlight productions.",
  hideOnStart = false,
}: VideoShowcaseSectionProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>

      <VideoPlaylist
        items={SAMPLE_PLAYLIST}
        hideOnStart={hideOnStart}
        nextOverlay={true}
        nextCountdownThreshold={6}
      />
    </section>
  );
}

export default VideoShowcaseSection;
