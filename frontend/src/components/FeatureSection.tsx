'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { Bookmark, Globe, FolderTree } from "lucide-react";

const features = [
  {
    icon: <Bookmark className="h-5 w-5 text-black" />,
    title: "Save and organize your research",
    desc: "Collect articles, papers, and resources from across the web in one centralized location. Never lose track of important information again.",
    imageAlt: "Bookmark collection interface",
    imageSrc: "/csphere-chrome.mp4",
  },
  {
    icon: <Globe className="h-5 w-5 text-black" />,
    title: "Access your content anywhere",
    desc: "Seamlessly sync your saved content across all your devices. Your bookmarks are always available whether you're at home, work, or on the go.",
    imageAlt: "Cross-device synchronization",
    imageSrc: "/csphere-home.png",
  },
  {
    icon: <FolderTree className="h-5 w-5 text-black" />,
    title: "Organize with smart collections",
    desc: "Create custom collections and let our AI help categorize your content automatically. Find what you need when you need it with powerful search and filtering.",
    imageAlt: "Smart collections and organization",
    imageSrc: "/csphere-search.mp4",
  },
];

function TextBlock({ feature }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col justify-center space-y-6 max-w-xl mx-auto lg:mx-0"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          {feature.icon}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight !text-white">
          {feature.title}
        </h2>
      </div>
      <p className="text-lg md:text-xl leading-relaxed !text-white">
        {feature.desc}
      </p>
    </motion.div>
  );
}

function ImageBlock({ feature }) {
  const isVideo = feature.imageSrc.endsWith(".mp4");
  const isImage =
    feature.imageSrc.endsWith(".png") || feature.imageSrc.endsWith(".jpg");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center"
    >
      <div className="relative w-full max-w-[500px] h-auto">
        <div className="relative z-10 overflow-hidden rounded-lg bg-gray-900 p-6 shadow-sm">
          <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-700">
            {isVideo ? (
              <video
                className="w-fit h-fit object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={feature.imageSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : isImage ? (
              <Image
                src={`${feature.imageSrc}?height=800&width=800`}
                width={800}
                height={800}
                alt={feature.imageAlt}
                className="object-contain scroll-auto"
              />
            ) : (
              <div className="h-full w-full bg-gray-800 flex items-center justify-center text-white">
                Unsupported media type
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeatureSection() {
  return (
    <div className="w-full bg-[#202A29] text-white">
      <div className="text-center py-16">
        <p className="text-4xl md:text-5xl font-normal tracking-tight !text-white">
          Pronounced{" "}
          <span className="italic font-bold !text-white">see sphere</span>
        </p>
      </div>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <section
          key={index}
          className="w-full py-16 md:py-24 border-t border-gray-800"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {index === 1 ? (
                <>
                  <ImageBlock feature={feature} />
                  <TextBlock feature={feature} />
                </>
              ) : (
                <>
                  <TextBlock feature={feature} />
                  <ImageBlock feature={feature} />
                </>
              )}
            </div>
          </div>
        </section>
      ))}

      <div className="w-full py-16 text-center border-t border-gray-800 bg-black">
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 !text-white">
          Start saving with the Chrome extension
        </h3>
        <a
          href="https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-black font-semibold text-lg px-6 py-3 rounded-lg hover:bg-gray-200 transition"
        >
          Download
        </a>
      </div>
    </div>
  );
}
