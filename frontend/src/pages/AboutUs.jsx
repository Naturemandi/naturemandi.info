import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white text-gray-900 px-4 md:px-10 py-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold mb-4 text-green-700">NatureMandi</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Uniting India with purity, taste, and tradition — delivered from local hands to your home.
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At <strong>NatureMandi</strong>, we aim to bridge the gap between India's regional treasures and homes across the country.
            We bring pure, authentic, and traditionally sourced products from remote parts of India directly to your doorstep.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To become India’s most trusted brand for regional authenticity, empowering farmers, artisans, and small businesses
            through digital accessibility and fair trade practices.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Our Story</h2>
        <p className="text-gray-700 text-lg max-w-4xl mx-auto leading-relaxed text-center">
          Our journey began with one simple realization by our founder, <strong>Suresh Kumar</strong> — pure and traditional products
          like <em>Kaladi, Desi Rajma, and Himalayan Pickles</em> were difficult to find outside their origin regions. What started as a
          mission to help families reconnect with their roots became a movement — and now a full-fledged e-commerce startup 
          delivering heritage, purity, and love across India.
        </p>
      </div>

      {/* Founder Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-20">
        <img
          src="/founder.png"
          alt="Founder"
          className="w-44 h-44 rounded-full object-cover shadow-md"
        />
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-gray-800">Suresh Kumar</h3>
          <p className="text-green-600 font-medium">Founder & CEO, NatureMandi</p>
          <p className="mt-3 text-gray-700 italic">
            “We believe in delivering purity at scale. Our roots guide us, and our people inspire us.”
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Our Achievements</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              image: '/hero1.png',
              title: 'Best Emerging Startup - 2024',
            },
            {
              image: '/founder.png',
              title: '10,000+ Orders Delivered',
            },
            {
              image: '/hero1.png',
              title: 'Rated 4.9+ by Happy Customers',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition text-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <p className="text-gray-800 font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Line */}
      <div className="text-center mt-16 text-green-800 font-semibold text-xl">
        “NatureMandi – Delivering Purity from the Roots of India”
      </div>
    </div>
  );
};

export default AboutUs;
