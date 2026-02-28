
import React, { useState } from 'react';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

interface LoginViewProps {
  onSuccess: (user: any) => void;
  onBack?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onBack }) => {
  const { login } = useAuth();
  
  // State for Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // State for Registration Modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regData, setRegData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [regError, setRegError] = useState('');
  
  // State for Verification
  const [verificationSentTo, setVerificationSentTo] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(loginEmail, loginPassword);
      login(response.user);
      onSuccess(response.user);
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Password or Email Incorrect");
      } else if (err.code === 'auth/email-not-verified') {
        setError("Please verify your email address before logging in.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.loginWithGoogle();
      login(response.user);
      onSuccess(response.user);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRegError('');

    if (regData.password !== regData.confirmPassword) {
      setRegError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setRegError("You must accept the Terms and Conditions to sign up.");
      setLoading(false);
      return;
    }

    try {
      // Register but do not log in
      await authService.register(regData.email, regData.displayName, regData.password);
      
      // Show verification screen
      setVerificationSentTo(regData.email);
      setIsRegisterOpen(false);
      
    } catch (err: any) {
      console.error("Register Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setRegError("User already exists, Sign in?");
      } else if (err.code === 'auth/weak-password') {
        setRegError("Password should be at least 6 characters.");
      } else {
        setRegError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVerification = async () => {
    if (verificationSentTo) {
      // Firebase handles verification differently, this was for mock
      alert(`Email verification sent to ${verificationSentTo}! Please check your inbox.`);
      setVerificationSentTo(null);
      setLoginEmail(verificationSentTo);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-orange-100">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div 
              onClick={onBack}
              className="cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center justify-center" 
              title="Back to Home"
            >
              <Logo className="w-12 h-12" textClassName="text-3xl text-zinc-900" />
            </div>
            <p className="text-zinc-500 text-sm font-medium">
              {verificationSentTo ? 'Verify your email' : 'Welcome back. Please enter your details.'}
            </p>
          </div>

          {/* Verification Sent View */}
          {verificationSentTo ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Check your inbox</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  We have sent you a verification email to <span className="font-bold text-zinc-900">{verificationSentTo}</span>. Verify it and log in.
                </p>
              </div>
              
              <button 
                onClick={() => setVerificationSentTo(null)}
                className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
              >
                Back to Login
              </button>

              {/* Dev Helper */}
              <button 
                onClick={handleSimulateVerification}
                className="text-xs text-blue-500 hover:underline mt-4 block mx-auto"
              >
                (Dev: Simulate Verification Link Click)
              </button>
            </div>
          ) : (
            /* Login Form */
            <div className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <i className={`fa-solid ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center">
                      <input 
                        id="rememberMe" 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-black border-zinc-300 rounded focus:ring-black/10 cursor-pointer"
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-xs font-medium text-zinc-600 cursor-pointer select-none">Remember for 30 days</label>
                   </div>
                   <a href="#" className="text-xs font-bold text-zinc-900 hover:underline">Forgot password?</a>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-black text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-zinc-400 font-bold tracking-wider">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
                <span>Google</span>
              </button>

              <div className="text-center pt-4">
                <p className="text-zinc-500 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setIsRegisterOpen(true); setError(''); setRegError(''); }}
                    className="font-bold text-zinc-900 hover:underline"
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs text-zinc-400 font-medium">
        © 2025 Speqtrum Inc. All rights reserved.
      </div>

      {/* Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Create account</h2>
                  <p className="text-zinc-500 text-sm mt-1">Start your 30-day free trial.</p>
                </div>
                <button onClick={() => setIsRegisterOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Display Name"
                    value={regData.displayName}
                    onChange={(e) => setRegData({ ...regData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                  />
                  
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                  />

                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <i className={`fa-solid ${showRegPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm password"
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <i className={`fa-solid ${showRegConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 pt-2">
                   <input 
                     type="checkbox" 
                     id="terms" 
                     checked={termsAccepted} 
                     onChange={(e) => setTermsAccepted(e.target.checked)}
                     className="mt-1 w-4 h-4 text-black border-zinc-300 rounded focus:ring-black/10 cursor-pointer"
                   />
                   <label htmlFor="terms" className="text-xs text-zinc-500 leading-relaxed cursor-pointer select-none">
                      I agree to the <a href="#" className="text-zinc-900 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-zinc-900 font-bold hover:underline">Privacy Policy</a>.
                   </label>
                </div>

                {regError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center border border-red-100">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-black text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-70 mt-2"
                >
                  {loading ? 'Creating account...' : 'Get started'}
                </button>
              </form>
            </div>
            <div className="bg-zinc-50 p-4 text-center text-xs text-zinc-400 font-medium border-t border-zinc-100">
              Already have an account? <button onClick={() => setIsRegisterOpen(false)} className="text-zinc-900 font-bold hover:underline">Log in</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginView;
