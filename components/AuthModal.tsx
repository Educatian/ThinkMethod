import React, { useState } from 'react';
import { authService } from '../services/supabaseService';
import { loggingService } from '../services/loggingService';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setMessage('');
    };

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
        resetForm();
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error } = await authService.signIn(email, password);

        if (error) {
            setError(error.message);
            loggingService.logAuthEvent('signin', false);
        } else {
            loggingService.logAuthEvent('signin', true);
            onAuthSuccess();
        }
        setIsLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        const { error } = await authService.signUp(email, password);

        if (error) {
            setError(error.message);
            loggingService.logAuthEvent('signup', false);
        } else {
            setMessage('Check your email for a confirmation link!');
            loggingService.logAuthEvent('signup', true);
        }
        setIsLoading(false);
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error } = await authService.resetPassword(email);

        if (error) {
            setError(error.message);
            loggingService.logAuthEvent('reset_password', false);
        } else {
            setMessage('Password reset email sent! Check your inbox.');
            loggingService.logAuthEvent('reset_password', true);
        }
        setIsLoading(false);
    };

    const getModeTitle = () => {
        switch (mode) {
            case 'signin': return 'Welcome Back';
            case 'signup': return 'Create Account';
            case 'forgot': return 'Reset Password';
        }
    };

    const getModeSubtitle = () => {
        switch (mode) {
            case 'signin': return 'Sign in to continue your research journey';
            case 'signup': return 'Join ThinkMethod to get started';
            case 'forgot': return 'Enter your email to receive a reset link';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/thinkmethod_logo.png" alt="ThinkMethod" className="w-12 h-12 rounded-xl" />
                        <span className="text-2xl font-bold gradient-text">ThinkMethod</span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">{getModeTitle()}</h2>
                    <p className="text-slate-500 text-sm mt-1">{getModeSubtitle()}</p>
                </div>

                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                        ✓ {message}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        ⚠ {error}
                    </div>
                )}

                {/* Sign In Form */}
                {mode === 'signin' && (
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleModeChange('forgot')}
                            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                        >
                            Forgot your password?
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                )}

                {/* Sign Up Form */}
                {mode === 'signup' && (
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                {/* Forgot Password Form */}
                {mode === 'forgot' && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeChange('signin')}
                            className="w-full text-sm text-slate-500 hover:text-slate-700"
                        >
                            ← Back to Sign In
                        </button>
                    </form>
                )}

                {/* Mode Toggle */}
                {mode !== 'forgot' && (
                    <div className="mt-6 text-center text-sm text-slate-500">
                        {mode === 'signin' ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => handleModeChange('signup')}
                                    className="text-sky-600 hover:text-sky-700 font-medium"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => handleModeChange('signin')}
                                    className="text-sky-600 hover:text-sky-700 font-medium"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Skip Option */}
                <div className="mt-4 text-center">
                    <button
                        onClick={onClose}
                        className="text-xs text-slate-400 hover:text-slate-500"
                    >
                        Continue without signing in →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
