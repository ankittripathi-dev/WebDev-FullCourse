import React from "react";

const App = () => {
  return (
    <div class="relative min-h-screen bg-gradient-to-br from-[#e9f1fd] via-[#e3eafe] to-[#f4f7ff] overflow-hidden flex items-center justify-center">
      {/* <!-- 🔵 Left Blue Glow --> */}
      <div class="absolute top-20 -left-20 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-40"></div>

      {/* <!-- 🟣 Right Purple Glow --> */}
      <div class="absolute bottom-10 -right-20 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-40"></div>

      {/* <!-- 🎯 Hero Content --> */}
      <div class="z-10 text-center px-6">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
          The{" "}
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 underline underline-offset-4">
            Easiest AI
          </span>{" "}
          Photo Editor
        </h1>
        <p class="mt-4 text-gray-600">
          Your all-in-one free AI photo editor. Create professional photos and
          bring your ideas to life effortlessly.
        </p>
        <button class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:scale-105 transition">
          Get Started for Free
        </button>
      </div>
    </div>
  );
};

export default App;
