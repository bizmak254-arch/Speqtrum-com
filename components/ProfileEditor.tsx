
import React, { useState } from 'react';
import { User, PurposeType } from '../types';
import { GoogleGenAI } from '@google/genai';
import { COUNTRIES } from '../utils/countries';

interface ProfileEditorProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack?: () => void;
}

const BIO_MAX_LENGTH = 500;

const PURPOSES: PurposeType[] = [
  'Companionship / Long-term', 'Casual Connections', 'Friendship', 'Entertainment', 
  'Community & Socializing', 'Networking', 'Exploring', 'Not sure yet'
];

const PREDEFINED_INTERESTS = [
  "Art", "Music", "Fitness", "Gaming", "Travel", "Cooking", "Photography", 
  "Coding", "Dancing", "Movies", "Outdoors", "Fashion", "Nightlife", "Yoga"
];

const LIFESTYLE_CHOICES = [
  "Non-Smoker", "Social Drinker", "Vegan", "Night Owl", "Early Bird", "Pet Owner", "Travel Addict", "Active Lifestyle"
];

const COMMUNITY_BADGES = [
  { id: 'verified', label: 'Verified', icon: 'fa-certificate', color: 'text-blue-500' },
  { id: 'pioneer', label: 'Pioneer', icon: 'fa-bolt', color: 'text-yellow-500' },
  { id: 'safe-ally', label: 'Community Ally', icon: 'fa-shield-heart', color: 'text-pink-500' },
  { id: 'creator', label: 'Top Creator', icon: 'fa-fire', color: 'text-orange-500' }
];

const IDENTITY_OPTIONS = ["Men", "Women", "Non-Binary", "Trans", "Genderfluid", "Everyone"];

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave, onBack }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const isFirstTime = !user.bio || user.interests?.length === 0;

  const toggleItem = (item: string, list: string[] = [], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const [customInterest, setCustomInterest] = useState('');
  const [prompts, setPrompts] = useState<{ question: string; answer: string }[]>(user.prompts || [
    { question: "My golden rule...", answer: "" },
    { question: "I'm looking for...", answer: "" },
    { question: "My ideal weekend...", answer: "" }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: url });
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests?.includes(customInterest.trim())) {
      setFormData({ ...formData, interests: [...(formData.interests || []), customInterest.trim()] });
      setCustomInterest('');
    }
  };

  const updatePrompt = (index: number, answer: string) => {
    const newPrompts = [...prompts];
    newPrompts[index].answer = answer;
    setPrompts(newPrompts);
    setFormData({ ...formData, prompts: newPrompts });
  };

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a concise, authentic companionship and social bio (300-500 chars) for a user with these interests: ${formData.interests?.join(', ')}. Focus on personality and their goal: ${formData.purpose}. Headline: ${formData.headline}`,
      });
      setFormData({ ...formData, bio: response.text?.trim().substring(0, BIO_MAX_LENGTH) || '' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleFinalSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, prompts });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-40">
      {onBack && (
        <button onClick={onBack} className="mb-10 group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Profile</span>
        </button>
      )}

      <header className="mb-16 text-center">
        <h1 className="text-5xl font-black tracking-tighter italic rainbow-text mb-4">
          {isFirstTime ? 'CREATE YOUR LEGACY' : 'REFINE YOUR VIBE'}
        </h1>
        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Identity • Purpose • Privacy</p>
      </header>

      <form onSubmit={handleFinalSave} className="space-y-16">
        {/* 0. PROFILE VISUALS */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-10 relative overflow-hidden group">
           <div className="absolute inset-0 h-48 bg-zinc-800">
              {formData.banner && <img src={formData.banner} className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" />}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <div className="text-center text-white">
                    <i className="fa-solid fa-camera text-2xl mb-2"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">Change Banner</p>
                 </div>
                 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
              </label>
           </div>
           
           <div className="relative pt-24 px-4 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full border-4 border-zinc-900 overflow-hidden group/avatar">
                 <img src={formData.avatar} className="w-full h-full object-cover" />
                 <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                    <i className="fa-solid fa-camera text-white text-xl"></i>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                 </label>
              </div>
              <p className="mt-4 text-xs text-gray-500 font-black uppercase tracking-widest">Tap to update photos</p>
           </div>
        </section>

        {/* 1. BASIC PROFILE INFO */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-10">
          <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
             <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400">
                <i className="fa-solid fa-user-astronaut text-xl"></i>
             </div>
             <h3 className="text-xl font-black italic">Basic Info</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Display Name</label>
              <input 
                type="text" 
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Headline (Short Bio)</label>
              <input 
                type="text" 
                value={formData.headline || ''}
                onChange={(e) => setFormData({...formData, headline: e.target.value})}
                placeholder="e.g. Digital Nomad & Coffee Lover"
                maxLength={60}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Age (18+)</label>
              <input 
                type="number" min="18" max="99"
                value={formData.age || ''}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Country</label>
              <select 
                value={formData.country || ''}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">City</label>
              <input 
                type="text" 
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="e.g. London"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500 outline-none transition-all" 
              />
            </div>
          </div>
        </section>

        {/* 2. ABOUT ME & PROMPTS */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-pink-600/20 rounded-2xl flex items-center justify-center text-pink-400">
                    <i className="fa-solid fa-comment-dots text-xl"></i>
                 </div>
                 <h3 className="text-xl font-black italic">About Me</h3>
              </div>
              <button 
                type="button" onClick={generateAIBio} disabled={isGeneratingBio}
                className="text-[10px] font-black uppercase text-purple-400 hover:text-white transition-colors"
              >
                {isGeneratingBio ? 'Refining...' : 'AI Assist'}
              </button>
           </div>
           <div className="space-y-4">
              <textarea 
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="What makes you unique? Share your personality highlights and hobbies..."
                className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 h-48 text-gray-200 leading-relaxed italic text-lg outline-none focus:border-purple-500 transition-all resize-none"
              />
              <div className="flex justify-between items-center px-4">
                 <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">End-to-End Encrypted Storage</p>
                 <span className={`text-[10px] font-black ${formData.bio?.length || 0 > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.bio?.length || 0} / 500
                 </span>
              </div>
           </div>

           {/* PROMPTS */}
           <div className="space-y-6 pt-8 border-t border-white/5">
              <h4 className="text-sm font-black uppercase text-gray-500 tracking-widest">Profile Prompts</h4>
              <div className="grid grid-cols-1 gap-6">
                 {prompts.map((prompt, index) => (
                    <div key={index} className="space-y-2">
                       <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest ml-1">{prompt.question}</label>
                       <input 
                         type="text" 
                         value={prompt.answer}
                         onChange={(e) => updatePrompt(index, e.target.value)}
                         placeholder="Your answer..."
                         className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-pink-500 outline-none transition-all" 
                       />
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 3. PURPOSE ON THE SITE */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-8">
           <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-2xl flex items-center justify-center text-yellow-400">
                 <i className="fa-solid fa-bullseye text-xl"></i>
              </div>
              <h3 className="text-xl font-black italic">My Purpose</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PURPOSES.map(p => (
                <button 
                  key={p} type="button"
                  onClick={() => setFormData({...formData, purpose: p})}
                  className={`py-4 px-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    formData.purpose === p ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
           </div>
        </section>

        {/* 4. IDENTITY & PREFERENCES */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-10">
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                    <i className="fa-solid fa-fingerprint text-xl"></i>
                 </div>
                 <h3 className="text-xl font-black italic">Identity & Prefs</h3>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl">
                 <span className="text-[9px] font-black text-gray-500 uppercase">Hide from public</span>
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, visibilitySettings: {...formData.visibilitySettings, hideIdentityFields: !formData.visibilitySettings.hideIdentityFields}})}
                   className={`w-10 h-5 rounded-full relative transition-all ${formData.visibilitySettings.hideIdentityFields ? 'bg-blue-600' : 'bg-zinc-800'}`}
                 >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.visibilitySettings.hideIdentityFields ? 'left-5.5' : 'left-0.5'}`}></div>
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Gender Identity</label>
                 <input type="text" value={formData.genderIdentity || ''} onChange={(e) => setFormData({...formData, genderIdentity: e.target.value})} placeholder="e.g. Non-Binary" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Interested In</label>
                 <div className="flex flex-wrap gap-2">
                    {IDENTITY_OPTIONS.map(opt => (
                      <button 
                        key={opt} type="button"
                        onClick={() => toggleItem(opt, formData.interestedIn, (v) => setFormData({...formData, interestedIn: v}))}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all ${
                          formData.interestedIn?.includes(opt) ? 'bg-blue-500 border-blue-400 text-white' : 'bg-black/40 border-white/5 text-gray-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 5. LIFESTYLE & INTERESTS */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-10">
           <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-400">
                 <i className="fa-solid fa-leaf text-xl"></i>
              </div>
              <h3 className="text-xl font-black italic">Lifestyle</h3>
           </div>
           
           <div className="space-y-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Vibe Tags</label>
                 <div className="flex flex-wrap gap-2">
                    {PREDEFINED_INTERESTS.map(i => (
                       <button 
                         key={i} type="button"
                         onClick={() => toggleItem(i, formData.interests, (v) => setFormData({...formData, interests: v}))}
                         className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            formData.interests?.includes(i) ? 'bg-white text-black border-white' : 'bg-black/40 border-white/5 text-gray-500'
                         }`}
                       >
                         {i}
                       </button>
                    ))}
                    {/* Render Custom Interests that are not in PREDEFINED */}
                    {formData.interests?.filter(i => !PREDEFINED_INTERESTS.includes(i)).map(i => (
                       <button 
                         key={i} type="button"
                         onClick={() => toggleItem(i, formData.interests, (v) => setFormData({...formData, interests: v}))}
                         className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-white text-black border-white transition-all flex items-center space-x-2"
                       >
                         <span>{i}</span>
                         <i className="fa-solid fa-xmark"></i>
                       </button>
                    ))}
                 </div>
                 
                 {/* Custom Interest Input */}
                 <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="text" 
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                      placeholder="Add custom tag..."
                      className="bg-black/40 border border-white/10 rounded-2xl py-3 px-5 text-xs text-white outline-none focus:border-green-500 transition-all w-48"
                    />
                    <button 
                      type="button"
                      onClick={addCustomInterest}
                      className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-green-500 hover:text-black text-gray-400 flex items-center justify-center transition-all"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Lifestyle Choices</label>
                 <div className="flex flex-wrap gap-2">
                    {LIFESTYLE_CHOICES.map(i => (
                       <button 
                         key={i} type="button"
                         onClick={() => toggleItem(i, formData.lifestyleChoices, (v) => setFormData({...formData, lifestyleChoices: v}))}
                         className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            formData.lifestyleChoices?.includes(i) ? 'bg-green-600/20 border-green-500/50 text-green-400' : 'bg-black/40 border-white/5 text-gray-500'
                         }`}
                       >
                         {i}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* NEW: COMMUNITY BADGES */}
        <section className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 sm:p-12 space-y-10">
          <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
            <div className="w-12 h-12 bg-amber-600/20 rounded-2xl flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-award text-xl"></i>
            </div>
            <h3 className="text-xl font-black italic">Community Badges</h3>
          </div>

          <div className="space-y-6">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Select the roles and recognitions you identify with in the Speqtrum community:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMMUNITY_BADGES.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => toggleItem(badge.id, formData.badges, (v) => setFormData({...formData, badges: v}))}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                    formData.badges?.includes(badge.id)
                      ? 'bg-amber-600/10 border-amber-500/50'
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                      formData.badges?.includes(badge.id) ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                    }`}>
                      <i className={`fa-solid ${badge.icon}`}></i>
                    </div>
                    <span className={`font-black uppercase text-xs tracking-widest ${
                      formData.badges?.includes(badge.id) ? 'text-amber-500' : 'text-gray-500'
                    }`}>
                      {badge.label}
                    </span>
                  </div>
                  {formData.badges?.includes(badge.id) && (
                    <i className="fa-solid fa-circle-check text-amber-500"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PRIVACY & VISIBILITY CONTROLS */}
        <section className="bg-zinc-950 border border-red-500/20 rounded-[3rem] p-8 sm:p-12 space-y-10">
           <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-400">
                 <i className="fa-solid fa-lock text-xl"></i>
              </div>
              <h3 className="text-xl font-black italic">Privacy Core</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Viewable By', field: 'viewableBy', type: 'select', options: ['everyone', 'connections_only'] },
                { label: 'Precision Masking', field: 'hideLocationPrecision', desc: 'Hide exact neighborhood location' },
                { label: 'Incognito Mode', field: 'incognitoMode', desc: 'Browse profiles without leaving a trace' },
                { label: 'Status Stealth', field: 'showOnlineStatus', desc: 'Hide last active / online marker', invert: true }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between">
                   <div>
                      <p className="text-xs font-black uppercase text-gray-200">{item.label}</p>
                      {item.desc && <p className="text-[9px] text-gray-600 font-bold uppercase">{item.desc}</p>}
                   </div>
                   {item.type === 'select' ? (
                     <select 
                       value={formData.visibilitySettings.viewableBy}
                       onChange={(e: any) => setFormData({...formData, visibilitySettings: {...formData.visibilitySettings, viewableBy: e.target.value}})}
                       className="bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase"
                     >
                       <option value="everyone">Everyone</option>
                       <option value="connections_only">Connections</option>
                     </select>
                   ) : (
                     <button 
                       type="button"
                       onClick={() => {
                         const field = item.field as keyof typeof formData.visibilitySettings;
                         // @ts-ignore
                         setFormData({...formData, visibilitySettings: {...formData.visibilitySettings, [field]: !formData.visibilitySettings[field]}});
                       }}
                       // @ts-ignore
                       className={`w-12 h-6 rounded-full relative transition-all ${formData.visibilitySettings[item.field] ? 'bg-purple-600' : 'bg-zinc-800'}`}
                     >
                        {/* @ts-ignore */}
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.visibilitySettings[item.field] ? 'left-7' : 'left-1'}`}></div>
                     </button>
                   )}
                </div>
              ))}
           </div>
        </section>

        <div className="pt-12">
          <button 
            type="submit" 
            className="w-full bg-white text-black font-black py-8 rounded-[3.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.4em] text-sm flex items-center justify-center space-x-4"
          >
            <span>{isFirstTime ? 'LAUNCH PROFILE' : 'SAVE CHANGES'}</span>
            <i className="fa-solid fa-bolt-lightning"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
