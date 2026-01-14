import Head from "next/head";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWRConfig from "swr";
import ProjectCardSection from "../components/ProjectCardSection";
import Layout from "./layout";

// Icons
import { FaChevronRight, FaGlobeAfrica } from "react-icons/fa";
import { BsBank, BsShieldCheck, BsLightningChargeFill } from "react-icons/bs";
import "animate.css";

const Home = () => {
  const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const [dbLoggedIn, setDbLoggedIn] = useState(false);
  const router = useRouter();

  // 1. Auto-Login Logic (Hybrid)
  useEffect(() => {
    if (!isWeb3Enabled && typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
    const token = window.localStorage.getItem("authToken"); 
    if (token) {
      setDbLoggedIn(true);
    }
  }, [isWeb3Enabled]);

  const isAuthenticated = isWeb3Enabled || dbLoggedIn;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/launch");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="bg-white">
      <Head>
        <title>Bloom | Hybrid Crowdfunding</title>
        <meta name="description" content="Fund your dreams in Naira or Crypto" />
      </Head>

      {/* ================= HERO SECTION (Centered & Clean) ================= */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-[#FDFBF7] overflow-hidden">
        
        {/* Optional: Background decorative blob to keep it from looking too flat */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 ft:px-20 z-10 flex flex-col items-center text-center">
          
          {/* <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
            Live in Nigeria
          </div> */}
          
          <h1 className="text-5xl ft:text-7xl font-extrabold text-zinc-900 leading-tight max-w-4xl">
            Fund a cause. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500">
              In Naira or Crypto.
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600 leading-relaxed max-w-2xl">
            A secure crowdfunding platform where you can raise funds globally 
            and settle locally. No card restrictions. No delays. 
            Accept <b>Bank Transfers</b> and <b>Crypto</b> seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={handleGetStarted}
              className="group flex items-center justify-center gap-3 bg-zinc-900 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {isAuthenticated ? "Start Campaign" : "Get Started Now"}
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push("/projects")}
              className="flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 text-zinc-700 px-10 py-4 rounded-full font-bold hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
            >
              Browse Campaigns
            </button>
          </div>
          
          {/* Trust Signals (Centered) */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-zinc-500 font-medium">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
              <BsShieldCheck className="text-green-600 text-lg" />
              <span>Verified Creators</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
              <BsLightningChargeFill className="text-yellow-500 text-lg" />
              <span>Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
              <BsBank className="text-blue-500 text-lg" />
              <span>Direct to Bank</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS TICKER ================= */}
      {/* <div className="w-full bg-zinc-900 text-white py-10 border-y border-zinc-800">
        <div className="container mx-auto px-6 ft:px-20 flex flex-wrap justify-center md:justify-between items-center text-center gap-8 md:gap-0">
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-4xl font-bold text-orange-500">₦45M+</h3>
            <p className="text-zinc-400 text-sm mt-1">Raised in Fiat</p>
          </div>
          <div className="w-px h-12 bg-zinc-700 hidden md:block"></div>
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-4xl font-bold text-blue-400">120 ETH</h3>
            <p className="text-zinc-400 text-sm mt-1">Raised in Crypto</p>
          </div>
          <div className="w-px h-12 bg-zinc-700 hidden md:block"></div>
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-4xl font-bold text-green-400">98%</h3>
            <p className="text-zinc-400 text-sm mt-1">Success Rate</p>
          </div>
        </div>
      </div> */}

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 ft:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl ft:text-4xl font-bold text-zinc-900">How it Works</h2>
            <p className="text-zinc-500 mt-3 text-lg">Fundraising made simple for the Nigerian market.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors text-center hover:shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Create Campaign</h3>
              <p className="text-zinc-500 leading-relaxed">
                Set your goal in Naira. Tell your story. 
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors text-center hover:shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 mx-auto">
                <FaGlobeAfrica />
              </div>
              <h3 className="text-xl font-bold mb-3">Share Globally</h3>
              <p className="text-zinc-500 leading-relaxed">
                Accept donations from anyone, anywhere. Your auntie in Lagos can pay with Naira, your friend in London with Crypto.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors text-center hover:shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-2xl mb-6 mx-auto">
                <BsBank />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Cashout</h3>
              <p className="text-zinc-500 leading-relaxed">
                Once your goal is reached, withdraw funds directly to your Nigerian Bank Account or Crypto Wallet instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE PROJECTS ================= */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 ft:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">Trending Campaigns</h2>
              <p className="text-zinc-500 mt-2 text-lg">Support creative ideas and causes.</p>
            </div>
            <button 
              onClick={() => router.push("/projects")}
              className="hidden md:flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all text-lg"
            >
              View All <FaChevronRight />
            </button>
          </div>
          
          <ProjectCardSection />
          
          <div className="mt-12 md:hidden flex justify-center">
             <button 
              onClick={() => router.push("/projects")}
              className="w-full py-4 rounded-xl border-2 border-orange-100 flex items-center justify-center gap-2 text-orange-600 font-bold"
            >
              View All Campaigns <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Home;


// import Head from "next/head";
// import Image from "next/image";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import { CryptoCards, Button } from "@web3uikit/core";
// import { useMoralis } from "react-moralis";
// import { useEffect, useState } from "react";
// import ProjectCard from "../components/ProjectCard";
// import useSWR, { useSWRConfig } from "swr";
// import ProjectCardSection from "../components/ProjectCardSection";
// import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
// import Link from "next/link";
// import { FaChevronRight } from "react-icons/fa";
// import "animate.css";
// import Layout from "./layout";

// const Home = () => {
//   const { isWeb3Enabled, chainId } = useMoralis();

//   const [enabled, setEnabled] = useState(false);
//   // const [dbLoggedIn, setDbLoggedIn] = useState(false);

//   const { mutate } = useSWRConfig();

//   // useEffect(() => {
//   //     const storedUser = localStorage.getItem("authToken");
//   //     if (storedUser){
//   //       setDbLoggedIn(true);
//   //     }

//   // }, [])



//   return (
//     <div className="">
//       <section className="ft:flex ft:flex-col">
//         <div className="w-full flex-1">
//           <div className="w-full h-full flex flex-col justify-center items-center ft:gap-1  ft:grid ft:grid-cols-12 bg-gradient-to-tr from-[#e7e0ce] via-white  to-white px-5 sm:px-20">
//             <div className="ft:col-span-7 flex flex-col justify-center ft:justify-start ft:items-left ">

//             <div className="font-medium text-center ft:text-left ft:mt-0 mt-3 ">
//               <p className="text-4xl ft:text-5xl">
//                 Decentralized
//               </p>

//               <p className="w-full py-2 text-4xl ft:text-5xl">
//                 Crowdfunding Platform
//               </p>

//             </div>
//             <p className="my-4 animate__animated animate__backInDown  text-sm leading-6 ft:w-8/12 text-center ft:text-left">This platform automate the process of campaign funding,
//             execution, and payout, reducing the need for manual intervention and enhancing efficiency. </p>
//             <div className="flex justify-center ft:justify-start text-base ss:text-xl mt-6">
//               <button
//                 className="bg-orange-700 w-40 rounded-full text-white p-2 py-4 hover:bg-orange-800"
//                 onClick={() => {
//                   if (isWeb3Enabled) {
//                     window.open("/launch", "_self");
//                   } else {
//                     window.alert("Connect your wallet");
//                   }
//                 }}
//               >
//                 <div className="flex items-center justify-center ">
//                 <p className="text-[12px] font-bold px-2">Get Funded</p>
//                 <FaChevronRight className="text-black w-5 h-5 bg-yellow-400 rounded-full p-1" />
//                 </div>

//               </button>

//               <button
//                 className="bg-orange-100 w-40 text-orange-800 rounded-full ml-4 p-2 py-4 hover:bg-orange-200"
//                 onClick={() => {
//                   if (isWeb3Enabled) {
//                     window.open("/projects", "_self");
//                   } else {
//                     window.alert("Connect your wallet");
//                   }
//                 }}
//               >
//                 <p className="text-[12px]">
//                 Browse Campaign
//                 </p>

//               </button>
//             </div>

//             </div>
//             <div className="ft:col-span-5 ">
//               <Image src="/homepage_clip_art.svg" alt="crowdfund clip art" width={800} height={900} objectFit="cover"/>
//             </div>

//           </div>

//         </div>
//       </section>
//       <section className="">
//         <h1 className="text-3xl mt-4 ft:mt-10 px-5">Explore Campaigns</h1>
//         <ProjectCardSection />
//       </section>
//     </div>
//   );
// }

// Home.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

// export default Home;
