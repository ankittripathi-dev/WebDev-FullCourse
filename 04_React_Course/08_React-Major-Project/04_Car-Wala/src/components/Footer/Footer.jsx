import { SiAmericanexpress, SiDiscover } from "react-icons/si";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import EmailIcon from "@mui/icons-material/Email";
// import { MdArrowForwardIos } from "react-icons/md";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Footer = () => {
  return (
    <div
      className="pt-10 px-6 md:px-12 lg:px-32 bg-black w-full overflow-hidden"
      id="Footer"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          {/* logo */}
          <div className="flex gap-1.5 text-white">
            <h1 className="text-3xl font-semibold">CAR WALA</h1>
          </div>

          <p className="text-gray-400 mt-2 md:mt-3">
            Your trusted partner for premium transportation services. Safe,
            reliable, and comfortable rides across Michigan.
          </p>

          <div className="flex gap-4 text-white text-2xl mt-3">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram color="#E1306C" />
            </a>

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF color="#1877F2" />
            </a>

            <a
              href="https://wa.me/+15178858129"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp color="#25D366" />
            </a>

            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn color="#0077B5" />
            </a>
          </div>
        </div>

        {/* Quick lines */}
        <div className="w-full mb-6 md:w-1/6 md:mb-0">
          <h3 className="text-white text-lg font-bold mb-1 ml-1">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li className="flex items-center gap-1">
              <PlayArrowIcon fontSize="small" style={{ color: "blue" }} />
              <a href="#home" className="hover:text-white">
                Home
              </a>
            </li>

            <li className="flex items-center gap-1">
              <PlayArrowIcon fontSize="small" style={{ color: "blue" }} />
              <a href="#about" className="hover:text-white">
                About
              </a>
            </li>

            <li className="flex items-center gap-1">
              <PlayArrowIcon fontSize="small" style={{ color: "blue" }} />
              <a href="#reviews" className="hover:text-white">
                Reviews
              </a>
            </li>

            <li className="flex items-center gap-1">
              <PlayArrowIcon fontSize="small" style={{ color: "blue" }} />
              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </li>

            <li className="flex items-center gap-1">
              <PlayArrowIcon fontSize="small" style={{ color: "blue" }} />
              <a href="#ourservices" className="hover:text-white">
                Our Services
              </a>
            </li>
          </ul>
        </div>

        {/* contact */}
        <div className="w-full mb-6 md:w-1/6 md:mb-0">
          <h3 className="text-white text-lg font-bold mb-1 ml-0.5">
            Contact Information
          </h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li className="flex items-center gap-1 text-lg">
              <EmailIcon style={{ color: "#F97316" }} />
              <a href="#email" className="hover:text-white">
                carwala@email.com
              </a>
            </li>

            <li className="flex items-center gap-1.5">
              <FaPhoneAlt color="#1D4ED8" size={20} />
              <a href="#phone" className="hover:text-white">
                +1-5178858129
              </a>
            </li>

            <li className="flex items-center gap-1.5">
              <FaWhatsapp color="#25D366" />
              <a
                href="https://wa.me/+15178858129"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                
                +1-5178858129
              </a>
            </li>

            <li className="flex items-center gap-2">
              <FaMapMarkerAlt color="#DC2626" size={20} />
              <a href="#reviews" className="hover:text-white">
                Lansing, MI, United States, Michigan
              </a>
            </li>
          </ul>
        </div>

        {/* NewsLetter Subscribe */}
        <div className="w-full md:w-1/4">
          <h3 className="text-white text-lg font-bold mb-1">
            Subscribe to Our Newsletters
          </h3>
          <p className="text-gray-400 mb-2 w-full md:max-w-80">
            Stay updated with fresh content, straight to your inbox—every week!
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="p-2 rounded bg-white text-black border border-gray-700 focus:outline-none w-full md:auto"
            />
            <button className="py-1 px-1 rounded bg-blue-800 text-white">
              Subscribe
            </button>
          </div>

          <p className="text-white mt-2">We accept all major Credit Cards</p>

          <div className="flex items-center gap-2 mt-1">
            {/* visa card */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
              alt="Visa"
              className="w-20 h-4"
            />

            {/* mastercard */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              alt="Mastercard"
              className="w-20 h-9"
            />

            {/* American Express */}
            <div className="text-blue-700 text-3xl">
              <SiAmericanexpress />
            </div>

            {/* Discover */}
            <div className="text-orange-600 text-4xl">
              <SiDiscover />
            </div>
          </div>
        </div>
      </div>
      {/* copyright part*/}
      <div className="border-t border-gray-700 py-4 mt-10 text-center text-gray-500">
        © 2025 Car Wala. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
