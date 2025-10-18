import Footer from "../components/Footer";
import Header from "../components/Header";

import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router; // The current path, e.g., "/signup"

  const noHeaderPaths = ["/signup", "/login"];

  const showHeader = !noHeaderPaths.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}  

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;