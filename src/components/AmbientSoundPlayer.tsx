import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Radio, ChevronDown, Sparkles } from 'lucide-react';
import { ambientAudio, AMBIENT_TRACKS, AmbientTrackId } from '../utils/ambientAudio';

interface AmbientSoundPlayerProps {
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export const AmbientSoundPlayer: React.FC<AmbientSoundPlayerProps> = ({
  isOpen = false,
  onToggleOpen
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<AmbientTrackId>('coffee-shop');
  const [volume, setVolume] = useState(0.45);
  const [isMuted, setIsMuted] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    ambientAudio.setVolume(volume);
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      ambientAudio.stop();
      setIsPlaying(false);
    } else {
      ambientAudio.startTrack(currentTrackId);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: AmbientTrackId) => {
    setCurrentTrackId(trackId);
    setShowSelector(false);
    if (isPlaying) {
      ambientAudio.startTrack(trackId);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
    ambientAudio.setVolume(newVol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientAudio.setVolume(volume || 0.4);
    } else {
      setIsMuted(true);
      ambientAudio.setVolume(0);
    }
  };

  const activeTrack = AMBIENT_TRACKS.find((t) => t.id === currentTrackId) || AMBIENT_TRACKS[0];

  return (
    <div className="relative inline-flex items-center">
      {/* Mini Pill Controller in Navigation or Header */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 hover:bg-zinc-850 border border-white/[0.08] rounded-full text-xs text-zinc-200 transition shadow-sm">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          id="btn-ambient-play-toggle"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
          title={isPlaying ? 'Pause Ambient Sound' : 'Play Background Ambient Sound'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Track Title Dropdown Button */}
        <button
          onClick={() => setShowSelector(!showSelector)}
          id="btn-ambient-track-menu"
          className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium text-zinc-300 hover:text-white transition"
          title="Select background audio channel"
        >
          <span>{activeTrack.icon}</span>
          <span className="hidden sm:inline font-sans truncate max-w-[110px]">{activeTrack.name}</span>
          {/* Animated Waveform Equalizer when playing */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3 px-1">
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce [animation-duration:0.6s] h-full" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce [animation-duration:0.9s] h-2/3" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce [animation-duration:0.75s] h-5/6" />
            </div>
          )}
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {/* Volume / Mute Quick Toggle */}
        <button
          onClick={handleToggleMute}
          className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Floating Track Selector & Volume Flyout Panel */}
      {showSelector && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSelector(false)}
          />
          <div className="absolute top-full right-0 mt-2 z-50 w-72 bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-3 text-zinc-100 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="font-display text-xs font-bold text-white">Atmospheric Ambience</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Web Audio
              </span>
            </div>

            {/* Track options list */}
            <div className="space-y-1.5">
              {AMBIENT_TRACKS.map((t) => {
                const isSelected = t.id === currentTrackId;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTrack(t.id)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 text-xs transition border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-sm'
                        : 'bg-zinc-950/60 hover:bg-zinc-800 border-white/[0.04] text-zinc-300'
                    }`}
                  >
                    <span className="text-base mt-0.5">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-100">{t.name}</span>
                        {isSelected && isPlaying && (
                          <span className="text-[10px] font-mono text-amber-400 font-bold">PLAYING</span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{t.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider Bar */}
            <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Ambience Volume
                </span>
                <span className="font-mono text-zinc-300">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
