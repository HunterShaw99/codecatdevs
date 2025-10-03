import { Navigation } from '@/app/components/Navigation';
import { Section } from '@/app/components/Section';
import { Card } from '@/app/components/Card';
import { ValueItem } from '@/app/components/ValueItem';
import { SolutionCard } from '@/app/components/SolutionCard';
import { Button } from '@/app/components/Button';
import CodeCatLine from '@/app/components/icons/CodeCatLine';
import CardMap from './components/map/Map';

export default function HomePage() {
  const navigationItems = [
    { label: 'About', href: '#about' },
    { label: 'Mission & Vision', href: '#mission-vision' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Values', href: '#values' },
    { label: 'Contact', href: '#contact' }
  ];

  const coreValues = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      iconColor: 'text-yellow',
      iconBgColor: 'bg-yellow/10'
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and building strong partnerships with our clients.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconColor: 'text-green',
      iconBgColor: 'bg-green/10'
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and ethical practices in everything we do.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconColor: 'text-red',
      iconBgColor: 'bg-red/10'
    },
    {
      title: 'Excellence',
      description: 'We strive for perfection in every project and relationship, continuously improving ourselves and our processes as we go.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-blue',
      iconBgColor: 'bg-blue/10'
    }
  ];

  const solutions = [
    {
      title: 'Fast Performance',
      description: 'Effeciency is at the core of our solutions. We optimize for speed and performance, ensuring your websites are snappy and responsive, your services process quickly and return outputs in a timely manner, and you\'re free to get back to what matters most to you.',
      variant: 'solution' as const,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      iconBgColor: 'bg-blue/20',
      iconColor: 'text-blue'
    },
    {
      title: 'No Maintenance',
      description: 'We handle the heavy (and light) lifting, managing the code base and hosting so you can focus on your business. But, if you\'d rather own the output product than consume it as a service, we provide options for that as well.',
      variant: 'solution-green' as const,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBgColor: 'bg-green/20',
      iconColor: 'text-green'
    },
    {
      title: 'Flexible Development',
      description: 'Our focus is making sure you\'re comfortable with and included in our process as much as you want to be. Whether through an agile approach, with iterative and flexible cycling, or an agreed upon devirable up front, we\'re happy to work with you - however works best for you!',
      variant: 'solution-mauve' as const,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      iconBgColor: 'bg-mauve/20',
      iconColor: 'text-mauve'
    },
    {
      title: 'Continuous Support',
      description: 'We\'re here to help you every step of the way, from initial setup to ongoing support and enhancements. Have a question? Need help with something? We\'re just a message away.',
      variant: 'solution-sky' as const,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      iconBgColor: 'bg-sky/20',
      iconColor: 'text-sky'
    }
  ];

  return (
    <div className="w-full">
    <div className='gradient-backdrop'></div>

      {/* Navigation Headers - Full width */}
      <Navigation items={navigationItems} />

      {/* Page content with consistent width for all sections */}
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="space-y-12 py-8">
            <Card className="flex items-center justify-center">
            <h1 className="heading-main text-center">Code Cat Developers LLC</h1>
            </Card>

            {/* About Section */}
            <Section id="about">
              <Card className="flex flex-col items-center justify-center relative">
                <CodeCatLine
                  width={280}
                  height={280}
                  className="absolute opacity-25 rounded-lg pointer-events-none dark:invert"
                  fill="--ctp-crust"
                />
                <div className="text-center mb-8 z-10">
                  <h2 className="heading-section">About Our Company</h2>
                  <p className="text-description max-w-4xl mx-auto">
                    Code, coffee, and cats. With over a decade of experience, and our 3 C's fueling us, we're positive that we can deliver effective and simple web solutions for your everyday issues. Pittsburgh-based and proud, we strive to offer the best possible service in development to your needs, from creating a landing page for your newly created business that matches your personal vibes, to engineering a solution for that monotonous, repeatable task that's driving you wild. Spreadsheet data entry and data crunching, generation of tailored PDF reports, we're happy to chat about any problems you're experiencing, and find a path forward, no overhead, no cattiness. We leave that to the actual cats in our lives!
                  </p>
                </div>
              </Card>
            </Section>

            {/* Mission & Vision Section */}
            <Section id="mission-vision">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="flex items-center mb-4">
                    <div className="icon-container bg-teal/20">
                      <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h2 className="heading-subsection text-teal">Our Mission</h2>
                  </div>
                  <p className="text-subtext1">
                    To provide our clients with innovative and effective software solutions that enhance their business operations, while fostering a culture of collaboration, integrity, and continuous improvement.
                  </p>
                </Card>

                <Card>
                  <div className="flex items-center mb-4">
                    <div className="icon-container bg-sky/20">
                      <svg className="w-6 h-6 text-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="heading-subsection text-sky">Our Vision</h2>
                  </div>
                  <p className="text-subtext1">
                    To empower businesses through technology, enabling them to achieve their goals and make a positive impact in their industries and communities.
                  </p>
                </Card>
              </div>
            </Section>

            {/* Solutions Section */}
            <Section id="solutions">
              <Card>
                <h2 className="heading-section">Our Solutions</h2>
                <p className="text-subtext1 mb-6 text-center max-w-4xl mx-auto">
                    Big or small, customer-facing or internal, front-end, back-end, full stack, we've done it all. 
                    Our solutions are designed to meet the unique needs of your business, leveraging the latest 
                    technologies and best practices to deliver exceptional results.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {solutions.map((solution, index) => (
                    <SolutionCard
                      key={index}
                      icon={solution.icon}
                      title={solution.title}
                      description={solution.description}
                      variant={solution.variant}
                      iconBgColor={solution.iconBgColor}
                      iconColor={solution.iconColor}
                    />
                  ))}
                </div>
              </Card>
            </Section>

            {/* Values Section */}
            <Section id="values">
              <Card>
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
              </Card>
            </Section>
            
            <Card>
              <div className="heading-section mb-4">Local Spots We Love</div>
              <CardMap />
            </Card>

            {/* Contact CTA */}
            <Section id="contact">
              <div className="gradient-cta">
                <h2 className="text-2xl font-bold text-mantle mb-4">Ready to Work Together?</h2>
                <p className="text-base mb-6 max-w-3xl mx-auto">
                  Let's discuss how we can help transform your business with innovative technology solutions
                  tailored to your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary">Get In Touch</Button>
                  <Button variant="secondary">View Our Work</Button>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}