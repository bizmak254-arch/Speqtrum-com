
import React, { useState } from 'react';
import { processMockPayment } from '../services/paymentService';

interface GiftModalProps {
  recipientName: string;
  onClose: () => void;
  onSuccess: (amount: number, giftName: string) => void;
}

const GIFTS = [
  { id: 'rose', name: 'Virtual Rose', price: 1, icon: 'fa-fan', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'coffee', name: 'Coffee', price: 3, icon: 'fa-mug-hot', color: 'text-orange-700', bg: 'bg-orange-50' },
  { id: 'beer', name: 'Drink', price: 5, icon: 'fa-beer-mug-empty', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'diamond', name: 'Diamond', price: 10, icon: 'fa-gem', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'castle', name: 'Castle', price: 50, icon: 'fa-chess-rook', color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'yacht', name: 'Yacht', price: 100, icon: 'fa-ship', color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

const GiftModal: React.FC<GiftModalProps> = ({ recipientName, onClose, onSuccess }) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSend = async () => {
    if (!selectedGift) return;
    setProcessing(true);
    const gift = GIFTS.find(g => g.id === selectedGift)!;
    
    try {
      // Simulate quick payment
      await processMockPayment({ method: 'card', cardNumber: 'mock_stored_card' });
      onSuccess(gift.price, gift.name);
      onClose();
    } catch (e) {
      alert("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Send a Gift</h2>
          <p className="text-sm text-gray-500">Support <span className="font-bold text-purple-600">@{recipientName}</span> directly.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {GIFTS.map(gift => (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                selectedGift === gift.id ? 'border-purple-600 bg-purple-50 scale-105' : 'border-gray-100 bg-white hover:border-purple-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${gift.bg} ${gift.color}`}>
                <i className={`fa-solid ${gift.icon}`}></i>
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase text-gray-900">{gift.name}</p>
                <p className="text-[10px] font-bold text-green-600">${gift.price}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex items-center justify-between border border-gray-100">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-500">
                 <i className="fa-regular fa-credit-card"></i>
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase text-gray-500">Payment Method</p>
                 <p className="text-xs font-bold text-gray-900">Visa •••• 4242</p>
              </div>
           </div>
           <button className="text-[10px] font-bold text-purple-600 uppercase">Change</button>
        </div>

        <button
          onClick={handleSend}
          disabled={!selectedGift || processing}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Send Gift ($${selectedGift ? GIFTS.find(g => g.id === selectedGift)?.price : '0'})`}
        </button>
      </div>
    </div>
  );
};

export default GiftModal;
