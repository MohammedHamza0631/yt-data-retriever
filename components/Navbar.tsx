"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/"
        });
    };

    const handleBack = () => {
        router.back();
    };

    if (status === "loading") {
        // return a loading skeleton for the navbar
        return (
            <nav className="bg-background/80 backdrop-blur-md shadow-md p-4 fixed w-full top-0 z-10">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="flex items-center gap-2 text-xl font-bold text-primary">
                        <Image src="/logo.png" width={50} height={10} alt="Logo" />
                        YT Data Retriever
                    </h1>
                </div>
            </nav>
        );
    }

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
                        className="flex items-center gap-2 text-xl font-bold text-primary"
                    >
                        <Image src="/logo.png" width={50} height={10} alt="Logo" />
                        YT Data Retriever
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
                    
                    <Link href="/channel">
                        <Button variant="ghost">Search by Channel</Button>
                    </Link>
                    <Button variant="outline" onClick={handleSignOut}>
                        Logout
                    </Button>
                    {session?.user && (
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Avatar>
                                <AvatarImage
                                    src={session.user.image || ""}
                                    alt={`${session.user.name}'s Avatar`}
                                />
                                <AvatarFallback>
                                    {session.user.name?.[0]?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
                    )}
                </div>
                <div className="flex md:hidden items-center gap-4">
                    
                    <button
                        className="md:hidden text-primary"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
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
                                    onClick={() => {
                                        handleBack();
                                        setMenuOpen(false);
                                    }}
                                >
                                    Back
                                </Button>
                            )}
                            <Link href="/channel">
                                <Button variant="ghost">Search by Channel</Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    handleSignOut();
                                    setMenuOpen(false);
                                }}
                            >
                                Logout
                            </Button>
                            {session?.user && (
                                <div className="flex items-center gap-2 p-2">
                                    <Avatar>
                                        <AvatarImage
                                            src={session.user.image || ""}
                                            alt={`${session.user.name}'s Avatar`}
                                        />
                                        <AvatarFallback>
                                            {session.user.name?.[0]?.toUpperCase() || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                        {session.user.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}