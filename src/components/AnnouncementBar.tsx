export const AnnouncementBar = () => {
  return (
    <div className="bg-charcoal text-primary-foreground py-2 px-3 text-center">
      <p className="text-[10px] sm:text-xs md:text-sm tracking-wide leading-tight">
        <span className="hidden sm:inline">Free UK Delivery on All Orders &nbsp;|&nbsp; 30 Day Returns &nbsp;|&nbsp; Rated Excellent ⭐</span>
        <span className="sm:hidden">Free UK Delivery &nbsp;·&nbsp; 30 Day Returns &nbsp;·&nbsp; ⭐ Excellent</span>
      </p>
    </div>
  );
};
