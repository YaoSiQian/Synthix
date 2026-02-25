from fastapi import APIRouter

from app.api.v1.endpoints import users, reactions, chemicals, awards, admin_awards, admin_monitoring

api_router = APIRouter()

api_router.include_router(
    users.router, prefix="/auth", tags=["authentication"])

api_router.include_router(
    reactions.router, prefix="/reactions", tags=["reactions"])

api_router.include_router(
    chemicals.router, prefix="/chemicals", tags=["chemicals"])

api_router.include_router(
    awards.router, prefix="/awards", tags=["awards"])

api_router.include_router(
    admin_awards.router, prefix="/admin/awards", tags=["admin-awards"])

api_router.include_router(
    admin_monitoring.router, prefix="/admin/monitoring", tags=["admin-monitoring"])
