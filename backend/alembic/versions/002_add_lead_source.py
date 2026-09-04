"""Add source column to lead tables for Product Finder attribution

Revision ID: 002_add_lead_source
Revises: 001_initial_schema
Create Date: 2026-08-27 13:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '002_add_lead_source'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add source column to quote_requests
    with op.batch_alter_table('quote_requests', schema=None) as batch_op:
        batch_op.add_column(sa.Column('source', sa.String(length=50), nullable=True, server_default='DIRECT'))
        batch_op.create_index(batch_op.f('ix_quote_requests_source'), ['source'], unique=False)

    # Add source column to sample_requests
    with op.batch_alter_table('sample_requests', schema=None) as batch_op:
        batch_op.add_column(sa.Column('source', sa.String(length=50), nullable=True, server_default='DIRECT'))
        batch_op.create_index(batch_op.f('ix_sample_requests_source'), ['source'], unique=False)

    # Add source column to distributor_applications
    with op.batch_alter_table('distributor_applications', schema=None) as batch_op:
        batch_op.add_column(sa.Column('source', sa.String(length=50), nullable=True, server_default='DIRECT'))
        batch_op.create_index(batch_op.f('ix_distributor_applications_source'), ['source'], unique=False)

    # Add source column to contact_messages
    with op.batch_alter_table('contact_messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('source', sa.String(length=50), nullable=True, server_default='DIRECT'))
        batch_op.create_index(batch_op.f('ix_contact_messages_source'), ['source'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('contact_messages', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_contact_messages_source'))
        batch_op.drop_column('source')

    with op.batch_alter_table('distributor_applications', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_distributor_applications_source'))
        batch_op.drop_column('source')

    with op.batch_alter_table('sample_requests', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_sample_requests_source'))
        batch_op.drop_column('source')

    with op.batch_alter_table('quote_requests', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_quote_requests_source'))
        batch_op.drop_column('source')
