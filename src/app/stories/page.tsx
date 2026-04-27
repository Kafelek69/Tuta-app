'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, X, Heart, Send, MoreHorizontal } from 'lucide-react';

const MOCK_STORIES = [
  {
    id: 's1',
    user: 'S1mple',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    items: [
      { id: 'i1', type: 'image', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', duration: 5000 },
      { id: 'i2', type: 'image', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', duration: 5000 },
    ],
    timestamp: '2h'
  },
  {
    id: 's2',
    user: 'PashaBiceps',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013P?w=100&q=80',
    items: [
      { id: 'i3', type: 'image', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', duration: 5000 },
    ],
    timestamp: '5h'
  },
  {
    id: 's3',
    user: 'NEO',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
    items: [
      { id: 'i4', type: 'image', url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80', duration: 5000 },
      { id: 'i5', type: 'image', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80', duration: 5000 },
      { id: 'i6', type: 'image', url: 'https://images.unsplash.com/photo-1587840104736-524ba5fcecf8?w=800&q=80', duration: 4000 },
    ],
    timestamp: '1h'
  }
];

export default function StoriesFeed() {
  const [activeUserIdx, setActiveUserIdx] = useState<number | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeUser = activeUserIdx !== null ? MOCK_STORIES[activeUserIdx] : null;
  const activeStory = activeUser?.items[activeStoryIdx] || null;

  const closeStories = () => {
    setActiveUserIdx(null);
    setActiveStoryIdx(0);
    setProgress(0);
  };

  const handleNext = () => {
    if (!activeUser) return;
    if (activeStoryIdx < activeUser.items.length - 1) {
      setActiveStoryIdx(prev => prev + 1);
      setProgress(0);
    } else if (activeUserIdx !== null && activeUserIdx < MOCK_STORIES.length - 1) {
      setActiveUserIdx(prev => (prev !== null ? prev + 1 : null));
      setActiveStoryIdx(0);
      setProgress(0);
    } else {
      closeStories();
    }
  };

  const handlePrev = () => {
    if (!activeUser) return;
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(prev => prev - 1);
      setProgress(0);
    } else if (activeUserIdx !== null && activeUserIdx > 0) {
      setActiveUserIdx(prev => (prev !== null ? prev - 1 : null));
      setActiveStoryIdx(MOCK_STORIES[activeUserIdx - 1].items.length - 1);
      setProgress(0);
    } else {
      closeStories();
    }
  };

  useEffect(() => {
    if (!activeUser || !activeStory) return;

    const intervalCheck = 50;
    const step = (intervalCheck / activeStory.duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalCheck);

    return () => clearInterval(timer);
  }, [activeUserIdx, activeStoryIdx, activeStory, activeUser]);

  return (
    <div className="bg-[#1e1e1e] min-h-screen text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="flex items-center space-x-4">
          <Link href="/feed" className="p-2 hover:bg-[#333] rounded-full transition">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-wider text-orange-500">RELACJE</h1>
        </div>
      </div>

      {/* Stories list */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_STORIES.map((story, idx) => (
            <div 
              key={story.id} 
              className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition-colors"
              onClick={() => {
                setActiveUserIdx(idx);
                setActiveStoryIdx(0);
                setProgress(0);
              }}
            >
              {/* Note: We use img tag to avoid next/image domains parsing errors for fast demo */}
              <img src={story.items[0].url} alt={story.user} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 p-[2px]">
                     <img src={story.avatar} alt={story.user} className="w-full h-full rounded-full object-cover bg-black" />
                  </div>
                  <span className="font-bold text-sm">{story.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Overlay */}
      {activeUser && activeStory && (
        <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col">
          {/* Progress Bars */}
          <div className="flex space-x-1 p-4 absolute top-0 w-full z-10">
            {activeUser.items.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all ease-linear"
                  style={{ 
                    width: idx < activeStoryIdx ? '100%' : idx === activeStoryIdx ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-6 left-0 right-0 p-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              <img src={activeUser.avatar} alt={activeUser.user} className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover" />
              <div>
                <p className="font-bold">{activeUser.user}</p>
                <p className="text-xs text-gray-400">{activeUser.timestamp}</p>
              </div>
            </div>
            <button onClick={closeStories} className="p-2 hover:bg-white/20 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          {/* Touch areas for nav */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 flex-shrink-0 z-0" onClick={handlePrev} />
            <div className="w-2/3 flex-shrink-0 z-0" onClick={handleNext} />
          </div>

          <img src={activeStory.url} alt="Story" className="w-full h-full object-cover" />

          {/* Footer Controls */}
          <div className="absolute bottom-0 w-full p-4 flex items-center space-x-4 bg-gradient-to-t from-black z-10">
            <input type="text" placeholder="Wyślij wiadomość..." className="flex-1 bg-transparent border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:border-orange-500" />
            <button className="text-white hover:text-orange-500"><Heart size={24} /></button>
            <button className="text-white hover:text-orange-500"><Send size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
