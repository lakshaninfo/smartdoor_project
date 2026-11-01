from django.db import models

class DoorLog(models.Model):
    mac_address = models.CharField(max_length=50, db_index=True)
    door_name = models.CharField(max_length=100, db_index=True)
    door_state = models.CharField(max_length=10, db_index=True)
    battery = models.IntegerField(default=100)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp'], name='idx_doorlog_time_desc'),
            models.Index(fields=['mac_address', '-timestamp'], name='idx_doorlog_mac_time'),
            models.Index(fields=['door_name', '-timestamp'], name='idx_doorlog_name_time'),
            models.Index(fields=['door_state', '-timestamp'], name='idx_doorlog_state_time'),
        ]

    def __str__(self):
        return f"{self.door_name} - {self.door_state} ({self.battery}%) at {self.timestamp}"
