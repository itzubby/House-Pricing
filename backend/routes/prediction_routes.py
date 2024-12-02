from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService

prediction_bp = Blueprint('prediction', __name__)
prediction_service = PredictionService()

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    try:
        features = request.json
        
        if not features:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        # Make prediction
        result = prediction_service.make_prediction(features)
        
        return jsonify({
            'success': True,
            'predicted_price': result['predicted_price'],
            'formatted_price': f"${result['predicted_price']:,.2f}",
            'feature_importance': result['feature_importance']
        })
        
    except ValueError as ve:
        return jsonify({
            'success': False,
            'error': str(ve)
        }), 400
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@prediction_bp.route('/features', methods=['GET'])
def get_features():
    """Return all feature descriptions"""
    try:
        descriptions = prediction_service.get_feature_descriptions()
        return jsonify({
            'success': True,
            'descriptions': descriptions
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@prediction_bp.route('/features/<feature_name>/values', methods=['GET'])
def get_feature_values(feature_name):
    """Return possible values for a specific feature"""
    try:
        values = prediction_service.get_feature_values(feature_name)
        return jsonify({
            'success': True,
            'feature': feature_name,
            'values': values
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 