import { Search } from "lucide-react";
import path from "path";

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
                Currently limited to the one Spanish deck below. Click <strong>Directions</strong> to expand
                the directions for the flashcards and click again to collapse them.
            </p>
            <Accordion type="single" collapsible>
                <AccordionItem value="directions">
                    <AccordionTrigger className="px-4 lg:px-8">
                        <h1 className="text-2xl font-bold mb-6">Directions</h1>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 lg:px-8">
                        <p className="text-lg text-muted-foreground">
                            In addition to using the <strong>Stop</strong> button, you can currently play FlashMash with <strong>either</strong> your <strong>webcam</strong> or <strong>microphone</strong> but <strong> not both at the same time</strong>.
                        </p>
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            Click <strong>Start Webcam</strong> to turn on your webcam and enable gesture controls. 
                            This will allow you to use an open hand stop gesture to your webcam to stop the flashcards
                            when you see the English definition on the right that you think matches the Spanish word on the left.
                            This works best when you spread out your fingers and place your hand in the center of the webcam frame.
                            Click <strong>Stop Webcam</strong> to turn off your webcam and disable gesture controls. At that point,
                            you can only play using the stop button for the rest of the game. Refresh the page to restart the game 
                            to be able to turn back on the webcame or to switch to microphone controls.
                        </p>
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            OR
                        </p>
                        <br />
                        <p className="text-lg text-muted-foreground">
                            Click <strong>Start Microphone</strong> to turn on your microphone and enable voice controls. 
                            This will allow you to use your voice to stop the flashcards when you to stop the flashcards 
                            by saying &quot;Stop&quot; when you see the English definition on the right that you think matches the Spanish word on the left.
                            Click <strong>Stop Microphone</strong> to turn off your microphone and disable voice controls. At that point,
                            you can only play using the stop button for the rest of the game. Refresh the page to restart the game 
                            to be able to turn back on the microphone or to switch to webcam controls.
                        </p>
                        <br/>
                        <p className="text-lg text-muted-foreground">
                            OR
                        </p>
                        <br />
                        <p className="text-lg text-muted-foreground">
                            Clicking the <strong>Stop</strong> button is currently the most reliable way to stop the flashcards and works with both webcam and microphone.
                        </p>
                        <br />
                        <p className="text-lg text-muted-foreground">
                            <strong>Note:</strong> The flashcards will speed up or slow down based on your performance, speeding up 1.5x every 3 cards answered correctly and slowing down 1.5x every 2 cards answered incorrectly.
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