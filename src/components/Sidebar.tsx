'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[var(--sidebar-bg)] border-l border-[var(--sidebar-border)] transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--sidebar-border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Menú
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <svg
                className="w-6 h-6 text-[var(--foreground)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-[var(--sidebar-border)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {user.nombre}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/inicio"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--muted)] transition-colors group"
                >
                  <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--foreground)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                    Inicio
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/chats"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--muted)] transition-colors group"
                >
                  <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--foreground)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                    Mis Chats
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--muted)] transition-colors group"
                >
                  <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--foreground)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                    Perfil
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--muted)] transition-colors group"
                >
                  <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--foreground)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                    Configuración
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--sidebar-border)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 hover:bg-opacity-20 transition-colors group"
            >
              <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[var(--foreground)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span className="text-[var(--foreground)] group-hover:text-red-400 transition-colors">
                Cerrar Sesión
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
