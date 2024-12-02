import pandas as pd
import os
from config import Config
import logging

logger = logging.getLogger(__name__)

class CSVParser:
    def __init__(self):
        self.data_folder = Config.DATA_FOLDER

    def parse_csv(self, filename='house_data.csv'):
        """
        Parse CSV file and return the data
        
        Args:
            filename (str): Name of the CSV file to parse
            
        Returns:
            list: List of dictionaries containing the data
        """
        try:
            file_path = os.path.join(self.data_folder, filename)
            
            if not os.path.exists(file_path):
                logger.warning(f"CSV file not found: {file_path}. Using empty dataset.")
                # Return empty dataset instead of raising error
                return []
            
            # Read CSV file
            df = pd.read_csv(file_path)
            
            # Basic data cleaning
            df = self._clean_data(df)
            
            # Convert to list of dictionaries
            data = df.to_dict('records')
            
            logger.info(f"Successfully parsed {len(data)} records from {filename}")
            return data
            
        except Exception as e:
            logger.error(f"Error parsing CSV file: {e}")
            raise

    def _clean_data(self, df):
        """
        Clean the data
        
        Args:
            df (pandas.DataFrame): Input DataFrame
            
        Returns:
            pandas.DataFrame: Cleaned DataFrame
        """
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        df = df.fillna({
            'bedrooms': df['bedrooms'].median(),
            'bathrooms': df['bathrooms'].median(),
            'sqft_living': df['sqft_living'].median(),
            'sqft_lot': df['sqft_lot'].median()
        })
        
        # Remove outliers (example for price)
        if 'price' in df.columns:
            q1 = df['price'].quantile(0.01)
            q3 = df['price'].quantile(0.99)
            df = df[(df['price'] >= q1) & (df['price'] <= q3)]
        
        return df
