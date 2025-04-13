import os
from builtins import object

from django.db import models
from PIL import Image
import cv2
from django.utils import timezone


class Images(models.Model):
    id = models.AutoField(primary_key=True)
    uploaded_at = models.DateTimeField(auto_now_add=timezone.now())  # When the image is added to your system
    image_file = models.ImageField(upload_to='images/')  # File path for the image
    processed = models.BooleanField(default=False)
    result = models.BooleanField(default=False)
    description = models.TextField(default='')

    # Capture metadata extracted from the image (often available in EXIF/XMP data)
    capture_date = models.DateTimeField(null=True, blank=True)  # When the image was actually captured
    gps_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    gps_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    gps_altitude = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    # Drone and camera-specific metadata
    drone_model = models.CharField(max_length=100, null=True, blank=True)  # e.g., "Phantom 4 Pro V2"
    # Camera settings such as ISO, shutter speed, aperture, focal length can be stored as a JSON object.
    camera_settings = models.JSONField(null=True, blank=True)

    # Orientation data if available (e.g., pitch, roll, yaw)
    orientation = models.JSONField(null=True, blank=True)

    # Optionally store the full EXIF data in a JSON field for future reference or processing.
    exif_data = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Image {self.id} captured at {self.capture_date}"

    def location(self):
        if self.gps_latitude is not None and self.gps_longitude is not None:
            return f" Lat: {self.gps_latitude}, Lng: {self.gps_longitude}, Alt: {self.gps_altitude}"
        return "Location not available"

    def size(self):
        return os.path.getsize(self.image_file.path)

    def resolution(self):
        image = cv2.imread(self.image_file.path)
        height, width = image.shape[:2]
        return f" {width} x {height}"
