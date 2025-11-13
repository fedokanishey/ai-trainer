"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ModalForm from "./ui/inf_form";


const NavBar = () =>
{
  const {isSignedIn} = useUser();
  const router = useRouter();
  const [openForm, setOpenForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFormSubmit = (data: unknown) => {
    // Convert form data to URL query parameters
    const params = new URLSearchParams();
    const formData = data as Record<string, string>;
    Object.entries(formData).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    // Navigate to generate-program page with form data as query params
    router.push(`/generate-program?${params.toString()}`);
    setOpenForm(false);
  };
  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3'>
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono  sm:inline">
            AI<span className="text-primary">Trainer</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          { isSignedIn ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>

              <button
                onClick={() => setOpenForm(true)}
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </button>

              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
              
              <UserButton />
            </> ) : (
            <>
              <SignInButton>
                <Button
                  variant={"outline"}
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </> ) }
        </nav>

        {/* Mobile Menu Button */}
        {/* Mobile Menu Button + UserButton side by side */}
<div className="md:hidden flex items-center gap-3">
  {/* زر المينيو */}
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="p-2 hover:bg-primary/10 rounded transition-colors"
    aria-label="Toggle menu"
  >
    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
  </button>

  {/* الأفاتار */}
  <UserButton
    afterSignOutUrl="/"
    appearance={{
      elements: {
        avatarBox: "w-10 h-10",
      },
    }}
  />
</div>

      </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && isSignedIn && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border py-4">
          <div className="container mx-auto px-4 flex flex-col gap-3 pt-15">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon size={16} />
              <span>Home</span>
            </Link>

            <button
              onClick={() => {
                setOpenForm(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer py-2"
            >
              <DumbbellIcon size={16} />
              <span>Generate</span>
            </button>
            <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
          </div>
        </div>
      )}

      {/* Mobile Auth Menu */}
      {mobileMenuOpen && !isSignedIn && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border py-4">
          <div className="container mx-auto px-4 flex flex-col gap-3 pt-15">
            <SignInButton>
              <Button
                variant={"outline"}
                className="w-full border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </div>
      )}
      
      <ModalForm 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        onSubmit={handleFormSubmit} 
      />
    </>
  )
}

export default NavBar
