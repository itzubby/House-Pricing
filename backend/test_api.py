import requests

# Base URL of your API
BASE_URL = 'http://localhost:5000/api'

# Get all feature descriptions
response = requests.get(f'{BASE_URL}/features')
print("All Features:", response.json())

# Get specific feature values
feature = 'MSZoning'
response = requests.get(f'{BASE_URL}/features/{feature}/values')
print(f"{feature} Values:", response.json()) 