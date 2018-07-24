from django.conf.urls import url
from . import views
from rest_framework import routers
from django.urls import include

from rest_framework.schemas import get_schema_view

router = routers.DefaultRouter()
router.register(r'api/user', views.UserViewSet)
router.register(r'api/task', views.TaskViewSet)
router.register(r'api/live_task', views.LiveTaskReadOnlyViewSet)

schema_view = get_schema_view(title='Pastebin API')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^schema/$', schema_view),
]
