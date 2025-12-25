
import React, { useState } from 'react';
import { Memory } from '../types';
import { ExternalLink, Calendar, PlusCircle, Trash2 } from 'lucide-react';

interface MemoryListProps {
  memories: Memory[];
  onAdd: (m: Memory) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

const MemoryList: React.FC<MemoryListProps> = ({ memories, onAdd, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState<Partial<Memory>>({ date: '', title: '', description: '', link: '' });

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
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-all shadow-lg"
        >
          <PlusCircle size={20} />
          {showAddForm ? 'Đóng' : 'Thêm kỷ niệm'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl mb-8 text-white space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="date" 
              required
              className="bg-white/10 border border-white/20 p-2 rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
              value={newMemory.date}
              onChange={e => setNewMemory({...newMemory, date: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Tiêu đề kỷ niệm" 
              required
              className="bg-white/10 border border-white/20 p-2 rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
              value={newMemory.title}
              onChange={e => setNewMemory({...newMemory, title: e.target.value})}
            />
          </div>
          <textarea 
            placeholder="Mô tả chi tiết..."
            className="w-full bg-white/10 border border-white/20 p-2 rounded-lg h-24 outline-none focus:ring-2 focus:ring-pink-400"
            value={newMemory.description}
            onChange={e => setNewMemory({...newMemory, description: e.target.value})}
          />
          <input 
            type="url" 
            placeholder="Link hình ảnh (không bắt buộc)" 
            className="w-full bg-white/10 border border-white/20 p-2 rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
            value={newMemory.link}
            onChange={e => setNewMemory({...newMemory, link: e.target.value})}
          />
          <button type="submit" className="w-full bg-white text-pink-500 font-bold py-2 rounded-lg hover:bg-pink-50 transition-colors">
            Lưu kỷ niệm
          </button>
        </form>
      )}

      <div className="space-y-6">
        {currentItems.map((memory, index) => (
          <div key={memory.id} className="glass p-6 rounded-2xl text-white relative group animate-slideUp">
            <button 
              onClick={() => onDelete(memory.id)}
              className="absolute top-4 right-4 text-white/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-2 text-pink-300 mb-2">
              <Calendar size={16} />
              <span className="text-sm font-medium">{new Date(memory.date).toLocaleDateString('vi-VN')}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{memory.title}</h3>
            <p className="text-white/80 leading-relaxed mb-4">{memory.description}</p>
            {memory.link && (
              <a 
                href={memory.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-pink-300 hover:text-pink-100 transition-colors bg-white/10 px-3 py-1.5 rounded-full"
              >
                <ExternalLink size={14} />
                Xem hình ảnh đính kèm
              </a>
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
