
import React, { useState } from 'react';
import { AppData, Person } from '../types';
import { X, Music, Palette, User, Camera, Calendar, Trash2 } from 'lucide-react';
import { DEFAULT_MUSIC_OPTIONS } from '../constants';

interface SettingsModalProps {
  data: AppData;
  onUpdate: (data: AppData) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ data, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'theme' | 'music'>('profiles');
  const [localData, setLocalData] = useState<AppData>(data);

  const handlePersonUpdate = (personKey: 'person1' | 'person2', updates: Partial<Person>) => {
    setLocalData({
      ...localData,
      [personKey]: { ...localData[personKey], ...updates }
    });
  };

  const handleSave = () => {
    onUpdate(localData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="bg-pink-500 p-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Cài đặt không gian riêng
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(['profiles', 'theme', 'music'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-50' : 'text-gray-500'
              }`}
            >
              {tab === 'profiles' && <User size={18} />}
              {tab === 'theme' && <Palette size={18} />}
              {tab === 'music' && <Music size={18} />}
              {tab === 'profiles' ? 'Cá nhân' : tab === 'theme' ? 'Giao diện' : 'Nhạc nền'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto bg-gray-50">
          {activeTab === 'profiles' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Person 1 */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 border-l-4 border-pink-400 pl-2">Người ấy 1</h3>
                  <input 
                    className="w-full border rounded-xl p-3" 
                    placeholder="Tên" 
                    value={localData.person1.name}
                    onChange={e => handlePersonUpdate('person1', { name: e.target.value })}
                  />
                  <input 
                    className="w-full border rounded-xl p-3" 
                    placeholder="URL Avatar" 
                    value={localData.person1.avatar}
                    onChange={e => handlePersonUpdate('person1', { avatar: e.target.value })}
                  />
                  <input 
                    type="date"
                    className="w-full border rounded-xl p-3" 
                    value={localData.person1.birthDate}
                    onChange={e => handlePersonUpdate('person1', { birthDate: e.target.value })}
                  />
                  <textarea 
                    className="w-full border rounded-xl p-3 h-20" 
                    placeholder="Mô tả..."
                    value={localData.person1.description}
                    onChange={e => handlePersonUpdate('person1', { description: e.target.value })}
                  />
                </div>
                {/* Person 2 */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 border-l-4 border-blue-400 pl-2">Người ấy 2</h3>
                  <input 
                    className="w-full border rounded-xl p-3" 
                    placeholder="Tên" 
                    value={localData.person2.name}
                    onChange={e => handlePersonUpdate('person2', { name: e.target.value })}
                  />
                  <input 
                    className="w-full border rounded-xl p-3" 
                    placeholder="URL Avatar" 
                    value={localData.person2.avatar}
                    onChange={e => handlePersonUpdate('person2', { avatar: e.target.value })}
                  />
                  <input 
                    type="date"
                    className="w-full border rounded-xl p-3" 
                    value={localData.person2.birthDate}
                    onChange={e => handlePersonUpdate('person2', { birthDate: e.target.value })}
                  />
                  <textarea 
                    className="w-full border rounded-xl p-3 h-20" 
                    placeholder="Mô tả..."
                    value={localData.person2.description}
                    onChange={e => handlePersonUpdate('person2', { description: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} /> Ngày bắt đầu tình yêu
                </h3>
                <input 
                  type="date"
                  className="w-full border rounded-xl p-3" 
                  value={localData.startDate}
                  onChange={e => setLocalData({...localData, startDate: e.target.value})}
                />
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Loại hình nền</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalData({...localData, theme: {...localData.theme, backgroundType: 'image'}})}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${localData.theme.backgroundType === 'image' ? 'border-pink-500 bg-pink-50' : 'bg-white'}`}
                  >
                    Hình ảnh
                  </button>
                  <button 
                    onClick={() => setLocalData({...localData, theme: {...localData.theme, backgroundType: 'video'}})}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${localData.theme.backgroundType === 'video' ? 'border-pink-500 bg-pink-50' : 'bg-white'}`}
                  >
                    Video
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">URL Hình nền/Video</label>
                <input 
                  className="w-full border rounded-xl p-3" 
                  placeholder="https://..." 
                  value={localData.theme.backgroundUrl}
                  onChange={e => setLocalData({...localData, theme: {...localData.theme, backgroundUrl: e.target.value}})}
                />
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-4">Gợi ý nhạc nền</label>
                <div className="space-y-2">
                  {DEFAULT_MUSIC_OPTIONS.map((music, i) => (
                    <button
                      key={i}
                      onClick={() => setLocalData({...localData, theme: {...localData.theme, musicUrl: music.url}})}
                      className={`w-full text-left p-4 rounded-xl border transition-all hover:bg-pink-50 flex justify-between items-center ${
                        localData.theme.musicUrl === music.url ? 'border-pink-500 bg-pink-50' : 'bg-white'
                      }`}
                    >
                      <span>{music.name}</span>
                      {localData.theme.musicUrl === music.url && <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Hoặc dán URL nhạc trực tiếp (MP3)</label>
                <input 
                  className="w-full border rounded-xl p-3" 
                  placeholder="https://example.com/song.mp3" 
                  value={localData.theme.musicUrl}
                  onChange={e => setLocalData({...localData, theme: {...localData.theme, musicUrl: e.target.value}})}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
