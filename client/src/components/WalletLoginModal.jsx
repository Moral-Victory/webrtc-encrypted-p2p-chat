import React, { useState, useEffect } from 'react';
import { Wallet, Shield, AlertCircle, Loader, ExternalLink, X, Lock, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WalletAuth from '../utils/walletAuth';

const WalletLoginModal = ({ onAuthenticated, onClose }) => {
  const [walletAuth] = useState(() => new WalletAuth());
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('connect'); // connect, sign, authenticated

  useEffect(() => {
    // Check if MetaMask is installed
    if (!walletAuth.isMetaMaskInstalled()) {
      setError('MetaMask is not installed');
    }

    // Listen for account changes
    walletAuth.onAccountsChanged((newAddress) => {
      if (newAddress === null) {
        setAddress('');
        setStep('connect');
        setError('Wallet disconnected. Please reconnect.');
      } else {
        setAddress(newAddress);
        setStep('sign');
        setError('Account changed. Please sign in again.');
      }
    });

    // Listen for chain changes
    walletAuth.onChainChanged((chainId) => {
      console.log('Chain changed to:', chainId);
    });
  }, [walletAuth]);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      const connectedAddress = await walletAuth.connectWallet();
      setAddress(connectedAddress);
      setStep('sign');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { message, signature, address: walletAddress } = await walletAuth.signInWithEthereum();
      
      const isValid = await walletAuth.verifySignature(message, signature);
      
      if (isValid) {
        console.log('✅ SIWE authentication successful');
        setStep('authenticated');
        const username = walletAuth.shortenAddress(walletAddress);
        onAuthenticated(walletAddress, username, signature);
      } else {
        setError('Signature verification failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    walletAuth.disconnect();
    setAddress('');
    setStep('connect');
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 30
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.85)', 
          backdropFilter: 'blur(12px)' 
        }}
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg relative"
        >
          {/* Modal Card */}
          <div className="bg-vscode-card/95 backdrop-blur-xl rounded-2xl border border-vscode-border/50 shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-metamask-orange via-metamask-yellow to-metamask-orange" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-vscode-text-muted hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex mb-6"
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(246, 133, 27, 0.6), transparent)',
                        filter: 'blur(20px)'
                      }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-metamask-orange to-metamask-yellow flex items-center justify-center shadow-xl">
                      <Wallet size={40} className="text-vscode-dark" />
                    </div>
                  </div>
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-3">Connect Wallet</h2>
                <p className="text-vscode-text-secondary">Sign in with Ethereum to get started</p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-start space-x-3">
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step: Connect Wallet */}
              {step === 'connect' && (
                <div className="space-y-5">
                  {!walletAuth.isMetaMaskInstalled() ? (
                    <div className="text-center space-y-4">
                      <p className="text-vscode-text-secondary text-sm mb-4">
                        MetaMask is required to continue
                      </p>
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-metamask-orange hover:bg-metamask-orange-dark text-vscode-dark font-bold py-4 px-8 rounded-xl transition-all shadow-lg"
                      >
                        <span>Install MetaMask</span>
                        <ExternalLink size={18} />
                      </motion.a>
                    </div>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 8px 30px rgba(246, 133, 27, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConnectWallet}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-metamask-orange to-metamask-yellow hover:from-metamask-orange-dark hover:to-metamask-orange disabled:from-vscode-hover disabled:to-vscode-hover disabled:cursor-not-allowed text-vscode-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-3 group relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ['-100%', '200%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        {loading ? (
                          <>
                            <Loader size={24} className="animate-spin" />
                            <span className="text-lg">Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Wallet size={24} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-lg">Connect Wallet</span>
                          </>
                        )}
                      </motion.button>

                      {/* Info Cards */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="p-4 rounded-xl bg-vscode-hover/40 backdrop-blur-sm border border-vscode-border/50 text-center">
                          <Lock size={20} className="mx-auto mb-2 text-vscode-accent" />
                          <p className="text-xs text-vscode-text-secondary">Encrypted</p>
                        </div>
                        <div className="p-4 rounded-xl bg-vscode-hover/40 backdrop-blur-sm border border-vscode-border/50 text-center">
                          <Zap size={20} className="mx-auto mb-2 text-metamask-orange" />
                          <p className="text-xs text-vscode-text-secondary">P2P Direct</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step: Sign Message */}
              {step === 'sign' && address && (
                <div className="space-y-5">
                  <div className="p-5 bg-vscode-hover/60 backdrop-blur-sm rounded-xl border border-vscode-border">
                    <p className="text-vscode-text-secondary text-xs mb-3 uppercase tracking-widest font-bold">Connected Wallet</p>
                    <p className="text-white font-mono text-sm break-all bg-vscode-dark/60 p-3.5 rounded-lg border border-vscode-border/50">
                      {address}
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-metamask-orange/15 via-metamask-orange/10 to-transparent backdrop-blur-sm border border-metamask-orange/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Shield size={22} className="text-metamask-orange flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white font-bold text-sm mb-2">
                          Verify Ownership
                        </p>
                        <p className="text-vscode-text-secondary text-xs leading-relaxed">
                          Sign a message to prove wallet ownership. This is free and doesn't send a transaction.
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 8px 30px rgba(246, 133, 27, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-metamask-orange to-metamask-yellow hover:from-metamask-orange-dark hover:to-metamask-orange disabled:from-vscode-hover disabled:to-vscode-hover disabled:cursor-not-allowed text-vscode-dark font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <Loader size={24} className="animate-spin" />
                        <span className="text-lg">Awaiting signature...</span>
                      </>
                    ) : (
                      <>
                        <Shield size={24} />
                        <span className="text-lg">Sign Message</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={handleDisconnect}
                    className="w-full py-3 text-vscode-text-secondary hover:text-white text-sm font-medium transition-colors"
                  >
                    Use different wallet
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 pb-8 pt-4 border-t border-vscode-border/30">
              <div className="flex items-center justify-center space-x-4 text-xs text-vscode-text-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-400" />
                  <span>No signup required</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <Shield size={14} className="text-vscode-accent" />
                  <span>SIWE standard</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletLoginModal;
