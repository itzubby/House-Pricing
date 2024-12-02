from flask import Flask, request, jsonify
from services.prediction_service import PredictionService
from http import HTTPStatus

app = Flask(__name__)
prediction_service = PredictionService()  # Create single instance

@app.route('/')
def home():
    return 'House Price Prediction API is running!'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json'
            }), HTTPStatus.BAD_REQUEST
        
        features = request.json
        result = prediction_service.make_prediction(features)
        
        return jsonify({
            'status': 'success',
            'predicted_price': result['predicted_price'],
            'feature_importance': result['feature_importance']
        }), HTTPStatus.OK
        
    except ValueError as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), HTTPStatus.BAD_REQUEST
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@app.route('/features', methods=['GET'])
def get_features():
    """Get all available features and their descriptions"""
    try:
        descriptions = prediction_service.get_feature_descriptions()
        return jsonify({
            'status': 'success',
            'features': descriptions
        }), HTTPStatus.OK
    except Exception as e:
        return jsonify({
            'error': 'Error fetching feature descriptions',
            'status': 'error'
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@app.route('/features/<feature_name>/values', methods=['GET'])
def get_feature_values(feature_name):
    """Get possible values for a specific categorical feature"""
    try:
        values = prediction_service.get_feature_values(feature_name)
        if not values:
            return jsonify({
                'error': f'Feature {feature_name} not found or has no categorical values',
                'status': 'error'
            }), HTTPStatus.NOT_FOUND
            
        return jsonify({
            'status': 'success',
            'feature': feature_name,
            'values': values
        }), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({
            'error': 'Error fetching feature values',
            'status': 'error'
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@app.route('/validate', methods=['POST'])
def validate_input():
    """Validate input features without making a prediction"""
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json'
            }), HTTPStatus.BAD_REQUEST
            
        features = request.json
        missing_features = []
        invalid_features = []
        
        # Check for required features
        for feature in prediction_service.feature_columns:
            if feature not in features:
                missing_features.append(feature)
                
        # Validate categorical features
        for feature, value in features.items():
            if feature in prediction_service.label_encoders:
                valid_values = prediction_service.get_feature_values(feature)
                if value not in valid_values:
                    invalid_features.append({
                        'feature': feature,
                        'value': value,
                        'valid_values': list(valid_values)
                    })
        
        if missing_features or invalid_features:
            return jsonify({
                'status': 'error',
                'missing_features': missing_features,
                'invalid_features': invalid_features
            }), HTTPStatus.BAD_REQUEST
            
        return jsonify({
            'status': 'success',
            'message': 'All input features are valid'
        }), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({
            'error': 'Error validating input',
            'status': 'error'
        }), HTTPStatus.INTERNAL_SERVER_ERROR

if __name__ == '__main__':
    app.run(debug=True, port=5001)
