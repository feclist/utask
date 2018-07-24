from django.conf.urls import url
from . import views
from rest_framework import routers
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'api/user', views.UserViewSet)

urlpatterns = [
    path('api/task/', views.TaskListCreate.as_view()),
    url(r'^', include(router.urls)),
]
