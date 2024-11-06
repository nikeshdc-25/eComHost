import React from "react";
import Marquee from "react-fast-marquee";
import "./marquee.css";


function MarqueeBanner() {
  return (
    <div className="marquee" >
      <Marquee gradient={false} speed={50}>
        <span style={{ padding: "0 2rem", fontWeight: "bold" }}>
          📞 Contact Us: +977-9848050240
        </span>
        <span style={{ padding: "0 2rem", fontWeight: "bold" }}>
          🚚 Free Shipping Over Rs. 1000
        </span>
        <span style={{ padding: "0 2rem", fontWeight: "bold" }}>
          🎉 Use Promo Code: 123456
        </span>
        <span style={{ padding: "0 2rem", fontWeight: "bold" }}>
          📦 Delivery Only Inside Valley
        </span>
      </Marquee>
    </div>
  );
}

export default MarqueeBanner;
