from django.conf.urls import url
from . import views
from rest_framework import routers
from django.urls import include


router = routers.DefaultRouter()
router.register(r'api/user', views.UserViewSet)
router.register(r'api/task', views.TaskViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
