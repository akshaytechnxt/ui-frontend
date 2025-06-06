import React from 'react';

function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
      
      <div className="space-y-8">
        <section className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We are dedicated to creating innovative solutions that make a difference in people's lives.
            Our team of experts works tirelessly to deliver the best possible experience to our users.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div>
                <h3 className="font-semibold text-gray-900">John Doe</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Jane Smith</h3>
                <p className="text-gray-600">Lead Developer</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-primary text-4xl mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">We never compromise on quality</p>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">Working together for success</p>
            </div>
            <div className="text-center">
              <div className="text-primary text-4xl mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">Always pushing boundaries</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About; 