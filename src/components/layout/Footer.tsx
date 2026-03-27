import { Link } from "react-router-dom";
import { Heart, Instagram, Mail, Facebook } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"/>
  </svg>
);

const Footer = () => (
  <footer className="bg-gradient-section stitch-bg mt-20">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Crochet World" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12" />
            <span className="font-display text-xl font-bold text-gradient-pink">Crochet World</span>
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
          <h4 className="font-display font-semibold mb-4">Policies</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shipping-policy" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-foreground transition-colors">Return Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-3 mb-4">
            <a
              href="https://www.facebook.com/share/1DxNcWWrkJ/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary hover:shadow-glow transition-all duration-300 hover:scale-110 btn-squish"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/hookonloop?igsh=eWY2NzByOHhuMHo5"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary hover:shadow-glow transition-all duration-300 hover:scale-110 btn-squish"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@hookonloop?_r=1&_t=ZS-91kniODXurM"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary hover:shadow-glow transition-all duration-300 hover:scale-110 btn-squish"
            >
              <TikTokIcon />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">hello@crochetworld.com</p>
          <Link
            to="/admin/login"
            className="inline-block mt-4 text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200"
          >
            Admin Login
          </Link>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart size={14} className="text-pink fill-pink" /> by Crochet World © 2025
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
