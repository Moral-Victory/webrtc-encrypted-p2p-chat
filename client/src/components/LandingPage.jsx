import React, { useState } from 'react';
import { Wallet, Shield, Lock, Zap, Users, MessageSquare, FileText, CheckCircle, Github, Twitter, ChevronRight, Sparkles, Code, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeBackground from './ThreeBackground';

const LandingPage = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'AES-GCM-256 encryption ensures your messages stay private. Only you and your peers can read the messages.',
      detail: 'Using Web Crypto API with ECDH key exchange'
    },
    {
      icon: Zap,
      title: 'Peer-to-Peer Connection',
      description: 'Direct WebRTC connections between users. No central server can access your data.',
      detail: 'Mesh topology supporting up to 4 users per room'
    },
    {
      icon: Shield,
      title: 'Web3 Authentication',
      description: 'Sign in with your Ethereum wallet using Sign-In with Ethereum (SIWE) standard.',
      detail: 'ERC-4361 compliant, works with all EVM chains'
    },
    {
      icon: FileText,
      title: 'Secure File Sharing',
      description: 'Share files with SHA-256 integrity verification and chunked transfer for reliability.',
      detail: 'Support for large files with progress tracking'
    }
  ];

  const stats = [
    { value: '4', label: 'Users per Room', sublabel: 'Mesh topology' },
    { value: '256-bit', label: 'AES-GCM', sublabel: 'Encryption' },
    { value: 'Zero', label: 'Server Storage', sublabel: 'True P2P' },
    { value: '100%', label: 'Open Source', sublabel: 'On GitHub' }
  ];

  const useCases = [
    {
      emoji: '💼',
      title: 'Team Collaboration',
      description: 'Discuss sensitive projects without corporate surveillance'
    },
    {
      emoji: '🏥',
      title: 'Healthcare',
      description: 'HIPAA-compliant communication for patient privacy'
    },
    {
      emoji: '⚖️',
      title: 'Legal Services',
      description: 'Attorney-client privileged conversations'
    },
    {
      emoji: '🎓',
      title: 'Education',
      description: 'Private tutoring and academic discussions'
    },
    {
      emoji: '💰',
      title: 'Finance',
      description: 'Secure discussions about investments and trading'
    },
    {
      emoji: '🌍',
      title: 'Activists',
      description: 'Free speech without censorship or surveillance'
    }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <ThreeBackground />
      </div>

      {/* Gradient overlay */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 1,
          background: 'radial-gradient(ellipse at top, rgba(30, 30, 30, 0.6) 0%, rgba(30, 30, 30, 0.9) 100%)',
          pointerEvents: 'none'
        }} 
      />

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header/Navigation */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-8 py-6 backdrop-blur-md bg-vscode-card/30 border-b border-vscode-border/30"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-metamask-orange to-metamask-yellow flex items-center justify-center">
              <MessageSquare size={24} className="text-vscode-dark" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">SecureChat</h1>
              <p className="text-vscode-text-muted text-xs">Decentralized P2P Messaging</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-vscode-text-secondary hover:text-white transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-vscode-text-secondary hover:text-white transition-colors text-sm">How It Works</a>
            <a href="#use-cases" className="text-vscode-text-secondary hover:text-white transition-colors text-sm">Use Cases</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-gradient-to-r from-metamask-orange to-metamask-yellow text-vscode-dark font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2"
            >
              <Wallet size={18} />
              <span>Get Started</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="px-8 py-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-vscode-hover/50 backdrop-blur-sm border border-vscode-border/50 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Sparkles size={16} className="text-metamask-orange" />
                <span className="text-xs text-vscode-text-secondary font-semibold">100% Open Source • Zero Data Collection</span>
              </motion.div>

              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                Private Chat,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-metamask-orange to-metamask-yellow">
                  Zero Compromise
                </span>
              </h1>

              <p className="text-xl text-vscode-text-secondary mb-8 leading-relaxed">
                End-to-end encrypted peer-to-peer messaging powered by Web3. 
                No servers, no tracking, no censorship. Your conversations belong to you.
              </p>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(246, 133, 27, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-metamask-orange to-metamask-yellow text-vscode-dark font-bold px-8 py-4 rounded-xl flex items-center space-x-3 text-lg shadow-lg"
                >
                  <Wallet size={24} />
                  <span>Connect Wallet</span>
                  <ArrowRight size={20} />
                </motion.button>

                <motion.a
                  href="https://github.com/yourusername/securechat"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl border-2 border-vscode-border hover:border-metamask-orange text-white font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Github size={20} />
                  <span>View on GitHub</span>
                </motion.a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-metamask-orange mb-1">{stat.value}</div>
                    <div className="text-sm text-white font-semibold">{stat.label}</div>
                    <div className="text-xs text-vscode-text-muted">{stat.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Feature Cards */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, x: 10 }}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-2xl backdrop-blur-md border cursor-pointer transition-all ${
                    activeFeature === index 
                      ? 'bg-vscode-card/80 border-metamask-orange/50 shadow-lg shadow-metamask-orange/20' 
                      : 'bg-vscode-card/40 border-vscode-border/30 hover:border-metamask-orange/30'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      activeFeature === index ? 'bg-metamask-orange/20' : 'bg-vscode-hover/50'
                    }`}>
                      <feature.icon size={24} className={activeFeature === index ? 'text-metamask-orange' : 'text-vscode-accent'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-vscode-text-secondary text-sm mb-2">{feature.description}</p>
                      {activeFeature === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center space-x-2 mt-3 pt-3 border-t border-vscode-border/30"
                        >
                          <Code size={14} className="text-metamask-orange" />
                          <span className="text-xs text-vscode-text-muted">{feature.detail}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-8 py-20 bg-vscode-darker/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-xl text-vscode-text-secondary">Simple, secure, and decentralized</p>
            </motion.div>

            <div className="grid grid-cols-4 gap-8">
              {[
                { 
                  step: '01', 
                  icon: Wallet, 
                  title: 'Connect Wallet', 
                  description: 'Sign in with MetaMask or any Web3 wallet using SIWE standard'
                },
                { 
                  step: '02', 
                  icon: Users, 
                  title: 'Join a Room', 
                  description: 'Choose a room and establish direct P2P connections with other users'
                },
                { 
                  step: '03', 
                  icon: Lock, 
                  title: 'Keys Exchange', 
                  description: 'ECDH key exchange creates unique encryption keys for each peer'
                },
                { 
                  step: '04', 
                  icon: MessageSquare, 
                  title: 'Chat Securely', 
                  description: 'Send encrypted messages and files directly to your peers'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative"
                >
                  <div className="p-6 rounded-2xl bg-vscode-card/60 backdrop-blur-md border border-vscode-border/30 hover:border-metamask-orange/30 transition-all">
                    <div className="text-6xl font-bold text-vscode-hover mb-4">{item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-metamask-orange/20 flex items-center justify-center mb-4">
                      <item.icon size={24} className="text-metamask-orange" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-vscode-text-secondary text-sm">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight size={24} className="text-vscode-border" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Who Benefits?</h2>
              <p className="text-xl text-vscode-text-secondary">Privacy matters across industries</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-2xl bg-vscode-card/60 backdrop-blur-md border border-vscode-border/30 hover:border-metamask-orange/30 transition-all text-center"
                >
                  <div className="text-5xl mb-4">{useCase.emoji}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{useCase.title}</h3>
                  <p className="text-vscode-text-secondary text-sm">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-20 bg-gradient-to-r from-metamask-orange/10 to-metamask-yellow/10 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">Ready to Chat Privately?</h2>
              <p className="text-xl text-vscode-text-secondary mb-10">
                No signup, no email, no phone number. Just your wallet.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 50px rgba(246, 133, 27, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="bg-gradient-to-r from-metamask-orange to-metamask-yellow text-vscode-dark font-bold px-12 py-5 rounded-xl flex items-center space-x-3 text-xl shadow-2xl mx-auto"
              >
                <Wallet size={28} />
                <span>Connect Your Wallet</span>
                <Sparkles size={24} />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-10 backdrop-blur-md bg-vscode-darker/50 border-t border-vscode-border/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-metamask-orange to-metamask-yellow flex items-center justify-center">
                <MessageSquare size={18} className="text-vscode-dark" />
              </div>
              <div>
                <p className="text-white font-semibold">SecureChat</p>
                <p className="text-vscode-text-muted text-xs">© 2025 • Open Source</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <a href="https://github.com" className="text-vscode-text-secondary hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" className="text-vscode-text-secondary hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://discord.com" className="text-vscode-text-secondary hover:text-white transition-colors">
                <MessageSquare size={20} />
              </a>
            </div>

            <div className="flex items-center space-x-2 text-xs text-vscode-text-muted">
              <CheckCircle size={14} className="text-green-400" />
              <span>All data stays on your device</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
