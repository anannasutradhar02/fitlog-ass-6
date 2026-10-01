'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Workout {
  id: string | number;
  name: string;
  equipment: string;
  duration: number | string;
  caloriesBurned?: number | string;
  rating: number;
  image: string;
  done?: boolean;
}

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [planWorkouts, setPlanWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [sortBy, setSortBy] = useState<string>('Duration');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    const storedSaved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    setPlanWorkouts(storedPlan);
    setSavedWorkouts(storedSaved);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleMarkAsDone = (id: string | number) => {
    const updated = planWorkouts.map(item => 
      item.id === id ? { ...item, done: true } : item
    );
    setPlanWorkouts(updated);
    localStorage.setItem('fitlog_plan', JSON.stringify(updated));
    showToast('Workout marked as done! 🎉');
  };

  const handleRemoveFromPlan = (id: string | number) => {
    const updated = planWorkouts.filter(item => item.id !== id);
    setPlanWorkouts(updated);
    localStorage.setItem('fitlog_plan', JSON.stringify(updated));
    showToast('Workout removed from plan.');
  };

  const handleRemoveFromSaved = (id: string | number) => {
    const updated = savedWorkouts.filter(item => item.id !== id);
    setSavedWorkouts(updated);
    localStorage.setItem('fitlog_saved', JSON.stringify(updated));
    showToast('Workout removed from saved.');
  };

  // Active list based on tab
  const currentList = activeTab === 'plan' ? planWorkouts : savedWorkouts;

  // Sorting logic
  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === 'Duration') {
      return Number(b.duration || 0) - Number(a.duration || 0);
    } else if (sortBy === 'Calories') {
      return Number(b.caloriesBurned || 0) - Number(a.caloriesBurned || 0);
    } else if (sortBy === 'Rating') {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }
    return 0;
  });

  // Calculate metrics
  const totalExercises = planWorkouts.length;
  const totalMinutes = planWorkouts.reduce((acc, curr) => acc + Number(curr.duration || 0), 0);
  const totalCalories = planWorkouts.reduce((acc, curr) => acc + Number(curr.caloriesBurned || 0), 0);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#ccff00] text-black font-bold text-xs px-4 py-3 rounded-xl shadow-lg transition animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-gray-800 pb-4 mb-8">
        <Link href="/" className="flex items-center gap-2 font-black tracking-wider text-lg">
          <span className="text-[#ccff00]">⚡</span> FITLOG
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition">Workouts</Link>
          <Link href="/my-plan" className="text-[#ccff00] font-bold transition">My Plan</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-wider uppercase mb-2">MY PLAN</h1>
          <p className="text-gray-400 text-xs md:text-sm">Cap of five lifts for today. Finish them, then load more.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-xs uppercase mb-1">Exercises</p>
            <h3 className="text-3xl font-black text-[#ccff00]">{totalExercises}</h3>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-xs uppercase mb-1">Minutes</p>
            <h3 className="text-3xl font-black text-[#ccff00]">{totalMinutes}</h3>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400 text-xs uppercase mb-1">Calories</p>
            <h3 className="text-3xl font-black text-[#ccff00]">{totalCalories}</h3>
          </div>
        </div>

        {/* Tabs & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('plan')}
              className={`px-5 py-2.5 rounded-full font-black text-xs transition cursor-pointer ${
                activeTab === 'plan' 
                  ? 'bg-[#ccff00] text-black' 
                  : 'bg-[#1a1a1a] text-white border border-gray-800 hover:border-gray-600'
              }`}
            >
              Today&apos;s Plan
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`px-5 py-2.5 rounded-full font-black text-xs transition cursor-pointer ${
                activeTab === 'saved' 
                  ? 'bg-[#ccff00] text-black' 
                  : 'bg-[#1a1a1a] text-white border border-gray-800 hover:border-gray-600'
              }`}
            >
              Saved
            </button>
          </div>

          {/* Fully Interactive Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#121212] border border-gray-800 px-4 py-2.5 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
            <span className="font-medium text-gray-300">Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer pr-2"
            >
              <option value="Duration" className="bg-[#121212] text-white">Duration</option>
              <option value="Calories" className="bg-[#121212] text-white">Calories</option>
              <option value="Rating" className="bg-[#121212] text-white">Rating</option>
            </select>
          </div>
        </div>

        {/* Workouts List */}
        {sortedList.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] border border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-sm mb-4">No workouts found in this section.</p>
            <Link href="/" className="bg-[#ccff00] text-black font-black text-xs px-6 py-3 rounded-xl">
              Browse Workouts
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedList.map((workout) => (
              <div 
                key={workout.id} 
                className="bg-[#121212] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-gray-700 transition"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="h-16 w-20 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={workout.image || 'https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666664.jpg?w=740'} 
                      alt={workout.name} 
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white tracking-wide uppercase flex items-center gap-2">
                      {workout.name}
                      {workout.done && <span className="text-[#ccff00] text-xs font-bold">(Done ✓)</span>}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2">{workout.equipment}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>⏱️ {workout.duration} min</span>
                      <span>🔥 {workout.caloriesBurned || 0} kcal</span>
                      <span>⭐ {workout.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Link 
                    href={`/workouts/${workout.id}`}
                    className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition text-center"
                  >
                    View Details
                  </Link>

                  {activeTab === 'plan' && (
                    <button 
                      onClick={() => handleMarkAsDone(workout.id)}
                      className={`font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer text-center ${
                        workout.done 
                          ? 'bg-green-600 text-white' 
                          : 'bg-[#ccff00] hover:bg-[#b3e600] text-black'
                      }`}
                    >
                      {workout.done ? 'Done ✓' : '✓ Mark as Done'}
                    </button>
                  )}

                  <button 
                    onClick={() => activeTab === 'plan' ? handleRemoveFromPlan(workout.id) : handleRemoveFromSaved(workout.id)}
                    className="bg-[#1a1a1a] border border-gray-800 hover:bg-red-950 hover:border-red-800 text-gray-400 hover:text-white font-bold text-xs p-3 rounded-xl transition cursor-pointer"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full border-t border-gray-800 pt-6 mt-12 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-[#ccff00]">⚡</span> FITLOG
        </div>
        <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </div>
    </main>
  );
}