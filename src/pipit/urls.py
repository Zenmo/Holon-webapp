import typing

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import URLPattern, URLResolver, include, path, re_path
from django.views import defaults as default_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from wagtail import urls as wagtail_urls
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.contrib.sitemaps.views import sitemap
from wagtail.documents import urls as wagtaildocs_urls

from api.router import api_router as rest_api_router
from holon.urls import urlpatterns as holon_urls
from holon.urls import urlpatterns_v2 as holon_urls_v2
from main.views.csfr import get_csrf
from main.views.error_500 import error_500_view
from main.views.page_not_found import PageNotFoundView
from nextjs.api import api_router

handler404 = PageNotFoundView.as_view()
handler500 = error_500_view
csrf = get_csrf

URL = typing.Union[URLPattern, URLResolver]
URLList = typing.List[URL]

urlpatterns: URLList = []

if settings.DEBUG:
    urlpatterns += [
        path(
            "wt/400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),  # NOQA
        path(
            "wt/403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),  # NOQA
        path("wt/404/", handler404, kwargs={"exception": Exception("Page not Found")}),  # NOQA
        path("wt/500/", handler500, kwargs={"exception": Exception("Internal error")}),  # NOQA
        path("wt/csrf/", csrf),  # NOQA
    ]

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [path("wt/__debug__/", include(debug_toolbar.urls))]

urlpatterns += [
    path(settings.ADMIN_URL, admin.site.urls),
    path("wt/api/nextjs/v1/", api_router.urls),
    path("wt/api/nextjs/v1/", include(rest_api_router.urls)),
    path("wt/api/nextjs/v1/", include(holon_urls)),
    path("wt/api/nextjs/v2/", include(holon_urls_v2)),
    path("wt/cms/", include(wagtailadmin_urls)),
    path("wt/documents/", include(wagtaildocs_urls)),
    path("wt/sitemap.xml", sitemap, name="sitemap"),
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

urlpatterns += [re_path(r"", include(wagtail_urls))]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
