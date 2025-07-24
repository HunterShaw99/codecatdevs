import React from 'react';
import Image from 'next/image';

const About = () => {
    return (
        <div className="relative flex flex-col gap-[16px] justify-center items-center">
            <Image
                src="/code_cat_fill.svg"
                alt="Background Image"
                fill
                style={{ zIndex: -1, opacity: 0.30 }}
                className="absolute rounded-lg pointer-events-none"
            />
            <p className="text-2xl text-center w-lg">
                Code, Coffee, and Cats.
            </p>
            <p className="text-lg text-center w-lg">
                That, and effective and simple web solutions, is what we love.
                Pittsburgh-based and proud, we strive to offer the best possible service
                we can in development to your needs, from creating a landing page for
                your newly created business that matches your personal vibes, to engineering
                a solution for that monotonous, repeatable task that’s driving you wild.
                Spreadsheet data entry and data crunching, generation of tailored PDF reports,
                we’re happy to chat about any problems you’re experiencing, and see if we can’t
                help you find an easy fix, no overhead, no cattiness. We leave that to the actual
                cats in our lives!
            </p>
        </div>
    );
}

export default About;
