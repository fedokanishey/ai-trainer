"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./button";
import { ArrowRightIcon } from "lucide-react";
import ModalForm from "./inf_form";

export default function ClientModalWrapper({ title }: { title: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { isSignedIn } = useAuth();

    const handleOpen = () => {
        if (!isSignedIn) {
            router.push("/sign-in");
            return;
        }
        setOpen(true);
    };
    const handleSubmit = (data: unknown) => {
        // Convert form data to URL query parameters
        const params = new URLSearchParams();
        const formData = data as Record<string, string>;
        Object.entries(formData).forEach(([key, value]) => {
            params.append(key, String(value));
        });
        // Navigate to generate-program page with form data as query params
        router.push(`/generate-program?${params.toString()}`);
        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                size="lg"
                className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                {title}
                <ArrowRightIcon className="ml-2 size-5" />
            </Button>

                {open && typeof document !== "undefined" ? createPortal(
                    <ModalForm open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />,
                    document.body
                ) : null}
        </>
    );
}
