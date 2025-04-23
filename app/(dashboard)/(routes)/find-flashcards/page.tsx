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
            <p className="text-md text-black font-bold px-4 lg:px-8">
                <h1 className="text-2xl font-bold mb-6">Directions: </h1>
            </p>
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Click the <strong>stop</strong> button when you see the English definition on the right that you think matches the Spanish word on the left.
            </p>
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Click the <strong>reveal</strong> button to see the correct answer.
            </p>
            <p className="text-md text-muted-foreground px-4 lg:px-8">
               Click <strong>next</strong> to see the next card or see results when you&apos;ve answered all the cards.
            </p>
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-6">General Spanish Words (Difficulty: Medium)</h1>
                <CardPair words={words} />
            </div>
        </div>
    )
}

export default FindFlashcardsPage;