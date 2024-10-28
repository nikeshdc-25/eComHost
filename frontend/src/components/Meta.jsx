import { Helmet } from "react-helmet-async";

function Meta({ title = "vShop Nepal", description = "Taste the air!" }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

export default Meta;
