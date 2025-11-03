"""Add created_by to watch_list_items

Revision ID: 88b05cda3415
Revises: 587201ae9c80
Create Date: 2025-11-03 09:49:45.714118

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '88b05cda3415'
down_revision: Union[str, Sequence[str], None] = '587201ae9c80'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Step 1: add column as nullable
    op.add_column('watchlist', sa.Column('created_by', sa.Integer(), nullable=True))

    # Step 2: set temporary default value for existing rows
    op.execute("UPDATE watchlist SET created_by = 1")  # ✅ update all rows

    # Step 3: alter the column to NOT NULL
    # op.alter_column('watchlist', 'created_by', nullable=False)


def downgrade():
    op.drop_column('watchlist', 'created_by')


