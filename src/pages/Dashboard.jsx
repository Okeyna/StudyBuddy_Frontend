// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { DocumentUploader } from '../components/DocumentUploader';
import { getDocuments, generateAudio } from '../services/api';
import { useAudio } from '../contexts/AudioContext';
import { FaFilePdf, FaFileWord, FaFileAlt, FaHeadphones, FaChartLine, FaPlay, FaClock, FaBrain } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, listened: 0, quizzes: 0 });
  const { playTrack } = useAudio();
  const navigate = useNavigate();

  const fetchDocs = async () => {
    const res = await getDocuments();
    setDocuments(res.data);
    setStats({
      total: res.data.length,
      listened: res.data.filter(d => d.listened).length,
      quizzes: res.data.filter(d => d.quiz_taken).length,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleGenerateAudio = async (docId, title) => {
    const res = await generateAudio(docId);
    playTrack(res.data.audio_url, title, res.data.audio_id);
    navigate(`/audio/${res.data.audio_id}`);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf className="text-red-500 text-2xl" />;
    if (ext === 'docx') return <FaFileWord className="text-blue-500 text-2xl" />;
    return <FaFileAlt className="text-gray-500 text-2xl" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Welcome Back! 👋</h1>
        <p className="text-xl text-gray-600">Continue your learning journey with AI-powered audio</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Documents</p>
              <p className="text-4xl font-bold mt-2">{stats.total}</p>
            </div>
            <FaFileAlt className="text-5xl opacity-30" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Listened</p>
              <p className="text-4xl font-bold mt-2">{stats.listened}</p>
            </div>
            <FaHeadphones className="text-5xl opacity-30" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Quizzes Taken</p>
              <p className="text-4xl font-bold mt-2">{stats.quizzes}</p>
            </div>
            <FaBrain className="text-5xl opacity-30" />
          </div>
        </div>
      </div>
      
      {/* Upload Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload New Material</h2>
        <DocumentUploader onUploadSuccess={fetchDocs} />
      </div>
      
      {/* Documents Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Documents</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">View All</button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                  <div className="flex items-center space-x-3 mb-3">
                    {getFileIcon(doc.filename)}
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{doc.filename}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center space-x-1">
                      <FaClock size={12} />
                      <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => handleGenerateAudio(doc.id, doc.filename)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <FaPlay size={12} />
                    <span>Listen Now</span>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/quiz/${doc.id}`)}
                    className="w-full flex items-center justify-center space-x-2 border-2 border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                  >
                    <FaBrain size={12} />
                    <span>Take Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};