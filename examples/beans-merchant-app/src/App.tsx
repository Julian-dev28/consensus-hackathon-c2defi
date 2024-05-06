import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import QrCodeGenerator from "./components/QrCodeGenerator";

const App: React.FC = () => {
  return (
    <div className="container mt-5">
      <QrCodeGenerator />
    </div>
  );
};

export default App;
