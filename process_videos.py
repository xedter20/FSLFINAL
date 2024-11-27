import cv2
import mediapipe as mp
import os
import numpy as np

# Initialize Mediapipe Hand Detection
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_draw = mp.solutions.drawing_utils

# Function to process a single video and detect hands
def process_video(video_path, output_folder):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video file: {video_path}")
        return

    parent_folder_name = os.path.basename(os.path.dirname(video_path))
    video_output_folder = os.path.join(output_folder, parent_folder_name)
    os.makedirs(video_output_folder, exist_ok=True)

    frame_number = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_number += 1
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            output_path = os.path.join(video_output_folder, f"{parent_folder_name}_frame_{frame_number}.jpg")
            cv2.imwrite(output_path, frame)
            print(f"Saved image: {output_path}")
            
            for hand_landmarks in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        cv2.imshow('Frame', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

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
root_folder = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL\survival_FSL'
output_folder = r'C:\DexDev\my_Small_projects\FSL\FINAL_WORKING\src\assests\FSL\survival_FSL\output_images'
os.makedirs(output_folder, exist_ok=True)

# Process videos with a per-folder limit
process_videos_in_folders_per_folder(root_folder, output_folder, max_videos_per_folder)
