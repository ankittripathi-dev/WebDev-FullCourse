import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen   mt-15 pt-8  bg-pink-50 flex flex-col items-center  px-4">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-800">Contact Us</h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows="4"
              placeholder="Your message..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-pink-600 transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Or email us directly at <a href="mailto:support@shopexample.com" className="text-pink-500 underline corsor-">support@shopexample.com</a>
        </div>
      </div>


      <div className='mt-9 w-full pb-5 '>
        <iframe className='w-full h-[400px]' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.2836996142496!2d75.79272447468486!3d26.86272616223834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5eb3f62c46b%3A0x1520669008d3a150!2sWsCube%20Tech%20-%20Upskilling%20Bharat!5e0!3m2!1sen!2sin!4v1744262662830!5m2!1sen!2sin" gloading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

      </div>

    </div>
  );
};

export default ContactPage;
