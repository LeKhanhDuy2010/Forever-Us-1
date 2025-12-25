
import React, { useState, useRef } from 'react';
import { AppData, Person } from '../types';
import { X, Music, Palette, User, Camera, Calendar, Download, Upload, Trash2, AlertCircle, Copy, Check } from 'lucide-react';
import { DEFAULT_MUSIC_OPTIONS } from '../constants';

interface SettingsModalProps {
  data: AppData;
  onUpdate: (data: AppData) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ data, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'theme' | 'music' | 'data'>('profiles');
  const [localData, setLocalData] = useState<AppData>(data);
  const [copied, setCopied] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'p1' | 'p2' | 'bg') => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file);
      if (type === 'p1') handlePersonUpdate('person1', { avatar: base64 });
      if (type === 'p2') handlePersonUpdate('person2', { avatar: base64 });
      if (type === 'bg') setLocalData({ ...localData, theme: { ...localData.theme, backgroundUrl: base64 } });
    }
  };

  const handlePersonUpdate = (personKey: 'person1' | 'person2', updates: Partial<Person>) => {
    setLocalData({
      ...localData,
      [personKey]: { ...localData[personKey], ...updates }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(localData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(localData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-journey-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setLocalData(imported);
          alert('Khôi phục dữ liệu thành công!');
        } catch (err) {
          alert('File không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    onUpdate(localData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scaleIn my-8">
        <div className="bg-pink-500 p-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">Cài đặt không gian riêng</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X /></button>
        </div>

        <div className="flex border-b overflow-x-auto">
          {(['profiles', 'theme', 'music', 'data'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-50' : 'text-gray-500'
              }`}
            >
              {tab === 'profiles' && <User size={18} />}
              {tab === 'theme' && <Palette size={18} />}
              {tab === 'music' && <Music size={18} />}
              {tab === 'data' && <Download size={18} />}
              {tab === 'profiles' ? 'Cá nhân' : tab === 'theme' ? 'Giao diện' : tab === 'music' ? 'Nhạc nền' : 'Dữ liệu'}
            </button>
          ))}
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto bg-gray-50">
          {activeTab === 'profiles' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 border-l-4 border-pink-400 pl-2">Người ấy 1</h3>
                  <input className="w-full border rounded-xl p-3" placeholder="Tên" value={localData.person1.name} onChange={e => handlePersonUpdate('person1', { name: e.target.value })} />
                  <div className="flex gap-2">
                    <input className="flex-1 border rounded-xl p-3 text-sm" placeholder="Link ảnh hoặc..." value={localData.person1.avatar.startsWith('data:') ? 'Đã upload ảnh' : localData.person1.avatar} onChange={e => handlePersonUpdate('person1', { avatar: e.target.value })} />
                    <label className="bg-white border rounded-xl p-3 cursor-pointer hover:bg-gray-100"><Camera size={20} className="text-pink-500" /><input type="file" hidden accept="image/*" onChange={e => handleFileUpload(e, 'p1')} /></label>
                  </div>
                  <input type="date" className="w-full border rounded-xl p-3" value={localData.person1.birthDate} onChange={e => handlePersonUpdate('person1', { birthDate: e.target.value })} />
                  <textarea className="w-full border rounded-xl p-3 h-20" placeholder="Mô tả..." value={localData.person1.description} onChange={e => handlePersonUpdate('person1', { description: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700 border-l-4 border-blue-400 pl-2">Người ấy 2</h3>
                  <input className="w-full border rounded-xl p-3" placeholder="Tên" value={localData.person2.name} onChange={e => handlePersonUpdate('person2', { name: e.target.value })} />
                  <div className="flex gap-2">
                    <input className="flex-1 border rounded-xl p-3 text-sm" placeholder="Link ảnh hoặc..." value={localData.person2.avatar.startsWith('data:') ? 'Đã upload ảnh' : localData.person2.avatar} onChange={e => handlePersonUpdate('person2', { avatar: e.target.value })} />
                    <label className="bg-white border rounded-xl p-3 cursor-pointer hover:bg-gray-100"><Camera size={20} className="text-blue-500" /><input type="file" hidden accept="image/*" onChange={e => handleFileUpload(e, 'p2')} /></label>
                  </div>
                  <input type="date" className="w-full border rounded-xl p-3" value={localData.person2.birthDate} onChange={e => handlePersonUpdate('person2', { birthDate: e.target.value })} />
                  <textarea className="w-full border rounded-xl p-3 h-20" placeholder="Mô tả..." value={localData.person2.description} onChange={e => handlePersonUpdate('person2', { description: e.target.value })} />
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Calendar size={18} /> Ngày bắt đầu tình yêu</h3>
                <input type="date" className="w-full border rounded-xl p-3" value={localData.startDate} onChange={e => setLocalData({...localData, startDate: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Loại hình nền</label>
                <div className="flex gap-4">
                  <button onClick={() => setLocalData({...localData, theme: {...localData.theme, backgroundType: 'image'}})} className={`flex-1 p-4 rounded-xl border-2 transition-all ${localData.theme.backgroundType === 'image' ? 'border-pink-500 bg-pink-50' : 'bg-white'}`}>Hình ảnh</button>
                  <button onClick={() => setLocalData({...localData, theme: {...localData.theme, backgroundType: 'video'}})} className={`flex-1 p-4 rounded-xl border-2 transition-all ${localData.theme.backgroundType === 'video' ? 'border-pink-500 bg-pink-50' : 'bg-white'}`}>Video</button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Hình nền / Video</label>
                <div className="flex gap-2">
                  <input className="flex-1 border rounded-xl p-3 text-sm" placeholder="https://..." value={localData.theme.backgroundUrl.length > 50 ? 'Đã upload file riêng' : localData.theme.backgroundUrl} onChange={e => setLocalData({...localData, theme: {...localData.theme, backgroundUrl: e.target.value}})} />
                  <label className="bg-white border rounded-xl p-3 cursor-pointer hover:bg-gray-100"><Upload size={20} className="text-pink-500" /><input type="file" hidden accept={localData.theme.backgroundType === 'video' ? 'video/*' : 'image/*'} onChange={e => handleFileUpload(e, 'bg')} /></label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-pink-50 p-6 rounded-2xl flex flex-col gap-4 border-2 border-pink-200">
                <div className="flex gap-3 text-pink-700">
                  <AlertCircle size={24} className="flex-shrink-0" />
                  <div>
                    <p className="font-bold">Lưu thay đổi vĩnh viễn (Cho GitHub)</p>
                    <p className="text-sm">Hãy nhấn nút bên dưới để sao chép cấu hình, sau đó gửi nó cho AI để cập nhật vào code file <b>constants.tsx</b>. Khi đó người khác vào xem sẽ thấy đúng nội dung của bạn.</p>
                  </div>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 p-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Đã sao chép!' : 'Sao chép cấu hình cho AI'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={exportData} className="flex items-center justify-center gap-2 p-4 bg-white border-2 border-pink-500 text-pink-500 rounded-2xl font-bold hover:bg-pink-50 transition-all">
                  <Download size={20} /> Xuất file sao lưu
                </button>
                <label className="flex items-center justify-center gap-2 p-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all cursor-pointer">
                  <Upload size={20} /> Nhập file sao lưu
                  <input type="file" hidden accept=".json" onChange={importData} />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-4">Gợi ý nhạc nền</label>
                <div className="space-y-2">
                  {DEFAULT_MUSIC_OPTIONS.map((music, i) => (
                    <button key={i} onClick={() => setLocalData({...localData, theme: {...localData.theme, musicUrl: music.url}})} className={`w-full text-left p-4 rounded-xl border transition-all hover:bg-pink-50 flex justify-between items-center ${localData.theme.musicUrl === music.url ? 'border-pink-500 bg-pink-50' : 'bg-white'}`}>
                      <span>{music.name}</span>
                      {localData.theme.musicUrl === music.url && <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Link MP3 trực tiếp</label>
                <input className="w-full border rounded-xl p-3" placeholder="https://example.com/song.mp3" value={localData.theme.musicUrl} onChange={e => setLocalData({...localData, theme: {...localData.theme, musicUrl: e.target.value}})} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 px-6 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 transition-colors">Hủy</button>
          <button onClick={handleSave} className="flex-1 py-3 px-6 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all">Lưu tạm (LocalStorage)</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
