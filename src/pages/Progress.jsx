// src/pages/Progress.jsx
import { useEffect, useState } from 'react';
import { getProgress } from '../services/api';
import { FaSpinner, FaChartLine, FaClock, FaCheckCircle, FaBrain } from 'react-icons/fa';

export const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await getProgress();
        setProgress(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Learning Progress</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaClock className="text-blue-500" size={24} />}
          title="Total Study Time"
          value={formatTime(progress?.total_study_time || 0)}
          color="blue"
        />
        <StatCard
          icon={<FaCheckCircle className="text-green-500" size={24} />}
          title="Completed Lessons"
          value={`${progress?.completed_lessons || 0} / ${progress?.total_lessons || 0}`}
          color="green"
        />
        <StatCard
          icon={<FaBrain className="text-purple-500" size={24} />}
          title="Average Quiz Score"
          value={`${Math.round(progress?.average_quiz_score || 0)}%`}
          color="purple"
        />
        <StatCard
          icon={<FaChartLine className="text-orange-500" size={24} />}
          title="Current Streak"
          value={`${progress?.current_streak || 0} days`}
          color="orange"
        />
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Weekly Activity</h2>
        <div className="flex items-end space-x-2 h-48">
          {progress?.weekly_activity?.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${Math.min((day.minutes / 60) * 100, 100)}%` }}
              />
              <span className="text-xs text-gray-600 mt-2">{day.label}</span>
              <span className="text-xs text-gray-500">{Math.round(day.minutes)}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Document Progress</h2>
        <div className="space-y-4">
          {progress?.documents?.map((doc) => (
            <div key={doc.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{doc.filename}</span>
                <span className="text-sm text-gray-600">
                  {Math.round(doc.progress_percentage)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${doc.progress_percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Listened: {formatTime(doc.time_listened)}</span>
                <span>Quiz: {doc.quiz_score ? `${doc.quiz_score}%` : 'Not taken'}</span>
              </div>
            </div>
          ))}
          {(!progress?.documents || progress.documents.length === 0) && (
            <p className="text-gray-500 text-center py-4">No documents yet</p>
          )}
        </div>
      </div>

      {/* Quiz Performance */}
      {progress?.quizzes && progress.quizzes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quiz Performance</h2>
          <div className="space-y-3">
            {progress.quizzes.slice(0, 5).map((quiz, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{quiz.document_name}</p>
                  <p className="text-sm text-gray-500">{new Date(quiz.completed_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{quiz.score}%</p>
                  <p className="text-xs text-gray-500">{quiz.correct} / {quiz.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };
  
  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds) return '0h 0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};