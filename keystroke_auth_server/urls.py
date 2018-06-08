from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^register_keystroke/', views.register_keystroke, name='register_keystroke'),
    url(r'^authenticate_keystroke/', views.authenticate_keystroke, name='authenticate_keystroke'),
]
