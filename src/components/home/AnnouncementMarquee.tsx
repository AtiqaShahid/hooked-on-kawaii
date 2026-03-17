const messages = [
  "Pay Rs. 500/- in advance to confirm your order! Remaining amount can be paid on delivery. 💕",
  "Free shipping on orders above Rs. 3,000 🚚",
  "Custom orders welcome — design your own crochet creation! 🧶",
  "New arrivals dropping every week ✨",
];

const AnnouncementMarquee = () => (
  <div className="overflow-hidden bg-primary/40 py-2.5">
    <div className="animate-marquee flex whitespace-nowrap">
      {[...messages, ...messages].map((msg, i) => (
        <span key={i} className="mx-8 text-sm font-body font-medium text-foreground/80">
          {msg}
        </span>
      ))}
    </div>
  </div>
);

export default AnnouncementMarquee;
