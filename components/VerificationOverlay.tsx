
import React, { useState, useRef, useEffect } from 'react';
import { verificationService } from '../services/verificationService';
import { useAuth } from '../context/AuthContext';

interface VerificationOverlayProps {
  onVerify: () => void;
}

const VerificationOverlay: React.FC<VerificationOverlayProps> = ({ onVerify }) => {
  const { currentUser, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !currentUser) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Capture frame
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const selfieBase64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    stopCamera();
    setIsVerifying(true);
    setError(null);

    try {
      const result = await verificationService.verifySelfie(selfieBase64, currentUser.avatar);
      
      if (result.isMatch && result.confidence > 0.7) {
        setSuccess(true);
        // Update user status in DB/Context
        const updatedUser = { ...currentUser, isVerified: true, badges: [...(currentUser.badges || []), 'verified'] };
        await updateUser(updatedUser);
        
        setTimeout(() => {
          onVerify();
        }, 2000);
      } else {
        setError(result.reasoning || "Verification failed. Please ensure your face is clearly visible and matches your profile picture.");
      }
    } catch (err) {
      setError("AI Verification service is currently unavailable.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_70%)]"></div>
      
      <div className="relative w-full max-w-lg p-8 mx-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
             <img src="logo.svg" alt="Speqtrum Logo" className="h-24 w-auto drop-shadow-2xl" />
          </div>
          
          <h1 className="text-2xl font-black tracking-tight uppercase text-gray-500 tracking-[0.2em]">Safety Verification</h1>
          
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl text-left overflow-hidden">
            {step === 1 ? (
              <>
                <h2 className="text-xl font-bold mb-4">Adult Content & Privacy</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Speqtrum is a premier 18+ interactive social platform. You must be of legal age in your jurisdiction to access our community and features. By continuing, you agree to our 18+ content policy and community guidelines.
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:scale-[1.02] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    I AM 18+ OR OLDER
                  </button>
                  <button className="w-full bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-4 rounded-2xl hover:bg-yellow-500 hover:text-black transition-colors uppercase text-xs tracking-widest">
                    LEAVE PLATFORM
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">AI Identity Check</h2>
                  {isVerifying && <i className="fa-solid fa-circle-notch fa-spin text-yellow-500"></i>}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-start space-x-3">
                    <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                    <span>{error}</span>
                  </div>
                )}

                {success ? (
                  <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl shadow-lg shadow-green-500/20">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <h3 className="text-xl font-bold text-green-400">Identity Verified!</h3>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Welcome to the inner circle</p>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-square bg-black rounded-2xl border border-white/10 overflow-hidden group">
                      {!isCapturing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-gray-500">
                          <i className="fa-solid fa-user-shield text-5xl opacity-20"></i>
                          <p className="text-[10px] uppercase tracking-widest font-bold">Camera Ready</p>
                        </div>
                      ) : (
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover scale-x-[-1]"
                        />
                      )}
                      
                      {isVerifying && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
                          <p className="text-[10px] uppercase tracking-widest font-black text-yellow-500">AI Analyzing Face...</p>
                        </div>
                      )}

                      {/* Scanning Animation Overlay */}
                      {isCapturing && !isVerifying && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>
                        </div>
                      )}
                    </div>

                    <canvas ref={canvasRef} width={640} height={480} className="hidden" />

                    <div className="space-y-3">
                      {!isCapturing ? (
                        <button 
                          onClick={startCamera}
                          className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-3"
                        >
                          <i className="fa-solid fa-camera"></i>
                          <span>ENABLE CAMERA</span>
                        </button>
                      ) : (
                        <button 
                          onClick={handleCapture}
                          disabled={isVerifying}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20 disabled:opacity-50"
                        >
                          {isVerifying ? 'VERIFYING...' : 'CAPTURE SELFIE'}
                        </button>
                      )}
                      
                      <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest font-bold">
                        <i className="fa-solid fa-shield-halved mr-2"></i>
                        Encrypted Biometric Processing
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4 text-[10px] uppercase font-bold tracking-widest text-gray-600">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300">Safety Guidelines</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default VerificationOverlay;
