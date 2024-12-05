import cv2
import mediapipe as mp
import os
import shutil

# Initialize Mediapipe Hand Detection
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_draw = mp.solutions.drawing_utils

# Function to process a single video and rename it to the parent folder name
def process_video(video_path, output_folder):
    if not os.path.exists(video_path):
        print(f"Error: Video file {video_path} does not exist.")
        return

    parent_folder_name = os.path.basename(os.path.dirname(video_path))

    # Get the file extension
    file_extension = os.path.splitext(video_path)[1]
    renamed_video_path = os.path.join(output_folder, f"{parent_folder_name}{file_extension}")
    
    # Rename and move the video file to the output folder
    shutil.move(video_path, renamed_video_path)
    print(f"Renamed and moved video to: {renamed_video_path}")

# Function to process videos with a per-folder limit
def process_videos_in_folders_per_folder(root_folder, output_folder, max_videos_per_folder):
    for root, _, files in os.walk(root_folder):
        video_files = [os.path.join(root, file) for file in files if file.lower().endswith(('.mp4', '.avi', '.mov'))]
        if len(video_files) > max_videos_per_folder:
            print(f"Processing first {max_videos_per_folder} videos in folder: {root}")
            video_files = video_files[:max_videos_per_folder]
        elif video_files:
            print(f"Processing all {len(video_files)} video(s) in folder: {root}")
        
        for video_path in video_files:
            process_video(video_path, output_folder)

# Set the number of videos per folder
max_videos_per_folder = 1  # Change as needed

# Define input and output folders
root_folder = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL'
output_folder = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL\output_videos'
os.makedirs(output_folder, exist_ok=True)

# Process videos with a per-folder limit
process_videos_in_folders_per_folder(root_folder, output_folder, max_videos_per_folder)
