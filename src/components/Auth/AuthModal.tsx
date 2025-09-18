'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { User } from '@/types/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [registerMessage, setRegisterMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {registerMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mx-6 mt-6 mb-4 text-sm">
            {registerMessage}
          </div>
        )}

        <div className="p-8">
          {isLogin ? (
            <LoginForm
              onSwitchToRegister={() => setIsLogin(false)}
              onLoginSuccess={onLoginSuccess}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={() => setIsLogin(true)}
              onRegisterSuccess={(message) => {
                setRegisterMessage(message);
                setTimeout(() => {
                  setIsLogin(true);
                  setRegisterMessage('');
                }, 3000);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
