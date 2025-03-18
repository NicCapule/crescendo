import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
  Button, Calendar, Alert, AlertTitle, AlertDescription, Badge
} from '@/components/ui'; // Assuming you're using shadcn/ui components
import { Calendar as CalendarIcon, Clock, Award, Users, Brain } from 'lucide-react';
import { format } from 'date-fns';

const AIScheduleRecommendations = ({ studentId, instrumentId, programId }) => {
  const [date, setDate] = useState(new Date());
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Fetch recommendations when date or instrument/program changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!date) return;
      
      setLoading(true);
      setError(null);
      setBookingStatus(null);
      
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Build query parameters based on available data
        const params = new URLSearchParams({
          date: formattedDate,
        });
        
        if (instrumentId) params.append('instrument_id', instrumentId);
        if (programId) params.append('program_id', programId);
        if (studentId) params.append('student_id', studentId);
        
        const response = await axios.get(`/api/recommendations?${params.toString()}`);
        
        if (response.data.success) {
          setRecommendations(response.data.recommendations);
        } else {
          setError(response.data.error || 'Failed to get recommendations');
          setRecommendations([]);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [date, instrumentId, programId, studentId]);

  // Handle booking a session
  const handleBookSession = async () => {
    if (!selectedRecommendation || !studentId) {
      setError('Please select a time slot and ensure student info is available');
      return;
    }
    
    setLoading(true);
    setBookingStatus(null);
    
    try {
      const response = await axios.post('/api/recommendations/book', {
        recommendation: selectedRecommendation,
        student_id: studentId,
        session_number: 1 // Default to first session, could be made configurable
      });
      
      if (response.data.success) {
        setBookingStatus({
          type: 'success',
          message: 'Session successfully booked!'
        });
        // Clear selected recommendation after successful booking
        setSelectedRecommendation(null);
        // Refresh recommendations after booking
        const formattedDate = format(date, 'yyyy-MM-dd');
        const params = new URLSearchParams({
          date: formattedDate,
        });
        if (instrumentId) params.append('instrument_id', instrumentId);
        if (programId) params.append('program_id', programId);
        if (studentId) params.append('student_id', studentId);
        
        const refreshResponse = await axios.get(`/api/recommendations?${params.toString()}`);
        if (refreshResponse.data.success) {
          setRecommendations(refreshResponse.data.recommendations);
        }
      } else {
        setBookingStatus({
          type: 'error',
          message: response.data.error || 'Failed to book session'
        });
      }
    } catch (err) {
      setBookingStatus({
        type: 'error',
        message: err.response?.data?.error || 'Error booking session'
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get styling based on recommendation level
  const getRecommendationStyle = (level) => {
    switch (level) {
      case 'Highly Recommended':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Recommended':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Acceptable':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Schedule Recommendations</CardTitle>
            <CardDescription>
              Select a date to see AI-powered time slot suggestions
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            <span>AI Powered</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date Selector */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Session Date</label>
          <div className="flex items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-2"
              disabled={(date) => date < new Date()}
            />
            <CalendarIcon className="ml-2 h-4 w-4" />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Booking Status */}
        {bookingStatus && (
          <Alert variant={bookingStatus.type === 'success' ? 'default' : 'destructive'}>
            <AlertTitle>{bookingStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{bookingStatus.message}</AlertDescription>
          </Alert>
        )}
        
        {/* Recommendations List */}
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              <span>AI is analyzing and generating recommendations...</span>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-medium">Recommended Time Slots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    selectedRecommendation?.session_start === rec.session_start
                      ? 'ring-2 ring-blue-500'
                      : 'hover:border-blue-200'
                  } ${getRecommendationStyle(rec.recommended_level)}`}
                  onClick={() => setSelectedRecommendation(rec)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">{rec.formatted_time}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{rec.preference_score}/5</span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs flex justify-between">
                    <span>{rec.recommended_level}</span>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{rec.current_utilization}/{rec.max_capacity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !error && !loading ? (
          <div className="p-4 text-center text-gray-500">
            No available time slots found for the selected date
          </div>
        ) : null}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          disabled={!selectedRecommendation || loading}
          onClick={handleBookSession}
        >
          {loading ? 'Processing...' : 'Book Session'}
        </Button>
        {recommendations.length > 0 && (
          <div className="text-xs text-gray-500 text-center">
            AI analysis took {recommendations[0]?.stats?.solution_time?.toFixed(2) || "0"} seconds
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIScheduleRecommendations;