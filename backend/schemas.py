"""
Pydantic schemas for request and response models.
"""
from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from .models import AssetType

class AssetBase(BaseModel):
    cusip: str
    type: AssetType
    display_name: str
    issuer: Optional[str] = None
    deal_name: Optional[str] = None
    spread_coupon: Optional[float] = None
    maturity: Optional[date] = None
    payment_rank: Optional[str] = None
    moodys_cfr: Optional[str] = None
    moodys_asset: Optional[str] = None
    sp_cfr: Optional[str] = None
    sp_asset: Optional[str] = None
    amount_outstanding: Optional[int] = None
    mark: Optional[float] = None
    created_by: Optional[int] = None 

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    class Config:
        from_attributes = True

class AssetFetch(BaseModel):
    cusip: str
    asset_type: AssetType


class TradeBase(BaseModel):
    trade_date: date
    settle_date: date
    direction: str
    asset_type: AssetType
    asset_id: int
    quantity: float
    price: float
    counterparty: Optional[str] = None
    fund_alloc: Optional[str] = None
    sub_alloc: Optional[str] = None
    agreement_type: Optional[str] = None
    doc_type: Optional[str] = None
    notes: Optional[str] = None

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: int
    class Config:
        from_attributes = True

class Holding(BaseModel):
    id: int 
    fund: str
    display_name: str
    position: float
    mark: float
    market_value: float
    cost_basis: float
    mtm_pnl: float
    class Config:
        from_attributes = True

class MacroRequest(BaseModel):
    tickers: List[str]

class MacroResponse(BaseModel):
    ticker: str
    last_price: float
    chg_net_1d: Optional[float]
    chg_pct_1d: Optional[float]
    chg_pct_5d: Optional[float]
    chg_pct_1m: Optional[float]
    chg_pct_6m: Optional[float]
    chg_pct_ytd: Optional[float]
    group: str
    
    model_config = {
        "from_attributes": True
    }


class WatchItemBase(BaseModel):
    cusip: str
    asset_type: AssetType

class WatchItemCreate(WatchItemBase):
    pass

class WatchItem(WatchItemBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class WatchItemWithData(WatchItem):
    # dynamical fields pulled from Bloomberg
    issuer:        Optional[str]
    deal_name:     Optional[str]
    spread_coupon: Optional[float]
    maturity:      Optional[date]
    px_bid:        Optional[float]
    px_ask:        Optional[float]
    yld_cnv_bid:   Optional[float]
    dm_zspread:    Optional[float]
    chg_net_1d:    Optional[float]
    chg_net_5d:    Optional[float]
    chg_net_1m:    Optional[float]
    chg_net_6m:    Optional[float]
    chg_net_ytd:   Optional[float]
    interval_high: Optional[float]
    interval_low:  Optional[float]
    payment_rank:  Optional[str]
    rtg_moody_long_term: Optional[str]
    rtg_moody:     Optional[str]
    rtg_sp_lt_lc_issuer_credit: Optional[str]
    rtg_sp:        Optional[str]
    amt_outstanding: Optional[float]


class AssetDataRequest(BaseModel):
    cusip: str
    asset_type: AssetType

class AssetDataResponse(BaseModel):
    issuer:        Optional[str] 
    deal_name:     Optional[str]
    spread_coupon: Optional[float]
    maturity:      Optional[date]
    payment_rank:  Optional[str]
    rtg_moody_long_term: Optional[str]
    rtg_moody:     Optional[str]
    rtg_sp_lt_lc_issuer_credit: Optional[str]
    rtg_sp:        Optional[str]
    amt_outstanding: Optional[int]

    model_config = {
        "from_attributes": True
    }

class AssetFetchRequest(BaseModel):
    cusip: str
    asset_type: AssetType

    model_config = {
        "from_attributes": True
    }


# -------- Action --------
class ActionBase(BaseModel):
    name: str

class ActionCreate(ActionBase):
    pass

class Action(ActionBase):
    id: int

    class Config:
        from_attributes = True


# -------- Role --------
class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    actions: List[Action] = []   # role has actions

    class Config:
        from_attributes = True


# -------- User --------
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    roles: List[Role] = []   # user has roles, each role has actions

    class Config:
        from_attributes = True


# -------- Token --------
class Token(BaseModel):
    access_token: str
    token_type: str