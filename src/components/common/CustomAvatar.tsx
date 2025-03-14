'use client'
import React from 'react'
import './CustomAvatar.css'
import Image from 'next/image'

interface CustomAvatarProps {
  alt: string
  src?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  alt,
  src,
  size = 'medium',
  onClick
}) => {
  // Get first letter of alt text for fallback
  const firstLetter = alt ? alt.charAt(0).toUpperCase() : 'U'
  
  // Handle image load error
  const [imgError, setImgError] = React.useState(false)

  const handleError = () => {
    setImgError(true)
  }

  // Calculate size in pixels
  const getSizeInPixels = () => {
    switch (size) {
      case 'small': return 32
      case 'large': return 48
      default: return 40
    }
  }

  const sizeInPx = getSizeInPixels()

  return (
    <div 
      className={`custom-avatar ${size}`} 
      onClick={onClick}
      title="Open settings"
    >
      {src && !imgError ? (
        <div className="avatar-image-container">
          <Image 
            src={src} 
            alt={alt} 
            onError={handleError}
            width={sizeInPx}
            height={sizeInPx}
            className="avatar-image"
          />
        </div>
      ) : (
        <div className="avatar-fallback">{firstLetter}</div>
      )}
    </div>
  )
}

export default CustomAvatar
