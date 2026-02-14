
import React, { useState, useRef, useEffect } from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInstagram = item.platform.toLowerCase().includes('instagram');

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'breaking': return 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'positive': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'negative': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'fab fa-instagram';
    if (p.includes('x') || p.includes('twitter')) return 'fab fa-x-twitter';
    if (p.includes('reddit')) return 'fab fa-reddit-alien';
    if (p.includes('tiktok')) return 'fab fa-tiktok';
    if (p.includes('youtube')) return 'fab fa-youtube';
    if (p.includes('telegram')) return 'fab fa-telegram';
    return 'fas fa-globe';
  };

  return (
    <div className={`group relative bg-[#0a0a0a] border ${isInstagram ? 'border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.1)]' : (item.sentiment === 'breaking' ? 'border-red-500/30' : 'border-white/5')} rounded-2xl transition-all hover:bg-[#111] hover:border-white/20 overflow-hidden flex flex-col`}>
      {/* Media Section */}
      {item.mediaUrl && (
        <div ref={containerRef} className="relative w-full h-56 overflow-hidden bg-black group/media">
          {item.mediaType === 'video' ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={item.mediaUrl}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                onClick={togglePlay}
                loop
                playsInline
              />
              {/* Custom Controls Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-between gap-3">
                <button onClick={togglePlay} className="text-white hover:text-pink-500 transition-colors">
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                </button>
                
                <div className="flex-1 flex items-center gap-2 group/volume">
                  <i className={`fas ${volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'} text-white text-[10px]`}></i>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-1 appearance-none bg-white/20 rounded-full cursor-pointer accent-pink-500"
                  />
                </div>

                <button onClick={toggleFullscreen} className="text-white hover:text-pink-500 transition-colors">
                  <i className="fas fa-expand text-sm"></i>
                </button>
              </div>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <i className="fas fa-play text-white text-lg ml-1"></i>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <img 
                src={item.mediaUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </>
          )}

          {isInstagram && (
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-pink-500/20 transition-all pointer-events-none"></div>
          )}
          
          <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
            <span className={`backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 uppercase tracking-tighter ${isInstagram ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white' : 'bg-black/60 text-gray-300'}`}>
              <i className={getPlatformIcon(item.platform)}></i>
              {item.platform}
            </span>
          </div>
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
             <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.1em] border ${getSentimentStyles(item.sentiment)}`}>
              {item.sentiment}
            </span>
            <span className="bg-white/5 text-gray-500 border border-white/5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
              {item.category}
            </span>
          </div>
          <span className="text-gray-600 text-[10px] mono flex items-center gap-2 font-bold bg-white/[0.03] px-2 py-1 rounded-md">
            <i className="far fa-clock text-blue-500"></i> {item.timestamp}
          </span>
        </div>

        <h3 className="text-xl font-black text-gray-100 mb-3 leading-tight group-hover:text-pink-400 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
          {item.summary}
        </p>

        {expanded && (
          <div className="mb-5 p-4 bg-white/[0.03] rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-[10px] uppercase font-black text-pink-500 mb-3 tracking-widest flex items-center gap-2">
              <i className="fab fa-instagram"></i> Full Post Intelligence
            </h4>
            <p className="text-gray-300 text-xs leading-loose italic">
              {item.detailedContent}
            </p>
          </div>
        )}

        <button 
          onClick={() => setExpanded(!expanded)}
          className={`text-[10px] font-black uppercase tracking-widest mb-5 self-start flex items-center gap-2 transition-all ${isInstagram ? 'text-pink-500 hover:text-pink-400' : 'text-blue-500 hover:text-blue-400'}`}
        >
          {expanded ? 'Collapse Report' : 'Intercept Media Details'}
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
        </button>

        <div className="mt-auto pt-5 border-t border-white/5 flex flex-wrap gap-2">
          {item.sources.map((source, idx) => (
            <a 
              key={idx}
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white bg-white/[0.05] hover:bg-pink-600/20 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-pink-500/30 group/link"
            >
              <i className="fas fa-external-link-alt text-[8px] group-hover/link:text-pink-400"></i>
              {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
