import { Link } from "react-router-dom";

export default function About() {
  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)" }}>
      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="about-title">TravelBharat</h1>
        <p
          style={{
            fontSize: "clamp(1rem, 4vw, 1.3rem)",
            opacity: 0.95,
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
            letterSpacing: "0.3px",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          Explore India State by State - Your Ultimate Tourism Information
          Platform
        </p>
      </section>

      {/* Mission Section */}
      <section
        style={{
          padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--heading)",
              color: "var(--accent)",
              fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
              marginBottom: "20px",
              fontWeight: "700",
            }}
          >
            Our Mission
          </h2>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "var(--accent)",
              margin: "0 auto",
              borderRadius: "2px",
            }}
          ></div>
        </div>

        <div className="about-intro">
          <p
            style={{
              fontSize: "clamp(0.95rem, 3vw, 1.05rem)",
              lineHeight: "1.8",
              color: "var(--muted)",
            }}
          >
            TravelBharat is a centralized tourism information platform that
            provides comprehensive, state-wise and city-wise details of tourist
            destinations across India. We aim to be a digital travel
            encyclopedia showcasing India's rich cultural heritage, natural
            wonders, and modern attractions.
          </p>
        </div>

        {/* Key Features */}
        <div className="about-features">
          {[
            {
              icon: "map",
              title: "State-Wise Exploration",
              desc: "Browse 28 states and 8 union territories with detailed information about each region",
            },
            {
              icon: "pin",
              title: "Detailed Destinations",
              desc: "Comprehensive guides including best time to visit, entry fees, timings, and nearby attractions",
            },
            {
              icon: "gallery",
              title: "Rich Media",
              desc: "Beautiful image galleries showcasing the essence of each destination",
            },
            {
              icon: "search",
              title: "Smart Search",
              desc: "Find destinations by state, category, or keywords instantly",
            },
            {
              icon: "lightbulb",
              title: "Travel Tips",
              desc: "Insider information about cultural significance and travel recommendations",
            },
            {
              icon: "star",
              title: "Verified Content",
              desc: "All information is carefully curated and verified for accuracy",
            },
          ].map((feature, i) => {
            const svgs = {
              map: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#0000F5"
                >
                  <path d="m608-120-255.33-90-181.34 71.33q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15L352.67-840 608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v563.34q0 11.66-7.5 20.33-7.5 8.67-19.17 13L608-120Zm-36-82.67v-492.66L388-758v492.67l184 62.66Z" />
                </svg>
              ),
              pin: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#BB271A"
                >
                  <path d="M320-200q-117 0-198.5-81.5T40-480q0-117 81.5-198.5T320-760h320q117 0 198.5 81.5T920-480q0 117-81.5 198.5T640-200H320Zm36.67-309.69q0 58.02 39 101.19 39 43.17 84.33 79.83 45.33-36.66 84.33-79.95 39-43.3 39-101.33 0-51.38-36.07-87.38-36.07-36-87.33-36t-87.26 36.14q-36 36.14-36 87.5Zm94.83 18.19Q440-503 440-520t11.5-28.5Q463-560 480-560t28.5 11.5Q520-537 520-520t-11.5 28.5Q497-480 480-480t-28.5-11.5Z" />
                </svg>
              ),
              gallery: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#F2CDA2"
                >
                  <path d="M106.67-200Q79-200 59.5-219.5T40-266.67v-426.66Q40-721 59.5-740.5t47.17-19.5h426.66q27.67 0 47.17 19.5t19.5 47.17v426.66q0 27.67-19.5 47.17T533.33-200H106.67ZM720-520q-17 0-28.5-11.5T680-560v-160q0-17 11.5-28.5T720-760h160q17 0 28.5 11.5T920-720v160q0 17-11.5 28.5T880-520H720ZM160-360h320L375-500l-75 100-55-73-85 113Zm560 160q-17 0-28.5-11.5T680-240v-160q0-17 11.5-28.5T720-440h160q17 0 28.5 11.5T920-400v160q0 17-11.5 28.5T880-200H720Z" />
                </svg>
              ),
              search: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#DCEAD5"
                >
                  <path d="M226.67-80q-27 0-46.84-19.83Q160-119.67 160-146.67v-666.66q0-27 19.83-46.84Q199.67-880 226.67-880h368L800-640.67V-164L606.67-358.67q12.33-16.33 18.5-37 6.16-20.66 6.16-43.66 0-63.34-44-107.34t-107.33-44q-63.33 0-107.33 44t-44 107.34q0 63.33 44 107.33T480-288q23 0 42.67-5.17 19.66-5.16 38.66-16.83L772-100q-16.33 10.67-35.33 15.33Q717.67-80 698-80H226.67Zm193.5-299.5q-24.84-24.83-24.84-59.83t24.84-59.84Q445-524 480-524t59.83 24.83q24.84 24.84 24.84 59.84t-24.84 59.83Q515-354.67 480-354.67t-59.83-24.83Z" />
                </svg>
              ),
              lightbulb: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#8B7DBE"
                >
                  <path d="M390-240q-27.5 0-47.08-19.58-19.59-19.59-19.59-47.09V-368q-58.58-39.68-90.95-101.74Q200-531.8 200-602q0-116.16 81.83-197.08Q363.67-880 480.33-880 597-880 678.5-798.5 760-717 760-600q0 70.33-32.5 131.5T636.67-368v61.33q0 27.5-19.59 47.09Q597.5-240 570-240H390Zm8 160q-14.17 0-23.75-9.58-9.58-9.59-9.58-23.75v-33.34H596v33.45q0 14.22-9.58 23.72-9.59 9.5-23.75 9.5H398Z" />
                </svg>
              ),
              star: (
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="var(--accent)"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
            };

            return (
              <div
                key={i}
                className="about-feature-card"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(155, 74, 26, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div style={{ marginBottom: "12px" }}>{svgs[feature.icon]}</div>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="about-section alt-bg">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
          <h2
            style={{
              fontFamily: "var(--heading)",
              color: "var(--accent)",
              fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            The Challenge We Solve
          </h2>

          <div className="about-grid-two">
            <div>
              <h3
                style={{
                  fontFamily: "var(--heading)",
                  color: "var(--dark)",
                  fontSize: "1.3rem",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="#EA3323"
                  stroke="none"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
                Before TravelBharat
              </h3>
              <ul
                style={{
                  color: "var(--muted)",
                  fontSize: "1rem",
                  lineHeight: "2",
                  listStyle: "none",
                }}
              >
                {[
                  "Scattered tourism information across multiple websites",
                  "Difficulty finding authentic, verified destination details",
                  "Poor navigation across regions",
                  "Lack of comparative information",
                  "Time-consuming travel research",
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: "12px" }}>
                    <span
                      style={{ color: "var(--accent)", fontWeight: "bold" }}
                    >
                      •
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: "var(--heading)",
                  color: "var(--dark)",
                  fontSize: "1.3rem",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="var(--accent)"
                  stroke="none"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                With TravelBharat
              </h3>
              <ul
                style={{
                  color: "var(--muted)",
                  fontSize: "1rem",
                  lineHeight: "2",
                  listStyle: "none",
                }}
              >
                {[
                  "One comprehensive platform for all Indian destinations",
                  "Verified, accurate information from reliable sources",
                  "Easy state-wise and category-based navigation",
                  "Complete destination details in one place",
                  "Quick, informed travel planning",
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: "12px" }}>
                    <span
                      style={{ color: "var(--accent)", fontWeight: "bold" }}
                    >
                      •
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team & Values */}
      <section className="about-section">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
          <h2
            style={{
              fontFamily: "var(--heading)",
              color: "var(--accent)",
              fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            Our Core Values
          </h2>

          <div className="about-features">
          {[
            {
              value: "Accuracy",
              icon: "check",
              desc: "Every piece of information is verified and validated",
            },
            {
              value: "Accessibility",
              icon: "globe",
              desc: "Easy-to-use platform for all types of travelers",
            },
            {
              value: "Comprehensiveness",
              icon: "books",
              desc: "Complete coverage of all states and destinations",
            },
            {
              value: "Community",
              icon: "handshake",
              desc: "Built for and by travelers who love India",
            },
          ].map((item, i) => {
            const valueIcons = {
              check: (
                <svg
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="var(--accent)"
                  stroke="none"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ),
              globe: (
                <svg
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              books: (
                <svg
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="var(--accent)"
                >
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zM3 20h18v2H3z" />
                  <path d="M5 3v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3h-2v18H7V3z" />
                </svg>
              ),
              handshake: (
                <svg
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="var(--accent)"
                >
                  <path d="M16 11h-1V3h-2v8h-2V1h-2v8H9V4H7v7H6a3 3 0 0 0-3 3v7h2v-7a1 1 0 0 1 1-1h1v8h2v-8h2v8h2v-8h2a1 1 0 0 1 1 1v7h2v-7a3 3 0 0 0-3-3z" />
                </svg>
              ),
            };

            return (
              <div
                key={i}
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  {valueIcons[item.icon]}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--heading)",
                    color: "var(--accent)",
                    fontSize: "1.3rem",
                    marginBottom: "8px",
                  }}
                >
                  {item.value}
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.95rem",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="about-cta"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
          marginTop: "80px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--heading)",
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            marginBottom: "20px",
            maxWidth: "800px",
            margin: "0 auto 20px",
          }}
        >
          Ready to Explore India?
        </h2>
        <p style={{ 
          fontSize: "clamp(1rem, 4vw, 1.1rem)", 
          marginBottom: "30px", 
          opacity: 0.95,
          maxWidth: "600px",
          margin: "0 auto 30px",
        }}>
          Start your journey through India's most incredible destinations
        </p>
        <Link
          to="/states"
          style={{
            display: "inline-block",
            background: "white",
            color: "var(--accent)",
            padding: "12px 32px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "clamp(0.95rem, 3vw, 1rem)",
            transition: "var(--transition)",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Explore States →
        </Link>
      </section>
    </div>
  );
}
