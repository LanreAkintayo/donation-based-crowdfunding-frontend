// Your original, working imports
import Head from "next/head";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { CryptoCards, Button } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import useSWR, { useSWRConfig } from "swr";
import ProjectCardSection from "../components/ProjectCardSection";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import "animate.css";
import Layout from "./layout";

// New imports for the icons in the new design
import { Rocket, FileCompass, Wallet, Layers, CheckCircle } from 'lucide-react';

// A helper component for the stat cards to keep the main code clean
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200">
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { isWeb3Enabled, account } = useMoralis(); // Using your original hook
  const userName = "Lanre";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Dashboard | Crowdfund</title>
      </Head>

      <main className="container mx-auto p-6 sm:p-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Hi {userName}, Welcome Back 👋</h1>
          <p className="mt-2 text-gray-600">Here's a snapshot of your activity on the platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StatCard title="Projects You've Backed" value="12" icon={<Layers size={24} className="text-emerald-600" />} />
          <StatCard title="Total Contributed" value="4.75 ETH" icon={<Wallet size={24} className="text-sky-600" />} />
          <StatCard title="Successful Projects" value="7" icon={<CheckCircle size={24} className="text-rose-600" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col items-start hover:border-emerald-500 transition-colors">
            <Rocket size={32} className="text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Launch a New Project</h2>
            <p className="text-gray-600 mt-2 mb-6 flex-grow">Have a new idea? Get the funding you need from our vibrant community.</p>
            <button
              onClick={() => window.open("/launch", "_self")}
              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Start a Campaign
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col items-start hover:border-sky-500 transition-colors">
            {/* <FileCompass  mb-4" /> */}
            <h2 className="text-2xl font-bold text-gray-900">Explore Projects</h2>
            <p className="text-gray-600 mt-2 mb-6 flex-grow">Discover and support innovative projects from creators around the world.</p>
            <button
              onClick={() => window.open("/projects", "_self")}
              className="w-full bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Browse Projects
            </button>
          </div>
        </div>
        
        <div className="mt-16">
           <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Active Campaigns</h2>
           {/* This uses your original, working ProjectCardSection component */}
           <ProjectCardSection /> 
        </div>
      </main>
    </div>
  );
};

// Your original, working getLayout function
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// Your original, working export
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

//   const { mutate } = useSWRConfig();


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
//             <p className="my-4 animate__animated animate__backInDown  text-sm leading-6 ft:w-8/12 text-center ft:text-left">This platform automate the process of project funding, 
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
//                 Browse Project
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
//         <h1 className="text-3xl mt-4 ft:mt-10 px-5">Explore Projects</h1>
//         <ProjectCardSection />
//       </section>
//     </div>
//   );
// }


// Home.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };


// export default Home;