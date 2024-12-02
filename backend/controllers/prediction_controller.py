from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService
import logging

logger = logging.getLogger(__name__)
prediction_blueprint = Blueprint('prediction', __name__)
prediction_service = PredictionService()

@prediction_blueprint.route('/predict', methods=['POST'])
def predict_price():
    try:
        features = request.json
        if not features:
            return jsonify({'error': 'No features provided'}), 400
        
        prediction = prediction_service.make_prediction(features)
        return jsonify({
            'success': True,
            'prediction': prediction,
            'currency': 'USD'
        })
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Failed to make prediction'}), 500

@prediction_blueprint.route('/data', methods=['GET'])
def get_data():
    try:
        page = request.args.get('page', default=1, type=int)
        limit = request.args.get('limit', default=10, type=int)
        
        data = prediction_service.get_training_data(page, limit)
        return jsonify(data)
        
    except Exception as e:
        logger.error(f"Data retrieval error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve data'}), 500

@prediction_blueprint.route('/stats', methods=['GET'])
def get_stats():
    try:
        stats = prediction_service.get_data_statistics()
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Stats retrieval error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve statistics'}), 500
