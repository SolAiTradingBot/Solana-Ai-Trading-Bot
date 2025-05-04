import os
from solana.keypair import Keypair
from solana.rpc.api import Client
from base64 import b64decode


private_key_str = "your_base64_encoded_private_key_here" # Write the private key or mnemonic words of your Solana wallet.
if not private_key_str:
    raise Exception("")


try:
    secret_key = b64decode(private_key_str)
    keypair = Keypair.from_secret_key(secret_key)
except Exception as e:
    raise Exception("Private key is invalid or in the wrong format!") from e

# Connect to Solana mainnet
solana_client = Client("https://api.mainnet-beta.solana.com")

# Show wallet address
public_key = keypair.public_key
print(f"Connected to Solana. Wallet Address: {public_key}")
