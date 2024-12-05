import os
import json
import firebase_admin
from firebase_admin import credentials, storage
from urllib.parse import quote_plus

# Initialize Firebase Admin using the service account credentials
cred = credentials.Certificate("key.json")  # Replace with your service account file
firebase_admin.initialize_app(cred, {
    'storageBucket': 'avdeasis-4b5c7.appspot.com'  # Use your Firebase Storage bucket from the config
})

# Base directory containing the folders
base_directory = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL'  # Change this to your directory path

categories = []
sub_categories = {}

# Function to get Firebase download URL for a file in the requested format
def get_firebase_download_url(file_path):
    try:
        bucket = storage.bucket()  # Get the Firebase Storage bucket
        blob = bucket.blob(file_path)  # Get the blob object for the file path

        # URL encode the file path to handle spaces and special characters
        encoded_file_path = quote_plus(file_path)

        # Construct the URL with `alt=media` and a signed token
        url = f'https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{encoded_file_path}?alt=media&token={blob.generate_signed_url(version="v4", expiration=3600, method="GET")}'
        
        return url  # Return the generated URL

    except Exception as e:
        print(f"Error fetching URL for {file_path}: {e}")  # Log the error
        return None  # Return None if there's an error


# Iterate through the main folders (top-level categories)
for idx, category_name in enumerate(os.listdir(base_directory), start=1):
    category_path = os.path.join(base_directory, category_name)
    
    if os.path.isdir(category_path):  # Ensure it's a directory
        # Add category to the categories list
        categories.append({
            'id': idx,
            'name': category_name,
            'bgColor': '#98C1D9'  # Placeholder color, you can customize per category
        })
        
        # Subcategories for this category
        category_subcategories = []
        
        # Iterate through the subfolders (subcategories)
        for sub_idx, subcategory_name in enumerate(os.listdir(category_path), start=1):
            subcategory_path = os.path.join(category_path, subcategory_name)
            
            if os.path.isdir(subcategory_path):  # Ensure it's a directory
                # Try to get the URL for the .MOV file first, and if it doesn't exist, try .mp4
                video_url = None
                try:
                    video_url = get_firebase_download_url(f'FSL_Videos/{subcategory_name}.MOV')  # Try MOV first
                except Exception as e:
                    print(f"Error fetching MOV for {subcategory_name}: {e}")
                
                if not video_url:
                    try:
                        video_url = get_firebase_download_url(f'FSL_Videos/{subcategory_name}.mp4')  # Then try MP4
                    except Exception as e:
                        print(f"Error fetching MP4 for {subcategory_name}: {e}")

                category_subcategories.append({
                    'id': sub_idx,
                    'title': subcategory_name,
                    'videoUrl': video_url
                })
        
        # Add subcategories to the sub_categories dictionary
        sub_categories[category_name] = category_subcategories

# Combine categories and sub_categories into the final structure
output = {
    'categories': categories,
    'subCategories': sub_categories
}

# Save to a JSON file
with open('categories_subcategories.json', 'w') as json_file:
    json.dump(output, json_file, indent=4)

# Optionally, print the result
print("JSON file 'categories_subcategories.json' has been created.")
