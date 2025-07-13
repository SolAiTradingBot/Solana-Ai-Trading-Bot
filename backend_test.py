import requests
import json
import time
import sys

def test_endpoint(url, method="GET", data=None, expected_status=200):
    """Test an API endpoint and return the result"""
    print(f"\n🔍 Testing {method} {url}")
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        status_ok = response.status_code == expected_status
        
        if status_ok:
            print(f"✅ Status: {response.status_code}")
            try:
                return True, response.json()
            except:
                return True, None
        else:
            print(f"❌ Status: {response.status_code}, expected: {expected_status}")
            try:
                print(f"Error: {response.json()}")
            except:
                print(f"Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False, None

def test_bot_creation_flow():
    """Test the complete bot creation flow for all bot types"""
    # Base URL
    base_url = "https://d1a18706-aed4-43e8-a500-9338467e5774.preview.emergentagent.com"
    
    print("\n===== TESTING BOT CREATION FLOW =====")
    
    # Get initial bot count
    success, initial_bots = test_endpoint(f"{base_url}/api/bots")
    if not success:
        print("❌ Failed to get initial bot list")
        return False
    
    initial_count = len(initial_bots)
    print(f"Initial bot count: {initial_count}")
    
    # Test creating bots for each bot type
    bot_types = ["sniper", "copy_trading", "ai_trading", "arbitrage", "dca", "volume", "liquidity"]
    created_bots = []
    
    for bot_type in bot_types:
        bot_data = {
            "name": f"Test {bot_type.capitalize()} Bot {int(time.time())}",
            "bot_type": bot_type,
            "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
            "config": {"test": True}
        }
        
        print(f"\n----- Testing creation of {bot_type} bot -----")
        success, new_bot = test_endpoint(f"{base_url}/api/bots", method="POST", data=bot_data)
        
        if success and new_bot:
            bot_id = new_bot.get("_id")  # Using _id instead of id
            print(f"✅ Created {bot_type} bot with ID: {bot_id}")
            created_bots.append(bot_id)
            
            # Verify bot details
            success, bot = test_endpoint(f"{base_url}/api/bots/{bot_id}")
            if success:
                if bot["name"] == bot_data["name"] and bot["bot_type"] == bot_type:
                    print(f"✅ Bot details verified for {bot_type}")
                else:
                    print(f"❌ Bot details mismatch for {bot_type}")
        else:
            print(f"❌ Failed to create {bot_type} bot")
    
    # Verify final bot count
    success, final_bots = test_endpoint(f"{base_url}/api/bots")
    if not success:
        print("❌ Failed to get final bot list")
        return False
    
    final_count = len(final_bots)
    expected_count = initial_count + len(created_bots)
    
    if final_count == expected_count:
        print(f"\n✅ Final bot count verified: {final_count} (added {len(created_bots)} bots)")
        return True
    else:
        print(f"\n❌ Bot count mismatch: expected {expected_count}, got {final_count}")
        return False

def test_bot_operations():
    """Test bot operations like start, stop, and delete"""
    base_url = "https://d1a18706-aed4-43e8-a500-9338467e5774.preview.emergentagent.com"
    
    print("\n===== TESTING BOT OPERATIONS =====")
    
    # Create a test bot
    bot_data = {
        "name": f"Operation Test Bot {int(time.time())}",
        "bot_type": "sniper",
        "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        "config": {"test": True}
    }
    
    success, new_bot = test_endpoint(f"{base_url}/api/bots", method="POST", data=bot_data)
    
    if not success or not new_bot:
        print("❌ Failed to create test bot for operations")
        return False
    
    bot_id = new_bot.get("_id")  # Using _id instead of id
    print(f"Created test bot with ID: {bot_id}")
    
    # Test starting the bot
    success, _ = test_endpoint(f"{base_url}/api/bots/{bot_id}/start", method="POST")
    if not success:
        print("❌ Failed to start bot")
        return False
    
    # Verify bot status after start
    success, bot = test_endpoint(f"{base_url}/api/bots/{bot_id}")
    if success and bot.get("status") == "active":
        print("✅ Bot successfully started and status verified")
    else:
        print("❌ Bot start verification failed")
        return False
    
    # Test stopping the bot
    success, _ = test_endpoint(f"{base_url}/api/bots/{bot_id}/stop", method="POST")
    if not success:
        print("❌ Failed to stop bot")
        return False
    
    # Verify bot status after stop
    success, bot = test_endpoint(f"{base_url}/api/bots/{bot_id}")
    if success and bot.get("status") == "inactive":
        print("✅ Bot successfully stopped and status verified")
    else:
        print("❌ Bot stop verification failed")
        return False
    
    # Test deleting the bot
    success, _ = test_endpoint(f"{base_url}/api/bots/{bot_id}", method="DELETE")
    if success:
        print("✅ Bot successfully deleted")
    else:
        print("❌ Failed to delete bot")
        return False
    
    # Verify bot is deleted
    success, _ = test_endpoint(f"{base_url}/api/bots/{bot_id}", expected_status=404)
    if success:
        print("❌ Bot still exists after deletion")
        return False
    else:
        print("✅ Bot deletion verified")
        return True

def test_solana_integration():
    """Test real Solana integration endpoints"""
    base_url = "https://d1a18706-aed4-43e8-a500-9338467e5774.preview.emergentagent.com"
    
    print("\n===== TESTING REAL SOLANA INTEGRATION =====")
    
    # Test 1: Get real wallet balance
    wallet_address = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    success, wallet = test_endpoint(f"{base_url}/api/wallet/{wallet_address}")
    if success:
        print(f"Real Solana wallet info:")
        print(f"  Address: {wallet.get('address')}")
        print(f"  SOL Balance: {wallet.get('balance')}")
        print(f"  Tokens: {len(wallet.get('tokens', []))} token(s)")
        
        # Verify we have real data
        if wallet.get('address') == wallet_address and isinstance(wallet.get('balance'), (int, float)):
            print("✅ Real wallet data verified")
        else:
            print("❌ Wallet data verification failed")
            return False
    else:
        print("❌ Failed to get wallet info")
        return False
    
    # Test 2: Get SOL token price
    sol_token = "So11111111111111111111111111111111111111112"
    success, price_data = test_endpoint(f"{base_url}/api/prices/{sol_token}")
    if success:
        print(f"\nSOL token price info:")
        print(f"  Symbol: {price_data.get('symbol')}")
        print(f"  Price: ${price_data.get('price')}")
        print(f"  Timestamp: {price_data.get('timestamp')}")
        
        # Verify we have real price data
        if price_data.get('symbol') and isinstance(price_data.get('price'), (int, float)) and price_data.get('price') > 0:
            print("✅ Real token price data verified")
        else:
            print("❌ Token price data verification failed")
            return False
    else:
        print("❌ Failed to get token price")
        return False
    
    # Test 3: Get swap quote
    swap_data = {
        "input_mint": "So11111111111111111111111111111111111111112",  # SOL
        "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
        "amount": 0.01,
        "slippage": 0.5
    }
    
    success, quote = test_endpoint(f"{base_url}/api/swap/quote", method="POST", data=swap_data)
    if success:
        print(f"\nSwap quote info:")
        print(f"  Input: {quote.get('inputMint')}")
        print(f"  Output: {quote.get('outputMint')}")
        print(f"  In Amount: {quote.get('inAmount')}")
        print(f"  Out Amount: {quote.get('outAmount')}")
        print(f"  Price Impact: {quote.get('priceImpact')}%")
        
        # Verify we have real swap data
        if quote.get('inputMint') == swap_data['input_mint'] and quote.get('outputMint') == swap_data['output_mint']:
            print("✅ Real swap quote data verified")
            return True
        else:
            print("❌ Swap quote data verification failed")
            return False
    else:
        print("❌ Failed to get swap quote")
        return False

def main():
    # Base URL
    base_url = "https://d1a18706-aed4-43e8-a500-9338467e5774.preview.emergentagent.com"
    
    # Test 1: Root endpoint
    success, _ = test_endpoint(f"{base_url}/")
    
    # Test 2: Dashboard stats
    success, stats = test_endpoint(f"{base_url}/api/stats/dashboard")
    if success:
        print(f"Dashboard stats: {json.dumps(stats, indent=2)}")
    
    # Test 3: Get wallet info
    wallet_address = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    success, wallet = test_endpoint(f"{base_url}/api/wallet/{wallet_address}")
    if success:
        print(f"Wallet info: {json.dumps(wallet, indent=2)}")
    
    # Test real Solana integration
    solana_success = test_solana_integration()
    
    # Test bot creation flow
    creation_success = test_bot_creation_flow()
    
    # Test bot operations
    operations_success = test_bot_operations()
    
    # Overall test result
    if solana_success and creation_success and operations_success:
        print("\n✅ All backend tests passed successfully!")
        return 0
    else:
        print("\n❌ Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())