"use client";

import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PincodeSelector({ scrolled }: { scrolled: boolean }) {
    const [pincode, setPincode] = useState<string>("Detecting...");
    const [isOpen, setIsOpen] = useState(false);
    const [inputVal, setInputVal] = useState("");

    useEffect(() => {
        // Load from localStorage or ask user
        const stored = localStorage.getItem("ddtec_pincode");
        if (stored) {
            setPincode(stored);
        } else {
            setPincode("Select Location");
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputVal.length === 6 && /^\d+$/.test(inputVal)) {
            localStorage.setItem("ddtec_pincode", inputVal);
            setPincode(inputVal);
            setIsOpen(false);
            window.dispatchEvent(new Event("pincode_changed")); // Notify Shop components to refetch
        } else {
            alert("Please enter a valid 6-digit Indian Pincode");
        }
    };

    return (
        <div className="relative ml-2 sm:ml-6 flex items-center">
            {/* Minimalist Location Display */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn("flex flex-col text-left group hover:opacity-80 transition-opacity", scrolled ? "text-slate-800 dark:text-slate-200" : "text-slate-800 dark:text-slate-200")}
            >
                <div className="flex items-center gap-1">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500">Delivery in 24 hrs</span>
                </div>
                <div className="flex items-center gap-1.5 -mt-0.5">
                    <span className="font-extrabold text-sm md:text-base leading-none">
                        {pincode !== "Select Location" ? `To: ${pincode}` : "Where to deliver?"}
                    </span>
                    <MapPin className="size-3.5 mt-0.5 text-teal-600 dark:text-teal-400 group-hover:animate-bounce" />
                </div>
            </button>

            {/* Selector Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 dark:text-white">Where should we deliver?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enter your pincode to check stock availability in your nearest Fulfillment Hub.</p>

                            <form onSubmit={handleSubmit} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="size-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit Pincode"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 font-bold text-lg dark:text-white outline-none"
                                />
                                <button type="submit" className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-teal-500/30">
                                    Confirm Location
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
