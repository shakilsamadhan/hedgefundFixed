"""replace table with new table

Revision ID: faf4a4b5e165
Revises: 8c4ff23b350f
Create Date: 2025-11-03 11:04:30.992137

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'faf4a4b5e165'
down_revision: Union[str, Sequence[str], None] = '8c4ff23b350f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop old table
    op.drop_table('watchlist')

    # Create new table with desired structure
    op.create_table(
        'watchlist',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('cusip', sa.String, nullable=False, index=True),
        sa.Column('asset_type', sa.String, nullable=False, index=True),
        sa.Column('created_by', sa.Integer, nullable=False),
        sa.UniqueConstraint('cusip', 'created_by', name='uq_user_cusip')
    )

def downgrade():
    # Optional: drop the table if you want to rollback
    op.drop_table('watchlist')