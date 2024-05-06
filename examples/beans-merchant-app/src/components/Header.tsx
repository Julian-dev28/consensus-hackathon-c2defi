import React from "react";
import vertexLogo from "./vertex.png";

const Header: React.FC = () => {
  return (
    <div className="header-section">
      <img src={vertexLogo} alt="Vertex Logo" className="header-logo" />
      <div className="header-container">
        <h1 className="header-title mb-4">Vertex Community Pay</h1>
        <h2 className="header-subtitle mb-4">Stellar QR Code Generator</h2>
        <h3 className="header-powered-by mb-4">
          <a
            className="header-link"
            href="https://github.com/Beans-BV/merchant_sdk_javascript"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Beans Merchant SDK
          </a>
        </h3>
        <p className="header-description mb-4">
          <p>
            This tool demonstrates the Beans Merchant SDK by allowing you to
            generate QR codes for payments on Stellar.
            <br />
            Specifically, you can create QR codes to make payments to the Vertex
            Community account.
          </p>
        </p>
      </div>
    </div>
  );
};

export default Header;
