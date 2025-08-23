import { InfiniteSlider } from "@/components/motion-primites/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primites/progressive-blur";
import Image from "next/image";

const images = [
  {
    src: "/logo/docker.svg",
    alt: "docker",
  },
  {
    src: "/logo/nextjs.svg",
    alt: "Next.js",
  },
  {
    src: "/logo/ethereum.svg",
    alt: "Ethereum",
  },
  {
    src: "/logo/mongodb.svg",
    alt: "MongoDB",
  },
  {
    src: "/logo/gemini.svg",
    alt: "Gemini",
  },
  {
    src: "/logo/vultr.svg",
    alt: "Vultr",
  },
];

export default function LogoCloud() {
  return (
    <section className="overflow-hidden py-20 bg-[#070E02]">
      <div className="group relative mx-auto max-w-screen-2xl flex flex-col items-center gap-4 px-6">
        <h1 className="text-white font-clash">// &nbsp; technologies used to built &nbsp; //</h1>
        <div className="relative py-6 w-full">
          <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
            {images.map((image, index) => (
              <div key={index} className="flex">
                <Image
                  className="mx-auto h-9 w-fit"
                  src={image.src}
                  alt={image.alt}
                  height={50}
                  width={50}
                />
              </div>
            ))}
          </InfiniteSlider>

          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#070E02] via-[#070E02]/80 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#070E02] via-[#070E02]/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
