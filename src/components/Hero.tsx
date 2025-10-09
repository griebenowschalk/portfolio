"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";
import { socialLinks } from "@/data/social-links";
import { useState } from "react";

const Hero = () => {
  const [windowOffset, setWindowOffset] = useState({
    innerWidth: 0,
    innerHeight: 0,
  });
  const [mouseMove, setMouseMove] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const xCoordinate = useMotionValue(0);
  const yCoordinate = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    xCoordinate.set(event.clientX);
    yCoordinate.set(event.clientY);
  };

  const handleMouseEnter = () => {
    setWindowOffset({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    });
    setMouseMove(true);
  };

  const handleMouseLeave = () => {
    setWindowOffset({
      innerWidth: 0,
      innerHeight: 0,
    });
    setMouseMove(false);
  };

  const { innerWidth, innerHeight } = windowOffset;

  const rotateYSpring = useSpring(yCoordinate, {
    damping: 10,
    stiffness: 100,
  });
  const rotateXSpring = useSpring(xCoordinate, {
    damping: 10,
    stiffness: 100,
  });

  const rotateY = useTransform(rotateXSpring, [0, innerWidth], [-30, 30]);
  const rotateX = useTransform(rotateYSpring, [0, innerHeight], [10, -50]);

  return (
    <div
      className="h-screen grid place-items-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-col gap-4 items-center justify-center gap-y-3 font-semibold capitalize">
          <motion.div
            className="flex flex-col items-center justify-center gap-y-3 transition-transform duration-100 ease-in-out"
            style={{
              rotateY: mouseMove ? rotateY : 0,
              rotateX: mouseMove ? rotateX : 0,
            }}
          >
            <Image
              src="/person.png"
              alt="Person"
              width={400}
              height={400}
              priority
              className="h-auto w-[150px]"
            />
            <motion.span
              className="absolute text-4xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{
                opacity: buttonHover ? 0 : 1,
                scale: buttonHover ? 2 : 0,
                y: buttonHover ? -40 : 0,
              }}
              transition={{
                opacity: { delay: 0.4 },
              }}
            >
              Hi
            </motion.span>
          </motion.div>
          <h1 className="text-center text-3xl font-bold tracking-wider text-foreground sm:text-2xl">
            My name is Schalk Griebenow
          </h1>
          <p className="text-lg text-center tracking-wider text-muted-foreground">
            I am a software engineer
          </p>
        </div>
        <div className="flex gap-5 items-center justify-center sm:text-2xl">
          {socialLinks.map((iconData) => {
            return (
              <a
                href={iconData.href}
                key={iconData.name}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 rounded-sm text-2xl transition-all duration-200 text-primary hover:bg-primary 
                  hover:text-primary-foreground dark:hover:bg-primary/30 focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                  focus-visible:ring-offset-background hover:scale-110`}
              >
                <i className={`${iconData.iconClass}`}></i>
              </a>
            );
          })}
        </div>
        <Button
          className="mx-auto block w-max px-3 py-1 bg-primary 
          text-primary-foreground tracking-wider capitalize hover:bg-primary/80 transition-colors cursor-pointer"
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {buttonHover ? "Talk to me" : "Talk to me"}
        </Button>
      </div>
    </div>
  );
};

export default Hero;
