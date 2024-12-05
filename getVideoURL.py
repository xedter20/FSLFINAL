import os
import json
import firebase_admin
from firebase_admin import credentials, storage
from urllib.parse import quote_plus
import time

# Initialize Firebase Admin using the service account credentials
cred = credentials.Certificate("key.json")  # Replace with your service account file
firebase_admin.initialize_app(cred, {
    'storageBucket': 'avdeasis-4b5c7.appspot.com'  # Use your Firebase Storage bucket from the config
})

# Base directory containing the folders
base_directory = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL'  # Change this to your directory path

categories = []
sub_categories = {}

# Function to get Firebase download URL for a file in the requested format with retries
def get_firebase_download_url(file_path, retries=3, delay=2):
    attempt = 0
    while attempt < retries:
        try:
            bucket = storage.bucket()  # Get the Firebase Storage bucket
            blob = bucket.blob(file_path)  # Get the blob object for the file path

            # URL encode the file path to handle spaces and special characters
            encoded_file_path = quote_plus(file_path)

            # Construct the URL with `alt=media` and a signed token
            url = f'https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{encoded_file_path}?alt=media&token={blob.generate_signed_url(version="v4", expiration=3600, method="GET")}'
            return url  # Return the generated URL

        except Exception as e:
            print(f"Error fetching URL for {file_path}: {e}")
            attempt += 1
            if attempt < retries:
                print(f"Retrying... Attempt {attempt}/{retries}")
                time.sleep(delay)  # Wait before retrying
            else:
                print(f"Failed to fetch URL after {retries} attempts.")
                return None  # Return None if failed after all retries

# Iterate through the main folders (top-level categories)
for idx, category_name in enumerate(os.listdir(base_directory), start=1):
    category_path = os.path.join(base_directory, category_name)
    
    if os.path.isdir(category_path):  # Ensure it's a directory
        categories.append({
            'id': idx,
            'name': category_name,
            'bgColor': '#98C1D9'  # Placeholder color, can be customized
        })
        
        category_subcategories = []
        
        # Iterate through the subfolders (subcategories)
        for sub_idx, subcategory_name in enumerate(os.listdir(category_path), start=1):
            subcategory_path = os.path.join(category_path, subcategory_name)
            
            if os.path.isdir(subcategory_path):  # Ensure it's a directory
                # Try to get the URL for the .MOV file first, and if it doesn't exist, try .mp4
                video_url = None
                
                # Try to get the .MOV file URL first
                video_url = get_firebase_download_url(f'FSL_Videos/{subcategory_name}.MOV')  # Try MOV first
                video_url_back_up = get_firebase_download_url(f'FSL_Videos/{subcategory_name}.mp4')  # Then try MP4

                category_subcategories.append({
                    'id': sub_idx,
                    'title': subcategory_name,
                    'videoUrl': video_url,
                    'videoUrlBackUp': video_url_back_up   # Will be None if both MOV and MP4 are not found
                })
        
        sub_categories[category_name] = category_subcategories
output = {
    'categories': categories,
    'subCategories': sub_categories
}

# Save to a JSON file
with open('categories_subcategories.json', 'w') as json_file:
    json.dump(output, json_file, indent=4)

print("JSON file 'categories_subcategories.json' has been created.")

# Combine categories and sub_categories into