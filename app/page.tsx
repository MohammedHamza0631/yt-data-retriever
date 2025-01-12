"use client";

import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { Youtube, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const features = [
  { icon: CheckCircle2, text: "Access all your playlists in one place" },
  { icon: CheckCircle2, text: "Beautiful, organized interface" },
  { icon: CheckCircle2, text: "Quick video previews and management" }
];

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 flex min-h-screen items-center">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial="initial"
              animate="animate"
              className="space-y-8 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                {...fadeIn}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-sm text-red-600 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Your YouTube Playlists, Reimagined
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                {...fadeIn}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-400"
              >
                Manage YouTube Playlists with Ease
              </motion.h1>

              {/* Subheading */}
              <motion.p
                {...fadeIn}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                Transform how you organize and access your YouTube content. A beautiful, intuitive interface designed for playlist management.
              </motion.p>

              {/* Features */}
              <motion.div
                {...fadeIn}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 text-muted-foreground"
                  >
                    <feature.icon className="w-5 h-5 text-red-500" />
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                {...fadeIn}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  onClick={() => signIn("google")}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white shadow-lg group"
                >
                  <Youtube className="mr-2 h-5 w-5" />
                  Sign in with Google
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Decorative Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-300/10 rounded-3xl blur-2xl" />
                <div className="relative bg-card border rounded-3xl shadow-2xl p-8">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-red-600/90 to-rose-500/90 flex items-center justify-center">
                    <Youtube className="w-20 h-20 text-white" />
                  </div>
                  <div className="mt-6 space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-4 bg-muted/50 rounded-full" style={{ width: `${85 - i * 15}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}