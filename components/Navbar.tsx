"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./Themetoggle";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background/80 backdrop-blur-md shadow-md p-4 fixed w-full top-0 z-10"
        >
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/dashboard">
                    <motion.h1
                        whileHover={{ scale: 1.05 }}
                        className="text-xl font-bold text-primary"
                    >
                        YouTube Retriever
                    </motion.h1>
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
                    <ThemeToggle />
                    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                        Logout
                    </Button>
                    {session && (
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Avatar>
                                <AvatarImage src={session.user?.image || ""} alt="User Avatar" />
                                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </motion.div>
                    )}
                </div>

                <button
                    className="md:hidden text-primary"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden"
                    >
                        <div className="flex flex-col gap-2 mt-4 p-4 bg-background/90 backdrop-blur-md rounded-lg">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Home
                                </Button>
                            </Link>
                            {pathname.includes("/dashboard/") && (
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => history.back()}
                                >
                                    Back
                                </Button>
                            )}
                            <ThemeToggle />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    signOut({ callbackUrl: "/" });
                                    setMenuOpen(false);
                                }}
                            >
                                Logout
                            </Button>
                            {session && (
                                <div className="flex items-center gap-2 p-2">
                                    <Avatar>
                                        <AvatarImage
                                            src={session.user?.image || ""}
                                            alt="User Avatar"
                                        />
                                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{session.user?.name}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}