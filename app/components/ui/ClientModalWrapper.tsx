"use client";
import { useState } from "react";
import { Button } from "./button";
import { ArrowRightIcon } from "lucide-react";
import ModalForm from "./inf_form";

export default function ClientModalWrapper() {
    const [open, setOpen] = useState(false);
    const handleSubmit = (data: unknown) => {
        console.log("Form submitted:", data);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="lg"
                className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                Build Your Program
                <ArrowRightIcon className="ml-2 size-5" />
            </Button>

        <ModalForm open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
        </>
    );
}
