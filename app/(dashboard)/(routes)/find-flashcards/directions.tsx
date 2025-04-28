"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export const Directions = () => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="px-4 lg:px-8"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Directions:</h1>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="sr-only">Toggle directions</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4">
                <p className="text-md text-muted-foreground">
                    Click <strong>Start Webcam</strong> to turn on your webcam and enable gesture controls. 
                    This will allow you to use an open hand stop gesture to your webcam to stop the flashcards
                    when you see the English definition on the right that you think matches the Spanish word on the left.
                </p>
                <p className="text-md text-muted-foreground">
                    OR
                </p>
                <p className="text-md text-muted-foreground">
                    Click <strong>Start Microphone</strong> to turn on your microphone and enable voice controls. 
                    This will allow you to use your voice to stop the flashcards when you to stop the flashcards 
                    by saying &quot;Stop&quot; when you see the English definition on the right that you think matches the Spanish word on the left.
                </p>
                <p className="text-md text-muted-foreground">
                    OR
                </p>
                <p className="text-md text-muted-foreground">
                    Clicking the <strong>Stop</strong> button is currently the most reliable way to stop the flashcards.
                </p>
                <p className="text-md text-muted-foreground">
                    <strong>Note:</strong> The flashcards will speed up or slow down based on your performance, speeding up 1.5x every 3 cards answered correctly and slowing down 1.5x every 2 cards answered incorrectly.
                </p>
            </CollapsibleContent>
        </Collapsible>
    );
};