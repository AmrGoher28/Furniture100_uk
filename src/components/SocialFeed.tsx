const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=250&q=75&fm=webp",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=250&q=75&fm=webp",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=250&q=75&fm=webp",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=250&q=75&fm=webp",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?w=250&q=75&fm=webp",
  "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=250&q=75&fm=webp",
];

export const SocialFeed = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-4">Follow Us @furniture100</h2>
        <p className="text-center text-muted-foreground mb-10 font-light">Join our community for daily inspiration</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PLACEHOLDER_IMAGES.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl warm-shadow hover:warm-shadow-lg transition-shadow duration-300">
              <img
                src={src}
                alt={`Lifestyle inspiration ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
