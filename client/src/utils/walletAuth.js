import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

class WalletAuth {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.address = ethers.getAddress(accounts[0]);

      console.log('✅ Wallet connected:', this.address);
      return this.address;
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('User rejected wallet connection');
      }
      throw new Error('Failed to connect wallet: ' + error.message);
    }
  }

  /**
   * Generate and sign SIWE message
   */
  async signInWithEthereum() {
    if (!this.address || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      // Get chain ID
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create SIWE message
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign in to Secure P2P Chat to prove you own this wallet address.';
      
      const siweMessage = new SiweMessage({
        domain,
        address: ethers.getAddress(this.address),
        statement,
        uri: origin,
        version: '1',
        chainId,
        nonce: this.generateNonce(),
        issuedAt: new Date().toISOString()
      });

      const message = siweMessage.prepareMessage();
      
      console.log('📝 SIWE Message:', message);

      // Sign the message
      const signature = await this.signer.signMessage(message);
      
      console.log('✅ Message signed');

      return {
        message: siweMessage,
        signature,
        address: this.address
      };
    } catch (error) {
    // Log the whole error object to the browser console.
    console.error('Sign error:', error);

    // Build a better error message for display.
    let details = '';
    if (error && typeof error === 'object') {
        details = error.message || error.code || JSON.stringify(error);
    } else {
        details = String(error);
    }

    if (error && error.code === 'ACTION_REJECTED') {
        throw new Error('User rejected signature request');
    }
    throw new Error('Failed to sign message: ' + details);
    }

  }

  /**
   * Verify SIWE signature (client-side basic check)
   */
  async verifySignature(message, signature) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.verify({ signature });
      return fields.success;
    } catch (error) {
      console.error('❌ Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Get shortened address for display
   */
  shortenAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  /**
   * Generate random nonce
   */
  generateNonce() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Listen for account changes
   */
  onAccountsChanged(callback) {
    if (!window.ethereum) return;
    
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        console.log('👋 Wallet disconnected');
        this.address = null;
        callback(null);
      } else {
        console.log('🔄 Account changed:', accounts[0]);
        this.address = accounts[0];
        callback(accounts[0]);
      }
    });
  }

  /**
   * Listen for chain changes
   */
  onChainChanged(callback) {
    if (!window.ethereum) return;
    
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('🔄 Chain changed:', chainId);
      callback(chainId);
      // Recommend page reload on chain change
      window.location.reload();
    });
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.address = null;
    this.signer = null;
    this.provider = null;
    console.log('🔌 Wallet disconnected');
  }
}

export default WalletAuth;
