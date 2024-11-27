import os
import json

# Base directory containing the folders
base_directory = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL'  # Change this to your directory path

categories = []
sub_categories = {}

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
                # Assuming the subfolder name is the title of the subcategory
                video_url = f'https://www.youtube.com/embed/{subcategory_name}'  # Example URL pattern
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
print(json.dumps(output, indent=4))
