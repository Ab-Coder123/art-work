import os
import subprocess
import shutil

def process_video():
    input_video = "public/assets/video/intro_loader.mp4"
    if not os.path.exists(input_video):
        print("Error: input video not found")
        return

    # Check if light webm already exists
    if not os.path.exists("public/assets/video/intro_loader_light.webm"):
        print("[1/2] Encoding Light Mode Transparent WebM (VP9 + Alpha)...")
        cmd_light = [
            "ffmpeg", "-y",
            "-i", input_video,
            "-vf", "colorkey=0xfaf8f5:0.09:0.08",
            "-c:v", "libvpx-vp9",
            "-pix_fmt", "yuva420p",
            "-b:v", "2M",
            "-crf", "22",
            "-c:a", "libopus",
            "-b:a", "128k",
            "public/assets/video/intro_loader_light.webm"
        ]
        subprocess.run(cmd_light, check=True)
        print("[OK] Created intro_loader_light.webm")
    else:
        print("[SKIP] intro_loader_light.webm already exists")

    print("[2/2] Encoding Dark Mode Transparent WebM (VP9 + Alpha + White Ink)...")
    cmd_dark = [
        "ffmpeg", "-y",
        "-i", input_video,
        "-vf", "negate,hue=h=180,colorkey=0x07090b:0.09:0.08",
        "-c:v", "libvpx-vp9",
        "-pix_fmt", "yuva420p",
        "-b:v", "2M",
        "-crf", "22",
        "-c:a", "libopus",
        "-b:a", "128k",
        "public/assets/video/intro_loader_dark.webm"
    ]
    subprocess.run(cmd_dark, check=True)
    print("[OK] Created intro_loader_dark.webm")

    # Set default intro_loader.webm
    shutil.copy("public/assets/video/intro_loader_light.webm", "public/assets/video/intro_loader.webm")
    print("[OK] Updated default intro_loader.webm")

if __name__ == "__main__":
    process_video()
