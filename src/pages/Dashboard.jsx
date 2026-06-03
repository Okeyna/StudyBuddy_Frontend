import { useEffect, useState } from 'react';
import { DocumentUploader } from '../components/DocumentUploader';
import { getDocuments, generateAudio } from '../services/api';
import { useAudio } from '../contexts/AudioContext';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  const fetchDocs = async () => {
    const res = await getDocuments();
    setDocuments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleGenerateAudio = async (docId, title) => {
    const res = await generateAudio(docId);
    playTrack(res.data.audio_url, title, res.data.audio_id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      <DocumentUploader onUploadSuccess={fetchDocs} />
      <div className="mt-8 space-y-4">
        {loading && <p>Loading...</p>}
        {documents.map((doc) => (
          <div key={doc.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{doc.filename}</p>
              <p className="text-sm text-gray-500">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleGenerateAudio(doc.id, doc.filename)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Play Audio
              </button>
              <Link to={`/quiz/${doc.id}`} className="bg-blue-500 text-white px-3 py-1 rounded inline-block">
                Take Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};