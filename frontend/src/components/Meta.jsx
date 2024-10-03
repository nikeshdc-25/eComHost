import { Helmet } from "react-helmet-async";

function Meta({
  title = "Welcome to Broadway",
  description = "This is a simple ecomm app",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

export default Meta;
