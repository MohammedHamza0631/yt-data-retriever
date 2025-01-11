"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md p-4 fixed w-full top-0 z-10">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/dashboard">
                    <h1 className="text-xl font-bold text-purple-700">YouTube Retriever</h1>
                </Link>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost">Home</Button>
                    </Link>
                    {pathname.includes("/dashboard/") && (
                        <Button variant="ghost" onClick={() => history.back()}>
                            Back
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                        Logout
                    </Button>
                    {session && (
                        <Avatar>
                            <AvatarImage src={session.user?.image || ""} alt="User Avatar" />
                            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                    )}
                </div>

                <button
                    className="md:hidden text-purple-700"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="flex flex-col mt-4 md:hidden">
                    <Link href="/dashboard">
                        <Button variant="ghost" onClick={() => setMenuOpen(false)}>
                            Home
                        </Button>
                    </Link>
                    {pathname.includes("/dashboard/") && (
                        <Button variant="ghost" onClick={() => history.back()}>
                            Back
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setMenuOpen(false);
                        }}
                    >
                        Logout
                    </Button>
                    {session && (
                        <div className="flex items-center mt-2">
                            <Avatar>
                                <AvatarImage src={session.user?.image || ""} alt="User Avatar" />
                                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="ml-2">{session.user?.name}</span>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
