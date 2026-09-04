"""Initial schema creation for Lioc B2B Platform

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-27 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Product Categories
    op.create_table(
        'product_categories',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_product_categories_id'), 'product_categories', ['id'], unique=False)
    op.create_index(op.f('ix_product_categories_name'), 'product_categories', ['name'], unique=True)
    op.create_index(op.f('ix_product_categories_slug'), 'product_categories', ['slug'], unique=True)

    # 2. Industries
    op.create_table(
        'industries',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('tagline', sa.String(length=255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('key_challenges', sa.Text(), nullable=True),
        sa.Column('recommended_solutions', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_industries_id'), 'industries', ['id'], unique=False)
    op.create_index(op.f('ix_industries_name'), 'industries', ['name'], unique=True)
    op.create_index(op.f('ix_industries_slug'), 'industries', ['slug'], unique=True)

    # 3. Products
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('slug', sa.String(length=180), nullable=False),
        sa.Column('sku', sa.String(length=50), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.Column('short_description', sa.String(length=300), nullable=False),
        sa.Column('full_description', sa.Text(), nullable=False),
        sa.Column('product_image', sa.String(length=255), nullable=True),
        sa.Column('available_sizes', sa.String(length=255), nullable=True),
        sa.Column('usage_instructions', sa.Text(), nullable=True),
        sa.Column('benefits', sa.Text(), nullable=True),
        sa.Column('safety_information', sa.Text(), nullable=True),
        sa.Column('technical_information', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='ACTIVE'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('is_bestseller', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['product_categories.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)
    op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)
    op.create_index(op.f('ix_products_slug'), 'products', ['slug'], unique=True)
    op.create_index(op.f('ix_products_sku'), 'products', ['sku'], unique=True)
    op.create_index(op.f('ix_products_category_id'), 'products', ['category_id'], unique=False)
    op.create_index(op.f('ix_products_status'), 'products', ['status'], unique=False)

    # 4. Product Industries association
    op.create_table(
        'product_industries',
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('industry_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['industry_id'], ['industries.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('product_id', 'industry_id')
    )

    # 5. Product Images
    op.create_table(
        'product_images',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(length=255), nullable=False),
        sa.Column('alt_text', sa.String(length=150), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_primary', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_product_images_id'), 'product_images', ['id'], unique=False)
    op.create_index(op.f('ix_product_images_product_id'), 'product_images', ['product_id'], unique=False)

    # 6. Quote Requests
    op.create_table(
        'quote_requests',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('reference_id', sa.String(length=50), nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('company_name', sa.String(length=200), nullable=False),
        sa.Column('phone_number', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('business_type', sa.String(length=100), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('product_interested_in', sa.String(length=255), nullable=True),
        sa.Column('estimated_quantity', sa.String(length=100), nullable=True),
        sa.Column('monthly_requirement', sa.String(length=100), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='NEW'),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quote_requests_id'), 'quote_requests', ['id'], unique=False)
    op.create_index(op.f('ix_quote_requests_reference_id'), 'quote_requests', ['reference_id'], unique=True)
    op.create_index(op.f('ix_quote_requests_company_name'), 'quote_requests', ['company_name'], unique=False)
    op.create_index(op.f('ix_quote_requests_phone_number'), 'quote_requests', ['phone_number'], unique=False)
    op.create_index(op.f('ix_quote_requests_status'), 'quote_requests', ['status'], unique=False)
    op.create_index(op.f('ix_quote_requests_created_at'), 'quote_requests', ['created_at'], unique=False)

    # 7. Sample Requests
    op.create_table(
        'sample_requests',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('reference_id', sa.String(length=50), nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('company_name', sa.String(length=200), nullable=False),
        sa.Column('phone_number', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('business_type', sa.String(length=100), nullable=False),
        sa.Column('business_address', sa.Text(), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('product_interested_in', sa.String(length=255), nullable=False),
        sa.Column('expected_monthly_requirement', sa.String(length=100), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='PENDING'),
        sa.Column('courier_tracking_info', sa.String(length=255), nullable=True),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sample_requests_id'), 'sample_requests', ['id'], unique=False)
    op.create_index(op.f('ix_sample_requests_reference_id'), 'sample_requests', ['reference_id'], unique=True)
    op.create_index(op.f('ix_sample_requests_company_name'), 'sample_requests', ['company_name'], unique=False)
    op.create_index(op.f('ix_sample_requests_phone_number'), 'sample_requests', ['phone_number'], unique=False)
    op.create_index(op.f('ix_sample_requests_status'), 'sample_requests', ['status'], unique=False)
    op.create_index(op.f('ix_sample_requests_created_at'), 'sample_requests', ['created_at'], unique=False)

    # 8. Distributor Applications
    op.create_table(
        'distributor_applications',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('reference_id', sa.String(length=50), nullable=False),
        sa.Column('applicant_name', sa.String(length=150), nullable=False),
        sa.Column('company_name', sa.String(length=200), nullable=False),
        sa.Column('phone_number', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('gst_number', sa.String(length=50), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('years_experience', sa.String(length=50), nullable=True),
        sa.Column('current_products_distributed', sa.Text(), nullable=True),
        sa.Column('investment_capacity', sa.String(length=100), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='NEW'),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_distributor_applications_id'), 'distributor_applications', ['id'], unique=False)
    op.create_index(op.f('ix_distributor_applications_reference_id'), 'distributor_applications', ['reference_id'], unique=True)
    op.create_index(op.f('ix_distributor_applications_company_name'), 'distributor_applications', ['company_name'], unique=False)
    op.create_index(op.f('ix_distributor_applications_phone_number'), 'distributor_applications', ['phone_number'], unique=False)
    op.create_index(op.f('ix_distributor_applications_status'), 'distributor_applications', ['status'], unique=False)
    op.create_index(op.f('ix_distributor_applications_created_at'), 'distributor_applications', ['created_at'], unique=False)

    # 9. Contact Messages
    op.create_table(
        'contact_messages',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('reference_id', sa.String(length=50), nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('phone_number', sa.String(length=50), nullable=False),
        sa.Column('company_name', sa.String(length=200), nullable=True),
        sa.Column('subject', sa.String(length=255), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='NEW'),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contact_messages_id'), 'contact_messages', ['id'], unique=False)
    op.create_index(op.f('ix_contact_messages_reference_id'), 'contact_messages', ['reference_id'], unique=True)
    op.create_index(op.f('ix_contact_messages_phone_number'), 'contact_messages', ['phone_number'], unique=False)
    op.create_index(op.f('ix_contact_messages_status'), 'contact_messages', ['status'], unique=False)
    op.create_index(op.f('ix_contact_messages_created_at'), 'contact_messages', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_table('contact_messages')
    op.drop_table('distributor_applications')
    op.drop_table('sample_requests')
    op.drop_table('quote_requests')
    op.drop_table('product_images')
    op.drop_table('product_industries')
    op.drop_table('products')
    op.drop_table('industries')
    op.drop_table('product_categories')
