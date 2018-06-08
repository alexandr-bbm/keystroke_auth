from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('client_example.urls')),
    url(r'^server/', include('keystroke_auth_server.urls')),
]
