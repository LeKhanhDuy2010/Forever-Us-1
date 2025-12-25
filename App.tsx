
import React, { useState, useEffect, useRef } from 'react';
import { AppData, Memory } from './types';
import { INITIAL_DATA } from './constants';
import { Heart, Settings, Play, Pause, Calendar } from 'lucide-react';
import MemoryList from './components/MemoryList';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('lover_app_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if ?edit=true is in URL
    const params = new URLSearchParams(window.location.search);
    setIsEditMode(params.get('edit') === 'true');
  }, []);

  // Persistence (local only for the owner)
  useEffect(() => {
    localStorage.setItem('lover_app_data', JSON.stringify(data));
  }, [data]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, data.theme.musicUrl]);

  const calculateDays = () => {
    const start = new Date(data.startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddMemory = (memory: Memory) => {
    setData({ ...data, memories: [...data.memories, memory] });
  };

  const handleDeleteMemory = (id: string) => {
    setData({ ...data, memories: data.memories.filter(m => m.id !== id) });
  };

  const daysCount = calculateDays();

  return (
    <div className="relative min-h-screen overflow-x-hidden text-gray-900">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {data.theme.backgroundType === 'video' ? (
          <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={data.theme.backgroundUrl} />
        ) : (
          <div className="w-full h-full bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${data.theme.backgroundUrl})` }} />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {data.theme.musicUrl && <audio ref={audioRef} src={data.theme.musicUrl} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />}

      <main className="relative z-10 flex flex-col items-center pt-20 pb-32">
        <div className="glass p-10 rounded-[3rem] text-white flex flex-col items-center gap-4 mb-16 shadow-2xl animate-fadeIn">
          <Heart className="text-pink-400 fill-pink-400 animate-pulse" size={48} />
          <h1 className="text-3xl font-bold font-romantic tracking-wider">Chúng mình đã yêu nhau được</h1>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black text-pink-400 drop-shadow-lg">{daysCount}</span>
            <span className="text-2xl font-bold">ngày</span>
          </div>
          <p className="text-white/70 italic flex items-center gap-2">
            <Calendar size={16} /> Bắt đầu từ: {new Date(data.startDate).toLocaleDateString('vi-VN')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 mb-20 animate-slideUp">
          <div className="flex flex-col items-center group">
            <div className="relative w-48 h-48 mb-4">
              <div className="absolute inset-0 bg-pink-400 rounded-full animate-spin-slow blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
              <img src={data.person1.avatar} alt={data.person1.name} className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-1">{data.person1.name}</h2>
            <p className="text-white/60 text-sm mb-2">{new Date(data.person1.birthDate).toLocaleDateString('vi-VN')}</p>
            <div className="glass px-4 py-2 rounded-xl text-white text-sm max-w-[200px] text-center">{data.person1.description}</div>
          </div>

          <div className="flex flex-col items-center text-pink-400 scale-150 animate-bounce">
            <Heart size={40} fill="currentColor" />
          </div>

          <div className="flex flex-col items-center group">
            <div className="relative w-48 h-48 mb-4">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-spin-slow-reverse blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
              <img src={data.person2.avatar} alt={data.person2.name} className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-1">{data.person2.name}</h2>
            <p className="text-white/60 text-sm mb-2">{new Date(data.person2.birthDate).toLocaleDateString('vi-VN')}</p>
            <div className="glass px-4 py-2 rounded-xl text-white text-sm max-w-[200px] text-center">{data.person2.description}</div>
          </div>
        </div>

        <MemoryList 
          memories={data.memories} 
          onAdd={handleAddMemory} 
          onDelete={handleDeleteMemory}
          readOnly={!isEditMode}
        />
      </main>

      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {data.theme.musicUrl && (
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-xl ring-2 ring-white/20">
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        )}
        {isEditMode && (
          <button onClick={() => setIsSettingsOpen(true)} className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-all shadow-xl shadow-pink-500/30 ring-2 ring-pink-400/50">
            <Settings size={24} />
          </button>
        )}
      </div>

      {isSettingsOpen && <SettingsModal data={data} onUpdate={setData} onClose={() => setIsSettingsOpen(false)} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
