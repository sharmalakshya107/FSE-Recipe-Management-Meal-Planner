import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/Button";
import { ROUTES } from "../../../config/routes";

export const SharedPromotionalCard = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center relative overflow-hidden group">
      <div className="relative z-10">
        <h4 className="text-xl font-black mb-3 italic">Love this recipe?</h4>
        <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
          Join our community to save this recipe to your notebook and start meal
          planning today.
        </p>
        <Link to={ROUTES.REGISTER}>
          <Button className="w-full bg-white text-indigo-600 hover:bg-gray-50 border-none rounded-2xl h-14 font-black transition-transform group-hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-xs">
            Get Started Free <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="inline-block mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
        >
          Already a member? Sign In
        </Link>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full -translate-x-12 translate-y-12 blur-3xl" />
    </div>
  );
};
