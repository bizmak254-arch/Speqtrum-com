
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { processMockPayment, getPersonalizedValuePropostion, PaymentDetails } from '../services/paymentService';

interface PremiumOverlayProps {
  onClose: () => void;
}

type PremiumTab = 'plans' | 'methods' | 'billing' | 'security';

const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ onClose }) => {
  const { currentUser, upgradeSubscription } = useAuth();
  const [activeTab, setActiveTab] = useState<PremiumTab>('plans');
  const [aiUpsell, setAiUpsell] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Payment Form State
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvc: '', zip: '' });
  const [mobileDetails, setMobileDetails] = useState({ phone: '' });
  const [cryptoDetails, setCryptoDetails] = useState({ hash: '' });

  useEffect(() => {
    if (currentUser) {
      getPersonalizedValuePropostion(currentUser).then(setAiUpsell);
    }
  }, [currentUser]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
        if (selectedMethod === 'Stripe') {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: 'price_gold_monthly', // Replace with real Stripe Price ID
                    userId: currentUser?.id
                })
            });

            if (!response.ok) throw new Error('Failed to create checkout session');
            
            const { url } = await response.json();
            window.location.href = url; // Redirect to Stripe
            return;
        }

        // Fallback for other methods (mock for now)
        let payload: PaymentDetails = { method: 'card' };
        
        if (selectedMethod === 'MasterCard' || selectedMethod === 'PayPal') {
            payload = { 
                method: 'card', 
                cardNumber: cardDetails.number, 
                cardName: cardDetails.name, 
                cvc: cardDetails.cvc, 
                expiry: cardDetails.expiry 
            };
        } else if (['M-Pesa', 'Airtel Money', 'Flutterwave'].includes(selectedMethod || '')) {
            payload = { 
                method: 'mobile_money', 
                phoneNumber: mobileDetails.phone 
            };
        } else if (selectedMethod === 'Crypto') {
            payload = { 
                method: 'crypto', 
                cryptoTxHash: cryptoDetails.hash 
            };
        }

        await processMockPayment(payload);
        upgradeSubscription('gold');
        setIsSuccess(true);
    } catch (err: any) {
        setError(err.message || "Payment failed. Please try again.");
    } finally {
        setProcessing(false);
    }
  };

  const paymentMethods = [
    { name: 'Stripe', icon: 'fa-cc-stripe', color: 'text-indigo-600', type: 'card' },
    { name: 'MasterCard', icon: 'fa-cc-mastercard', color: 'text-red-600', type: 'card' },
    { name: 'PayPal', icon: 'fa-paypal', color: 'text-blue-600', type: 'card' },
    { name: 'M-Pesa', icon: 'fa-mobile-screen', color: 'text-green-600', local: true, type: 'mobile' },
    { name: 'Airtel Money', icon: 'fa-mobile-screen', color: 'text-red-600', local: true, type: 'mobile' },
    { name: 'Crypto', icon: 'fa-bitcoin', color: 'text-orange-500', type: 'crypto' }
  ];

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in zoom-in-95 duration-500">
        <div className="bg-white border border-gray-200 p-12 rounded-[3rem] text-center space-y-8 max-w-sm shadow-2xl">
          <div className="w-24 h-24 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce shadow-xl shadow-yellow-500/20">
            <i className="fa-solid fa-crown"></i>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic text-gray-900">Welcome to Gold!</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Your account has been upgraded. Global Passport and Incognito Mode are now active.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-lg hover:bg-blue-700 transition-transform"
          >
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-5xl bg-white text-gray-900 border border-gray-200 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[800px]">
        
        {/* Navigation Tabs */}
        <header className="border-b border-gray-100 bg-gray-50 px-8 flex items-center justify-between shrink-0">
           <div className="flex space-x-8 overflow-x-auto no-scrollbar">
              {['Plans', 'Payment Methods', 'Billing', 'Security'].map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab.toLowerCase().replace(' ', '') as PremiumTab); setSelectedMethod(null); }}
                  className={`py-6 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.toLowerCase().replace(' ', '') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-900 pl-4"><i className="fa-solid fa-xmark text-xl"></i></button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 sm:p-12 no-scrollbar bg-white">
           {activeTab === 'plans' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-gray-900">Choose your journey</h2>
                    <p className="text-gray-500 max-w-lg mx-auto font-medium">{aiUpsell}</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { id: 'standard', name: 'Standard', price: '0', color: 'bg-gray-50 border-gray-200 text-gray-600', btn: 'bg-gray-200 text-gray-500', features: 2 },
                      { id: 'core_member', name: 'Core Member', price: '9.99', color: 'bg-emerald-600 border-emerald-500 text-white shadow-2xl shadow-emerald-500/20', btn: 'bg-white text-emerald-600', isStripeButton: true, features: 3 },
                      { id: 'gold', name: 'Gold', price: '14.99', color: 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-500/20 scale-105', btn: 'bg-white text-blue-600', features: 4 },
                      { id: 'platinum', name: 'Platinum', price: '29.99', color: 'bg-gray-900 border-gray-800 text-white', btn: 'bg-blue-500 text-white', features: 5 }
                    ].map((plan) => (
                       <div key={plan.id} className={`p-8 rounded-[2.5rem] border flex flex-col ${plan.color}`}>
                          <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                          <div className="text-4xl font-black mb-8">${plan.price}<span className="text-sm opacity-50">/mo</span></div>
                          <ul className="space-y-4 mb-12 text-sm flex-1 font-bold">
                             <li className="flex items-center"><i className="fa-solid fa-check mr-3"></i> Core Discovery</li>
                             <li className="flex items-center"><i className="fa-solid fa-check mr-3"></i> Encrypted Chat</li>
                             {plan.features > 2 && <li className="flex items-center"><i className="fa-solid fa-check mr-3"></i> Global Passport</li>}
                             {plan.features > 3 && <li className="flex items-center"><i className="fa-solid fa-check mr-3"></i> Incognito Browsing</li>}
                             {plan.features > 4 && <li className="flex items-center"><i className="fa-solid fa-check mr-3"></i> Concierge Access</li>}
                          </ul>
                          {plan.isStripeButton ? (
                            <div className="mt-auto">
                              {/* @ts-ignore */}
                              <stripe-buy-button
                                buy-button-id="buy_btn_1T4jGIAd6scEXedeSSfBAgfq"
                                publishable-key="pk_test_51T4QrSAd6scEXedeWx7ej4x3ZyIf32JXxBkZWYZsVkZpSBdQjpFvwh1fFbfPpLVT8qgScpfVkIIYp7pMMh5AqO7Q00V3AdX5q9"
                              >
                              {/* @ts-ignore */}
                              </stripe-buy-button>
                            </div>
                          ) : (
                            <button 
                              disabled={currentUser?.subscriptionTier === plan.id || processing}
                              onClick={() => setActiveTab('methods')}
                              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-md ${plan.btn}`}
                            >
                               {currentUser?.subscriptionTier === plan.id ? 'Current Plan' : 'Select Plan'}
                            </button>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {activeTab === 'methods' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-gray-900">Secure Checkout</h2>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Select your preferred gateway</p>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {paymentMethods.map(m => (
                       <button 
                        key={m.name}
                        onClick={() => setSelectedMethod(m.name)}
                        className={`p-6 border rounded-[2rem] hover:scale-[1.02] transition-all flex flex-col items-center space-y-3 relative overflow-hidden group ${
                            selectedMethod === m.name ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
                        }`}
                       >
                          <div className={`text-3xl ${m.color} group-hover:scale-110 transition-transform`}>
                             <i className={`fa-solid ${m.icon}`}></i>
                          </div>
                          <span className={`font-black text-[10px] uppercase tracking-[0.2em] ${selectedMethod === m.name ? 'text-blue-600' : 'text-gray-500'}`}>{m.name}</span>
                          {m.local && (
                            <div className="absolute top-2 right-2">
                              <i className="fa-solid fa-location-dot text-[8px] text-blue-400"></i>
                            </div>
                          )}
                       </button>
                    ))}
                 </div>

                 {selectedMethod && (
                    <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-8 mt-8 animate-in fade-in slide-in-from-bottom-2">
                        {error && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 flex items-center space-x-3 text-red-600">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p className="text-xs font-bold">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handlePaymentSubmit} className="space-y-6 max-w-lg mx-auto">
                            {/* Dynamic Forms based on Method Type */}
                            {(selectedMethod === 'Stripe' || selectedMethod === 'MasterCard' || selectedMethod === 'PayPal') && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Cardholder Name</label>
                                        <input required type="text" placeholder="NAME ON CARD" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none uppercase shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Card Number</label>
                                        <div className="relative">
                                            <i className="fa-regular fa-credit-card absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                            <input required type="text" maxLength={19} placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Expiry</label>
                                            <input required type="text" maxLength={5} placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none text-center shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">CVC</label>
                                            <input required type="password" maxLength={4} placeholder="123" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none text-center shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {['M-Pesa', 'Airtel Money', 'Flutterwave'].includes(selectedMethod) && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">+254</span>
                                            <input required type="tel" placeholder="700 000 000" value={mobileDetails.phone} onChange={e => setMobileDetails({...mobileDetails, phone: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-16 pr-5 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none shadow-sm" />
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic px-2">You will receive a prompt on your phone to complete the transaction.</p>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'Crypto' && (
                                <div className="space-y-6 text-center">
                                    <div className="bg-white p-4 rounded-xl inline-block border border-gray-200 shadow-lg">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`} alt="QR" className="w-32 h-32" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Send BTC to:</p>
                                        <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 font-mono text-xs text-gray-600 break-all select-all cursor-pointer hover:bg-gray-200" onClick={() => navigator.clipboard.writeText("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")}>
                                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Transaction Hash</label>
                                        <input required type="text" placeholder="Enter TXID to verify..." value={cryptoDetails.hash} onChange={e => setCryptoDetails({...cryptoDetails, hash: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none shadow-sm" />
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all uppercase text-xs tracking-widest flex items-center justify-center space-x-3 disabled:opacity-50 disabled:grayscale"
                            >
                                {processing ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-lock"></i>
                                        <span>Pay $14.99 Securely</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[9px] text-gray-400 uppercase font-black tracking-widest">
                                <i className="fa-solid fa-shield-halved mr-1.5"></i>
                                256-Bit SSL Encrypted
                            </p>
                        </form>
                    </div>
                 )}
              </div>
           )}

           {activeTab === 'billing' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
                 <h2 className="text-3xl font-black text-gray-900">Billing Archive</h2>
                 <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                       <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-200">
                          <tr>
                             <th className="p-6">Date</th>
                             <th className="p-6">Transaction</th>
                             <th className="p-6">Amount</th>
                             <th className="p-6">Status</th>
                             <th className="p-6 text-right">Invoice</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                          {[
                            { date: 'Oct 01, 2025', id: 'TXN-882194', amount: '14.99', status: 'PAID' },
                            { date: 'Sep 01, 2025', id: 'TXN-773122', amount: '14.99', status: 'PAID' },
                            { date: 'Aug 01, 2025', id: 'TXN-110294', amount: '0.00', status: 'FREE TRIAL' },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors group">
                               <td className="p-6 font-bold text-gray-900">{row.date}</td>
                               <td className="p-6 font-mono text-xs opacity-50">{row.id}</td>
                               <td className="p-6 font-black">${row.amount}</td>
                               <td className="p-6">
                                  <span className={`text-[9px] font-black px-2 py-1 rounded ${row.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {row.status}
                                  </span>
                               </td>
                               <td className="p-6 text-right">
                                  <button className="text-blue-500 hover:text-blue-700 transition-colors"><i className="fa-solid fa-file-arrow-down"></i></button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {activeTab === 'security' && (
              <div className="max-w-md mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 py-12">
                 <div className="relative inline-block">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto text-4xl">
                       <i className="fa-solid fa-shield-check"></i>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-100 shadow-lg rounded-xl flex items-center justify-center text-green-500">
                       <i className="fa-solid fa-lock text-sm"></i>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-3xl font-black text-gray-900">Payment Vault</h2>
                    <p className="text-gray-500 text-sm leading-relaxed px-4">
                       Speqtrum Gold uses Stripe and Flutterwave for PCI-DSS compliant processing. Your card details never touch our local servers. Payments are listed as "SQT* COMM" for your privacy.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <button className="w-full py-5 bg-white border border-gray-200 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center space-x-3 text-gray-700 shadow-sm">
                       <i className="fa-solid fa-fingerprint"></i>
                       <span>Enable Biometric Auth for Payments</span>
                    </button>
                    <button className="w-full py-4 text-[10px] font-black uppercase text-red-500 tracking-widest hover:bg-red-50 rounded-2xl transition-all">Clear Payment History</button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PremiumOverlay;
