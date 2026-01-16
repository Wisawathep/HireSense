"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FileUser, Workflow, Brain, DatabaseZap, ArrowRight, ListChecks, Zap, ScanSearch, Power } from 'lucide-react';

const HireSense = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Large Language Model Reasoning",
      description: "Advanced AI reasoning enables structure resume interpretation and summarization."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Retrieval-Augmented Generation (RAG)",
      description: "Ensures responses are grounded in retrieved resume data, reducing hallucination and improving reliability."
    },
    {
      icon: <DatabaseZap className="w-8 h-8" />,
      title: "FAISS Vector Database",
      description: "High-Performance vector indexing for scalable semantic search and retrieval."
    },
    {
      icon: <ScanSearch className="w-8 h-8" />,
      title: "Intelligence Search Mode",
      description: "Enable to find relevant candidates by specifying skills, or role requirements. No need to manually review every resume."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
                <FileUser className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  HireSense
                </h1>
                <p className="text-xs text-gray-400">AI-Powered Resume Analysis for HR</p>
              </div>
            </div>
            <Link href="/workspace">
              <button className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300">
                Start
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Powered by Gemini 2.5 Flash Model</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Review Resumes Faster</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                with HireSense
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Easily add/remove resumes within the database.
              Use keyword/requirements-based search to retrieve relevant resumes—without manually
              reviewing every file. Powered by AI that intelligently analyzes resumes,
              helping HR teams make faster and more informed decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/workspace"
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center gap-2 text-lg"
              >
                <Power className="w-5 h-5" />
                Start
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Features of <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">HireSense</span>
            </h2>
            <p className="text-xl text-gray-400">4 features that make a better life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Easy use within 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload All Resumes", desc: "Add all resumes in database that you want" },
              { step: "2", title: "Search Mode", desc: "Type keyword of requirements to pick up related resumes" },
              { step: "3", title: "Analysis", desc: "Analyze/summarize resume with AI" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="text-7xl font-bold text-green-500/20 mb-4">{item.step}</div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                    <ListChecks className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-green-500/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Creator of{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                HireSense
              </span>
            </h2>
            <p className="text-xl text-gray-400">Who made this project?</p>
          </div>

          {/* Centered Developer Card */}
          <div className="flex justify-center">
            <div className="group w-full max-w-sm p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 text-center">
              
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="w-75 h-64 squared-full bg-gradient-to-br from-green-500 to-emerald-600 p-1 group-hover:scale-105 transition-transform">
                  <img
                    src="/developer.jpg"   
                    alt="Developer"
                    className="w-full h-full squared-full object-cover bg-gray-900"
                  />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-bold text-white mb-2">
                Wisawathep Thongkum
              </h3>

              {/* Role */}
              <p className="text-green-400 font-semibold mb-4">
                Fullstack Developer
              </p>

              {/* Short Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                Creator of HireSense — an AI-powered resume analysis system using
                RAG and LLM to assist
                HR professionals in candidate screening.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HireSense;