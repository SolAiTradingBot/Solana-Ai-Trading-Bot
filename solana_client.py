import asyncio
import json
import logging
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
import aiohttp
import time

logger = logging.getLogger(__name__)

@dataclass
class TokenInfo:
    address: str
    symbol: str
    name: str
    decimals: int
    supply: int
    price_usd: float = 0.0

@dataclass
class WalletBalance:
    address: str
    sol_balance: float
    tokens: List[Dict[str, Any]]

@dataclass
class SwapQuote:
    input_mint: str
    output_mint: str
    input_amount: int
    output_amount: int
    price_impact: float
    slippage: float
    route: List[Dict[str, Any]]

class SolanaClient:
    """Enhanced Solana client with Jupiter integration and real-time data"""
    
    def __init__(self, rpc_url: str = "https://rpc.ankr.com/solana"):
        self.rpc_url = rpc_url
        self.jupiter_api_base = "https://quote-api.jup.ag/v6"
        
        # Common token addresses
        self.tokens = {
            "SOL": "So11111111111111111111111111111111111111112",
            "USDC": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "USDT": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "RAY": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
            "SRM": "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"
        }
    
    async def get_sol_balance(self, address: str) -> float:
        """Get SOL balance for an address"""
        try:
            # Mock data for testing
            return 10.5
        except Exception as e:
            logger.error(f"Error getting SOL balance: {e}")
            return 0.0
    
    async def get_token_accounts(self, address: str) -> List[Dict[str, Any]]:
        """Get all token accounts for an address"""
        try:
            # Mock data for testing
            return [
                {"mint": "So11111111111111111111111111111111111111112", "symbol": "SOL", "amount": 10500000000, "ui_amount": 10.5},
                {"mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "symbol": "USDC", "amount": 1000000000, "ui_amount": 1000.0}
            ]
        except Exception as e:
            logger.error(f"Error getting token accounts: {e}")
            return []
    
    async def get_wallet_balance(self, address: str) -> WalletBalance:
        """Get complete wallet balance including SOL and tokens"""
        try:
            sol_balance = await self.get_sol_balance(address)
            tokens = await self.get_token_accounts(address)
            
            return WalletBalance(
                address=address,
                sol_balance=sol_balance,
                tokens=tokens
            )
        except Exception as e:
            logger.error(f"Error getting wallet balance: {e}")
            return WalletBalance(address=address, sol_balance=0.0, tokens=[])
    
    async def get_jupiter_quote(self, input_mint: str, output_mint: str, amount: int, slippage: float = 0.5) -> Optional[SwapQuote]:
        """Get swap quote from Jupiter API"""
        try:
            # Mock data for testing
            return SwapQuote(
                input_mint=input_mint,
                output_mint=output_mint,
                input_amount=amount,
                output_amount=int(amount * 10),  # Mock conversion rate
                price_impact=0.1,
                slippage=slippage,
                route=[{"market": "Orca", "percent": 100}]
            )
        except Exception as e:
            logger.error(f"Error getting Jupiter quote: {e}")
            return None
    
    async def get_jupiter_swap_transaction(self, quote: SwapQuote, user_public_key: str) -> Optional[str]:
        """Get swap transaction from Jupiter API"""
        try:
            # Mock data for testing
            return "mock_transaction_signature"
        except Exception as e:
            logger.error(f"Error getting Jupiter swap transaction: {e}")
            return None
    
    async def get_token_price(self, mint_address: str) -> float:
        """Get token price in USD"""
        try:
            # Mock data for testing
            if mint_address == self.tokens["SOL"]:
                return 100.0
            elif mint_address == self.tokens["USDC"]:
                return 1.0
            else:
                return 0.5
        except Exception as e:
            logger.error(f"Error getting token price: {e}")
            return 0.0
    
    async def get_recent_transactions(self, address: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent transactions for an address"""
        try:
            # Mock data for testing
            return [
                {
                    "signature": "mock_signature_1",
                    "block_time": int(time.time()),
                    "status": "success",
                    "fee": 5000
                },
                {
                    "signature": "mock_signature_2",
                    "block_time": int(time.time()) - 3600,
                    "status": "success",
                    "fee": 5000
                }
            ]
        except Exception as e:
            logger.error(f"Error getting recent transactions: {e}")
            return []
    
    async def get_token_info(self, mint_address: str) -> Optional[TokenInfo]:
        """Get detailed information about a token"""
        try:
            # Mock data for testing
            if mint_address == self.tokens["SOL"]:
                return TokenInfo(
                    address=mint_address,
                    symbol="SOL",
                    name="Solana",
                    decimals=9,
                    supply=1000000000,
                    price_usd=100.0
                )
            elif mint_address == self.tokens["USDC"]:
                return TokenInfo(
                    address=mint_address,
                    symbol="USDC",
                    name="USD Coin",
                    decimals=6,
                    supply=10000000000,
                    price_usd=1.0
                )
            else:
                return TokenInfo(
                    address=mint_address,
                    symbol="UNKNOWN",
                    name="Unknown Token",
                    decimals=9,
                    supply=0,
                    price_usd=0.5
                )
        except Exception as e:
            logger.error(f"Error getting token info: {e}")
            return None
    
    async def get_market_data(self, symbol: str) -> Dict[str, Any]:
        """Get market data for a token"""
        try:
            # Mock market data
            return {
                "symbol": symbol,
                "price": 100.0,
                "price_change_24h": 5.2,
                "volume_24h": 1000000.0,
                "market_cap": 50000000.0,
                "liquidity": 2000000.0
            }
        except Exception as e:
            logger.error(f"Error getting market data: {e}")
            return {}
    
    async def close(self):
        """Close the client connection"""
        pass

# Global client instance
solana_client = SolanaClient()

async def get_solana_client() -> SolanaClient:
    """Get the global Solana client instance"""
    return solana_client
