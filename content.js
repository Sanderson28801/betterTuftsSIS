console.log("⚙️ SIS Overhaul extension successfully injected into the DOM.");

// Create a high-visibility structural element to verify execution
const injectorBanner = document.createElement("div");

// Style the element inline to ensure it overrides default page rules
Object.assign(injectorBanner.style, {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  backgroundColor: "#2563eb", // Modern blue
  color: "#ffffff",
  textAlign: "center",
  padding: "12px 0",
  fontSize: "14px",
  fontWeight: "600",
  fontFamily: "system-ui, -apple-system, sans-serif",
  zIndex: "9999999", // Ensure it sits on top of everything
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
});

injectorBanner.innerText = "🚀 SIS Overhaul: Extension Active (DOM Injected)";

// Append directly to the top of the body
document.body.appendChild(injectorBanner);

// Shift the body down slightly so the banner doesn't hide natural page content
document.body.style.paddingTop = "45px";
