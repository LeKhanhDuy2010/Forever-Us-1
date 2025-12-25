
import React, { useState } from 'react';
import { Memory } from '../types';
import { Calendar, PlusCircle, Trash2, Camera, X } from 'lucide-react';

interface MemoryListProps {
  memories: Memory[];
  onAdd: (m: Memory) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const ITEMS_PER_PAGE = 10;

const MemoryList: React.FC<MemoryListProps> = ({ memories, onAdd, onDelete, readOnly = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState<Partial<Memory>>({ date: '', title: '', description: '', link: '' });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file);
      setNewMemory({ ...newMemory, link: base64 });
    }
  };

  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPages = Math.ceil(sortedMemories.length / ITEMS_PER_PAGE);
  const currentItems = sortedMemories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemory.date && newMemory.title) {
      onAdd({
        id: Date.now().toString(),
        date: newMemory.date!,
        title: newMemory.title!,
        description: newMemory.description || '',
        link: newMemory.link
      });
      setNewMemory({ date: '', title: '', description: '', link: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-20 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-romantic font-bold text-white drop-shadow-lg">Hành trình kỷ niệm</h2>
        {!readOnly && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-all shadow-lg"
          >
            <PlusCircle size={20} />
            {showAddForm ? 'Đóng' : 'Thêm kỷ niệm'}
          </button>
        )}
      </div>

      {showAddForm && !readOnly && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl mb-8 text-white space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="date" 
              required
              className="bg-white/10 border border-white/20 p-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
              value={newMemory.date}
              onChange={e => setNewMemory({...newMemory, date: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Tiêu đề kỷ niệm" 
              required
              className="bg-white/10 border border-white/20 p-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
              value={newMemory.title}
              onChange={e => setNewMemory({...newMemory, title: e.target.value})}
            />
          </div>
          <textarea 
            placeholder="Mô tả chi tiết..."
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg h-24 outline-none focus:ring-2 focus:ring-pink-400"
            value={newMemory.description}
            onChange={e => setNewMemory({...newMemory, description: e.target.value})}
          />
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 p-3 rounded-lg cursor-pointer hover:bg-white/20 transition-all">
              <Camera size={20} />
              <span>{newMemory.link ? 'Đã chọn ảnh' : 'Chọn ảnh từ máy'}</span>
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
            </label>
            <span className="text-white/40">hoặc</span>
            <input 
              type="url" 
              placeholder="Link hình ảnh" 
              className="flex-[2] bg-white/10 border border-white/20 p-3 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              value={newMemory.link && !newMemory.link.startsWith('data:') ? newMemory.link : ''}
              onChange={e => setNewMemory({...newMemory, link: e.target.value})}
            />
          </div>
          {newMemory.link && newMemory.link.startsWith('data:') && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/30">
              <img src={newMemory.link} className="w-full h-full object-cover" alt="Preview" />
              <button type="button" onClick={() => setNewMemory({...newMemory, link: ''})} className="absolute top-0 right-0 bg-red-500 p-1"><X size={12} /></button>
            </div>
          )}
          <button type="submit" className="w-full bg-white text-pink-500 font-bold py-3 rounded-lg hover:bg-pink-50 transition-colors shadow-lg">
            Lưu kỷ niệm
          </button>
        </form>
      )}

      <div className="space-y-6">
        {currentItems.map((memory) => (
          <div key={memory.id} className="glass p-0 rounded-3xl text-white relative group animate-slideUp overflow-hidden">
            <div className="p-6">
              {!readOnly && (
                <button 
                  onClick={() => onDelete(memory.id)}
                  className="absolute top-4 right-4 text-white/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="flex items-center gap-2 text-pink-300 mb-2">
                <Calendar size={16} />
                <span className="text-sm font-medium">{new Date(memory.date).toLocaleDateString('vi-VN')}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{memory.title}</h3>
              <p className="text-white/80 leading-relaxed mb-4">{memory.description}</p>
            </div>
            {memory.link && (
              <div className="w-full px-6 pb-6">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                  <img src={memory.link} alt={memory.title} className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            )}
          </div>
        ))}
        {memories.length === 0 && (
          <div className="text-center text-white/60 py-20 glass rounded-3xl">
            Chưa có kỷ niệm nào được lưu lại.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 glass rounded-lg text-white disabled:opacity-30"
          >
            Trước
          </button>
          <span className="text-white font-medium">Trang {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 glass rounded-lg text-white disabled:opacity-30"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryList;
