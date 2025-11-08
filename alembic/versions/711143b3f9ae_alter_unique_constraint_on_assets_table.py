"""alter unique constraint on assets table

Revision ID: 711143b3f9ae
Revises: faf4a4b5e165
Create Date: 2025-11-08 12:51:02.385526

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '711143b3f9ae'
down_revision: Union[str, Sequence[str], None] = 'faf4a4b5e165'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop any unique index on cusip if exists
    conn = op.get_bind()

    result = conn.exec_driver_sql("PRAGMA index_list('assets')").fetchall()
    for row in result:
        index_name = row[1]  # second column is index name
        is_unique = bool(row[2])
        if is_unique and "cusip" in index_name:
            conn.exec_driver_sql(f"DROP INDEX IF EXISTS {index_name}")

    # Add new composite unique constraint
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.create_unique_constraint(
            "uq_user_asset_cusip", ["cusip", "created_by"]
        )


def downgrade():
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.drop_constraint("uq_user_asset_cusip", type_="unique")

    # Recreate original unique index on cusip
    op.create_index(
        "unique_cusip_idx", "assets", ["cusip"], unique=True
    )