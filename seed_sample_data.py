import os
import sys
import django
from datetime import timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth.models import User
from logger.models import DoorLog

def seed():
    print("=== SEEDING SAMPLE DATA ===")
    
    # 1. Ensure sample users
    sample_users = [
        ("admin", "admin@example.com", "admin123", True),
        ("operator1", "operator1@smartdoor.com", "smartdoor2026", False),
        ("sarah.connor", "sarah.c@smartdoor.com", "smartdoor2026", False),
        ("john.doe", "john.doe@smartdoor.com", "smartdoor2026", False),
        ("security_patrol", "patrol@security-ops.com", "smartdoor2026", False),
    ]
    
    for username, email, pwd, is_super in sample_users:
        u, created = User.objects.get_or_create(username=username, defaults={'email': email, 'is_superuser': is_super})
        if created:
            u.set_password(pwd)
            u.save()
            print(f"Created user: {username} ({email}) [Superuser: {is_super}]")
        else:
            u.email = email
            u.is_superuser = is_super
            u.save()
            print(f"Updated user: {username}")

    # 2. Devices definition
    devices = [
        {"name": "Main Entrance", "mac": "24:6F:28:AB:12:01", "batt": 98, "freq": 14},
        {"name": "Bedroom Door", "mac": "24:6F:28:AB:12:02", "batt": 85, "freq": 10},
        {"name": "Balcony Door", "mac": "24:6F:28:AB:12:03", "batt": 74, "freq": 8},
        {"name": "Kitchen Window", "mac": "24:6F:28:AB:12:04", "batt": 45, "freq": 6},
        {"name": "Living Room Window", "mac": "24:6F:28:AB:12:05", "batt": 18, "freq": 4},
        {"name": "Bedroom Window", "mac": "24:6F:28:AB:12:06", "batt": 91, "freq": 5},
        {"name": "Garage Entry", "mac": "24:6F:28:AB:12:07", "batt": 82, "freq": 12},
        {"name": "Back Garden Gate", "mac": "24:6F:28:AB:12:08", "batt": 62, "freq": 7},
    ]

    now = timezone.now()
    
    # Clear old door logs if any
    DoorLog.objects.all().delete()
    print("Cleared existing door logs.")

    logs_to_create = []

    # Generate realistic 48-hour access logs with natural distribution peaks
    # (Morning 7-9am peak, Afternoon 12-1pm, Evening 5-9pm peak)
    for dev in devices:
        mac = dev["mac"]
        name = dev["name"]
        batt = dev["batt"]
        freq = dev["freq"]

        # Generate timestamps over the last 48 hours
        # More logs in daytime (7 to 22), fewer at night (23 to 6)
        for h in range(48, 0, -1):
            target_hour = (now - timedelta(hours=h)).hour
            # Determine likelihood of event in this hour
            if 7 <= target_hour <= 9 or 17 <= target_hour <= 20:
                events_in_hour = random.randint(1, 3)
            elif 11 <= target_hour <= 14:
                events_in_hour = random.randint(1, 2)
            elif 0 <= target_hour <= 5:
                events_in_hour = 1 if random.random() < 0.15 else 0
            else:
                events_in_hour = 1 if random.random() < 0.5 else 0

            # Scale by device frequency
            if dev["name"] in ["Living Room Window", "Bedroom Window"] and events_in_hour > 1:
                events_in_hour = 1

            for ev in range(events_in_hour):
                minute = random.randint(0, 50)
                open_ts = now - timedelta(hours=h, minutes=minute)
                # An open event followed by a closed event a few minutes later
                duration_open = random.randint(1, 8)
                close_ts = open_ts + timedelta(minutes=duration_open)

                # Battery slight jitter
                log_batt = max(5, min(100, batt + random.randint(-2, 2)))

                # Create Open log
                log_open = DoorLog(
                    mac_address=mac,
                    door_name=name,
                    door_state="OPEN",
                    battery=log_batt
                )
                logs_to_create.append((open_ts, log_open))

                # Create Close log
                log_close = DoorLog(
                    mac_address=mac,
                    door_name=name,
                    door_state="CLOSED",
                    battery=log_batt
                )
                logs_to_create.append((close_ts, log_close))

        # Finally, generate the latest current status log (within the last 1-15 minutes)
        final_state = "CLOSED"
        # Let one device (e.g. Balcony Door) be temporarily OPEN so user can observe live open status badge
        if dev["name"] == "Balcony Door":
            final_state = "OPEN"

        final_ts = now - timedelta(minutes=random.randint(1, 10))
        final_log = DoorLog(
            mac_address=mac,
            door_name=name,
            door_state=final_state,
            battery=batt
        )
        logs_to_create.append((final_ts, final_log))

    # Sort logs by timestamp ascending
    logs_to_create.sort(key=lambda x: x[0])

    # Bulk create
    created_instances = []
    for ts, log_obj in logs_to_create:
        log_obj.save()
        # Update auto_now_add timestamp to historical simulated time
        DoorLog.objects.filter(id=log_obj.id).update(timestamp=ts)
        created_instances.append(log_obj)

    print(f"Successfully generated {len(created_instances)} historical access logs across {len(devices)} devices!")
    print("Seeding complete.")

if __name__ == '__main__':
    seed()
