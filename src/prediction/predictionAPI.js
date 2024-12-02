import axios from 'axios';

export const getPrediction = async (formData) => {
  try {
    // For testing/development, you can use the sample data
    // This is a temporary solution until your backend is ready
    const mockPrediction = {
      predictedPrice: 180000 + Math.random() * 50000, // Random price between 180k-230k
      confidence: 0.85
    };

    // Comment this return when you have a real backend
    return mockPrediction;

    // Uncomment this when you have a real backend
    /*
    const response = await axios.post('http://localhost:5000/predict', formData);
    
    if (response.data && response.data.predictedPrice) {
      return {
        predictedPrice: response.data.predictedPrice,
        confidence: response.data.confidence || 0.85
      };
    } else {
      throw new Error('Invalid response format from API');
    }
    */
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to get prediction: ' + error.message);
  }
};