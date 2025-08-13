import React from "react";
import Image from "next/image";

import Logo from "../../../public/favicons/logo.svg";
import Link from "next/link";

function Header() {
  return (
    <header className="h-[120px] w-full border-b border-border bg-secondary-background">
      <div className="layout-standard flex-center h-full">
        <Link href={"/"} passHref>
          <Image src={Logo} alt="Code Aura" priority width={250} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
