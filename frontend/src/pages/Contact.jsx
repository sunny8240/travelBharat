import React from "react";
import LottiePlaceholder from "../component/LottiePlaceholder";

const Contact = () => {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LottiePlaceholder 
        title="Contact Page Coming Soon" 
        message="This page is currently under development. We'll be ready to connect with you very soon!"
        src={"https://lottie.host/embed/9e4fbfc6-b43b-4ae2-8bbc-5bc7a7849540/QMHxs63mj9.lottie"}
      />
    </div>
  );
};

export default Contact;
