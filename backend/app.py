"""
FastAPI application entrypoint for the OMS MVP.
Initializes app, includes routers, and configures middleware.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import assets, trades, holdings, macro, watchlist, auth, accesscontrol
from backend.routers import assetdata
from backend.database import Base, engine
from backend.routers.macro import router as macro_router


app = FastAPI(
    title="Trade MVP OMS",
    version="1.0.0",
    description="MVP-grade Order Management System"
)

# Drop all tables
#Base.metadata.drop_all(bind=engine)

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(assets.router, prefix="/api/assets", tags=["Assets"])
app.include_router(accesscontrol.router)
app.include_router(trades.router, prefix="/api/trades", tags=["Trades"])
app.include_router(holdings.router, prefix="/api/holdings", tags=["Holdings"])
app.include_router(macro.router)
app.include_router(watchlist.router)
app.include_router(assetdata.router, prefix="/api", tags=["AssetData"])
app.include_router(auth.router)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
    #return GOOGLE_CLIENT_ID
    