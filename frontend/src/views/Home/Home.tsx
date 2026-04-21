"use client";

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useHome } from '@/hooks/useHome';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import API_BASE_URL from '@/constants/api';

const Home = () => {
  const { 
    preview, 
    loading, 
    result, 
    chatMessages, 
    chatLoading, 
    handleFileChange, 
    uploadAndAnalyze, 
    askQuestion,
    reset 
  } = useHome();
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTo({
        top: chatEndRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, chatLoading]);

  const onAsk = () => {
    if (question.trim()) {
      askQuestion(question);
      setQuestion('');
    }
  };

  return (
    <div className="min-h-screen pt-2 pb-12 px-6">
      <Navbar onHomeClick={reset} />
      
      <main className="max-w-6xl mx-auto space-y-8">
        {!result ? (
          <section className="flex flex-col items-center justify-center text-center space-y-8 py-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                AI-Powered <span className="text-light-blue">Radiology</span> Assistant
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
                Upload your X-ray images for instant AI analysis, detailed medical explanations, and interactive assistance.
              </p>
            </div>

            <Card className="w-full max-w-2xl aspect-[16/9] flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden">
              {preview ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image src={preview} alt="X-ray Preview" fill className="object-contain p-4" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="glass" onClick={() => (document.getElementById('file-upload') as HTMLInputElement)?.click()}>
                      Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="space-y-4"
                  onClick={() => (document.getElementById('file-upload') as HTMLInputElement)?.click()}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-light-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-white/80 font-raleway">
                    <span className="font-bold text-light-blue">Click to upload</span> or drag and drop
                    <p className="text-sm text-white/40 mt-1">PNG, JPG or JPEG (max. 10MB)</p>
                  </div>
                </div>
              )}
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </Card>

            <div className="flex gap-4">
              <Button 
                onClick={uploadAndAnalyze} 
                className="w-48 h-12 text-lg" 
                disabled={!preview || loading}
              >
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </Button>
              {preview && !loading && (
                <Button variant="glass" onClick={reset} className="w-32 h-12 text-lg">
                  Cancel
                </Button>
              )}
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Analysis Result */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Analysis Result</h2>
                  <div className="px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30">
                    <span className="text-light-blue font-bold">Case #{result.id.toString().padStart(4, '0')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative aspect-square rounded-xl overflow-hidden glass border-white/5">
                    <img 
                      src={`${API_BASE_URL}/${result.image_path}`} 
                      alt="Analyzed X-ray" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Analysis Result</label>
                      <div className="text-4xl font-bold text-white mt-1">{result.prediction}</div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Confidence Score</label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-light-blue transition-all duration-1000"
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xl font-bold text-light-blue">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-lg text-white/80 leading-relaxed italic">
                        "{result.explanation}"
                      </p>
                    </div>

                    <Button variant="glass" className="w-full" onClick={reset}>
                      Analyze Another Image
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chat Assistant */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] flex flex-col p-0 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    AI Assistant
                  </h3>
                </div>
                
                <div 
                  ref={chatEndRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar scroll-smooth"
                >
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-white/40">Ask me anything about these results.</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["What does this mean?", "Is it serious?", "Next steps?"].map(q => (
                          <button 
                            key={q} 
                            onClick={() => askQuestion(q)}
                            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-primary/20 hover:text-light-blue transition-all"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-white/5 border border-white/10 text-white/80'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-black/20 border-t border-white/10">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask a question..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary/50 transition-colors"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onAsk()}
                    />
                    <Button className="px-4 py-2" onClick={onAsk} disabled={chatLoading}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
              <p className="text-[10px] text-white/30 text-center mt-4 uppercase tracking-widest font-bold">
                * Educational tool only. Not for medical diagnosis.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
