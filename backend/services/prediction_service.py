import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import logging
import os
from utils.text_parser import TextParser

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.train_data = None
        self.test_data = None
        self.model = None
        self.label_encoders = {}
        self.feature_columns = None
        self.feature_descriptions = {}
        
        # Set up logging
        logging.basicConfig(level=logging.INFO)
        
        try:
            self.load_data()
            self.train_model()
        except Exception as e:
            logger.error(f"Initialization error: {str(e)}")
            raise

    def load_data(self):
        """Load and process the training and test data"""
        try:
            # Get absolute paths
            base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            train_path = os.path.join(base_path, 'data', 'train.csv')
            test_path = os.path.join(base_path, 'data', 'test.csv')
            desc_path = os.path.join(base_path, 'data', 'data_description.txt')
            
            logger.info(f"Loading data from: {train_path}")
            
            # Check if files exist
            if not os.path.exists(train_path):
                raise FileNotFoundError(f"Training data not found at {train_path}")
            if not os.path.exists(test_path):
                raise FileNotFoundError(f"Test data not found at {test_path}")
            if not os.path.exists(desc_path):
                raise FileNotFoundError(f"Description file not found at {desc_path}")
            
            # Load datasets
            self.train_data = pd.read_csv(train_path)
            self.test_data = pd.read_csv(test_path)
            
            # Parse feature descriptions
            text_parser = TextParser()
            self.feature_descriptions = text_parser.parse_feature_descriptions(desc_path)
            
            logger.info(f"Loaded {len(self.train_data)} training records and {len(self.test_data)} test records")
            logger.info(f"Parsed {len(self.feature_descriptions)} feature descriptions")
            
            # Process the data
            self._preprocess_data()
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise

    def _preprocess_data(self):
        """Clean and preprocess the data"""
        # Select important features (you can modify this list based on data_description.txt)
        self.feature_columns = [
            'LotArea', 'Neighborhood', 'OverallQual', 'OverallCond',
            'YearBuilt', 'BldgType', 'HouseStyle', 'TotalBsmtSF',
            'GrLivArea', 'FullBath', 'BedroomAbvGr', 'KitchenQual',
            'GarageType', 'GarageArea'
        ]

        # Handle missing values
        for column in self.feature_columns:
            if self.train_data[column].dtype == 'object':
                self.train_data[column] = self.train_data[column].fillna('unknown')
                if column in self.test_data.columns:
                    self.test_data[column] = self.test_data[column].fillna('unknown')
            else:
                self.train_data[column] = self.train_data[column].fillna(0)
                if column in self.test_data.columns:
                    self.test_data[column] = self.test_data[column].fillna(0)

        # Encode categorical variables
        for column in self.feature_columns:
            if self.train_data[column].dtype == 'object':
                # Replace unknown values with the most frequent value
                most_frequent = self.train_data[column].mode()[0]
                self.test_data[column] = self.test_data[column].replace('unknown', most_frequent)
                
                le = LabelEncoder()
                self.train_data[column] = le.fit_transform(self.train_data[column])
                self.test_data[column] = le.transform(self.test_data[column])
                self.label_encoders[column] = le

    def train_model(self):
        """Train the prediction model"""
        try:
            X = self.train_data[self.feature_columns]
            y = self.train_data['SalePrice']

            # Split data into training and validation sets
            X_train, X_val, y_train, y_val = train_test_split(
                X, y, test_size=0.2, random_state=42
            )

            # Train model
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.model.fit(X_train, y_train)

            # Evaluate model
            train_score = self.model.score(X_train, y_train)
            val_score = self.model.score(X_val, y_val)
            
            logger.info(f"Model trained successfully. Training R2: {train_score:.4f}, Validation R2: {val_score:.4f}")
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise

    def make_prediction(self, features):
        """Make a house price prediction"""
        try:
            # Prepare input features
            input_data = {}
            for column in self.feature_columns:
                if column in features:
                    if column in self.label_encoders:
                        # Encode categorical features
                        le = self.label_encoders[column]
                        input_data[column] = le.transform([features[column]])[0]
                    else:
                        # Numeric features
                        input_data[column] = features[column]
                else:
                    raise ValueError(f"Missing required feature: {column}")

            # Create input DataFrame
            input_df = pd.DataFrame([input_data])

            # Make prediction
            prediction = self.model.predict(input_df)[0]

            # Get feature importance
            feature_importance = dict(zip(
                self.feature_columns,
                self.model.feature_importances_
            ))

            return {
                'predicted_price': round(prediction, 2),
                'feature_importance': feature_importance
            }

        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise

    def get_feature_descriptions(self):
        """Return the parsed feature descriptions"""
        return self.feature_descriptions

    def get_feature_values(self, feature_name):
        """Get possible values for a categorical feature"""
        try:
            if feature_name not in self.feature_columns:
                logger.error(f"Feature {feature_name} not found in feature columns")
                return None
                
            if feature_name in self.label_encoders:
                return list(self.label_encoders[feature_name].classes_)
            else:
                logger.info(f"Feature {feature_name} is not categorical")
                return None
                
        except Exception as e:
            logger.error(f"Error getting feature values: {str(e)}")
            return None
