import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="max-w-2xl mx-auto z-20 my-20">
      <div className="text-center mt-30">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
          Choose a <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Plan</span> 
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
          Select the perfect plan that fits your workflow. Start free and unlock
          powerful AI tools as you grow.
        </p>
      </div>

      <div className="mt-14 max-w-2xl flex justify-center items-center mx-auto">
        <PricingTable />
      </div>
    </div>
  );
};

export default Plan;
