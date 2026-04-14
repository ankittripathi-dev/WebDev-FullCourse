import React from "react";
import Heading from "../Heading/Heading";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
} from "react-icons/tb";
import { PiFactory, PiPlantFill } from "react-icons/pi";
import { TbTruckDelivery } from "react-icons/tb";
import { SlBadge } from "react-icons/sl";

function Process() {
  const renderSteps = steps.map((step) => {
    return(
        <div className={`flex-1 basis-[300px]  ${step.id%2==0 ? 'md:-mt-60 ':''}`}>
            <span className="flex mx-auto  outline-[4px] justify-center items-center outline-offset-2 mt-10 mb-5 outline-dotted rounded-full  w-18 h-18 text-8xl  bg-zinc-100 ">{step.number}</span>
            <div>
                <div className=" flex items-center mt-1 gap-2">
                    <span className="flex bg-gradient-to-b from-orange-500 to-orange-600 rounded-full text-white w-15 h-15 justify-center items-center text-3xl">{step.icon}</span>
                
                <div className="flex-1">
                    <h4 className="text-2xl font-bold text-zinc-800 ">{step.title}</h4>
                    <p className="text-zinc-600 mt-2 ">{step.para}</p>
                </div>
                </div>
            </div>
        </div>
    )
  });

  return (
    <section>
      <div className="max-w-[1400px] mx-auto py-25 px-10">
        <Heading highlight={"Our"} heading={"Process"} />
        <div className="flex flex-wrap md:mt-20 mt-10 items-center justify-center  md:pt-50">
            {renderSteps}
        </div>
      </div>
    </section>
  );
}

export default Process;





















const steps = [
  {
    id: 1,
    number: <TbCircleNumber1Filled />,
    title: "Sourcing",
    para: "We carefully select fresh and high-quality ingredients directly from trusted farmers and suppliers.",
    icon: <PiPlantFill />,
  },
  {
    id: 2,
    number: <TbCircleNumber2Filled />,
    title: "Manufacturing",
    para: "Our products are processed using modern technology while maintaining hygiene and natural freshness.",
    icon: <PiFactory />,
  },
  {
    id: 3,
    number: <TbCircleNumber3Filled />,
    title: "Quality Control",
    para: "Each product goes through strict quality checks to ensure safety and top-notch standards.",
    icon: <SlBadge />,
  },
  {
    id: 4,
    number: <TbCircleNumber4Filled />,
    title: "Logistics",
    para: "We deliver products efficiently and on time, maintaining freshness from our warehouse to your doorstep.",
    icon: <TbTruckDelivery />,
  },
];



