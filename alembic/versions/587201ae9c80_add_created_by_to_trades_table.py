"""Add created_by to trades table

Revision ID: 587201ae9c80
Revises: 
Create Date: 2025-11-01 10:22:52.079378

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '587201ae9c80'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    with op.batch_alter_table("trades", recreate="always") as batch_op:
        batch_op.add_column(sa.Column('created_by', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_trades_created_by_users",
            "users",
            ["created_by"],
            ["id"]
        )

def downgrade():
    with op.batch_alter_table("trades", recreate="always") as batch_op:
        batch_op.drop_constraint("fk_trades_created_by_users", type_="foreignkey")
        batch_op.drop_column('created_by')

    # ### end Alembic commands ###
