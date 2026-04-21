"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useHistory } from '@/hooks/useHistory';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import API_BASE_URL from '@/constants/api';

const History = () => {
  const { history, loading, deleteScan } = useHistory();
  const { user } = useAuth();
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [scanToDelete, setScanToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!scanToDelete) return;
    setIsDeleting(true);
    const success = await deleteScan(scanToDelete.id);
    if (success) {
      setScanToDelete(null);
    }
    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen pt-2 pb-12 px-6">
      <Navbar />
      
      <main className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Scan History</h1>
            <p className="text-white/60 font-medium mt-1">Review your previous X-ray analysis results and AI explanations.</p>
          </div>
          <Link href="/">
            <Button className="w-full md:w-auto h-12 px-8">
              New Scan Analysis
            </ Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-80 animate-pulse bg-white/5 border-white/10">
                <div />
              </Card>
            ))}
          </div>
        ) : history.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-light-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">No scans found</h3>
              <p className="text-white/40 max-w-sm">You haven't analyzed any X-rays yet. Start by uploading an image on the home page.</p>
            </div>
            <Link href="/">
              <Button variant="secondary">Start your first analysis</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {history.map((scan) => (
              <Card key={scan.id} className="group p-0 overflow-hidden hover:scale-[1.02] transition-all border-white/5 hover:border-primary/30 flex flex-col h-full bg-white/5 shadow-2xl backdrop-blur-xl">
                <div className="relative h-60 w-full bg-black/40">
                  <img 
                    src={scan.image_path.startsWith('http') ? scan.image_path : `${API_BASE_URL}/${scan.image_path}`} 
                    alt={scan.prediction} 
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setScanToDelete(scan);
                      }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-200 transition-all backdrop-blur-md"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white leading-tight flex-1">{scan.prediction}</h3>
                    <div className="shrink-0 flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold text-light-blue">{(scan.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/50 line-clamp-3 italic flex-1 leading-relaxed">
                    "{scan.explanation}"
                  </p>
                  <Button 
                    variant="glass" 
                    className="w-full text-xs py-2.5 mt-2"
                    onClick={() => setSelectedScan(scan)}
                  >
                    View Full Report
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal 
          isOpen={!!selectedScan} 
          onClose={() => setSelectedScan(null)}
          title={`Case Report #${selectedScan?.id?.toString().padStart(4, '0')}`}
        >
          {selectedScan && (
            <div className="space-y-6">
              <div className="relative aspect-auto min-h-[200px] w-full rounded-2xl overflow-hidden glass border-white/10 bg-black/40">
                <img 
                  src={selectedScan.image_path.startsWith('http') ? selectedScan.image_path : `${API_BASE_URL}/${selectedScan.image_path}`} 
                  alt={selectedScan.prediction} 
                  className="w-full h-full object-contain max-h-[50vh] p-4"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Diagnosis</label>
                  <div className="text-xl font-bold text-white mt-1 break-words">{selectedScan.prediction}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Confidence</label>
                  <div className="text-xl font-bold text-light-blue mt-1">
                    {`${(selectedScan.confidence * 100).toFixed(1)}%`}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Medical Explanation</label>
                <p className="text-white/80 leading-relaxed italic mt-3">
                  "{selectedScan.explanation}"
                </p>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1" onClick={() => setSelectedScan(null)}>
                  Close Report
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="glass" className="w-full">New Scan</Button>
                </Link>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={!!scanToDelete} 
          onClose={() => !isDeleting && setScanToDelete(null)}
          title="Delete Scan Record"
        >
          <div className="space-y-6">
            <p className="text-white/70">
              Are you sure you want to delete this scan record? This action will permanently remove the analysis and the image file.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="glass" 
                className="flex-1" 
                onClick={() => setScanToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-500/20 hover:bg-red-500/40 border-red-500/30 text-red-100" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default History;
