
import { AppData } from './types';

export const DEFAULT_MUSIC_OPTIONS = [
  { name: 'Love Story (Taylor Swift Instrumental)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder
  { name: 'Beautiful in White', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Noel Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { name: 'All I Want For Christmas Is You', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

export const INITIAL_DATA: AppData = {
  person1: {
    name: 'Anh',
    avatar: 'https://picsum.photos/400/400?random=1',
    birthDate: '1998-01-01',
    description: 'Chàng trai của em'
  },
  person2: {
    name: 'Em',
    avatar: 'https://picsum.photos/400/400?random=2',
    birthDate: '2000-01-01',
    description: 'Cô gái của anh'
  },
  startDate: '2023-01-01',
  memories: [
    {
      id: '1',
      date: '2023-01-01',
      title: 'Ngày đầu tiên gặp gỡ',
      description: 'Chúng ta đã gặp nhau tại một quán cà phê nhỏ ven đường.',
      link: 'https://picsum.photos/800/600?random=10'
    },
    {
      id: '2',
      date: '2023-02-14',
      title: 'Valentine đầu tiên',
      description: 'Món quà bất ngờ nhất mà anh dành cho em.',
      link: 'https://picsum.photos/800/600?random=11'
    }
  ],
  theme: {
    backgroundUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1920',
    backgroundType: 'image',
    musicUrl: '',
    accentColor: '#ec4899' // Pink-500
  }
};
