import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

const reviews = [
  {
    name: "Jack",
    position: "CEO, Company",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    position: "CTO, Company",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    position: "SDE, Company",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    position: "SDE-2, Company",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    position: "SDE-1, Companyy",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    position: "LEAD, Companys",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  position,
  body,
}: {
  img: string;
  name: string;
  position: string;
  body: string;
}) => {
  return (
    <div className="h-full w-80 cursor-pointer border border-light/30">
      <div className="p-4 border border-light/30 border-b">
        <p className="font-syne text-white">"{body}"</p>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2 p-4">
          <Image
            className="rounded-full"
            width="32"
            height="32"
            alt=""
            src={img}
          />
          <div className="flex flex-col">
            <figcaption className="text-lg font-medium text-white">
              {name}
            </figcaption>
            <p className="font-medium text-white/60">{position}</p>
          </div>
        </div>
        <div className="border border-light/30 border-l p-4 flex items-center justify-center">
          <Image src={"/x.svg"} alt="x" height={30} width={30} />
        </div>
      </div>
    </div>
  );
};

export function Testimonials() {
  return (
    <div className="relative flex w-full max-w-screen-2xl mx-auto flex-col items-center justify-center overflow-hidden px-5 md:px-14 mt-20">
        <div className="relative flex items-center justify-center">
        <h1 className="text-5xl font-semibold font-syne mb-5 bg-gradient-to-r from-[#7FEE64] to-[#FFEA71] bg-clip-text text-transparent lowercase">
          Trusted Voices at Credora
        </h1>
      </div>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.position} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.position} {...review} />
        ))}
      </Marquee>
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-72 bg-gradient-to-r from-[#070E02] via-[#070E02]/90 to-transparent z-10" />

      {/* Right smoke effect */}
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-72 bg-gradient-to-l from-[#070E02] via-[#070E02]/90 to-transparent z-10" />
    </div>
  );
}
