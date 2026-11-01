from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('api/update', views.esp32_api, name='esp32_api'),
    path('api/status', views.live_status_api, name='live_status_api'),
    path('api/status/', views.live_status_api),
    path('api/live_status', views.live_status_api),
    path('api/live_status/', views.live_status_api),
    path('api/logs', views.full_logs_api, name='full_logs_api'),
    path('api/login', views.login_api, name='login_api'),
    path('api/logout', views.logout_api, name='logout_api'),
    path('api/register', views.register_api, name='register_api'),
    path('api/users', views.user_info_api, name='user_info_api'),
    path('api/users/delete/<int:user_id>', views.delete_user_api, name='delete_user_api'),
    path('api/devices', views.database_devices_api, name='database_devices_api'),
    path('api/devices/delete/<str:mac_address>', views.delete_device_logs_api, name='delete_device_logs_api'),
    path('manifest.json', views.manifest_json, name='manifest_json'),
    # Database Studio APIs (Admin Superuser Only)
    path('api/database/overview', views.db_overview_api, name='db_overview_api'),
    path('api/database/table/<str:table_name>/schema', views.db_table_schema_api, name='db_table_schema_api'),
    path('api/database/table/<str:table_name>/data', views.db_table_data_api, name='db_table_data_api'),
    path('api/database/table/<str:table_name>/insert', views.db_insert_row_api, name='db_insert_row_api'),
    path('api/database/table/<str:table_name>/update', views.db_update_row_api, name='db_update_row_api'),
    path('api/database/table/<str:table_name>/delete', views.db_delete_row_api, name='db_delete_row_api'),
    path('api/database/table/<str:table_name>/truncate', views.db_truncate_table_api, name='db_truncate_table_api'),
    path('api/database/table/<str:table_name>/drop', views.db_drop_table_api, name='db_drop_table_api'),
    path('api/database/table/create', views.db_create_table_api, name='db_create_table_api'),
    path('api/database/query', views.db_query_runner_api, name='db_query_runner_api'),
    path('api/database/backup', views.db_backup_download_api, name='db_backup_download_api'),
    path('api/database/table/<str:table_name>/export', views.db_export_table_api, name='db_export_table_api'),
]
