from sqlalchemy.orm import Session
from backend import models
from backend.database import SessionLocal


def seed_data():
    db: Session = SessionLocal()

    # Define initial roles
    roles = ["admin", "trader"]

    # Define initial actions
    actions = [
        "CREATE_ASSET",
        "DELETE_ASSET",
        "VIEW_ASSET",
        "UPDATE_ASSET"
    ]

    # Insert roles if not exist
    for role_name in roles:
        if not db.query(models.Role).filter_by(name=role_name).first():
            db.add(models.Role(name=role_name))

    # Insert actions if not exist
    for action_name in actions:
        if not db.query(models.Action).filter_by(name=action_name).first():
            db.add(models.Action(name=action_name))

    db.commit()

    # Assign default actions to roles
    admin = db.query(models.Role).filter_by(name="admin").first()
    trader = db.query(models.Role).filter_by(name="trader").first()

    create_asset = db.query(models.Action).filter_by(name="CREATE_ASSET").first()
    delete_asset = db.query(models.Action).filter_by(name="DELETE_ASSET").first()
    view_asset = db.query(models.Action).filter_by(name="VIEW_ASSET").first()
    update_asset = db.query(models.Action).filter_by(name="UPDATE_ASSET").first()

    if admin and not admin.actions:
        admin.actions.extend([create_asset, delete_asset, view_asset, update_asset])

    if trader and not trader.actions:
        trader.actions.extend([create_asset, view_asset])

    db.commit()
    db.close()


if __name__ == "__main__":
    seed_data()
    print("✅ Database seeded successfully")
