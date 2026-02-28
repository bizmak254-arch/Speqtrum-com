
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveCallOverlayProps {
  match: any;
  mode: 'voice' | 'video';
  onClose: () => void;
}

const LiveCallOverlay: React.FC<LiveCallOverlayProps> = ({ match, mode, onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'ending'>('connecting');
  const [transcription, setTranscription] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);

  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      // Switch back to camera
      if (localVideoRef.current && cameraStreamRef.current) {
        localVideoRef.current.srcObject = cameraStreamRef.current;
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        
        // Handle user stopping screen share via browser UI
        stream.getVideoTracks()[0].onended = () => {
          toggleScreenSharing();
        };

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting screen share:", err);
      }
    }
  };

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let mediaStream: MediaStream;

    const initCall = async () => {
      try {
        const constraints = {
          audio: true,
          video: mode === 'video' ? { facingMode: 'user' } : false
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraStreamRef.current = mediaStream;
        
        if (mode === 'video' && localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }

        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('active');
              
              // 1. Audio Stream Setup
              const audioSource = audioContextRef.current!.createMediaStreamSource(mediaStream);
              const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              audioSource.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current!.destination);

              // 2. Video Stream Setup (if mode is video)
              if (mode === 'video' && canvasRef.current && localVideoRef.current) {
                const canvas = canvasRef.current;
                const video = localVideoRef.current;
                const ctx = canvas.getContext('2d');
                
                frameIntervalRef.current = window.setInterval(() => {
                  if (isCameraOff && !isScreenSharing) return;
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  if (ctx && video.readyState >= 2) {
                    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    canvas.toBlob(async (blob) => {
                      if (blob) {
                        const base64Data = await blobToBase64(blob);
                        sessionPromise.then(session => {
                          session.sendRealtimeInput({
                            media: { data: base64Data, mimeType: 'image/jpeg' }
                          });
                        });
                      }
                    }, 'image/jpeg', 0.6);
                  }
                }, 1000 / 5); // 5 FPS for real-time safety analysis
              }
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                setTranscription(prev => (prev + ' ' + message.serverContent?.outputTranscription?.text).slice(-100));
              }

              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                const ctx = outputAudioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }

              const interrupted = message.serverContent?.interrupted;
              if (interrupted) {
                for (const source of sourcesRef.current.values()) {
                  try { source.stop(); } catch(e) {}
                  sourcesRef.current.delete(source);
                }
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => console.error('Live API Error:', e),
            onclose: () => setStatus('ending'),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: `You are 'Speqtrum Guardian', an AI moderator facilitated call between the user and ${match.name}. 
            ${mode === 'video' ? (isScreenSharing ? 'The user is currently sharing their screen. ' : 'You can see them via image frames. ') : ''}
            Your priority is safety and icebreaking. Start the call warmly.
            If you detect harassment or non-consensual behavior, interject immediately to pause the session.
            Keep the conversation light and helpful for a friendly social context.`,
            outputAudioTranscription: {},
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Call failed:', err);
        onClose();
      }
    };

    initCall();

    return () => {
      mediaStream?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, [isMuted, isCameraOff, isScreenSharing, mode, match.name, onClose]);

  // Helpers
  async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }

  function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }
  function decode(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-hidden">
      {/* Background Visual Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]"></div>
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Display Area */}
      <div className="relative w-full max-w-lg aspect-[3/4] flex flex-col items-center justify-center">
        
        {/* Remote Content (Avatar in Voice, Placeholder for AI in Video) */}
        <div className={`relative transition-all duration-700 ${mode === 'video' ? 'w-full h-full' : 'w-48 h-48'}`}>
          <div className={`absolute -inset-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-20 blur-3xl ${status === 'active' ? 'animate-pulse' : ''}`}></div>
          
          <div className={`relative w-full h-full border-4 border-white/10 overflow-hidden shadow-2xl ${mode === 'video' ? 'rounded-[3rem]' : 'rounded-full p-1'}`}>
             {mode === 'voice' ? (
               <img src={match.avatar} className="w-full h-full rounded-full object-cover" />
             ) : (
               <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 text-3xl animate-bounce">
                     <i className="fa-solid fa-eye"></i>
                  </div>
                  <h3 className="text-xl font-black italic">Spectrum AI Active</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Facilitating Secure Vision Link</p>
               </div>
             )}
             
             {/* Local Video Pip (For Video Mode) */}
             {mode === 'video' && (
               <div className="absolute top-6 right-6 w-32 aspect-[3/4] bg-black border-2 border-white/20 rounded-2xl overflow-hidden shadow-xl z-20">
                  <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${(isCameraOff && !isScreenSharing) ? 'hidden' : ''}`} />
                  {(isCameraOff && !isScreenSharing) && <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-gray-500"><i className="fa-solid fa-video-slash"></i></div>}
               </div>
             )}
          </div>
        </div>

        {/* Info Overlay */}
        <div className="mt-12 text-center space-y-3 z-10">
          <h2 className="text-3xl font-black tracking-tight">{match.name}</h2>
          <div className="flex flex-col items-center space-y-1">
             <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400">
               <i className="fa-solid fa-shield-halved"></i>
               <span>{status === 'connecting' ? 'Establishing Secure Link...' : `Secure ${mode.charAt(0).toUpperCase() + mode.slice(1)} Session`}</span>
             </div>
             {status === 'active' && <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Live Connected</p>}
          </div>
        </div>
      </div>

      {/* Transcription Ticker (WhatsApp-style) */}
      <div className="w-full max-w-md h-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 my-10 flex items-center justify-center text-center overflow-hidden z-10">
        {transcription ? (
          <p className="text-sm text-gray-300 italic animate-in fade-in slide-in-from-bottom-2">
            "{transcription}..."
          </p>
        ) : (
          <div className="flex space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {/* Controls Bar (WhatsApp/iOS Style) */}
      <div className="flex items-center space-x-8 z-10">
        {mode === 'video' && (
           <div className="flex items-center space-x-4">
             <button 
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isCameraOff ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
             >
               <i className={`fa-solid ${isCameraOff ? 'fa-video-slash' : 'fa-video'}`}></i>
             </button>

             <button 
              onClick={toggleScreenSharing}
              className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isScreenSharing ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              title={isScreenSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
             >
               <i className={`fa-solid ${isScreenSharing ? 'fa-desktop' : 'fa-display'}`}></i>
             </button>
           </div>
        )}
        
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
        >
          <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        </button>
        
        <button 
          onClick={onClose}
          className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white text-3xl flex items-center justify-center shadow-2xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-phone-slash"></i>
        </button>

        <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all">
          <i className="fa-solid fa-volume-high"></i>
        </button>
      </div>

      {/* Bottom Legal/Safety Tag */}
      <div className="mt-12 z-10">
        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          End-to-End Encrypted • Faciliated by Speqtrum Tech
        </span>
      </div>
    </div>
  );
};

export default LiveCallOverlay;
