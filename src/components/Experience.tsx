"use client";

// import { motion } from "framer-motion";

import Heading from "./common/Heading";
import Container from "./common/Container";
import Image from "next/image";
import ExperienceCard from "./common/ExperienceCard";
import { experience } from "@/data/experience";
import { Fragment, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 95%", "end end"],
  });

  const scrollY = useSpring(scrollYProgress, { stiffness: 200, damping: 20 });
  return (
    <Container className="relative">
      <Heading title="Experience & Education" />
      <div className="relative w-full py-5 md:py-10">
        {/* Center line */}
        <motion.div
          initial={{ scaleY: 0 }}
          style={{ scaleY: scrollY }}
          className="hidden origin-top md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-card-foreground rounded-full"
        />

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-x-8 items-start"
        >
          {experience.map((item, idx) => (
            <Fragment key={`${item.year}-${idx}`}>
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
                className="w-full max-w-xl justify-self-center md:justify-self-end"
              >
                {idx % 2 === 0 ? (
                  <ExperienceCard {...item} />
                ) : (
                  <div className="hidden md:block" />
                )}
              </motion.div>
              {/* Center Column */}
              <div className="hidden md:flex relative items-center justify-center">
                <div className="relative z-20 w-14 aspect-square rounded-full border border-primary bg-card grid place-items-center text-primary font-light shadow-sm">
                  {item.year}
                </div>
                <div
                  className={`absolute z-10 w-6 h-6 rounded-full grid place-items-center text-primary ${
                    idx % 2 === 0 ? "-left-7" : "-right-7"
                  }`}
                  aria-hidden="true"
                >
                  <span className="block scale-[1.5]">
                    <i
                      className={
                        idx % 2 === 0
                          ? "ri-arrow-right-s-fill"
                          : "ri-arrow-left-s-fill"
                      }
                    ></i>
                  </span>
                </div>
              </div>
              {/* Right Column */}
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
                className="w-full max-w-xl justify-self-center md:justify-self-start"
              >
                {idx % 2 !== 0 ? (
                  <ExperienceCard {...item} />
                ) : (
                  <div className="hidden md:block" />
                )}
              </motion.div>
            </Fragment>
          ))}
        </div>

        <div className="hidden lg:block lg:justify-self-start absolute right-10 -top-32">
          <Image
            src="/education.png"
            alt="Education"
            width={400}
            height={400}
            className="opacity-70"
          />
        </div>
      </div>
    </Container>
  );
};

export default Experience;
