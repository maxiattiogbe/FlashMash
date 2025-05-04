import { Search } from "lucide-react";
import path from "path";
import Image from "next/image";

import { Heading } from "@/components/heading";
import { loadCsvDeck } from "@/lib/loadCsvDeck";
import CardPair from "@/components/card-pair";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FindFlashcardsPage = () => {
    const filePath = path.join(process.cwd(), "decks/flashmash_decks/spanish/medium/spanish_medium_general.csv");
    const deck = loadCsvDeck(filePath); // [{ Spanish Word: "...", English Definition: "..." }]
    const words = deck.map((entry: { "Spanish Word": string; "English Definition": string }) => ({
        Spanish: entry["Spanish Word"],
        English: entry["English Definition"], 
    }));

    return (
        <div>
            <Heading
                title="Find Flashcards"
                description="Find flashcards for your favorite topics"
                icon={Search}
                iconColor="text-[#4169e1]"
                bgColor="bg-[#4169e1]/10"
            />
            <p className="text-md text-muted-foreground px-4 lg:px-8">
                Currently limited to the one Spanish deck below. 
                <br/>
                Please click <strong>Directions</strong> to expand and <strong>read the directions</strong> for
                the flashcards. Click <strong>Directions</strong> again to collapse the directions.
            </p>
            <Accordion type="single" collapsible>
                <AccordionItem value="directions">
                    <AccordionTrigger className="px-4 lg:px-8">
                        <h1 className="text-2xl font-bold mb-6">Directions</h1>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 lg:px-8">
                        <p className="text-lg text-muted-foreground">
                            In addition to using the <strong>Stop button</strong>, you can currently play FlashMash
                            with <strong>either</strong> your <strong>webcam</strong> or <strong>microphone</strong> but 
                            <strong> not both at the same time.</strong> After stopping either the webcam or the microphone,
                            you can only play using the <strong>Stop button</strong> for the rest of the 
                            game. <strong>Refresh the page</strong> to restart the game and to <strong>restart the webcam 
                            or the microphone</strong> or to <strong>switch between webcam and microphone controls.</strong>
                        </p>
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            When you see the <strong>English definition</strong> on the right that you think <strong>matches the Spanish word</strong> on the left,
                            you can <strong>stop the flashcards</strong> by:
                        </p>
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            using <strong>an open hand stop gesture</strong> to your <strong>webcam</strong>
                        </p>
                        <br/>
                        <Image src="/open-hand-stop.jpg" alt="Open Hand Stop Gesture" className="w-1/4 mx-auto" width={500} height={500} />
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            OR
                        </p>
                        <br />
                        <p className="text-lg text-muted-foreground">
                            saying <strong> &quot;Stop&quot;</strong> into your <strong>microphone</strong>
                        </p>
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            OR
                        </p>
                        <br />
                        <p className="text-lg text-muted-foreground">
                            clicking the <strong>Stop button.</strong>
                        </p>
                        <br />
                        <p className="text-lg text-muted-foreground">
                            <strong>Note:</strong> The flashcards will speed up or slow down based on your
                             performance, <strong>speeding up 1.5x every 3 cards answered correctly</strong> and <strong>slowing
                             down 1.5x every 2 cards answered incorrectly.</strong>
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-6">General Spanish Words (Difficulty: Medium)</h1>
                <CardPair words={words} />
            </div>
        </div>
    )
}

export default FindFlashcardsPage;