'use client'
import React, { useRef, useEffect } from 'react'
import './CustomMobileMenu.css'
import Link from 'next/link'

interface CategoryItem {
  documentId: string
  name: string
}

interface CustomMobileMenuProps {
  isOpen: boolean
  onClose: () => void
  categories: CategoryItem[]
  anchorEl: HTMLElement | null
}

const CustomMobileMenu: React.FC<CustomMobileMenuProps> = ({
  isOpen,
  onClose,
  categories,
  anchorEl
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          anchorEl && !anchorEl.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, anchorEl])

  // Animation classes
  const menuClasses = `custom-mobile-menu ${isOpen ? 'open' : ''}`

  if (!isOpen) return null

  // Calculate position based on anchorEl
  const getMenuPosition = () => {
    if (!anchorEl) return {}
    
    const rect = anchorEl.getBoundingClientRect()
    return {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    }
  }

  return (
    <div 
      className={menuClasses} 
      ref={menuRef}
      style={getMenuPosition()}
    >
      <div className="mobile-menu-header">
        <div className="mobile-menu-title">Categories</div>
        <button className="mobile-menu-close" onClick={onClose}>×</button>
      </div>
      <div className="mobile-menu-content">
        {categories.map((category) => (
          <Link
            key={category.documentId}
            href={`/bangla/${category?.name}`}
            className="mobile-menu-item"
            onClick={onClose}
          >
            {category?.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CustomMobileMenu
