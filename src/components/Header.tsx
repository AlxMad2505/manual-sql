import React from 'react';
import Image from 'next/image';
import unamLogo from './Escudo-UNAM-escalable.svg';
import fesLogo from './escudo_fes_negro.jpg';

export default function Header() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-row justify-between items-center text-white gap-4">
          
          {/* IZQUIERDA */}
          <div className="flex items-center gap-4 md:w-1/3">
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-white p-1.5 rounded-lg shadow-inner border border-blue-400">
              <Image 
                src={fesLogo} 
                alt="Logo UNAM" 
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-blue-300 font-bold mb-0.5">
                Institución Académica
              </span>
              <div className="text-xs md:text-sm font-black uppercase tracking-widest border-l-2 border-blue-400 pl-2 py-0.5">
                Facultad de Estudios Superiores Aragón
              </div>
            </div>
          </div>

          {/* CENTRO */}
          <div className="flex-grow text-center">
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter leading-tight mb-1">
              Manual de JOINs <span className="text-blue-400">&</span> GROUPS
            </h1>
            <div className="h-1 w-12 bg-blue-400 mx-auto rounded-full"></div>
          </div>

          {/* DERECHA */}
          <div className="flex items-center justify-end gap-4 md:w-1/3 text-right">
            <div className="hidden sm:flex flex-col items-end">
              <span className="block text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-0.5">
                Materia
              </span>
              <span className="block text-xs md:text-sm font-bold uppercase tracking-tight">
                Bases de Datos
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
