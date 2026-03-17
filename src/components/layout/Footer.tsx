import { Link } from "react-router-dom";
import { Heart, Instagram, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-gradient-section stitch-bg mt-20">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🧶</span>
            <span className="font-display text-xl font-bold text-gradient-pink">HookOnLoop</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Handmade with love, one stitch at a time. Every piece tells a story. 💕
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
            <li><Link to="/collections" className="hover:text-foreground transition-colors">Collections</Link></li>
            <li><Link to="/surprise-box" className="hover:text-foreground transition-colors">Mystery Box</Link></li>
            <li><Link to="/style-quiz" className="hover:text-foreground transition-colors">Style Quiz</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/custom-builder" className="hover:text-foreground transition-colors">Custom Builder</Link></li>
            <li><Link to="/craft-stories" className="hover:text-foreground transition-colors">Craft Stories</Link></li>
            <li><Link to="/learn" className="hover:text-foreground transition-colors">Learn Crochet</Link></li>
            <li><Link to="/community" className="hover:text-foreground transition-colors">Community</Link></li>
            <li><Link to="/design-voting" className="hover:text-foreground transition-colors">Vote on Designs</Link></li>
            <li><Link to="/loyalty" className="hover:text-foreground transition-colors">Loyalty Rewards</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Connect</h4>
          <div className="flex gap-3 mb-4">
            <a href="#" className="w-10 h-10 rounded-2xl bg-primary/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary transition-all btn-squish">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-2xl bg-primary/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary transition-all btn-squish">
              <Mail size={18} />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">hello@hookonloop.com</p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart size={14} className="text-pink fill-pink" /> by HookOnLoop © 2025
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
