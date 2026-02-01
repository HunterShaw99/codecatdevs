'use client';

import {Navigation} from '@/app/components/Navigation';
import {Section} from '@/app/components/Section';
import {Card} from '@/app/components/Card';
import {ValueItem} from '@/app/components/ValueItem';
import {SolutionCard} from '@/app/components/SolutionCard';
import {Button} from '@/app/components/Button';
import {ContactModal} from '@/app/components/ContactModal';
import CodeCatLine from '@/app/components/icons/CodeCatLine';
import CardMap from './components/map/Map';
import { LightningBoltIcon, GearIcon, MixerHorizontalIcon, EyeOpenIcon, UpdateIcon, StarIcon, LockClosedIcon, MagicWandIcon, PersonIcon } from "@radix-ui/react-icons"

export default function HomePage() {
    const navigationItems = [
        {label: 'About', href: '#about'},
        {label: 'Mission & Vision', href: '#mission-vision'},
        {label: 'Cat Map Demo App', href: '#catmap'},
        {label: 'Our Solutions', href: '#solutions'},
        {label: 'Values', href: '#values'},
        {label: 'Contact', href: '#contact'},
    ];

    const coreValues = [
        {
            title: 'Innovation',
            description: 'We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.',
            icon: <MagicWandIcon className={'h-4 w-4'}/>,
            iconColor: 'text-yellow',
            iconBgColor: 'bg-yellow/10'
        },
        {
            title: 'Collaboration',
            description: 'We believe in the power of teamwork and building strong partnerships with our clients.',
            icon: <PersonIcon className={'h-4 w-4'}/>,
            iconColor: 'text-green',
            iconBgColor: 'bg-green/10'
        },
        {
            title: 'Integrity',
            description: 'We operate with transparency, honesty, and ethical practices in everything we do.',
            icon: <LockClosedIcon className={'h-4 w-4'}/>,
            iconColor: 'text-red',
            iconBgColor: 'bg-red/10'
        },
        {
            title: 'Excellence',
            description: 'We strive for perfection in every project and relationship, continuously improving ourselves and our processes as we go.',
            icon: <StarIcon className={'h-4 w-4'}/>,
            iconColor: 'text-blue',
            iconBgColor: 'bg-blue/10'
        }
    ];

    const solutions = [
        {
            title: 'Fast Performance',
            description: 'Efficiency is at the core of our solutions. We optimize for speed and performance, ensuring your websites are snappy and responsive, your services process quickly and return outputs in a timely manner, and you\'re free to get back to what matters most to you.',
            variant: 'solution' as const,
            icon: <LightningBoltIcon className={'w-6 h-6'}/>,
            iconBgColor: 'bg-blue/20',
            iconColor: 'text-blue'
        },
        {
            title: 'No Maintenance',
            description: 'We handle the heavy (and light) lifting, managing the code base and hosting details so you can focus on your business. But, if you\'d rather own the output product than consume it as a service, we provide options for that as well.',
            variant: 'solution' as const,
            icon: <GearIcon className={'w-6 h-6'}/>,
            iconBgColor: 'bg-green/20',
            iconColor: 'text-green'
        },
        {
            title: 'Flexible Development',
            description: 'Our focus is making sure you\'re comfortable with and included in our process as much as you want to be. Whether through an agile approach, with iterative and flexible cycling, or an agreed upon deliverable up front, we\'re happy to work with you - however works best for you!',
            variant: 'solution' as const,
            icon: <MixerHorizontalIcon className={'w-6 h-6'}/>,
            iconBgColor: 'bg-mauve/20',
            iconColor: 'text-mauve'
        },
        {
            title: 'Continuous Support',
            description: 'We\'re here to help you every step of the way, from initial setup to ongoing support and enhancements. Have a question? Need help with something? We\'re just a message away.',
            variant: 'solution' as const,
            icon: <UpdateIcon className={'w-6 h-6'}/>,
            iconBgColor: 'bg-sky/20',
            iconColor: 'text-sky'
        }
    ];

    return (
        <div className="w-full justify-center items-center">
            <div className='nav-backdrop'></div>

            {/* Navigation Headers - Full width */}
            <Navigation items={navigationItems} title={'Code Cat Developers LLC'}/>

            {/* Page content with consistent width for all sections */}
            <div className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <div className="space-y-12 py-8">

                        {/* About Section */}
                        <Section id="about">
                            <div className="flex flex-col items-center justify-center relative">
                                <CodeCatLine
                                    width={350}
                                    height={350}
                                    className="absolute opacity-20 rounded-lg pointer-events-none dark:invert"
                                    fill="--ctp-crust"
                                />
                                <div className="text-center mb-8 z-10">
                                    <h2 className="heading-section">About Our Company</h2>
                                    <p className="text-description max-w-4xl mx-auto text-text">
                                        We're Code Cat Developers, a partnership with over a decade of experience in GIS 
                                        and Software engineering. <br/>
                                        <br/>
                                        
                                        A few things about us:
                                        First and foremost, we love solving problems. Whether it's a complex technical
                                        challenge or a simple task that can be automated,
                                        we get a kick out of finding solutions that make life easier and more efficient.
                                        Secondly, we love working with people.
                                        Building strong relationships with our clients and colleagues has always been
                                        the key to our success, and we enjoy collaborating
                                        to achieve shared wins.
                                        Finally, we love learning. The tech world is constantly evolving, and we thrive
                                        on staying up-to-date with the
                                        latest trends and technologies, bringing only the best to the table 
                                        and filtering out the noise.<br/>
                                        <br/>

                                        Pittsburgh-based and proud, we know what it's like to start out small. Our
                                        partnership is so strong because we both have
                                        the shared experience of being the little guy, both from small towns, both
                                        first-generation college students figuring it all out as we went.
                                        We understand the challenges that come with growing, and how rewarding it is
                                        after the fact to look back on how far you've come. Pittsburgh
                                        makes a lot of sense as a home base in that regard - it's a city on the rise,
                                        with a thriving tech scene and a strong sense of community, one
                                        that's changed and morphed over the years to become something new.<br/>
                                        <br/>

                                        We love our 3 C's: Code, Cats, and Coffee. With a good
                                        frsh cup of coffee (or espresso), one of our furry friends
                                        napping nearby, and some good tunes in the background, we're in our element.
                                        It's our not-so-secret weapon for staying focused and productive,
                                        delivering the best possible results for you.<br/>
                                        <br/>

                                        We're happy to chat about any problems you're experiencing, and find a path
                                        forward, no overhead, no cattiness.
                                        We leave that to the actual cats in our lives!
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* Mission & Vision Section */}
                        <Section id="mission-vision">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <div className="flex items-center mb-4">
                                        <div className="icon-container bg-teal/20">
                                            <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                            </svg>
                                        </div>
                                        <h2 className="heading-subsection text-teal">Our Mission</h2>
                                    </div>
                                    <p className="text-subtext1">
                                        We believe in the combined power of technology and human ingenuity to solve
                                        problems and empower businesses, allowing the people behind those businesses to thrive and 
                                        their unique ideas to flourish. Our mission is to work with you to find those solutions,
                                        leveraging our shared experience and expertise to create tools that make your
                                        life easier, your business more efficient, and your goals more attainable.
                                    </p>
                                </Card>

                                <Card>
                                    <div className="flex items-center mb-4">
                                        <div className="icon-container bg-sky/20">
                                            <EyeOpenIcon className={'h-6 w-6 text-sky'}/>
                                        </div>
                                        <h2 className="heading-subsection text-sky">Our Vision</h2>
                                    </div>
                                    <p className="text-subtext1">
                                        We want to be a catalyst for the small to become the large, the scary and
                                        unattainable to become the manageable and achievable.
                                        By providing accessible, affordable, and effective technology solutions, we aim
                                        to empower businesses of all sizes to compete and succeed in an increasingly
                                        digital world.
                                        We envision a future where technology is a tool for growth and innovation, not a
                                        barrier to entry.
                                    </p>
                                </Card>
                            </div>
                        </Section>

                        {/* Solutions Section */}
                        <Section id="catmap">
                            <div className='m-6 flex flex-col items-center justify-center text-center'>
                                    <h2 className="heading-section">
                                        Cat Map - Demo Spatial Analytics Product
                                    </h2>
                                    <p className="text-subtext1 mb-6 text-center max-w-4xl mx-auto">
                                        We believe in show, don't tell, so here are a few workflows you can experience in our app:
                                    </p>
                                        <Card className='w-200 mb-6'>
                                            <ul className="list-disc list-inside mb-1 text-subtext1 text-center max-w-4xl mx-auto">
                                                <li>Create layers to house your data, and upload points from a spreadsheet.</li>
                                            </ul>
                                            <video autoPlay loop muted>
                                                <source src="upload_clean.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </Card>
                                        <Card className='w-200 mb-6'>
                                            <ul className="list-disc list-inside mb-1 text-subtext1 text-center max-w-4xl mx-auto">
                                                <li>Add Layers, click to add points on the map, and perform spatial analysis.</li>
                                            </ul>
                                            <video autoPlay loop muted>
                                                <source src="search_rings_clean.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </Card>
                                        <Card className='w-200 mb-6'>
                                            <ul className="list-disc list-inside mb-1 text-subtext1 text-center max-w-4xl mx-auto">
                                                <li>Change your basemap, and route points within a layer.</li>
                                            </ul>
                                            <video autoPlay loop muted>
                                                <source src="routing_clean.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </Card>
                                        <Card className='w-200 mb-6'>
                                            <ul className="list-disc list-inside mb-1 text-subtext1 text-center max-w-4xl mx-auto">
                                                <li>Measure distances on the map using the measure tool.</li>
                                            </ul>
                                            <video autoPlay loop muted>
                                                <source src="measure_clean.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </Card>

                                    <div className="m-4 flex-col items-center justify-center text-center">
                                            <h2 className='heading-subsection m-2'>
                                                Ready to check it out for yourself? Click the button below to open Cat Map in a new tab.
                                            </h2>
                                            <Button variant="app-launcher" onClick={() => window.open('/catmap', '_blank', 'noopener,noreferrer')}>
                                                Launch the Cat Map Application
                                            </Button>
                                    </div>
                            </div>
                        </Section>

                        <Section id="solutions">
                            <div>
                                <h2 className="heading-section">Our Solutions</h2>
                                <p className="text-subtext1 mb-6 text-center max-w-4xl mx-auto">
                                    From a simple landing page for your blossoming business to a custom-built full-stack GIS Application
                                    to manage assets or visualize data, we can handle those and everything in between. We focus on:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {solutions.map((solution, index) => (
                                        <SolutionCard
                                            key={index}
                                            icon={solution.icon}
                                            title={solution.title}
                                            description={solution.description}
                                            iconBgColor={solution.iconBgColor}
                                            iconColor={solution.iconColor}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Values Section */}
                        <Section id="values">
                            <div>
                                <div className="section-spacing">
                                    <h2 className="heading-section">Our Core Values</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {coreValues.map((value, index) => (
                                            <ValueItem
                                                key={index}
                                                icon={value.icon}
                                                title={value.title}
                                                description={value.description}
                                                iconColor={value.iconColor}
                                                iconBgColor={value.iconBgColor}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Contact CTA */}
                        <Section id="contact">
                            <div className="gradient-cta">
                                <h2 className="text-2xl font-bold text-mantle mb-4">Ready to Work Together?</h2>
                                <p className="text-base mb-6 max-w-3xl mx-auto">
                                    Click the button below and fill out our contact form. We'll get back to you as soon
                                     as possible to discuss your needs and how we can help. Looking forward to hearing from you!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <ContactModal
                                        trigger={<Button variant="primary">Get In Touch</Button>}
                                    />
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}