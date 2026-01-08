import React, { useState } from "react";
import { assets } from "../assets/data";

const blogs = [
  {
    id: 1,
    title: "Why Real Estate Is the Best Investment",
    category: "Real Estate",
    image: assets.photoblog1,
    description:
      "Real estate remains one of the safest and most profitable investments.",
    content: `
Real estate has remained one of the most reliable investment options for decades.

Unlike stocks or cryptocurrencies, property value does not vanish overnight.
People will always need homes, offices, and commercial spaces.

Key benefits of real estate investment include:
• Steady rental income
• Long-term value appreciation
• Protection against inflation
• Financial security

Smart investors always include property in their portfolio.
    `,
  },
  {
    id: 2,
    title: "How to Choose the Right Property",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471",
    description:
      "Learn the most important things to consider before buying property.",
    content: `
Choosing the right property requires research and patience.

Always consider:
• Location
• Accessibility
• Security
• Nearby facilities
• Future development plans

A property in a growing area today can become extremely valuable tomorrow.
    `,
  },
  {
    id: 3,
    title: "Mistakes New Property Buyers Make",
    category: "Advice",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    description:
      "Avoid these common mistakes when buying your first property.",
    content: `
Many first-time buyers rush into property deals without enough information.

Common mistakes include:
• Buying without inspection
• Ignoring legal documents
• Choosing poor locations
• Overstretching finances

Taking your time can save you millions in the future.
    `,
  },
  {
    id: 4,
    title: "How to Sell Your Property Fast",
    category: "Real Estate",
    image: assets.photoblog2,
    description: "Top strategies to sell your property quickly and at a good price.",
    content: `
Selling your property can be stressful, but with the right strategies you can do it fast.

Tips:
• Price it correctly
• Stage the property
• Advertise online
• Work with a trusted agent
    `,
  },
  {
    id: 5,
    title: "Understanding Property Taxes",
    category: "Finance",
    image: assets.photoblog4,
    description: "A beginner's guide to property taxes and how they affect your investment.",
    content: `
Property taxes are unavoidable but understanding them helps you plan your finances.

Things to know:
• Tax rates vary by location
• Taxes affect ROI
• Keep records for deductions
    `,
  },
  {
    id: 6,
    title: "Renovation Tips That Increase Property Value",
    category: "Home Improvement",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    description: "Simple renovation ideas that boost your property's resale value.",
    content: `
Not all renovations are equal. Focus on upgrades that buyers love:

• Kitchen remodel
• Modern bathrooms
• Fresh paint
• Landscaping
    `,
  },
  {
    id: 7,
    title: "How Location Affects Property Investment",
    category: "Real Estate",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    description: "Why location is one of the most important factors in real estate.",
    content: `
Location determines property value, rent potential, and long-term growth.

Always research:
• Neighborhood trends
• Future developments
• Proximity to schools and work
    `,
  },
  {
    id: 8,
    title: "Real Estate vs Stocks: Which is Better?",
    category: "Investment",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471",
    description: "Comparing real estate and stock investments for beginners.",
    content: `
Both real estate and stocks have pros and cons.

Real estate:
• Tangible asset
• Steady income
• Less volatile

Stocks:
• Liquid
• High growth potential
• Requires research
    `,
  },
  {
    id: 9,
    title: "Top Mistakes Landlords Make",
    category: "Advice",
    image: assets.photoblog3,
    description: "Common pitfalls landlords should avoid to protect their investment.",
    content: `
Landlords often make mistakes that hurt income:

• Poor tenant screening
• Ignoring maintenance
• Not understanding laws
• Overpricing rent
    `,
  },
];

const Blog = () => {
  const [activeBlog, setActiveBlog] = useState(null);

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-28">
      <div className="max-padd-container">
        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-12">
          {blogs.map((blog) => (
            <div key={blog.id} className="relative">
              <div className="bg-secondary/10 p-4 rounded-2xl relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="rounded-xl shadow-xl shadow-slate-900/20"
                />
              </div>

              <p className="medium-14 mt-6">{blog.category}</p>
              <h5 className="h5 pr-4">{blog.title}</h5>
              <p className="line-clamp-2">{blog.description}</p>

              <button
                onClick={() => setActiveBlog(blog)}
                className="underline mt-2 bold-14"
              >
                continue reading
              </button>
            </div>
          ))}
        </div>

        {/* Full Blog Modal */}
        {activeBlog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl p-6 relative max-h-[80vh] overflow-y-auto">
              {/* X Button over the image */}
              <div className="relative">
                <img
                  src={activeBlog.image}
                  alt={activeBlog.title}
                  className="rounded-xl mb-4"
                />
                <button
                  onClick={() => setActiveBlog(null)}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="medium-14 text-gray-500">{activeBlog.category}</p>
              <h2 className="text-2xl font-bold mb-4">{activeBlog.title}</h2>
              <p className="whitespace-pre-line text-gray-700">
                {activeBlog.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
