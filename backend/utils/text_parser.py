import re

class TextParser:
    def parse_feature_descriptions(self, file_path):
        """Parse the data description file to extract feature descriptions and values"""
        descriptions = {}
        current_feature = None
        
        try:
            with open(file_path, 'r') as file:
                lines = file.readlines()
                
            for line in lines:
                line = line.strip()
                
                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue
                    
                # Check if line starts with a feature name
                feature_match = re.match(r'^([A-Za-z0-9]+)\s*:', line)
                if feature_match:
                    current_feature = feature_match.group(1)
                    descriptions[current_feature] = {
                        'description': line[len(current_feature)+1:].strip(),
                        'values': {}
                    }
                    continue
                
                # Check for categorical values
                value_match = re.match(r'\s+([A-Za-z0-9]+)\s+(.+)', line)
                if value_match and current_feature:
                    value = value_match.group(1)
                    value_desc = value_match.group(2)
                    descriptions[current_feature]['values'][value] = value_desc
                    
        except Exception as e:
            print(f"Error parsing feature descriptions: {e}")
            return {}
            
        return descriptions 