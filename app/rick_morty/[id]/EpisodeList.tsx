"use client";

import { useState } from "react";

interface EpisodeListProps {
  episodes: string[];
}

function getEpisodeNumber(url: string) {
  return url.split("/").pop();
}

export default function EpisodeList({ episodes }: EpisodeListProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleEpisodes = showAll ? episodes : episodes.slice(0, 5);
  const hasMore = episodes.length > 5;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {visibleEpisodes.map((episodeUrl) => (
          <span
            key={episodeUrl}
            className="rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-300"
          >
            Ep. {getEpisodeNumber(episodeUrl)}
          </span>
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mt-3 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:border-emerald-300/40 hover:text-emerald-300"
        >
          {showAll ? "Mostrar menos" : `Mostrar mas (${episodes.length - 5})`}
        </button>
      ) : null}
    </div>
  );
}
