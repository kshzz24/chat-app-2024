import { Helmet } from "react-helmet-async";

// eslint-disable-next-line react/prop-types
const Title = ({ title = "Chat", description = "This is a chat app" }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
