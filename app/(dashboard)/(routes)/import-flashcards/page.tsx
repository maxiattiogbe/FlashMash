import { Heading } from "@/components/heading";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImportFlashcardsPage = () => {
    return (
        <div>
            <Heading
                title="Import Flashcards"
                description="Import flashcards from a CSV file"
                icon={Upload}
                iconColor="text-[#4169e1]"
                bgColor="bg-[#4169e1]/10"
            />
            <div className="px-4 lg:px-8">
                <p className="text-md text-muted-foreground mb-4">
                    Coming soon! (The buttons below don&apos;t do anything yet.)
                </p>
                <p className="text-md text-muted-foreground mb-4">
                    Upload a CSV file containing your flashcards. The file should have two columns - one for each side of the flashcard.
                </p>
                <div className="flex items-center gap-4">
                    <Button variant="outline">
                        Choose File
                    </Button>
                    <Button>
                        Upload
                    </Button>
                </div>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">CSV Format Requirements:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>File must be in CSV format</li>
                        <li>First row should contain column headers</li>
                        <li>Each row after represents one flashcard</li>
                        <li>Maximum file size: 5MB</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ImportFlashcardsPage;