import React from "react";

function Footer() {
  return (
    <footer className="layout-standard py-6 border-t border-border text-muted-foreground text-sm text-center">
      © {new Date().getFullYear()} <strong>Code Aura</strong>. All rights
      reserved. These invoices will be generated securely for authorized use
      only.
      <br />
      Designed & built with precision by <strong>TechSaws</strong>.
    </footer>
  );
}

export default Footer;
