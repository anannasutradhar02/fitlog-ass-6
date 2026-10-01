'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  const [savedCount, setSavedCount] = useState<number>(0);
  const [planCount, setPlanCount] = useState<number>(0);

  useEffect(() => {
    try {
      const storedSaved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
      const storedPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
      setSavedCount(storedSaved.length);
      setPlanCount(storedPlan.length);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <nav className="bg-black text-white py-4 px-8 flex justify-between items-center border-b border-gray-800">
      
      {/* 1. Left side: Logo & Brand Name */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/logo.png" 
            alt="Fit Log Logo" 
            width={32}
            height={32}
            className="w-8 h-8 object-contain" 
          />
          <span className="text-lg font-black tracking-wider text-white">FITLOG</span>
        </Link>
      </div>

      {/* 2. Middle links: Workouts & My Plan */}
      <div className="flex items-center space-x-6 text-sm font-medium">
        <Link 
          href="/" 
          className="bg-[#222222] text-white px-4 py-1.5 rounded-full hover:text-[#ccff00] transition"
        >
          Workouts
        </Link>
        <Link 
          href="/my-plan" 
          className="text-gray-400 hover:text-[#ccff00] transition"
        >
          My Plan
        </Link>
      </div>

      {/* 3. Right side links: Plan & Saved with dynamic count */}
      <div className="flex items-center space-x-4 text-sm font-medium text-gray-300">
        <Link 
          href="/my-plan" 
          className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 px-3 py-1 rounded-full text-white transition flex items-center gap-1.5"
        >
          <span>Plan</span>
          <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full text-[#ccff00]">{planCount}</span>
        </Link>
        <Link 
          href="/my-plan" 
          className="flex items-center space-x-1.5 bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 px-3 py-1 rounded-full text-white transition"
        >
          <span>Saved</span>
          <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full text-[#ccff00]">{savedCount}</span>
        </Link>
      </div>
    </nav>
  );
}