from django.db import models


class User(models.Model):
    login = models.CharField(max_length=200, blank=False)


class KeyStroke(models.Model):
    LOGIN_TYPE = 1
    PASSWORD_TYPE = 2

    KEYSTROKE_TYPES = (
        (LOGIN_TYPE, 'Login'),
        (PASSWORD_TYPE, 'Password'),
    )

    flight_times = models.TextField(blank=False)
    dwell_times = models.TextField(blank=False)
    type = models.IntegerField(choices=KEYSTROKE_TYPES, blank=False)
    is_temporary = models.BooleanField(default=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
