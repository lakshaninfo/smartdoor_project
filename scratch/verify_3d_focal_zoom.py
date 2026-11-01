import math

# Let's test with rx = 56 deg, rz = -34 deg
rx_deg = 56.0
rz_deg = -34.0
rx = math.radians(rx_deg)
rz = math.radians(rz_deg)

# Forward projection from ground (dx, dy) to screen (offX, offY)
# A: rotateZ(rz):
# [ cos(rz)  -sin(rz) ] [dx]
# [ sin(rz)   cos(rz) ] [dy]
# B: rotateX(rx):
# offX = x1
# offY = y1 * cos(rx)
#
# So:
# offX = dx * cos(rz) - dy * sin(rz)
# offY = (dx * sin(rz) + dy * cos(rz)) * cos(rx)

# Now, given (offX, offY), how do we solve for (dx, dy)?
# From offY:
# y1 = offY / cos(rx)
# Now we have:
# dx * cos(rz) - dy * sin(rz) = offX
# dx * sin(rz) + dy * cos(rz) = y1
#
# Inverse of 2D rotation by rz is rotation by -rz:
# dx = offX * cos(rz) + y1 * sin(rz)
# dy = -offX * sin(rz) + y1 * cos(rz)

# Let's verify with test points:
test_points = [(100, 200), (-50, 80), (300, -120)]
for dx, dy in test_points:
    offX = dx * math.cos(rz) - dy * math.sin(rz)
    offY = (dx * math.sin(rz) + dy * math.cos(rz)) * math.cos(rx)
    
    # Invert:
    y1 = offY / math.cos(rx)
    rec_dx = offX * math.cos(rz) + y1 * math.sin(rz)
    rec_dy = -offX * math.sin(rz) + y1 * math.cos(rz)
    
    print(f"Original: ({dx}, {dy}) -> Screen: ({offX:.2f}, {offY:.2f}) -> Recovered: ({rec_dx:.2f}, {rec_dy:.2f})")
    assert abs(dx - rec_dx) < 1e-6 and abs(dy - rec_dy) < 1e-6
print("INVERSE IS 100% EXACT!")

