
import React, { useRef, useState, useEffect } from 'react';
import { NewsItem } from '../types';

interface VideoReelProps {
  item: NewsItem;
  onViewDossier: (handle: string) => void;
  isActive: boolean;
}

const VideoReel: React.FC<VideoReelProps> = ({ item, onViewDossier, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-black snap-start flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={item.mediaUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={() => setIsMuted(!isMuted)}
      />

      {/* Account & Details Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

      <div className="absolute bottom-10 left-6 right-16 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative pointer-events-auto cursor-pointer" onClick={() => onViewDossier(item.accountHandle || '')}>
            <img src={item.avatarUrl} alt={item.accountHandle} className="w-12 h-12 rounded-full border-2 border-pink-500 shadow-lg shadow-pink-500/30" />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
              <i className="fas fa-check text-[8px] text-white"></i>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-white font-black text-lg tracking-tighter drop-shadow-md pointer-events-auto cursor-pointer" onClick={() => onViewDossier(item.accountHandle || '')}>
              {item.accountHandle}
            </h4>
            <span className="text-[10px] text-pink-400 font-black uppercase tracking-widest">{item.platform} OFFICIAL</span>
          </div>
          <button 
            className="ml-2 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg pointer-events-auto"
            onClick={() => onViewDossier(item.accountHandle || '')}
          >
            Track Identity
          </button>
        </div>

        <div className="flex flex-col gap-2 max-w-lg">
          <h3 className="text-white text-xl font-bold leading-tight drop-shadow-md">{item.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{item.summary}</p>
        </div>

        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <i className="fas fa-satellite-dish text-blue-500 text-xs"></i>
            <span className="text-[10px] text-white font-black uppercase tracking-widest">Live Intercept</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <i className="far fa-clock text-pink-500 text-xs"></i>
            <span className="text-[10px] text-white font-black tracking-widest uppercase">{item.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all pointer-events-auto">
            <i className="fas fa-heart text-white group-hover:text-pink-500 transition-colors"></i>
          </div>
          <span className="text-[10px] text-white font-bold mono">32.4K</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all pointer-events-auto">
            <i className="fas fa-comment text-white group-hover:text-blue-500 transition-colors"></i>
          </div>
          <span className="text-[10px] text-white font-bold mono">1.2K</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all pointer-events-auto">
            <i className="fas fa-share text-white group-hover:text-emerald-500 transition-colors"></i>
          </div>
          <span className="text-[10px] text-white font-bold mono">842</span>
        </button>
      </div>

      {isMuted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/40 p-6 rounded-full animate-pulse">
           <i className="fas fa-volume-mute text-white text-3xl"></i>
        </div>
      )}
    </div>
  );
};

export default VideoReel;
