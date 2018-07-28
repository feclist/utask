from django.conf.urls import url
from . import views
from rest_framework import routers
from django.urls import include

from rest_framework.schemas import get_schema_view
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
router.register(r'api/user', views.UserViewSet)
router.register(r'api/task', views.TaskViewSet)
router.register(r'api/live_task', views.LiveTaskReadOnlyViewSet)

schema_view = get_schema_view(title='Pastebin API')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^schema/$', schema_view),
    url(r'^api/obtain-auth-token/$', obtain_auth_token),
    url(r'^api/user/me/wallet/buy/(?P<amount>[0-9]+)$', views.buy_tokens_from_company),
    url(r'^api/user/me/wallet/sell/(?P<amount>[0-9]+)$', views.sell_tokens_to_company),
    url(r'^api/user/me/wallet/transactions', views.list_transactions),
    url(r'^api/user/me/wallet/transactions/(?P<transaction_id>[0-9]+)$', views.retrieve_transaction),
    url(r'^api/user/me/wallet', views.wallet_detail),
]
