import { Search } from "lucide-react";
import path from "path";

import { Heading } from "@/components/heading";
import { loadCsvDeck } from "@/lib/loadCsvDeck";
import CardPair from "@/components/card-pair";

const FindFlashcardsPage = () => {
    const filePath = path.join(process.cwd(), "decks/flashmash_decks/spanish/medium/spanish_words_medium.csv");
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
                Currently limited to the one Spanish deck below but more decks, languages, and topics coming soon!
            </p>
            <br />
            <h1 className="text-2xl font-bold mb-6 px-4 lg:px-8">Directions:</h1>
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Click <strong>Enable Webcam</strong> to turn on your webcam and enable gesture controls. 
               This will allow you to use an open hand stop gesture to your webcam to stop the flashcards
               when you see the English definition on the right that you think matches the Spanish word on the left.
            </p>
            <br />
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Click <strong>Enable Microphone</strong> to turn on your microphone and enable voice controls. 
               This will allow you to use your voice to stop the flashcards when you to stop the flashcards 
               by saying &quot;Stop&quot; when you see the English definition on the right that you think matches the Spanish word on the left.
            </p>
            <br />
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Lastly, clicking the <strong>Stop</strong> button will also stop the flashcards.
            </p>
            <br />
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Click <strong>Next</strong> to see the next card or <strong>See Results</strong> when you&apos;ve answered all the cards.
            </p>
            <br />
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               <strong>Note:</strong> The flashcards will speed up or slow down based on your performance, speeding up ~1.22x every 3 cards answered correctly and slowing down 1.5x every 2 cards answered incorrectly.
            </p>
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-6">General Spanish Words (Difficulty: Medium)</h1>
                <CardPair words={words} />
            </div>
        </div>
    )
}

export default FindFlashcardsPage;