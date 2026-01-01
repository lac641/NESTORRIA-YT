import React, { useState } from 'react'

const PropertyImages = ({ property }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0) // first image expanded initially
  const images = property?.images || [] // get images safely

  // Generate captions dynamically if images exist
  const defaultCaptions = [
    'Front View',
    'Living Area',
    'Master Bedroom',
    'Modern Kitchen',
    'Backyard',
    'Bathroom',
    'Kitchen',
    'Dining Area',
  ]

  return (
    <div className="flex gap-2">
      {images.map((img, index) => {
        const isHovered = hoveredIndex === index
        const captionHeading = defaultCaptions[index] || `Image ${index + 1}`

        return (
          <div
            key={index}
            className={`relative group transition-all duration-500 h-[400px] overflow-hidden rounded-2xl ${
              isHovered ? 'flex-grow w-full' : 'max-sm:w-10 max-md:w-20 w-56'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(0)} // revert to first image
          >
            <img
              src={img}
              alt={`Property Image ${index + 1}`}
              className="w-full h-full object-cover object-center rounded-2xl"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl">
              <h3 className="h3">{captionHeading}</h3>
              <p className="text-white/90">
                {/* optional description */}
                {`View of ${captionHeading.toLowerCase()}`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PropertyImages
