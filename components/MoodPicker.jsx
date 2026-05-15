'use client'
import { useState } from 'react'
import { Heart, Flame, Laugh, Swords, Coffee, Eye, Sparkles, Brain, Rocket, Users, Trophy, Moon } from 'lucide-react'
import { moods as moodConfig } from '@/data/moods'

const moodStyles = {
  "Love": { icon: Heart, gradient: "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)", color: "#FF6B6B", description: "Romantic stories" },
  "Emotional": { icon: Eye, gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)", color: "#4ECDC4", description: "Heart touching" },
  "Mass": { icon: Flame, gradient: "linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)", color: "#FF8C42", description: "Power packed" },
  "Thriller": { icon: Swords, gradient: "linear-gradient(135deg, #6C5CE7 0%, #5F3DC4 100%)", color: "#6C5CE7", description: "Edge of seat" },
  "Action": { icon: Swords, gradient: "linear-gradient(135deg, #A8E6CF 0%, #7FD1AE 100%)", color: "#A8E6CF", description: "Adrenaline rush" },
  "Feel Good": { icon: Coffee, gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)", color: "#7C3AED", description: "Uplifting" },
  "Comedy": { icon: Laugh, gradient: "linear-gradient(135deg, #FFD93D 0%, #FCB045 100%)", color: "#FFD93D", description: "Fun times" },
  "Dark": { icon: Moon, gradient: "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)", color: "#2D3748", description: "Dark & intense" },
  "Motivational": { icon: Trophy, gradient: "linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)", color: "#F6AD55", description: "Inspiring" },
  "Family": { icon: Users, gradient: "linear-gradient(135deg, #68D391 0%, #48BB78 100%)", color: "#68D391", description: "Family friendly" },
  "Sci-Fi": { icon: Rocket, gradient: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)", color: "#4299E1", description: "Futuristic" },
  "Mind Bending": { icon: Brain, gradient: "linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%)", color: "#9F7AEA", description: "Mind twisting" },
}

export default function MoodPicker({ selectedMood, onSelect }) {
  const [hoveredMood, setHoveredMood] = useState(null)
  
  const moods = moodConfig.map(mood => ({
    label: mood.name,
    emoji: mood.emoji,
    ...moodStyles[mood.name]
  }))

  return (
    <div className="w-full">
      {/* Mood Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {moods.map((mood, index) => {
          const isSelected = selectedMood === mood.label
          const isHovered = hoveredMood === mood.label
          
          return (
            <button
              key={mood.label}
              onClick={() => onSelect(mood.label === selectedMood ? null : mood.label)}
              onMouseEnter={() => setHoveredMood(mood.label)}
              onMouseLeave={() => setHoveredMood(null)}
              className="relative group"
              style={{
                animation: `scaleIn 0.4s ease ${index * 0.08}s both`,
              }}
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl p-6
                  transition-all duration-300 ease-out
                  ${isSelected 
                    ? 'transform -translate-y-2 scale-105' 
                    : 'transform translate-y-0 scale-100 hover:-translate-y-1 hover:scale-102'
                  }
                `}
                style={{
                  background: isSelected 
                    ? mood.gradient 
                    : isHovered 
                      ? `${mood.color}15` 
                      : '#FFFFFF',
                  border: isSelected 
                    ? `2px solid ${mood.color}` 
                    : isHovered 
                      ? `1px solid ${mood.color}40` 
                      : '1px solid rgba(124,58,237,0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: isSelected 
                    ? `0 12px 24px ${mood.color}25` 
                    : isHovered 
                      ? 'var(--hover-shadow)' 
                      : 'var(--card-shadow)',
                }}
              >
                {/* Shimmer Effect */}
                {(isSelected || isHovered) && (
                  <div 
                    className="shimmer"
                    style={{ opacity: isSelected ? 0.4 : 0.2 }}
                  />
                )}
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  {/* Icon/Emoji */}
                  <div 
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center
                      transition-all duration-300
                      ${isSelected ? 'bg-white/20' : 'bg-white/5'}
                    `}
                    style={{
                      background: isSelected 
                        ? 'rgba(255,255,255,0.2)' 
                        : isHovered 
                          ? `${mood.color}10` 
                          : 'rgba(124,58,237,0.05)',
                    }}
                  >
                    <span 
                      className={`text-2xl transition-transform duration-300 ${
                        isSelected || isHovered ? 'scale-110' : 'scale-100'
                      }`}
                      style={{
                        filter: isSelected || isHovered 
                          ? `drop-shadow(0 0 12px ${mood.color})` 
                          : 'none',
                      }}
                    >
                      {mood.emoji}
                    </span>
                  </div>
                  
                  {/* Label */}
                  <div 
                    className={`
                      font-semibold text-sm transition-colors duration-300
                      ${isSelected 
                        ? 'text-white' 
                        : isHovered 
                          ? '#111827' 
                          : '#4B5563'
                      }
                    `}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {mood.label}
                  </div>
                  
                  {/* Description - Show on hover/select */}
                  {(isSelected || isHovered) && (
                    <div 
                      className="text-xs opacity-80 transition-opacity duration-300"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        color: isSelected ? 'white' : '#4B5563',
                      }}
                    >
                      {mood.description}
                    </div>
                  )}
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div 
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    style={{
                      boxShadow: `0 2px 8px ${mood.color}50`,
                    }}
                  >
                    <Sparkles size={12} fill={mood.color} stroke={mood.color} />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Selected Mood Info */}
      {selectedMood && (
        <div 
          className="mt-6 p-4 rounded-xl text-center animate-scale-in"
          style={{
            background: `${moods.find(m => m.label === selectedMood)?.color}15`,
            border: `1px solid ${moods.find(m => m.label === selectedMood)?.color}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">
              {moods.find(m => m.label === selectedMood)?.emoji}
            </span>
            <div className="text-left">
              <div 
                className="font-semibold"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#111827',
                }}
              >
                {selectedMood} cinema selected
              </div>
              <div 
                className="text-sm opacity-70"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#4B5563',
                }}
              >
                {moods.find(m => m.label === selectedMood)?.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
    
