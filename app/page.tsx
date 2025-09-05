import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Navigation Headers */}
      <div className="nav-header">
        <nav className="flex space-x-6 justify-center">
          <a href="#about" className="nav-link">About</a>
          <a href="#mission-vision" className="nav-link">Mission & Vision</a>
          <a href="#solutions" className="nav-link">Solutions</a>
          <a href="#values" className="nav-link">Values</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </div>

      <div className="main-container">
        <h1 className="heading-main">Code Cat Developers</h1>

        {/* About Section and Values in the same row */}
        <section id="about" className="section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Our Company */}
            <div className="card-primary flex flex-col items-center justify-center relative">
              <Image
                src="/code_cat_fill.svg"
                alt="Background Image"
                width={320}
                height={320}
                className="absolute opacity-25 rounded-lg pointer-events-none dark:invert"
              />
              <div className="text-center mb-8 z-10">
                <h2 className="heading-section">About Our Company</h2>
                <p className="text-description max-w-3xl mx-auto">
                  Code, coffee, and cats. With over a decade of experience, and our 3 C's fueling us, we're positive that we can deliver effective and simple web solutions for your everyday issues. Pittsburgh-based and proud, we strive to offer the best possible service in development to your needs, from creating a landing page for your newly created business that matches your personal vibes, to engineering a solution for that monotonous, repeatable task that's driving you wild. Spreadsheet data entry and data crunching, generation of tailored PDF reports, we're happy to chat about any problems you're experiencing, and find a path forward, no overhead, no cattiness. We leave that to the actual cats in our lives!
                </p>
              </div>
            </div>

            {/* Our Core Values */}
            <div className="card-primary">
              <div id="values" className="section-spacing">
                <h2 className="heading-section">Our Core Values</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="value-item">
                    <div className="icon-small bg-yellow/10">
                      <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="value-content">Innovation</h3>
                      <p className="text-small">
                        We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.
                      </p>
                    </div>
                  </div>

                  <div className="value-item">
                    <div className="icon-small bg-green/10">
                      <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="value-content">Collaboration</h3>
                      <p className="text-small">
                        We believe in the power of teamwork and building strong partnerships with our clients.
                      </p>
                    </div>
                  </div>

                  <div className="value-item">
                    <div className="icon-small bg-red/10">
                      <svg className="w-5 h-5 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="value-content">Integrity</h3>
                      <p className="text-small">
                        We operate with transparency, honesty, and ethical practices in everything we do.
                      </p>
                    </div>
                  </div>

                  <div className="value-item">
                    <div className="icon-small bg-blue/10">
                      <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="value-content">Excellence</h3>
                      <p className="text-small">
                        We strive for perfection in every project and relationship, continuously improving ourselves and our processes as we go.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section id="mission-vision" className="section-spacing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-primary">
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
            </div>

            <div className="card-primary">
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
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="section-spacing">
          <div className="card-primary">
            <h2 className="heading-section">Our Solutions</h2>
            <p className="text-subtext1 mb-6 text-center max-w-3xl mx-auto">
              Discover our comprehensive suite of solutions designed to meet your business needs and drive your success forward.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-solution">
                <div className="flex items-center mb-4">
                  <div className="icon-container bg-blue/20">
                    <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="heading-subsection text-text">Fast Performance</h3>
                </div>
                <p className="text-subtext1">
                  Lightning-fast solutions that deliver exceptional performance and user experience for your customers.
                </p>
              </div>

              <div className="card-solution-green">
                <div className="flex items-center mb-4">
                  <div className="icon-container bg-green/20">
                    <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="heading-subsection text-text">Reliable Security</h3>
                </div>
                <p className="text-subtext1">
                  Enterprise-grade security features to protect your data and maintain compliance with industry standards.
                </p>
              </div>

              <div className="card-solution-mauve">
                <div className="flex items-center mb-4">
                  <div className="icon-container bg-mauve/20">
                    <svg className="w-6 h-6 text-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="heading-subsection text-text">Scalable Architecture</h3>
                </div>
                <p className="text-subtext1">
                  Built to scale with your business growth and evolving requirements, from startup to enterprise.
                </p>
              </div>

              <div className="card-solution-peach">
                <div className="flex items-center mb-4">
                  <div className="icon-container bg-peach/20">
                    <svg className="w-6 h-6 text-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="heading-subsection text-text">Ongoing Support</h3>
                </div>
                <p className="text-subtext1">
                  Comprehensive support to ensure your operations run smoothly and efficiently at all times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="section-spacing">
          <div className="gradient-cta">
            <h2 className="text-2xl font-bold text-mantle mb-4">Ready to Work Together?</h2>
            <p className="text-base mb-6 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with innovative technology solutions
              tailored to your specific needs.
            </p>
            <div className="space-x-4">
              <button className="btn-primary">Get In Touch</button>
              <button className="btn-secondary">View Our Work</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}