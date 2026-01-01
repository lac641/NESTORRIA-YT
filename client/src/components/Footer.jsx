import { Link } from "react-router-dom";
import { assets } from "../assets/data";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Please enter your email before subscribing!");
      return;
    }

    // Email destination and content
    const recipient = "lawrenceleo579@gmail.com"; // where the email will go
    const subject = encodeURIComponent("New Newsletter Subscription");
    const body = encodeURIComponent(`Hello, I would like to subscribe to your newsletter.\n\nUser email: ${email}`);

    // Opens user's default mail app (like Gmail)
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className='pt-16 xl:pt-20 w-full text-gray-500 bg-[#fffbee]'>
      <div className="max-padd-container">
        <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
          {/* Logo + social links */}
          <div className='max-w-80'>
            <div className='flex mb-4'>
              <Link to={'/'}>
                <img src={assets.logoImg} alt="logoImg" className='h-11' />
              </Link>
            </div>

            <p className='text-sm'>
              Experience modern living through well-presented properties, professional support, and thoughtfully designed spaces.
            </p>
            <div className='flex items-center gap-3 mt-4'>
              <img src={assets.facebook} alt="facebook" />
              <img src={assets.instagram} alt="instagram" />
              <img src={assets.twitter} alt="twitter" />
              <img src={assets.linkedin} alt="linkedin" />
            </div>
          </div>

          {/* Company */}
          <div>
            <p className='text-lg text-gray-800'>COMPANY</p>
            <ul className='mt-3 flex flex-col gap-2 text-sm'>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className='h4 text-gray-800'>SUPPORT</p>
            <ul className='mt-3 flex flex-col gap-2 text-sm'>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Information</a></li>
              <li><a href="#">Cancellation Options</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='max-w-80'>
            <p className='h4 text-black/80'>STAY UPDATED</p>
            <p className='mt-3 text-sm'>
               Send us an email to join our newsletter and receive inspiration and negotiation offers.
            </p>
            <div className='flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden max-w-md w-full mt-6'>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full h-full outline-none text-sm text-gray-500'
                placeholder='Your email'
              />
              <button
                onClick={handleSubscribe}
                className='btn-dark font-medium px-9.5 py-2 mr-0.5 p-9'
              >
                Send 
              </button>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
          <p>© {new Date().getFullYear()} <a href="/">Nestorria</a>. All rights reserved.</p>
          <ul className='flex items-center gap-4'>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
