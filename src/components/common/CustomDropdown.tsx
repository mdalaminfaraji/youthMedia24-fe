'use client'
import React, { useState, useRef, useEffect } from 'react'
import './CustomDropdown.css'

interface DropdownItem {
  label: string
  onClick: () => void
  isLogout?: boolean
}

interface CustomDropdownProps {
  items: DropdownItem[]
  trigger: React.ReactNode
  mobileView?: boolean
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  items, 
  trigger,
  mobileView = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (onClick: () => void) => {
    onClick()
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`custom-dropdown ${mobileView ? 'mobile' : ''}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`dropdown-item ${item.isLogout ? 'logout-item' : ''}`}
                onClick={() => handleItemClick(item.onClick)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
