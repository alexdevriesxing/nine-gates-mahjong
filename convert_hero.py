import os
from PIL import Image

input_path = r"c:\Users\HoboHydrauliekSales\Downloads\ChatGPT Image Jun 24, 2026, 09_35_13 PM.png"
output_path = r"c:\Users\HoboHydrauliekSales\Downloads\NineGatesMahjong\public\hero-bg.jpg"

try:
    img = Image.open(input_path).convert("RGB")
    img.save(output_path, "JPEG", quality=85)
    print("Hero image converted and saved to", output_path)
except Exception as e:
    print(f"Error processing image: {e}")
