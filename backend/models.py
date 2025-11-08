"""
SQLAlchemy models for Assets, Trades, and related entities.
"""
import enum
from sqlalchemy import Enum as SAEnum
from sqlalchemy import Table, Column, Integer, String, Date, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy import Enum as SAEnum

class AssetType(str, enum.Enum):
    BOND                      = "Bond"
    STOCK                     = "Stock"
    OTHER                     = "Other"
    CORPORATE_BOND            = "Corporate Bond"
    GOVERNMENT_BOND           = "Government Bond"
    TERM_LOAN                 = "Term Loan"
    REVOLVER                  = "Revolver"
    EQUITY                    = "Equity"
    EQUITY_OPTION             = "Equity Option"
    TRADE_CLAIM               = "Trade Claim"
    SINGLE_NAME_CDS           = "Single Name CDS"
    INDEX_CDS                 = "Index CDS"
    DELAYED_DRAW_TERM_LOAN    = "Delayed Draw Term Loan"

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    cusip = Column(String, index=True, nullable=False)
    type = Column(SAEnum(AssetType, name="asset_type"), nullable=False)
    display_name = Column(String, nullable=False)
    issuer = Column(String, nullable=True)
    deal_name = Column(String, nullable=True)
    spread_coupon = Column(Numeric(20, 4), nullable=True)
    maturity = Column(Date, nullable=True)
    payment_rank = Column(String, nullable=True)
    moodys_cfr = Column(String, nullable=True)
    moodys_asset = Column(String, nullable=True)
    sp_cfr = Column(String, nullable=True)
    sp_asset = Column(String, nullable=True)
    amount_outstanding = Column(Integer, nullable=True)
    mark = Column(Numeric(20, 4), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))  # link to user
    creator = relationship("User")

    trades = relationship("Trade", back_populates="asset", cascade="all, delete")
    __table_args__ = (
        UniqueConstraint('cusip', 'created_by', name='uq_user_asset_cusip'),
    )

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    trade_date = Column(Date, nullable=False)
    settle_date = Column(Date, nullable=False)
    direction = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    quantity = Column(Numeric(20, 4), nullable=False)
    price = Column(Numeric(20, 4), nullable=False)
    counterparty = Column(String, nullable=True)
    fund_alloc = Column(String, nullable=True)
    sub_alloc = Column(String, nullable=True)
    agreement_type = Column(String, nullable=True)
    doc_type = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))  # link to user
    creator = relationship("User")
    
    asset = relationship("Asset", back_populates="trades")

class WatchListItem(Base):
    __tablename__ = "watchlist"
    __table_args__ = (
        UniqueConstraint('cusip', 'created_by', name='uq_user_cusip'),
    )

    id = Column(Integer, primary_key=True, index=True)
    cusip = Column(String, nullable=False, index=True)
    asset_type = Column(SAEnum(AssetType, name="asset_type"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)  # ✅ new column

    user = relationship("User", back_populates="watchlist")

# User ↔ Role (many-to-many)
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True)
)

# Role ↔ Action (many-to-many)
role_actions = Table(
    "role_actions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
    Column("action_id", Integer, ForeignKey("actions.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    watchlist = relationship("WatchListItem", back_populates="user", cascade="all, delete-orphan")
    def has_action(self, action_name: str) -> bool:
        """Check if this user has a given action permission"""
        return any(action.name == action_name for role in self.roles for action in role.actions)

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    users = relationship("User", secondary=user_roles, back_populates="roles")
    actions = relationship("Action", secondary=role_actions, back_populates="roles")

class Action(Base):
    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    roles = relationship("Role", secondary=role_actions, back_populates="actions")