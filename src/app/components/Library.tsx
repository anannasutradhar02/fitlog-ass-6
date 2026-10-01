'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Workout {
  id: string | number;
  name: string;
  muscleGroups?: string[];
  category?: string[];
  equipment: string;
  duration: number | string;
  caloriesBurned?: number | string;
  rating: number;
  image: string;
}

export default function Library() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('Duration');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('https://api.abcz.workers.dev/api/fitlog')
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching workouts:', error);
        setLoading(false);
      });
  }, []);

  // Sorting and Filtering logic
  const sortedWorkouts = [...workouts].filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'Duration') {
      return Number(b.duration || 0) - Number(a.duration || 0);
    } else if (sortBy === 'Calories') {
      return Number(b.caloriesBurned || 0) - Number(a.caloriesBurned || 0);
    } else if (sortBy === 'Rating') {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-[#ccff00] font-bold text-lg animate-pulse">
        Loading workouts…
      </div>
    );
  }

  return (
    <section id="workouts-section" className="px-8 py-12 max-w-7xl mx-auto scroll-mt-8">
      {/* Section Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white">THE LIBRARY</h2>
          <p className="text-gray-400 text-sm mt-1">Twelve lifts covering every major muscle group.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search workouts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-gray-800 focus:border-[#ccff00] text-xs text-white px-4 py-2.5 rounded-xl outline-none w-full md:w-60 transition"
          />
          
          {/* Clean Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#121212] border border-gray-800 px-4 py-2 rounded-xl">
            <span className="font-medium text-gray-300">Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#ccff00] font-bold outline-none cursor-pointer"
            >
              <option value="Duration" className="bg-[#121212] text-white">Duration</option>
              <option value="Calories" className="bg-[#121212] text-white">Calories</option>
              <option value="Rating" className="bg-[#121212] text-white">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedWorkouts.map((workout) => {
          const tags = workout.muscleGroups || workout.category || [];

          return (
            <Link 
              href={`/workouts/${workout.id}`} 
              key={workout.id}
              className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden hover:border-[#ccff00] transition group flex flex-col"
            >
              <div className="relative h-48 w-full bg-[#1a1a1a]">
                <img 
                  src={workout.image || 'https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666664.jpg?w=740'} 
                  alt={workout.name} 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(tags) && tags.map((cat, index) => (
                      <span key={index} className="bg-[#ccff00] text-black text-[10px] font-black px-2.5 py-0.5 rounded tracking-wide">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base font-black tracking-wide text-white mb-1 group-hover:text-[#ccff00] transition">
                    {workout.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-4">{workout.equipment}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800 pt-3">
                  <span>⏱️ {workout.duration} min</span>
                  <span>🔥 {workout.caloriesBurned} kcal</span>
                  <span>⭐ {workout.rating}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}