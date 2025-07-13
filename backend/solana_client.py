import asyncio
import json
import logging
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solana.publickey import PublicKey
from solana.keypair import Keypair
from solana.system_program import SystemProgram
from solana.transaction import Transaction
from solana.rpc.core import RPCException
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
        self.client = AsyncClient(rpc_url)
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
            pubkey = PublicKey(address)
            response = await self.client.get_balance(pubkey)
            balance = response.value / 1e9  # Convert lamports to SOL
            return balance
        except Exception as e:
            logger.error(f"Error getting SOL balance: {e}")
            return 0.0
    
    async def get_token_accounts(self, address: str) -> List[Dict[str, Any]]:
        """Get all token accounts for an address"""
        try:
            pubkey = PublicKey(address)
            response = await self.client.get_token_accounts_by_owner(
                pubkey,
                {"programId": PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
                commitment=Confirmed
            )
            
            tokens = []
            for account in response.value:
                account_info = account.account
                token_data = account_info.data
                
                # Parse token account data (simplified)
                if len(token_data) >= 64:
                    # Extract mint and amount (basic parsing)
                    mint = token_data[0:32]
                    amount = int.from_bytes(token_data[64:72], 'little')
                    
                    tokens.append({
                        "mint": str(PublicKey(mint)),
                        "amount": amount,
                        "decimals": 9,  # Default, would need to fetch actual decimals
                        "ui_amount": amount / 1e9
                    })
            
            return tokens
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
            url = f"{self.jupiter_api_base}/quote"
            params = {
                "inputMint": input_mint,
                "outputMint": output_mint,
                "amount": amount,
                "slippageBps": int(slippage * 100),  # Convert to basis points
                "swapMode": "ExactIn"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return SwapQuote(
                            input_mint=input_mint,
                            output_mint=output_mint,
                            input_amount=amount,
                            output_amount=int(data["outAmount"]),
                            price_impact=float(data.get("priceImpactPct", 0)),
                            slippage=slippage,
                            route=data.get("routePlan", [])
                        )
                    else:
                        logger.error(f"Jupiter API error: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error getting Jupiter quote: {e}")
            return None
    
    async def get_jupiter_swap_transaction(self, quote: SwapQuote, user_public_key: str) -> Optional[str]:
        """Get swap transaction from Jupiter API"""
        try:
            url = f"{self.jupiter_api_base}/swap"
            data = {
                "quoteResponse": {
                    "inputMint": quote.input_mint,
                    "outputMint": quote.output_mint,
                    "inAmount": str(quote.input_amount),
                    "outAmount": str(quote.output_amount),
                    "routePlan": quote.route
                },
                "userPublicKey": user_public_key,
                "wrapAndUnwrapSol": True
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get("swapTransaction")
                    else:
                        logger.error(f"Jupiter swap API error: {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error getting Jupiter swap transaction: {e}")
            return None
    
    async def get_token_price(self, mint_address: str) -> float:
        """Get token price in USD"""
        try:
            # Use Jupiter price API
            url = f"https://price.jup.ag/v4/price?ids={mint_address}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        price_info = data.get("data", {}).get(mint_address)
                        if price_info:
                            return float(price_info.get("price", 0))
                    return 0.0
        except Exception as e:
            logger.error(f"Error getting token price: {e}")
            return 0.0
    
    async def get_recent_transactions(self, address: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent transactions for an address"""
        try:
            pubkey = PublicKey(address)
            signatures = await self.client.get_signatures_for_address(pubkey, limit=limit)
            
            transactions = []
            for sig_info in signatures.value:
                tx_detail = await self.client.get_transaction(sig_info.signature)
                if tx_detail.value:
                    transactions.append({
                        "signature": sig_info.signature,
                        "block_time": sig_info.block_time,
                        "status": "success" if not sig_info.err else "failed",
                        "fee": tx_detail.value.meta.fee if tx_detail.value.meta else 0
                    })
            
            return transactions
        except Exception as e:
            logger.error(f"Error getting recent transactions: {e}")
            return []
    
    async def simulate_transaction(self, transaction: Transaction) -> Dict[str, Any]:
        """Simulate a transaction before sending"""
        try:
            response = await self.client.simulate_transaction(transaction)
            return {
                "success": not response.value.err,
                "error": response.value.err,
                "logs": response.value.logs,
                "units_consumed": response.value.units_consumed
            }
        except Exception as e:
            logger.error(f"Error simulating transaction: {e}")
            return {"success": False, "error": str(e)}
    
    async def send_transaction(self, transaction: Transaction) -> str:
        """Send a transaction to the network"""
        try:
            response = await self.client.send_transaction(
                transaction, 
                TxOpts(skip_confirmation=False, preflight_commitment=Confirmed)
            )
            return response.value
        except Exception as e:
            logger.error(f"Error sending transaction: {e}")
            raise
    
    async def get_token_info(self, mint_address: str) -> Optional[TokenInfo]:
        """Get detailed information about a token"""
        try:
            pubkey = PublicKey(mint_address)
            response = await self.client.get_account_info(pubkey)
            
            if response.value:
                # Parse mint account data (simplified)
                account_data = response.value.data
                
                # Get price
                price = await self.get_token_price(mint_address)
                
                return TokenInfo(
                    address=mint_address,
                    symbol="UNKNOWN",  # Would need to fetch from metadata
                    name="Unknown Token",
                    decimals=9,  # Default, would parse from account data
                    supply=0,  # Would parse from account data
                    price_usd=price
                )
            
            return None
        except Exception as e:
            logger.error(f"Error getting token info: {e}")
            return None
    
    async def monitor_new_tokens(self, callback) -> None:
        """Monitor for new token launches (simplified implementation)"""
        try:
            # This would implement WebSocket connection to monitor new tokens
            # For now, just a placeholder
            logger.info("Token monitoring started")
            
            while True:
                await asyncio.sleep(60)  # Check every minute
                # In real implementation, this would monitor new token creation
                
        except Exception as e:
            logger.error(f"Error in token monitoring: {e}")
    
    async def get_market_data(self, symbol: str) -> Dict[str, Any]:
        """Get market data for a token"""
        try:
            # Mock market data - in real implementation would use APIs like CoinGecko
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
        try:
            await self.client.close()
        except Exception as e:
            logger.error(f"Error closing client: {e}")

# Global client instance
solana_client = SolanaClient()

async def get_solana_client() -> SolanaClient:
    """Get the global Solana client instance"""
    return solana_client