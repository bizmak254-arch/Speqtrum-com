import React from 'react';

const VideoMarketplace: React.FC = () => {
  const categories = ['Trending', 'New Arrivals', 'Top Creators', 'Exclusive', 'Bundles'];
  const featuredItems = [
    { id: 1, title: 'Backstage Pass: Tour Life', creator: 'Alex Rivera', price: 4.99, image: 'https://picsum.photos/seed/m1/400/300', rating: 4.8 },
    { id: 2, title: 'Makeup Masterclass: Drag Edition', creator: 'Queen B', price: 9.99, image: 'https://picsum.photos/seed/m2/400/300', rating: 5.0 },
    { id: 3, title: 'Fitness Routine: 30 Day Challenge', creator: 'FitFam', price: 14.99, image: 'https://picsum.photos/seed/m3/400/300', rating: 4.7 },
    { id: 4, title: 'Cooking with Pride: Recipes', creator: 'Chef J', price: 2.99, image: 'https://picsum.photos/seed/m4/400/300', rating: 4.9 },
  ];

  return (
    <div className="h-full bg-zinc-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-zinc-200 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-black text-zinc-900 tracking-tight">Marketplace</h1>
        <div className="flex space-x-2">
           <button className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200">
              <i className="fa-solid fa-magnifying-glass text-zinc-600 text-sm"></i>
           </button>
           <button className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 relative">
              <i className="fa-solid fa-cart-shopping text-zinc-600 text-sm"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
           {categories.map(cat => (
              <button key={cat} className="px-4 py-2 bg-white border border-zinc-200 rounded-full text-xs font-bold text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors whitespace-nowrap">
                 {cat}
              </button>
           ))}
        </div>

        {/* Featured Banner */}
        <div className="relative rounded-3xl overflow-hidden h-64 bg-zinc-900 text-white shadow-xl">
           <img src="https://picsum.photos/seed/banner/800/400" className="absolute inset-0 w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-8 max-w-lg">
              <span className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block">Featured Bundle</span>
              <h2 className="text-3xl font-black mb-2">The Ultimate Creator Pack</h2>
              <p className="text-sm text-zinc-300 mb-4 line-clamp-2">Get access to 5 exclusive masterclasses from top creators on Speqtrum. Limited time offer.</p>
              <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors">
                 Get Access - $29.99
              </button>
           </div>
        </div>

        {/* Trending Items */}
        <section>
           <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-zinc-900 text-lg">Trending Now</h2>
              <button className="text-xs font-bold text-zinc-500 hover:text-zinc-900">View All</button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredItems.map(item => (
                 <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-lg transition-all group cursor-pointer">
                    <div className="relative aspect-[4/3]">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                          ${item.price}
                       </div>
                    </div>
                    <div className="p-4">
                       <h3 className="font-bold text-zinc-900 text-sm line-clamp-1 mb-1">{item.title}</h3>
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500">{item.creator}</span>
                          <div className="flex items-center text-yellow-500 text-xs font-bold">
                             <i className="fa-solid fa-star mr-1"></i>
                             {item.rating}
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Top Creators */}
        <section>
           <h2 className="font-bold text-zinc-900 text-lg mb-4">Top Creators</h2>
           <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
              {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer group">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 group-hover:scale-105 transition-transform">
                       <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-full h-full rounded-full border-2 border-white object-cover" />
                    </div>
                    <span className="text-xs font-bold text-zinc-900 truncate w-full text-center">Creator {i}</span>
                 </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default VideoMarketplace;
