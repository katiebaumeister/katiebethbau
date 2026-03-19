import Image from "next/image";
import kb2 from "../flowers/KB-2.png";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-4xl px-6 py-1 text-center sm:py-2">
        <div className="mx-auto w-full max-w-[420px] overflow-hidden">
          <Image
            src={kb2}
            alt="Katie Beth"
            className="mx-auto h-auto w-full object-contain"
            style={{ clipPath: "inset(18% 0 18% 0)" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
