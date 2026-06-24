import os
import shutil
from rembg import remove
from PIL import Image

input_path = r"c:\Users\HoboHydrauliekSales\Downloads\ChatGPT Image Jun 24, 2026, 09_27_17 PM.png"
output_path = r"c:\Users\HoboHydrauliekSales\Downloads\NineGatesMahjong\public\logo.png"

try:
    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input_data = i.read()
            output_data = remove(input_data)
            o.write(output_data)

    print("Logo processed and saved as transparent PNG at", output_path)
except Exception as e:
    print(f"Error processing image: {e}")
