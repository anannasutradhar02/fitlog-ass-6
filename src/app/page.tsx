import React from 'react';


import Banner from './components/Banner'; // Apnar Navbar component-er path
import Library from './components/Library';
            // Apnar Hero component-er path

const page = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar show korar jonno */}
  

      {/* Hero section show korar jonno */}
      <Banner></Banner>
      <Library></Library>
    </main>
  );
};

export default page;