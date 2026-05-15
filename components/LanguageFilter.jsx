'use client'
import { useState } from 'react'
import { Globe, Star } from 'lucide-react'

const languages = [
  { 
    code: "All", 
    name: "All Languages", 
    flag: "",
    color: "#7C3AED",
    description: "Browse all cinema"
  },
  { 
    code: "Telugu", 
    name: "Telugu Cinema", 
    flag: "",
    color: "#ff6b6b",
    description: "Tollywood masterpieces"
  },
  { 
    code: "Tamil", 
    name: "Tamil Cinema", 
    flag: "",
    color: "#4ecdc4",
    description: "Kollywood classics"
  },
  { 
    code: "Hindi", 
    name: "Bollywood Cinema", 
    flag: "",
    color: "#f7b731",
    description: "Bollywood blockbusters"
  },
  { 
    code: "Malayalam", 
    name: "Malayalam Cinema", 
    flag: "",
    color: "#5f27cd",
    description: "Mollywood gems"
  },
  { 
    code: "Kannada", 
    name: "Kannada Cinema", 
    flag: "",
    color: "#00d2d3",
    description: "Sandalwood stories"
  },
  { 
    code: "English", 
    name: "International Cinema", 
    flag: "",
    color: "#a55eea",
    description: "Global cinema"
  },
]

export default function LanguageFilter({ selected, onSelect }) {
  const [hoveredLang, setHoveredLang] = useState(null)

  return (
    <div className="w-full">
      {/* Language Pills Grid */}
      <div className="flex flex-wrap gap-3">
        {languages.map((lang, index) => {
          const isSelected = selected === lang.code
          const isHovered = hoveredLang === lang.code
          
          return (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              onMouseEnter={() => setHoveredLang(lang.code)}
              onMouseLeave={() => setHoveredLang(null)}
              className="relative group"
              style={{
                animation: `slideInLeft 0.4s ease ${index * 0.06}s both`,
              }}
            >
              <div
                className={`
                  relative overflow-hidden rounded-full px-4 py-2
                  flex items-center gap-2 transition-all duration-300
                  ${isSelected 
                    ? 'transform scale-105' 
                    : 'transform scale-100 hover:scale-102'
                  }
                `}
                style={{
                  background: isSelected 
                    ? lang.color 
                    : isHovered 
                      ? `${lang.color}15` 
                      : '#FFFFFF',
                  border: isSelected 
                    ? `2px solid ${lang.color}` 
                    : isHovered 
                      ? `1px solid ${lang.color}40` 
                      : '1px solid rgba(124,58,237,0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: isSelected 
                    ? `0 8px 24px ${lang.color}25` 
                    : isHovered 
                      ? 'var(--hover-shadow)' 
                      : 'var(--card-shadow)',
                }}
              >
                {/* Shimmer Effect */}
                {(isSelected || isHovered) && (
                  <div 
                    className="shimmer"
                    style={{ opacity: isSelected ? 0.3 : 0.15 }}
                  />
                )}
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  {/* Flag/Icon */}
                  <span 
                    className={`text-sm transition-transform duration-300 ${
                      isSelected || isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      filter: isSelected || isHovered 
                        ? `drop-shadow(0 0 8px ${lang.color})` 
                        : 'none',
                    }}
                  >
                    {lang.flag}
                  </span>
                  
                  {/* Language Name */}
                  <span 
                    className={`
                      text-sm font-medium transition-colors duration-300
                      ${isSelected 
                        ? 'text-white' 
                        : isHovered 
                          ? '#111827' 
                          : '#4B5563'
                      }
                    `}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  >
                    {lang.name}
                  </span>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <Star 
                      size={12} 
                      fill="white" 
                      stroke="white"
                      className="animate-pulse"
                    />
                  )}
                </div>
              </div>
              
              {/* Hover Tooltip */}
              {isHovered && !isSelected && (
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-lg text-xs whitespace-nowrap z-50"
                  style={{
                    background: `${lang.color}95`,
                    backdropFilter: 'blur(8px)',
                    color: '#111827',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    boxShadow: `0 4px 12px ${lang.color}30`,
                    animation: 'scaleIn 0.2s ease',
                  }}
                >
                  {lang.description}
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Selected Language Info */}
      {selected && selected !== "All" && (
        <div 
          className="mt-4 p-3 rounded-lg flex items-center gap-3 animate-scale-in"
          style={{
            background: `${languages.find(l => l.code === selected)?.color}15`,
            border: `1px solid ${languages.find(l => l.code === selected)?.color}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <span className="text-xl">
            {languages.find(l => l.code === selected)?.flag}
          </span>
          <div className="flex-1">
            <div 
              className="font-medium text-sm"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#111827',
              }}
            >
              {languages.find(l => l.code === selected)?.name} selected
            </div>
            <div 
              className="text-xs opacity-70"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#4B5563',
              }}
            >
              {languages.find(l => l.code === selected)?.description}
            </div>
          </div>
          <button
            onClick={() => onSelect('All')}
            className="transition-colors"
            aria-label="Clear language filter"
            style={{
              color: '#4B5563',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            x
          </button>
        </div>
      )}
      
      {/* All Languages Selected */}
      {selected === "All" && (
        <div 
          className="mt-4 p-3 rounded-lg flex items-center gap-3 animate-scale-in"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <Globe size={20} style={{ color: '#7C3AED' }} />
          <div className="flex-1">
            <div 
              className="font-medium text-sm"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#111827',
              }}
            >
              All Languages
            </div>
            <div 
              className="text-xs opacity-70"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#4B5563',
              }}
            >
              Browse cinema from all regions
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
