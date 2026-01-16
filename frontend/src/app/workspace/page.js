"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, FileText, Plus, Trash2, Search, Bot, User, X, Eye, Download, Filter } from 'lucide-react';

const Workspace = () => {
  const [resumes, setResumes] = useState([]);
  const [analysisResults, setAnalysisResult] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your assistant' }
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const testHealth = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/health");
        const data = await res.json();
        console.log("Backend Health:", data);
      } catch (err) {
        console.error("Cannot reach backend:", err);
      }
    };

    testHealth();

    const loadResumes = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/resumes");
        const data = await res.json();
        setResumes(data);
      } catch (err) {
        console.error("Failed to load resumes:", err);
      }
    };

    loadResumes();
  }, []);

  const handleAddResume = () => {
    setShowUpload(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const form = new FormData();
      form.append("file", file);
      await fetch("http://127.0.0.1:8000/api/resumes/upload", {
        method: "POST",
        body: form,
      });

      setShowUpload(false);

      const res = await fetch("http://127.0.0.1:8000/api/resumes");
      const data = await res.json();
      setResumes(data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setResumes(prev => prev.filter(r => r.id !== id));
      setSelectedResumes(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete resume");
    }
  };

  const buildAnalysisMessage = (results) => {
  if (!results || results.length === 0) {
    return "No analysis Result from system";
  }

  return results.map((r, idx) => {
    if (r.status !== "ok") {
      return `❌ ${idx + 1}. ${r.filename}\nError: ${r.error || "unknown error"}`;
    }

    return (
      `📄 ${idx + 1}. ${r.filename}\n` +
      `${r.summary}`
    );
  }).join("\n\n----------------------\n\n");
  };


  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  const keyword = searchQuery;

  setChatMessages((prev) => [
    ...prev,
    { role: "user", content: keyword }
  ]);

  setIsSearching(true);
  setSearchQuery("");

  try {
    const searchRes = await fetch("http://127.0.0.1:8000/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: keyword, top_k: 5 }),
    });

    if (!searchRes.ok) {
      throw new Error(await searchRes.text());
    }

    const searchData = await searchRes.json();
    const matched = searchData.results || [];
    setSelectedResumes(matched);

    const analyzeRes = await fetch("http://127.0.0.1:8000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: keyword,
        resume_ids: matched.map((r) => r.id),
        max_items: 5,
      }),
    });

    if (!analyzeRes.ok) {
      throw new Error(await analyzeRes.text());
    }

    const analyzeData = await analyzeRes.json();
    const assistantText = buildAnalysisMessage(analyzeData.results);

    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: assistantText
      }
    ]);

  } catch (err) {
    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Error to Analysis\n${err.message}`
      }
    ]);
  } finally {
    setIsSearching(false);
  }};

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50 cursor-pointer hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-black" />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Workspace
                </h1>
                <p className="text-xs text-gray-400">HireSense | AI-Powered Resume Analysis for HR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">
                There are {resumes.length} resume(s) in the system
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Resume List */}
        <div className="w-1/4 border-r border-gray-800 bg-gray-900/30 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">All resume</h2>
              <button
                onClick={handleAddResume}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Searching..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`p-4 bg-gray-800 rounded-lg border transition-all duration-300 ${
                  selectedResumes.find(r => r.id === resume.id)
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      <h3 className="text-sm font-semibold text-white truncate">
                        {resume.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{resume.uploadDate}</span>
                      {resume.status === 'indexed' && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </span>
                      )}
                      {resume.status === 'processing' && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          processing...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Split into Search Results & Chat */}
        <div className="flex-1 flex flex-col">
          {/* Search Section */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/30">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type requirements Ex. 'React'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none pr-12"
                />
                <Filter className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Top Half - Search Results */}
          <div className="h-1/3 border-b border-gray-800 overflow-y-auto p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-green-400" />
              Selected Candidate(s)
              {selectedResumes.length > 0 && (
                <span className="text-sm text-gray-400">({selectedResumes.length} candidates)</span>
              )}
            </h3>
            
            {selectedResumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-30 text-gray-500">
                <Search className="w-16 h-16 mb-4 opacity-30" />
                <p>Candidate not found</p>
                <p className="text-sm">Try searching candidates with Search Mode above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {selectedResumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
                            {index + 1}
                          </div>
                          <h4 className="text-white font-semibold">{resume.name}</h4>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                            {resume.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 ml-10">
                          Upload when {resume.uploadDate}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Half - AI Chat */}
          <div className="h-1/2 flex flex-col bg-gray-900/30">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-400" />
                Assistant
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-black" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-green-500 text-black'
                        : 'bg-gray-800 text-white border border-gray-700'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full p-8 border border-gray-700 shadow-2xl relative">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-3xl font-bold text-white mb-2">Upload</h3>
            <p className="text-gray-400 mb-8">Add resume to save into database, only .PDF is available</p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-12 cursor-pointer hover:border-green-500 hover:bg-green-500/5 transition-all">
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
              />
              <Upload className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-lg font-medium text-white mb-2">
                Click to upload
              </p>
              <p className="text-sm text-gray-400">
                Only .PDF is available (Maximum 10MB)
              </p>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;