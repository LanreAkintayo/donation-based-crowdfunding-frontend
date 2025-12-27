// import Link from "next/link";
// import { CryptoCards, Button } from "@web3uikit/core";
// import { ConnectButton } from "web3uikit";
// import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
// import NavigationDropdown from "./NavigationDropdown";
// import { useEffect, useState, useCallback } from "react";
// import { useMoralis, useWeb3Contract, useChain } from "react-moralis";
// import { abi } from "../constants";
// import { BigNumber, ethers } from "ethers";
// import { useRouter } from "next/router";
// import { FaBars, FaTimes } from "react-icons/fa";

// const useMediaQuery = (width) => {
//   const [targetReached, setTargetReached] = useState(false);

//   const updateTarget = useCallback((e) => {
//     if (e.matches) {
//       setTargetReached(true);
//     } else {
//       setTargetReached(false);
//     }
//   }, []);

//   useEffect(() => {
//     const media = window.matchMedia(`(max-width: ${width}px)`);
//     media.addEventListener("change", updateTarget);

//     // Check on mount (callback is not called until a change occurs)
//     if (media.matches) {
//       setTargetReached(true);
//     }

//     return () => media.removeEventListener("change", updateTarget);
//   }, []);

//   return targetReached;
// };

// export default function Header() {
//   const [collapsed, setCollapsed] = useState(true);
//   const isBreakpoint = useMediaQuery(912);
//   const { isWeb3Enabled, chainId: chainIdHex, enableWeb3 } = useMoralis();
//   const { switchNetwork, chain, account } = useChain();

//   // console.log(chainIdHex)
//   const chainId = parseInt(chainIdHex);

//   const router = useRouter();
//   const currentUrl = router.asPath;

//   useEffect(() => {
//     console.log(collapsed);
//   }, [collapsed]);
//   const handleSidebar = () => {
//     setCollapsed((prevCollapsed) => !prevCollapsed);
//   };

//   return (
//     <div className={`ss:${chainId != 97 ? "h-30" : "h-20"} h-30 `}>
//       {/* Navbar */}

//       {!collapsed && isBreakpoint && (
//         <div className={`z-50 h-screen ${!collapsed && "fixed inset-0"}`}>
//           <ProSidebar
//             breakPoint="0px"
//             open={false}
//             collapsedWidth="0px"
//             collapsed={collapsed}
//           >
//             <div
//               className="px-4 pt-4 w-full flex justify-end text-end cursor-pointer text-xl"
//               onClick={handleSidebar}
//             >
//               <FaTimes />
//             </div>
//             <Menu iconShape="square">
//               <div className="text-xl text-white hover:text-green-700">
//                 <MenuItem>
//                   <Link href="/">
//                     <p
//                       className={`text-white font-semibold ${
//                         currentUrl == "/" && "border-b-2 border-orange-700"
//                       } hover:text-orange-500 sm:text-xl text-lg`}
//                     >
//                       Home
//                     </p>
//                   </Link>
//                 </MenuItem>
//               </div>
//               <MenuItem>
//                 <Link href="/projects">
//                   <p
//                     className={`text-white ${
//                       currentUrl == "/projects" &&
//                       "border-b-2 border-orange-700"
//                     } font-semibold hover:text-orange-500 text-lg`}
//                   >
//                     Projects
//                   </p>
//                 </Link>
//               </MenuItem>
//               <MenuItem>
//                 <Link href="/launch">
//                   <p
//                     className={`w-full text-white ${
//                       currentUrl == "/launch" && "border-b-2 border-orange-700"
//                     } font-semibold hover:text-orange-500 text-lg `}
//                   >
//                     Get Funded
//                   </p>
//                 </Link>
//               </MenuItem>
//             </Menu>
//           </ProSidebar>
//         </div>
//       )}

//       <nav className="flex  items-end flex-row w-full justify-between hh:justify-between hh:items-center px-2 py-2 sm:px-4 sm:py-4 h-full text-white bg-zinc-800 ">
//         <img
//           src="./my_logo.svg"
//           width={200}
//           height={30}
//           className="object-cover p-0 lt:block hidden"
//         />
//         <img
//           src="./my_icon.svg"
//           width={40}
//           height={10}
//           className="object-cover p-0 lt:hidden block"
//         />
//         <div className="flex items-center justify-end self-end ss:self-auto">
//           <div className="flex justify-between items-center text-lg ">
//             {!isBreakpoint && (
//               <>
//                 <Link href="/">
//                   <a
//                     className={`text-white font-semibold ${
//                       currentUrl == "/" && "border-b-2 border-orange-700"
//                     } hover:text-orange-500 sm:text-xl text-lg`}
//                   >
//                     Home
//                   </a>
//                 </Link>
//                 <Link href="/projects">
//                   <a
//                     className={`sm:ml-8 ml-6 text-white ${
//                       currentUrl == "/projects" &&
//                       "border-b-2 border-orange-700"
//                     } font-semibold hover:text-orange-500 text-lg`}
//                   >
//                     Projects
//                   </a>
//                 </Link>

//                 <Link href="/launch">
//                   <a
//                     className={`sm:mx-4 mx-2 w-full text-white ${
//                       currentUrl == "/launch" && "border-b-2 border-orange-700"
//                     } font-semibold hover:text-orange-500 `}
//                   >
//                     Get Funded
//                   </a>
//                 </Link>
//               </>
//             )}

//             {currentUrl !== "/" && (
//               <div className="text-white flex flex-col w-full sc:py-10 items-start">
//                 <div className="px-0">
//                   {" "}
//                   <ConnectButton text="This is a button" />
//                 </div>
//                 {chainId != "97" && isWeb3Enabled && (
//                   <button
//                     className=" ml-4 text-red-700 text-sm my-2 cursor-pointer bg-red-100 rounded-lg p-1 px-2"
//                     onClick={() => {
//                       switchNetwork("0x61");
//                     }}
//                   >
//                     Switch to BSC Testnet
//                   </button>
//                 )}
//               </div>
//             )}
//             {currentUrl === "/" && (
//               <div className="text-white flex flex-col w-full sc:py-10 items-start">
//                 <div className="px-0">
//                   Sign In
//                 </div>

//               </div>
//             )}

//             {isBreakpoint && (
//               <div
//                 className="w-8 h-8 text-white hover:text-green-500 cursor-pointer"
//                 onClick={handleSidebar}
//               >
//                 {/* <img
//                   alt="..."
//                   src="./menubar.svg"
//                   className="object-cover w-full h-full cursor-pointer hover:text-green-500"
//                 /> */}

//                 <FaBars className="mr-3 w-9 h-9 bg-orange-100 rounded-full text-orange-800 p-2" />
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

import Link from "next/link";
import { ConnectButton } from "web3uikit";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useEffect, useState, useCallback } from "react";
import { useMoralis, useChain } from "react-moralis";
import { useRouter } from "next/router";
import { FaBars, FaTimes, FaExclamationTriangle } from "react-icons/fa";

// IMPORT YOUR NEW COMPONENTS
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

// --- AUTH MODAL COMPONENT ---
const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

const handleAuthSuccess = (shouldRedirect = false) => {
    if (shouldRedirect) {
      // CASE 1: Google Login OR Normal Login
      onClose();
      router.push("/dashboard");
    } else {
      // CASE 2: Normal Signup
      setIsSignUp(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate__animated animate__fadeIn">
      <div className="bg-white text-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate__animated animate__zoomIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex text-center border-b border-zinc-100">
          <div
            className={`flex-1 py-4 cursor-pointer font-bold ${
              !isSignUp
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
            onClick={() => setIsSignUp(false)}
          >
            Login
          </div>
          <div
            className={`flex-1 py-4 cursor-pointer font-bold ${
              isSignUp
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            {isSignUp ? "Join the funding revolution." : ""}
          </p>

          {/* DYNAMICALLY RENDER THE FORM */}
          {isSignUp ? (
            <SignupForm onSuccess={handleAuthSuccess} />
          ) : (
          <LoginForm onSuccess={() => handleAuthSuccess(true)} />
          )}

          <p
            className="text-center text-sm text-zinc-500 mt-6 cursor-pointer hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- HEADER COMPONENT (Kept Simple) ---
const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);
  const updateTarget = useCallback((e) => {
    if (e.matches) setTargetReached(true);
    else setTargetReached(false);
  }, []);
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);
    if (media.matches) setTargetReached(true);
    return () => media.removeEventListener("change", updateTarget);
  }, []);
  return targetReached;
};

export default function Header() {
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const isBreakpoint = useMediaQuery(912);
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const { switchNetwork } = useChain();

  const chainId = parseInt(chainIdHex);
  const router = useRouter();
  const currentUrl = router.asPath;

  const handleSidebar = () => setCollapsed(!collapsed);

  return (
    <>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-100 shadow-sm">
        {/* Mobile Sidebar */}
        {!collapsed && isBreakpoint && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="h-full w-[250px] bg-white shadow-2xl">
              <div className="p-5 flex justify-end">
                <FaTimes
                  className="text-zinc-600 text-2xl cursor-pointer hover:text-red-500"
                  onClick={handleSidebar}
                />
              </div>
              <div className="flex flex-col gap-6 px-6 mt-4">
                <Link href="/">
                  <p className="text-zinc-600 font-medium">Home</p>
                </Link>
                <Link href="/projects">
                  <p className="text-zinc-600 font-medium">Projects</p>
                </Link>
                <Link href="/launch">
                  <p className="text-zinc-600 font-medium">Get Funded</p>
                </Link>
                {/* Mobile Sign In */}
                {currentUrl === "/" && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-orange-600 text-white py-2 rounded-lg font-bold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="./my_logo.svg"
              className="h-8 object-contain hidden md:block"
              alt="Logo"
            />
            <img
              src="./my_icon.svg"
              className="h-8 object-contain md:hidden block"
              alt="Icon"
            />
          </div>

          {!isBreakpoint && (
            <div className="flex items-center gap-10">
              <Link href="/">
                <a
                  className={`text-base font-medium ${
                    currentUrl === "/"
                      ? "text-orange-600 font-bold"
                      : "text-zinc-500 hover:text-orange-600"
                  }`}
                >
                  Home
                </a>
              </Link>
              <Link href="/projects">
                <a
                  className={`text-base font-medium ${
                    currentUrl === "/projects"
                      ? "text-orange-600 font-bold"
                      : "text-zinc-500 hover:text-orange-600"
                  }`}
                >
                  Projects
                </a>
              </Link>
              <Link href="/launch">
                <a
                  className={`text-base font-medium ${
                    currentUrl === "/launch"
                      ? "text-orange-600 font-bold"
                      : "text-zinc-500 hover:text-orange-600"
                  }`}
                >
                  Get Funded
                </a>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4">
            {currentUrl !== "/" && (
              <div className="flex items-center gap-3">
                <ConnectButton moralisAuth={false} />
                {chainId !== 97 && isWeb3Enabled && !isBreakpoint && (
                  <button
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-bold border border-red-100"
                    onClick={() => switchNetwork("0x61")}
                  >
                    <FaExclamationTriangle /> Switch Network
                  </button>
                )}
              </div>
            )}

            {currentUrl === "/" && !isBreakpoint && (
              <button
                onClick={() => setShowModal(true)}
                className="ml-6 bg-zinc-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all"
              >
                Sign In
              </button>
            )}

            {isBreakpoint && (
              <button
                onClick={handleSidebar}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600"
              >
                <FaBars className="w-6 h-6" />
              </button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
