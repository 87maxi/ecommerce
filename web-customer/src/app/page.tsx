export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="hero bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 py-24 rounded-b-3xl border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 font-display bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Blockchain E-Commerce
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-muted-foreground">
            Shop with cryptocurrency. Secure, transparent, decentralized payments powered by Ethereum.
          </p>
          <a
            href="/products"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 border border-primary/20 shadow-2xl hover:shadow-primary/30"
          >
            Start Shopping
          </a>
        </div>
      </div>

      {/* Features grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:bg-card transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🔒</div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Secure Payments</h3>
            <p className="text-muted-foreground">Pay with EURT tokens backed by real euros on the blockchain</p>
          </div>

          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:bg-card transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Fast Transactions</h3>
            <p className="text-muted-foreground">Instant confirmation and settlement on the Ethereum network</p>
          </div>

          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:bg-card transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🌐</div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Decentralized</h3>
            <p className="text-muted-foreground">No intermediaries, direct peer-to-peer transactions</p>
          </div>
        </div>
      </div>

      {/* Web3 Features */}
      <div className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 font-display text-foreground">Powered by Web3 Technology</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Built on Ethereum with smart contracts for secure, trustless transactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '💎', title: 'Smart Contracts', desc: 'Automated, secure payment processing' },
            { icon: '🪙', title: 'EURT Stablecoin', desc: 'Stable value backed by real euros' },
            { icon: '🔐', title: 'Wallet Integration', desc: 'Connect with MetaMask or any Web3 wallet' },
            { icon: '📊', title: 'Transparent', desc: 'All transactions visible on the blockchain' }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-secondary/30 rounded-xl border border-border hover:bg-secondary/50 transition-all duration-300">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h4 className="font-semibold mb-2 text-foreground">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}