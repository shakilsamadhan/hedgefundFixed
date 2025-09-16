import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to Our
            <br />
            <span className="text-lime-400">Trading Platform</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Manage your assets, track your trades, monitor holdings, and stay on top of macro trends 
            with our comprehensive trading platform. Join thousands of traders who trust us with their investments.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex justify-center space-x-6 mb-20">
            <NavLink
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-lime-400 text-gray-900 font-semibold text-lg rounded-full hover:bg-lime-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NavLink>
            <NavLink
              to="/signin"
              className="inline-flex items-center px-8 py-4 border-2 border-lime-400 text-lime-400 font-semibold text-lg rounded-full hover:bg-lime-400 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </NavLink>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-lime-400/50 transition-all duration-300 group">
              <div className="text-lime-400 text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📈
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Asset Management</h3>
              <p className="text-gray-300">
                Track and manage your diverse portfolio of assets with real-time data and advanced analytics.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-lime-400/50 transition-all duration-300 group">
              <div className="text-lime-400 text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                💹
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Trading</h3>
              <p className="text-gray-300">
                Execute trades with confidence using our advanced trading tools and comprehensive market insights.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-lime-400/50 transition-all duration-300 group">
              <div className="text-lime-400 text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Holdings Tracker</h3>
              <p className="text-gray-300">
                Monitor your current positions and portfolio performance with detailed analytics and reporting.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-lime-400/50 transition-all duration-300 group">
              <div className="text-lime-400 text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Watchlists</h3>
              <p className="text-gray-300">
                Keep track of potential investments and market movements with customizable watchlists and alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-lime-400 mb-2">50K+</div>
              <div className="text-gray-300 text-lg">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-lime-400 mb-2">$2.5B+</div>
              <div className="text-gray-300 text-lg">Trading Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-lime-400 mb-2">99.9%</div>
              <div className="text-gray-300 text-lg">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our platform today and take control of your financial future with professional-grade trading tools.
          </p>
          <NavLink
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-lime-400 text-gray-900 font-semibold text-lg rounded-full hover:bg-lime-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Create Your Account
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;