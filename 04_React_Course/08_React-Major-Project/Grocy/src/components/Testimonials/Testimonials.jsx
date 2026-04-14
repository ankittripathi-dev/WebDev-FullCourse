import React from "react";
import Heading from "../Heading/Heading";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import img1 from "../../assets/userImages/img1.jpeg";
import img2 from "../../assets/userImages/img2.jpg";
import img3 from "../../assets/userImages/img3.webp";
import img4 from "../../assets/userImages/img4.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar } from "react-icons/fa";

function Testimonials() {
  return (
    <section>
      <div className="max-w-[1400px] py-20 mx-auto px-10">
        <Heading highlight={"Customers"} heading={"Saying"} />
        <div className="py-5 flex justify-end gap-x-5">
          <button className="custom-prev text-2xl rounded-lg w-10 h-10 px-2 cursor-pointer justify-center items-center bg-zinc-200 hover:bg-gradient-to-b hover:from-orange-500 hover:to-orange-600 hover:text-white">
            <IoIosArrowBack />
          </button>
          <button className="custom-next text-2xl rounded-lg w-10 h-10 px-2 cursor-pointer justify-center items-center bg-zinc-200 hover:bg-gradient-to-b hover:from-orange-500 hover:to-orange-600 hover:text-white">
            <IoIosArrowForward />
          </button>
        </div>

{/* slider */}
        <Swiper navigation={{
          nextEl:".custom-next",
          prevEl:".custom-prev"
        }}
        loop = {true}
        breakpoints={{
          640:{slidesPerView: 1,spaceBetween:20},
          768:{slidesPerView: 2,spaceBetween:20},
          1024:{slidesPerView: 3,spaceBetween:20},
        }} 
        modules={[Navigation]} className="mySwiper">
          {reviews.map((review) => {
            return (
              <SwiperSlide className="bg-zinc-200 rounded-xl p-8 ">
                <div className="flex gap-5 items-center">
                  <div className=" rounded-full h-16 w-16 outline-2 outline-orange-500 outline-offset-2 overflow-hidden">
                    {/* {review.image} */}
                    <img src={review.image} alt={review.name} className="object-cover w-full h-full" />

                  </div>
                  <div className="">
                    <h5 className="text-xl font-bold">{review.name}</h5>
                    <p className="text-zinc-600 mt-2 text-xl font-bold">{review.profession}</p>
                    <span className="flex text-orange-600 mt-3">{Array.from({length:review.rating},(_, index)=>
                         <FaStar/>
                     )}</span>
                  </div>
                </div>
                <div className="mt-10 min-h-[15vh]">
                  <p className="text-zinc-600">{review.para}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}


export default Testimonials;

const reviews = [
  {
    id: 1,
    name: "Aditya Tripathi",
    profession: "Food Blogger",
    para: "Grocy is my go-to store for all grocery needs. Their produce is always fresh, and the delivery is super fast. I love the user-friendly interface and variety of organic options!",
    rating: 3,
    image: img1,
  },
  {
    id: 2,
    name: "Alok Mishra",
    profession: "Fitness Coach",
    para: "Shopping online with Grocy has saved me so much time. I trust them for my family's weekly groceries—always fresh, affordable, and reliable.",
    rating: 4,
    image: img2,
  },
  {
    id: 3,
    name: "Abhijeet",
    profession: "Chef",
    para: "As a chef, quality ingredients are everything. Grocy consistently delivers the best vegetables, herbs, and pantry staples. Highly recommended!",
    rating: 5,
    image: img3,
  },
  {
    id: 4,
    name: "Adarsh",
    profession: "Model",
    para: "Shopping online with Grocy has saved me so much time. I trust them for my family's weekly groceries—always fresh, affordable, and reliable.",
    rating: 4,
    image: img4,
  },
];
