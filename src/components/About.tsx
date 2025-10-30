"use client";

import Achievements from "./common/Achievements";
import Heading from "./common/Heading";
import Image from "next/image";
import { aboutText, achievements } from "@/data/about-me";
import { Button } from "./ui/button";
import Container from "./common/Container";

const About = () => {
  return (
    <Container id="about">
      <Heading title="About Me" />
      <div className="w-full flex items-center justify-between md:justify-center">
        <Image
          src="/about-me.png"
          alt="About Me"
          width={400}
          height={400}
          className="hidden md:block w-[300px] lg:w-[200px]"
        />
        <div className="relative max-w-[800px] rounded-xl bg-card p-5 text-justify border border-accent">
          <span className="hidden md:block absolute -left-5 top-10 scale-[2.5] text-muted-foreground">
            <i className="ri-arrow-left-s-fill"></i>
          </span>
          {aboutText.map((text) => (
            <p
              key={text}
              className="text-lg font-medium text-muted-foreground lg:text-[16px] sm:text-[14px]"
            >
              {text}
            </p>
          ))}
          <Button asChild className="w-max flex items-center gap-2 mt-6">
            <a href="/CV.pdf" download={""}>
              <span>Download CV</span>
              <span>
                <i className="ri-download-line"></i>
              </span>
            </a>
          </Button>
        </div>
      </div>
      <div
        data-testid="achievements-container"
        className="w-full flex flex-wrap items-center justify-between gap-x-7 gap-y-10"
      >
        {achievements.map((achievement) => (
          <Achievements key={achievement.number} {...achievement} />
        ))}
      </div>
    </Container>
  );
};

export default About;
