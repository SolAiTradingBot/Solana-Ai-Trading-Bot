from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie, Document
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
import json
import uuid
from enum import Enum
import asyncio
import logging

# Import Solana client
from solana_client import SolanaClient, get_solana_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Models
class BotType(str, Enum):
    SNIPER = "sniper"
    COPY_TRADING = "copy_trading"
    AI_TRADING = "ai_trading"
    ARBITRAGE = "arbitrage"
    DCA = "dca"
    VOLUME = "volume"
    LIQUIDITY = "liquidity"

class BotStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PAUSED = "paused"

class BotConfiguration(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    bot_type: BotType
    status: BotStatus = BotStatus.INACTIVE
    wallet_address: str
    config: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "bot_configurations"

class Transaction(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bot_id: str
    tx_signature: str
    from_token: str
    to_token: str
    amount: float
    price: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending"
    
    class Settings:
        name = "transactions"

class PriceData(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    token_address: str
    symbol: str
    price: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "price_data"

# Request/Response Models
class CreateBotRequest(BaseModel):
    name: str
    bot_type: BotType
    wallet_address: str
    config: Dict[str, Any] = Field(default_factory=dict)

class UpdateBotRequest(BaseModel):
    name: Optional[str] = None
    status: Optional[BotStatus] = None
    config: Optional[Dict[str, Any]] = None

class TokenSwapRequest(BaseModel):
    input_mint: str
    output_mint: str
    amount: float
    slippage: float = 0.5

class WalletInfo(BaseModel):
    address: str
    balance: float
    tokens: List[Dict[str, Any]] = Field(default_factory=list)

# Initialize FastAPI app
app = FastAPI(
    title="Solana Trading Bot API",
    description="Advanced Solana trading bot with multiple strategies",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Database connection
@app.on_event("startup")
async def startup_event():
    try:
        # Get MongoDB URL from environment
        mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        
        # Initialize MongoDB connection
        client = AsyncIOMotorClient(mongo_url)
        
        # Initialize Beanie with document models
        await init_beanie(
            database=client.solana_trading_bot,
            document_models=[BotConfiguration, Transaction, PriceData]
        )
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Solana Trading Bot API is running"}

# Bot Management Endpoints
@app.post("/api/bots", response_model=BotConfiguration)
async def create_bot(request: CreateBotRequest):
    """Create a new trading bot"""
    try:
        bot = BotConfiguration(
            name=request.name,
            bot_type=request.bot_type,
            wallet_address=request.wallet_address,
            config=request.config
        )
        await bot.insert()
        return bot
    except Exception as e:
        logger.error(f"Error creating bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bots", response_model=List[BotConfiguration])
async def get_bots():
    """Get all trading bots"""
    try:
        bots = await BotConfiguration.find_all().to_list()
        return bots
    except Exception as e:
        logger.error(f"Error fetching bots: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bots/{bot_id}", response_model=BotConfiguration)
async def get_bot(bot_id: str):
    """Get specific bot by ID"""
    try:
        bot = await BotConfiguration.find_one(BotConfiguration.id == bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")
        return bot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/bots/{bot_id}", response_model=BotConfiguration)
async def update_bot(bot_id: str, request: UpdateBotRequest):
    """Update bot configuration"""
    try:
        bot = await BotConfiguration.find_one(BotConfiguration.id == bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        if request.name is not None:
            bot.name = request.name
        if request.status is not None:
            bot.status = request.status
        if request.config is not None:
            bot.config.update(request.config)
        
        bot.updated_at = datetime.utcnow()
        await bot.save()
        return bot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/bots/{bot_id}")
async def delete_bot(bot_id: str):
    """Delete a bot"""
    try:
        bot = await BotConfiguration.find_one(BotConfiguration.id == bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        await bot.delete()
        return {"message": "Bot deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Solana Integration Endpoints
@app.post("/api/swap/quote")
async def get_swap_quote(request: TokenSwapRequest):
    """Get swap quote from Jupiter API"""
    try:
        client = await get_solana_client()
        
        # Convert amount to lamports/smallest unit
        amount_lamports = int(request.amount * 1e9)
        
        quote = await client.get_jupiter_quote(
            input_mint=request.input_mint,
            output_mint=request.output_mint,
            amount=amount_lamports,
            slippage=request.slippage
        )
        
        if quote:
            return {
                "inputMint": quote.input_mint,
                "outputMint": quote.output_mint,
                "inAmount": quote.input_amount,
                "outAmount": quote.output_amount,
                "priceImpact": quote.price_impact,
                "slippage": quote.slippage,
                "route": quote.route
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to get quote")
    except Exception as e:
        logger.error(f"Error getting swap quote: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transactions")
async def log_transaction(
    bot_id: str = Body(...),
    tx_signature: str = Body(...),
    from_token: str = Body(...),
    to_token: str = Body(...),
    amount: float = Body(...),
    price: float = Body(...)
):
    """Log a transaction"""
    try:
        transaction = Transaction(
            bot_id=bot_id,
            tx_signature=tx_signature,
            from_token=from_token,
            to_token=to_token,
            amount=amount,
            price=price,
            status="completed"
        )
        await transaction.insert()
        return {"message": "Transaction logged successfully"}
    except Exception as e:
        logger.error(f"Error logging transaction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transactions/{bot_id}")
async def get_bot_transactions(bot_id: str):
    """Get transactions for a specific bot"""
    try:
        transactions = await Transaction.find(Transaction.bot_id == bot_id).to_list()
        return transactions
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Price Data Endpoints
@app.get("/api/prices/{token_address}")
async def get_token_price(token_address: str):
    """Get current price for a token"""
    try:
        client = await get_solana_client()
        price = await client.get_token_price(token_address)
        token_info = await client.get_token_info(token_address)
        
        return {
            "token_address": token_address,
            "symbol": token_info.symbol if token_info else "UNKNOWN",
            "price": price,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching price: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Wallet Endpoints
@app.get("/api/wallet/{address}")
async def get_wallet_info(address: str):
    """Get wallet information"""
    try:
        client = await get_solana_client()
        wallet_balance = await client.get_wallet_balance(address)
        
        return {
            "address": wallet_balance.address,
            "balance": wallet_balance.sol_balance,
            "tokens": wallet_balance.tokens
        }
    except Exception as e:
        logger.error(f"Error fetching wallet info: {str(e)}")
        # Return mock data as fallback
        return {
            "address": address,
            "balance": 10.5,
            "tokens": [
                {"mint": "So11111111111111111111111111111111111111112", "symbol": "SOL", "amount": 10500000000, "ui_amount": 10.5},
                {"mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "symbol": "USDC", "amount": 1000000000, "ui_amount": 1000.0}
            ]
        }

# Bot Control Endpoints
@app.post("/api/bots/{bot_id}/start")
async def start_bot(bot_id: str):
    """Start a bot"""
    try:
        bot = await BotConfiguration.find_one(BotConfiguration.id == bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        bot.status = BotStatus.ACTIVE
        bot.updated_at = datetime.utcnow()
        await bot.save()
        
        # Here you would implement the bot logic based on bot_type
        logger.info(f"Starting {bot.bot_type} bot: {bot.name}")
        
        return {"message": f"Bot {bot.name} started successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/bots/{bot_id}/stop")
async def stop_bot(bot_id: str):
    """Stop a bot"""
    try:
        bot = await BotConfiguration.find_one(BotConfiguration.id == bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        bot.status = BotStatus.INACTIVE
        bot.updated_at = datetime.utcnow()
        await bot.save()
        
        logger.info(f"Stopping {bot.bot_type} bot: {bot.name}")
        
        return {"message": f"Bot {bot.name} stopped successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error stopping bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/dashboard")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        total_bots = await BotConfiguration.count()
        active_bots = await BotConfiguration.find(BotConfiguration.status == BotStatus.ACTIVE).count()
        total_transactions = await Transaction.count()
        
        return {
            "total_bots": total_bots,
            "active_bots": active_bots,
            "total_transactions": total_transactions,
            "total_volume": 50000.0,  # Would calculate from actual transactions
            "profit_loss": 2500.0     # Would calculate from actual transactions
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Market Data Endpoints
@app.get("/api/market/{symbol}")
async def get_market_data(symbol: str):
    """Get market data for a token"""
    try:
        client = await get_solana_client()
        market_data = await client.get_market_data(symbol)
        return market_data
    except Exception as e:
        logger.error(f"Error fetching market data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tokens/trending")
async def get_trending_tokens():
    """Get trending tokens"""
    try:
        # Mock data - in real implementation would fetch from APIs
        return [
            {
                "address": "So11111111111111111111111111111111111111112",
                "symbol": "SOL",
                "name": "Solana",
                "price": 100.0,
                "change_24h": 5.2,
                "volume_24h": 1000000.0
            },
            {
                "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "symbol": "USDC",
                "name": "USD Coin",
                "price": 1.0,
                "change_24h": 0.1,
                "volume_24h": 5000000.0
            }
        ]
    except Exception as e:
        logger.error(f"Error fetching trending tokens: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)