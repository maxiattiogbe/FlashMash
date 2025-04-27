"use client";

import { useAuth } from "@clerk/nextjs";
import Typewriter from "react-ts-typewriter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const LandingHero = () => {
    const {isSignedIn} = useAuth();

    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>Interactive Digital Flashcards Featuring</h1>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4169e1] to-[#89CFF0]">
                    <Typewriter
                        text={["Speech Controls", "Gesture Controls", "Adaptive Difficulty"]}
                        loop={true}
                        cursor={true}
                        speed={100}
                    />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Fun with flashcards reimagined
            </div>
            <div>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                    <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                        Start Studying
                    </Button>
                </Link>
            </div>
            {/* <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No credit card required
            </div> */}
            
        </div>
    )
}