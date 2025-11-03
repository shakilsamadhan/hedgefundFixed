"""add created_by and unique constraint to watchlist

Revision ID: 8c4ff23b350f
Revises: 88b05cda3415
Create Date: 2025-11-03 10:37:45.914323

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c4ff23b350f'
down_revision: Union[str, Sequence[str], None] = '88b05cda3415'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    with op.batch_alter_table("watchlist") as batch_op:
        batch_op.create_unique_constraint(
            "uq_user_cusip", ["cusip", "created_by"]
        )

def downgrade():
    with op.batch_alter_table("watchlist") as batch_op:
        batch_op.drop_constraint(
            "uq_user_cusip", type_="unique"
        )
