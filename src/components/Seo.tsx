import { Helmet } from "react-helmet-async";

const SITE_URL = "https://furniture100.co.uk";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
  noindex?: boolean;
}

export const Seo = ({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
  noindex = false,
}: SeoProps) => {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image || `${SITE_URL}/hero-slide-1.webp`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Furniture100" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};
