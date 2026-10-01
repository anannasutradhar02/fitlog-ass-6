'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface WorkoutDetail {
  id: string | number;
  name: string;
  image: string;
  muscleGroups?: string[];
  category?: string[];
  equipment: string;
  difficulty: string;
  duration: number | string;
  caloriesBurned?: number | string;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [planCount, setPlanCount] = useState<number>(0);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Load counts from localStorage
    const currentPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    const currentSaved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    setPlanCount(currentPlan.length);
    setSavedCount(currentSaved.length);

    fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const workoutData = Array.isArray(data) ? data.find((item: any) => String(item.id) === String(id)) : data;
        setWorkout(workoutData || data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching workout details:', error);
        setLoading(false);
      });
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToPlan = () => {
    if (!workout) return;
    const currentPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    if (!currentPlan.some((item: any) => String(item.id) === String(workout.id))) {
      const updatedPlan = [...currentPlan, workout];
      localStorage.setItem('fitlog_plan', JSON.stringify(updatedPlan));
      setPlanCount(updatedPlan.length);
      showToast('Added to today\'s plan');
    } else {
      showToast('Already in today\'s plan');
    }
  };

  const handleSaveForLater = () => {
    if (!workout) return;
    const currentSaved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    if (!currentSaved.some((item: any) => String(item.id) === String(workout.id))) {
      const updatedSaved = [...currentSaved, workout];
      localStorage.setItem('fitlog_saved', JSON.stringify(updatedSaved));
      setSavedCount(updatedSaved.length);
      showToast('Saved for later');
    } else {
      showToast('Already saved for later');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-[#ccff00] font-bold text-lg animate-pulse">
        Loading workout details...
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
        <p className="text-xl mb-4">Workout not found!</p>
        <Link href="/" className="bg-[#ccff00] text-black font-black px-4 py-2 rounded-lg">
          Back to Library
        </Link>
      </div>
    );
  }

  const tags = workout.muscleGroups || workout.category || [];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 flex flex-col justify-between relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#ccff00] text-black font-black px-5 py-3 rounded-xl shadow-2xl z-50 animate-bounce text-xs tracking-wider">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-gray-800 pb-4 mb-10">
        <Link href="/" className="flex items-center gap-2 font-black tracking-wider text-lg">
          <span className="text-[#ccff00]">⚡</span> FITLOG
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition">Workouts</Link>
          <Link href="/my-plan" className="hover:text-white transition">My Plan</Link>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/my-plan" className="bg-[#1a1a1a] border border-gray-800 px-3 py-1 rounded-full text-white hover:border-[#ccff00] transition">
              Plan <span className="text-[#ccff00] font-bold ml-1">{planCount}</span>
            </Link>
            <Link href="/my-plan" className="bg-[#1a1a1a] border border-gray-800 px-3 py-1 rounded-full text-white hover:border-[#ccff00] transition">
              Saved <span className="text-[#ccff00] font-bold ml-1">{savedCount}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-start flex-grow">
        {/* Left: Image Box */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden p-6 flex justify-center items-center">
          <img 
            src={workout.image || 'https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666664.jpg?w=740'} 
            alt={workout.name} 
            className="w-full max-h-[450px] object-contain"
          />
        </div>

        {/* Right: Info & Specs */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-black tracking-wider text-white mb-3">
            {workout.name}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {workout.description}
          </p>

          {/* Muscle Group Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-[#ccff00] text-black text-[10px] font-black px-3 py-1 rounded tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          {/* Specifications Box */}
          <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden mb-8">
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800/60 text-xs">
              <span className="text-gray-400 font-medium">EQUIPMENT</span>
              <span className="text-white font-bold">{workout.equipment}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800/60 text-xs">
              <span className="text-gray-400 font-medium">DIFFICULTY</span>
              <span className="text-white font-bold">{workout.difficulty}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800/60 text-xs">
              <span className="text-gray-400 font-medium">SETS</span>
              <span className="text-white font-bold">{workout.sets}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800/60 text-xs">
              <span className="text-gray-400 font-medium">REPS</span>
              <span className="text-white font-bold">{workout.reps}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800/60 text-xs">
              <span className="text-gray-400 font-medium">DURATION</span>
              <span className="text-white font-bold">{workout.duration} min</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800/60 text-xs">
              <span className="text-gray-400 font-medium">CALORIES</span>
              <span className="text-white font-bold">{workout.caloriesBurned} kcal</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 text-xs">
              <span className="text-gray-400 font-medium">RATING</span>
              <span className="text-white font-bold">⭐ {workout.rating}</span>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Instructions</h2>
            <div className="space-y-3 text-sm text-gray-300">
              {workout.instructions && workout.instructions.map((step, index) => (
                <div key={index} className="flex gap-3 leading-relaxed">
                  <span className="text-gray-500 font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAddToPlan}
              className="flex-1 bg-[#ccff00] hover:bg-[#b3e600] text-black font-black text-xs py-3.5 px-6 rounded-xl transition tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              📅 Add to today&apos;s plan
            </button>
            <button 
              onClick={handleSaveForLater}
              className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              🔖 Save for later
            </button>
          </div>
        </div>
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