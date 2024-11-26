import cv2
import mediapipe as mp
import os
import numpy as np

# Initialize Mediapipe Hand Detection
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_draw = mp.solutions.drawing_utils

# Function to process video and detect hands
def process_video(video_path, output_folder):
    # Read the video
    cap = cv2.VideoCapture(video_path)
    
    # Ensure the video opened correctly
    if not cap.isOpened():
        print(f"Error opening video file: {video_path}")
        return

    # Get the parent folder name of the video
    parent_folder_name = os.path.basename(os.path.dirname(video_path))
    
    # Create the output subfolder for this parent folder
    video_output_folder = os.path.join(output_folder, parent_folder_name)
    os.makedirs(video_output_folder, exist_ok=True)

    # Frame processing loop
    frame_number = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_number += 1
        # Convert frame to RGB (Mediapipe works in RGB format)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        # Check if hand is detected
        if results.multi_hand_landmarks:
            # Save the frame as an image
            output_path = os.path.join(video_output_folder, f"{parent_folder_name}_frame_{frame_number}.jpg")
            cv2.imwrite(output_path, frame)
            print(f"Saved image: {output_path}")
            
            # Draw hand landmarks (optional)
            for hand_landmarks in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        # Display the frame with hand landmarks (optional)
        cv2.imshow('Frame', frame)
        
        # Exit on pressing 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

# Function to process videos with a limit on number of videos
def process_videos_in_folders(root_folder, output_folder, max_videos):
    video_files = []
    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.lower().endswith(('.mp4', '.avi', '.mov')):  # Check for video files
                video_files.append(os.path.join(root, file))

    # If there are fewer videos than max_videos, process them all, otherwise slice the list
    if len(video_files) < max_videos:
        print(f"Only {len(video_files)} video(s) found, processing all of them.")
        videos_to_process = video_files
    else:
        videos_to_process = video_files[:max_videos]
        print(f"Processing {max_videos} video(s).")

    # Process the selected videos
    for video_path in videos_to_process:
        process_video(video_path, output_folder)

# Define the number of videos to process (set this value directly)
max_videos = 1  # Change this value to the number of videos you want to process

# Define your input and output folders
root_folder = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL\color_FSL\Yellow'
output_folder = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL\color_FSL\output_images'
# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Process the videos
process_videos_in_folders(root_folder, output_folder, max_videos)
