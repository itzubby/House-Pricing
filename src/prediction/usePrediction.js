import { useState } from 'react';
import { getPrediction } from './predictionAPI';

const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const predictPrice = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Sending prediction request with data:', formData);

      const data = await getPrediction(formData);
      
      console.log('Received prediction response:', data);

      if (data && data.predictedPrice) {
        setResult(data);
      } else {
        throw new Error('Invalid response from prediction API');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, predictPrice };
};

export default usePrediction;