"use client";

import { Menu} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
    Sheet, 
    SheetContent, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import Sidebar from "@/components/sidebar";

const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <VisuallyHidden>
                    <h2>Mobile Navigation Menu</h2>
                </VisuallyHidden>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}   

export default MobileSidebar;