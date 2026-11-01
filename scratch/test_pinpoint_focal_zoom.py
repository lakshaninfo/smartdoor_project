import math

rx_deg = 56.0
rz_deg = -34.0
rx = math.radians(rx_deg)
rz = math.radians(rz_deg)

stage_w = 1000
stage_h = 600
stage_cx = stage_w / 2
stage_cy = stage_h / 2

cam_zoom_old = 0.85
s_old = cam_zoom_old * 1.0 # say base scale is 1.0

cam_cx_old = 600.0
cam_cy_old = 300.0

# Mouse is at (750, 420) on screen
mouse_x = 750.0
mouse_y = 420.0

off_x = mouse_x - stage_cx
off_y = mouse_y - stage_cy

# Step 1: Find the world point P under the mouse cursor at s_old
# Forward: off = s * R * (P - C)
# R * (P - C) = off / s
y1_old = (off_y / s_old) / math.cos(rx)
px = cam_cx_old + (off_x / s_old) * math.cos(rz) + y1_old * math.sin(rz)
py = cam_cy_old - (off_x / s_old) * math.sin(rz) + y1_old * math.cos(rz)

print(f"World point P under mouse: ({px:.2f}, {py:.2f})")

# Step 2: Now user scrolls wheel to zoom in to cam_zoom_new = 1.15
cam_zoom_new = 1.15
s_new = cam_zoom_new * 1.0

# Calculate new camera center using our formula:
d_screen_x = off_x * (1.0 / s_old - 1.0 / s_new)
d_screen_y = off_y * (1.0 / s_old - 1.0 / s_new)

y1_diff = d_screen_y / math.cos(rx)
dcx = d_screen_x * math.cos(rz) + y1_diff * math.sin(rz)
dcy = -d_screen_x * math.sin(rz) + y1_diff * math.cos(rz)

cam_cx_new = cam_cx_old + dcx
cam_cy_new = cam_cy_old + dcy

print(f"Old cam center: ({cam_cx_old:.2f}, {cam_cy_old:.2f}) -> New cam center: ({cam_cx_new:.2f}, {cam_cy_new:.2f})")

# Step 3: Verify where world point P lands on screen at s_new with new camera center:
# Forward:
dx_new = px - cam_cx_new
dy_new = py - cam_cy_new
screen_off_x_new = s_new * (dx_new * math.cos(rz) - dy_new * math.sin(rz))
screen_off_y_new = s_new * (dx_new * math.sin(rz) + dy_new * math.cos(rz)) * math.cos(rx)

screen_x_new = stage_cx + screen_off_x_new
screen_y_new = stage_cy + screen_off_y_new

print(f"Projected screen position after zoom: ({screen_x_new:.2f}, {screen_y_new:.2f})")
print(f"Difference from original mouse: dx={screen_x_new - mouse_x:.6f}, dy={screen_y_new - mouse_y:.6f}")
assert abs(screen_x_new - mouse_x) < 1e-6 and abs(screen_y_new - mouse_y) < 1e-6
print("PERFECT MATCH! World point under mouse cursor stayed at the exact same screen position!")

