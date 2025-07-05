'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoComponent from './LogoComponent';
import { DotPattern } from '@/components/ui/dot-pattern';

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-[#1A1A1A] text-white">
      <div className="absolute inset-0 -z-10">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:items-center lg:px-8 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
        >
          <LogoComponent />
          <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
            Save and revisit your favorite bookmarks with CSphere
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Never miss out on saving your content again. CSphere helps you
            organize your digital life, one bookmark at a time.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild>
              <Link href="/signup">
                Get started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#feature-section">
                View Demo <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none"
        >
          <div className="p-8 bg-white/5 rounded-2xl shadow-2xl">
            <Image
              src="/csphere-home.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="w-[76rem] rounded-md"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
