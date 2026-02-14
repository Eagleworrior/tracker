
import React from 'react';
import { PersonDossier } from '../types';

interface IdentityDossierProps {
  dossier: PersonDossier;
}

const IdentityDossier: React.FC<IdentityDossierProps> = ({ dossier }) => {
  return (
    <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Profile Section */}
        <div className="md:w-1/3 bg-[#0d0d0d] p-8 border-r border-white/5 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-blue-500/30 group">
              <img src={dossier.image} alt={dossier.fullName} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
              Verified
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-tighter mb-1 uppercase italic">{dossier.fullName}</h2>
          <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">{dossier.occupation}</p>
          
          <div className="w-full space-y-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Exposure Level</div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                  style={{ width: `${dossier.digitalFootprintScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-[10px] mono text-gray-400">
                <span>{dossier.digitalFootprintScore}%</span>
                <span>Critical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="flex-1 p-8 bg-[#0a0a0a]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-blue-500"></i> Place of Residence
              </h4>
              <p className="text-lg font-bold text-gray-200">{dossier.currentResidence}</p>
              {dossier.location && (
                <div className="mt-2 text-[10px] mono text-gray-500">
                  LAT: {dossier.location.lat.toFixed(4)} | LNG: {dossier.location.lng.toFixed(4)}
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="fas fa-users text-blue-500"></i> Relatives / Parents
              </h4>
              <div className="flex flex-wrap gap-2">
                {dossier.familyLinks.length > 0 ? dossier.familyLinks.map((link, i) => (
                  <span key={i} className="bg-white/5 border border-white/5 px-2 py-1 rounded text-xs text-gray-400 font-medium italic">
                    {link}
                  </span>
                )) : <span className="text-gray-600 italic text-sm">No Public Records Found</span>}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fas fa-fingerprint text-blue-500"></i> Public Identifiers
            </h4>
            <div className="flex flex-wrap gap-2">
              {dossier.publicIdentifiers.map((id, i) => (
                <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold mono">
                  {id}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fas fa-broadcast-tower text-blue-500"></i> Real-Time Activity Monitoring
            </h4>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 border-l-2 border-l-blue-500 relative overflow-hidden">
               <div className="absolute top-2 right-2 flex gap-1">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                 <span className="text-[8px] text-blue-500 font-black uppercase mono">Live</span>
               </div>
               <p className="text-gray-300 text-sm leading-relaxed mb-2 font-medium">
                 {dossier.recentActivity}
               </p>
               <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                 <i className="fas fa-satellite"></i> Scanned 1.2s ago
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Alert */}
      <div className="bg-blue-600/10 border-t border-blue-500/20 px-8 py-3 flex justify-between items-center">
        <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] italic">
          Target Locked: Continuous Global Monitoring Enabled
        </span>
        <button className="text-[9px] text-white bg-blue-600 px-3 py-1 rounded-md font-black uppercase tracking-widest hover:bg-blue-500 transition-colors">
          Download Archive
        </button>
      </div>
    </div>
  );
};

export default IdentityDossier;
