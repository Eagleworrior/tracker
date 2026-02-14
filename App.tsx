
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NewsItem, ViewMode, PersonDossier, GeneratedAsset } from './types';
import { fetchRealtimeNews, fetchIdentityIntelligence, determineIntent, generateAIImage, generateAIVideo } from './services/geminiService';
import NewsCard from './components/NewsCard';
import IdentityDossier from './components/IdentityDossier';
import VideoReel from './components/VideoReel';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [creativeAssets, setCreativeAssets] = useState<GeneratedAsset[]>([]);
  const [topic, setTopic] = useState<string>('Global High-Frequency Intercepts');
  const [inputSearch, setInputSearch] = useState<string>('');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('news');
  const [currentDossier, setCurrentDossier] = useState<PersonDossier | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reelsContainerRef = useRef<HTMLDivElement>(null);

  // Implement handleIdentitySearch to resolve "Cannot find name 'handleIdentitySearch'" error
  const handleIdentitySearch = useCallback(async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    setProgressMsg("Scanning Digital Footprint...");
    setError(null);
    try {
      const dossier = await fetchIdentityIntelligence(query);
      setCurrentDossier(dossier);
      setViewMode('intel');
    } catch (err) {
      setError("AI Engine reported a bypass error or safety trigger.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  }, []);

  const startIntelligenceStream = useCallback(async (searchTopic: string) => {
    if (viewMode !== 'news' && viewMode !== 'reels') return;
    setIsLoading(true);
    try {
      const results = await fetchRealtimeNews(searchTopic);
      setNews(prev => [...results.filter(r => !prev.some(p => p.title === r.title)), ...prev].slice(0, 100));
    } catch (err) { setError("Downlink saturated. Retrying..."); }
    finally { setIsLoading(false); }
  }, [viewMode]);

  const handleOmniAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSearch.trim()) return;
    
    setIsLoading(true);
    setProgressMsg("Analyzing Intent...");
    setError(null);

    try {
      const intent = await determineIntent(inputSearch);
      
      if (intent === 'image') {
        setProgressMsg("Dreaming visual pixels...");
        const url = await generateAIImage(inputSearch);
        const asset: GeneratedAsset = { id: Date.now().toString(), type: 'image', url, prompt: inputSearch, timestamp: new Date().toLocaleTimeString() };
        setCreativeAssets(prev => [asset, ...prev]);
        setViewMode('creative');
      } else if (intent === 'video') {
        // Veo Check: Ensure the user has selected their own API key for video generation
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          await (window as any).aistudio.openSelectKey();
        }
        setProgressMsg("Synthesizing temporal neural frames...");
        const url = await generateAIVideo(inputSearch, (msg) => setProgressMsg(msg));
        const asset: GeneratedAsset = { id: Date.now().toString(), type: 'video', url, prompt: inputSearch, timestamp: new Date().toLocaleTimeString() };
        setCreativeAssets(prev => [asset, ...prev]);
        setViewMode('creative');
      } else if (intent === 'intel') {
        await handleIdentitySearch(inputSearch);
      } else {
        setTopic(inputSearch);
        setNews([]);
        setViewMode('news');
        startIntelligenceStream(inputSearch);
      }
    } catch (err) {
      setError("AI Engine reported a bypass error or safety trigger.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  useEffect(() => {
    if (viewMode === 'news' || viewMode === 'reels') {
      startIntelligenceStream(topic);
      if (isLive) {
        pollingRef.current = setInterval(() => startIntelligenceStream(topic), 20000);
      }
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [topic, isLive, startIntelligenceStream, viewMode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#020202] text-gray-200 selection:bg-blue-500/30 overflow-hidden">
      {/* Top OS Banner */}
      <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] py-1.5 px-6 flex justify-between items-center z-50 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> PULSE CORE: v5.0-OMEGA</span>
          <span className="opacity-40">|</span>
          <span className="opacity-80">MULTI-MODAL GROUNDING: ENGAGED</span>
        </div>
        <div className="flex gap-4">
          <span className="opacity-70">LATENCY: 12ms</span>
          <span className="opacity-70">SIGNAL: 5/5</span>
        </div>
      </div>

      {/* Omni-Command Header */}
      <header className={`sticky top-0 z-50 bg-black/95 backdrop-blur-3xl border-b border-white/5 p-6 transition-all ${viewMode === 'reels' ? 'h-0 py-0 overflow-hidden opacity-0' : 'h-auto'}`}>
        <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="relative w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <i className="fas fa-brain text-white text-2xl"></i>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-black rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">PULSE<span className="text-blue-500">OMEGA</span></h1>
              <div className="flex gap-4 mt-1">
                <button onClick={() => setViewMode('news')} className={`text-[10px] font-black uppercase tracking-widest ${viewMode === 'news' ? 'text-blue-400' : 'text-gray-500'}`}>Streams</button>
                <button onClick={() => setViewMode('reels')} className={`text-[10px] font-black uppercase tracking-widest ${viewMode === 'reels' ? 'text-blue-400' : 'text-gray-500'}`}>Reels</button>
                <button onClick={() => setViewMode('creative')} className={`text-[10px] font-black uppercase tracking-widest ${viewMode === 'creative' ? 'text-blue-400' : 'text-gray-500'}`}>Creative</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleOmniAction} className="flex-1 max-w-4xl flex gap-3 relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
             <div className="relative flex-1 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center px-6">
                <i className="fas fa-terminal text-blue-500 mr-4"></i>
                <input 
                  type="text" 
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  placeholder="Ask anything: 'Mars News', 'Track @handle', 'Generate Image of X', 'Create Video of Y'..."
                  className="w-full bg-transparent py-4.5 text-base focus:outline-none placeholder:text-gray-700 font-bold"
                />
             </div>
             <button type="submit" className="relative bg-white text-black px-10 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Intercept</button>
          </form>
        </div>
      </header>

      {/* Workspace Area */}
      <main className={`flex-1 overflow-y-auto ${viewMode === 'reels' ? 'h-screen p-0 snap-y snap-mandatory' : 'p-6 md:p-10'}`}>
        {isLoading && progressMsg && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 border-8 border-blue-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-black italic text-white tracking-tighter uppercase animate-pulse">{progressMsg}</h3>
            <p className="text-blue-500/60 font-black uppercase text-[10px] tracking-[0.4em] mt-4">Multi-Modal Synthesis Engine</p>
          </div>
        )}

        {viewMode === 'news' ? (
          <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {news.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        ) : viewMode === 'creative' ? (
          <div className="max-w-[1700px] mx-auto">
            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-10 uppercase">Generated Realities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {creativeAssets.map(asset => (
                <div key={asset.id} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden group">
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {asset.type === 'video' ? (
                      <video src={asset.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{asset.type}</div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-400 text-sm font-bold mb-4 italic">"{asset.prompt}"</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-600 uppercase font-black tracking-widest">
                      <span>Synthesized {asset.timestamp}</span>
                      <a href={asset.url} download={`pulse-asset-${asset.id}`} className="text-blue-500 hover:text-white transition-colors">Export RAW</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewMode === 'intel' && currentDossier ? (
          <div className="py-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <IdentityDossier dossier={currentDossier} />
          </div>
        ) : viewMode === 'reels' ? (
          <div ref={reelsContainerRef} className="h-full overflow-y-scroll snap-y snap-mandatory" onScroll={() => setActiveIndex(Math.round(reelsContainerRef.current!.scrollTop / window.innerHeight))}>
             <button onClick={() => setViewMode('news')} className="fixed top-12 left-6 z-[60] bg-black/60 border border-white/20 p-4 rounded-2xl text-white"><i className="fas fa-arrow-left"></i></button>
             {news.filter(n => n.mediaType === 'video').map((item, idx) => (
                <VideoReel key={item.id} item={item} isActive={activeIndex === idx} onViewDossier={handleIdentitySearch} />
             ))}
          </div>
        ) : null}
      </main>

      {/* Global Status Bar */}
      <footer className={`bg-[#050505] border-t border-white/5 p-6 z-50 transition-transform ${viewMode === 'reels' ? 'translate-y-full' : 'translate-y-0'}`}>
         <div className="max-w-[1700px] mx-auto flex justify-between items-center">
            <div className="flex gap-10">
               <div><div className="text-[9px] text-gray-600 font-black uppercase mb-1">Active Signals</div><div className="text-xl font-black mono text-white">12.4K</div></div>
               <div><div className="text-[9px] text-gray-600 font-black uppercase mb-1">Synthesizer Load</div><div className="text-xl font-black mono text-emerald-500">OPTIMAL</div></div>
            </div>
            <div className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">PULSE OMEGA v5.0 // THE END OF INFORMATION ASYMMETRY</div>
         </div>
      </footer>
    </div>
  );
};

export default App;
