import Link from "next/link";
import SearchInput from "./search-input";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

import HeaderAuth from "./header-auth";

function Header() {
  return (
    <Navbar className="shadow mb-6">
      <NavbarBrand>
        <Link href={"/"} className="font-bold">
          Discuss
        </Link>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          <SearchInput />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
