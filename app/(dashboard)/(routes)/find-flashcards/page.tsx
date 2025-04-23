import { Heading } from "@/components/heading";
import { Search } from "lucide-react";

const FindFlashcardsPage = () => {
    return (
        <div>
            <Heading
                title="Find Flashcards"
                description="Find flashcards for your favorite topics"
                icon={Search}
                iconColor="text-blue-500"
                bgColor="bg-blue-500/10"
            />
            <p className="text-sm text-muted-foreground px-4 lg:px-8">
                Will be limited to one Spanish deck that will soon be released below but more decks, languages, and topics coming soon as well!
            </p>
        </div>
    )
}

export default FindFlashcardsPage;