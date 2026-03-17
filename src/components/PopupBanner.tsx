import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useStoreSetting } from "@/hooks/useStoreSettings";
import { useNavigate } from "react-router-dom";

const PopupBanner = () => {
  const { data: popup } = useStoreSetting("popup");
  const { data: saleBanner } = useStoreSetting("sale_banner");
  const [showPopup, setShowPopup] = useState(false);
  const [showSale, setShowSale] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (popup?.enabled) {
      const dismissed = sessionStorage.getItem("popup_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setShowPopup(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [popup]);

  const dismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("popup_dismissed", "true");
  };

  return (
    <>
      {/* Sale Banner at top */}
      {saleBanner?.enabled && showSale && saleBanner?.text && (
        <div className="relative bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
          <span>{saleBanner.text}</span>
          <button onClick={() => setShowSale(false)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && popup?.enabled && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={dismissPopup}>
          <div className="relative bg-card rounded-3xl shadow-2xl max-w-md w-[90%] p-6 animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={dismissPopup} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            {popup.image_url && (
              <img src={popup.image_url} alt="" className="w-full h-40 object-cover rounded-2xl mb-4" />
            )}
            {popup.title && <h3 className="font-display text-xl font-bold mb-2">{popup.title}</h3>}
            {popup.message && <p className="text-muted-foreground text-sm mb-4">{popup.message}</p>}
            {popup.link && (
              <button
                onClick={() => { navigate(popup.link); dismissPopup(); }}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition"
              >
                Shop Now →
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupBanner;
