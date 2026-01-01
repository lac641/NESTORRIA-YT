import React from 'react'
import { blogs } from '../assets/data'

const Blog = () => {
  return (
    <div className='bg-gradient-to-r from-[#fffbee] to-white py-28'>
<div className='max-padd-container'>
{/* Container */}
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-12'>
  {blogs.map((blog, index)=>(
    <div key={index} className='relative'>
<div className='bg-secondary/10 p-4 rounded-2xl'>
<img src={blog.image} alt="" className='rounded-xl shadow-xl shadow-slate-900/20'/>
</div>

{/* Info */}
<p className='medium-14 mt-6'>{blog.category}</p>
<h5 className='h5 pr-4'>{blog.title}</h5>
<p>{blog.description}</p>
<button className="underline mt-2 bold-14 line-clamp-2">
  continue reading
</button>

    </div>
  ))}
</div>
</div>
    </div>
  )
}

export default Blog