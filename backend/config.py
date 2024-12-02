import os
from pathlib import Path

class Config:
    # Base directory of the project
    BASE_DIR = Path(__file__).parent.parent
    
    # Data directory
    DATA_FOLDER = os.path.join(BASE_DIR, 'data')
    
    # Model settings
    MODEL_FEATURES = [
        'bedrooms',
        'bathrooms',
        'sqft_living',
        'sqft_lot',
        'floors',
        'condition'
    ]
    
    # API settings
    API_TITLE = "House Price Prediction API"
    API_VERSION = "1.0.0"
    
    # Development settings
    DEBUG = True
