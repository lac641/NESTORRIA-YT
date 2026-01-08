import React, { useRef } from "react";
import { assets } from "../assets/data";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const Contact = () => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_rweuso4",
        "template_hr08id3",
        formRef.current,
        "EdYSyxruufWTPa5Yp"
      )
      .then(
        () => {
          toast.success("Message sent successfully ✅");
          formRef.current.reset();
        },
        () => {
          toast.error("Failed to send message ❌");
        }
      );
  };

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28">
      <form
        ref={formRef}
        onSubmit={sendEmail}
        className="flex flex-col items-center text-sm text-slate-800"
      >
        <p className="text-xs bg-black/80 text-white font-medium px-3 py-1 rounded-full">
          Contact Us
        </p>

        <h1 className="text-4xl font-bold py-4 text-center">
          Let’s Get In Touch.
        </h1>

        <p className="max-md:text-sm text-gray-500 pb-10 text-center">
          Or just reach out manually to us at{" "}
          <a
            href="mailto:lawrenceleo579@gmail.com"
            className="text-secondary hover:underline"
          >
            njokukelechi3@gmail.com
          </a>
        </p>

        <div className="max-w-96 w-full px-4">
          <label className="font-medium">Full Name</label>
          <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 bg-secondary/10 rounded-full">
            <img src={assets.user} width={19} alt="" className="invert-50" />
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="h-full px-2 w-full outline-none bg-transparent"
              required
            />
          </div>

          <label className="font-medium">Email Address</label>
          <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 bg-secondary/10 rounded-full">
            <img src={assets.mail} width={18} alt="" className="invert-50" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="h-full px-2 w-full outline-none bg-transparent"
              required
            />
          </div>

          <label className="font-medium">Message</label>
          <textarea
            name="message"
            rows="4"
            className="w-full mt-2 p-2 border border-slate-300 bg-secondary/10 rounded-lg resize-none outline-none"
            placeholder="Enter your message"
            required
          ></textarea>

          <button
            type="submit"
            className="flexCenter gap-1 mt-5 btn-secondary w-full !font-bold"
          >
            Submit Form
            <img src={assets.right} alt="" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
