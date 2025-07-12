"use client";
import React from "react";
import {
  User,
  Sparkles,
  Crown,
  Heart,
  Star,
  Zap,
  Shield,
  Gem,
} from "lucide-react";

// Avatar data (no TypeScript interface needed)
const avatars = [
  {
    id: "1",
    name: "Climate expert",
    icon: User,
    gradient: "from-purple-400 to-pink-400",
    description: "For climate, enviornment and more",
  },
  {
    id: "2",
    name: "Health Mentor",
    icon: Sparkles,
    gradient: "from-purple-500 to-indigo-500",
    description: "for wellness, fitness, or medical guidance.",
  },
  {
    id: "3",
    name: "Code Mentor",
    icon: Crown,
    gradient: "from-purple-600 to-blue-500",
    description: "for programming and development help.",
  },
  {
    id: "4",
    name: "Eco Mentor ",
    icon: Heart,
    gradient: "from-pink-400 to-rose-400",
    description: "for sustainability and environmental education.",
  },
  {
    id: "5",
    name: "Career Mentor",
    icon: Star,
    gradient: "from-indigo-500 to-purple-600",
    description: "for job search, resume, and interview guidance.",
  },
  {
    id: "6",
    name: "Energy Master",
    icon: Zap,
    gradient: "from-yellow-400 to-orange-500",
    description: "Dynamic and powerful",
  },
  {
    id: "7",
    name: "Finance Mentor",
    icon: Shield,
    gradient: "from-emerald-400 to-teal-500",
    description: "for personal finance or investment advice.",
  },
  {
    id: "8",
    name: "Tech Mentor",
    icon: Gem,
    gradient: "from-cyan-400 to-blue-500",
    description: "for learning about gadgets, software, and emerging tech.",
  },
];

function AvatarCard({ avatar }) {
  const handleClick = () => {
    window.open("https://3d-mentor-3js.vercel.app/", "_blank");
  };

  const IconComponent = avatar.icon;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 overflow-hidden">
        <div
          className={`h-32 bg-gradient-to-br ${avatar.gradient} flex items-center justify-center relative`}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-all duration-300">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-purple-800 mb-2 group-hover:text-purple-600 transition-colors">
            {avatar.name}
          </h3>
          <p className="text-purple-600 text-sm leading-relaxed">
            {avatar.description}
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-purple-50 rounded-lg p-3 text-center group-hover:bg-purple-100 transition-colors duration-300">
            <span className="text-purple-700 font-semibold text-sm">
              Enter 3D Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpertSelection() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
              Choose Your Avatar
            </h1>
            <p className="text-xl text-purple-600 max-w-2xl mx-auto leading-relaxed">
              Select your digital identity and step into an immersive 3D
              learning experience. Each avatar represents a unique journey of
              discovery and growth.
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {avatars.map((avatar) => (
            <AvatarCard key={avatar.id} avatar={avatar} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Click on any avatar above to start your 3D learning adventure.
              Discover new worlds, gain knowledge, and unlock your potential.
            </p>
            <div className="flex justify-center space-x-4">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <Star className="w-6 h-6 text-yellow-300" />
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-purple-600">
            <p>
              © 2025 3D Mentor Experience. Choose your avatar and explore
              unlimited possibilities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ExpertSelection;
