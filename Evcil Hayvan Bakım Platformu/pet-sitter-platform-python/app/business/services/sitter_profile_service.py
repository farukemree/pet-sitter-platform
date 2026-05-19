from sqlalchemy.orm import Session
# Senin paylaştığın modelin bulunduğu dosya yoluna göre import ediyoruz
from app.data.models.sitter_profile import SitterProfile

class SitterService:
    @staticmethod
    def update_or_create_profile(db: Session, user_id: int, profile_data: dict):
        profile = db.query(SitterProfile).filter(SitterProfile.user_id == user_id).first()
        
        if not profile:
            profile = SitterProfile(user_id=user_id)
            db.add(profile)
        
        profile.location = profile_data.get('location')
        profile.service_type = profile_data.get('service_type')
        profile.daily_rate = profile_data.get('daily_rate')
        profile.bio = profile_data.get('bio')
        profile.experience = profile_data.get('experience')
        
        db.commit()
        return profile