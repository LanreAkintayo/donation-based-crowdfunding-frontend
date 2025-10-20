import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image"; 

export default function ProjectCard({ projectInfo }) {
  // --- Data Formatting (Kept from original) ---
  const goal = ethers.utils.formatEther(projectInfo.goal.toString());
  const dollarUSLocale = Intl.NumberFormat("en-US");
  const formattedGoal = dollarUSLocale.format(goal);
  const newImageUrl = `https://amethyst-intimate-swallow-509.mypinata.cloud/ipfs/${projectInfo.projectImageUrl}`;

  // --- Improved Dynamic Styling ---
  // A more modern and accessible color palette for the progress bar
  const progressBarColor =
    projectInfo.percentFunded > 70
      ? "bg-emerald-500"
      : projectInfo.percentFunded > 40
      ? "bg-amber-500"
      : "bg-rose-500";

  // Using an object for cleaner, more readable status styles
  const statusStyles = {
    Active: "bg-emerald-100 text-emerald-800",
    Successful: "bg-emerald-100 text-emerald-800",
    Pending: "bg-amber-100 text-amber-800",
    Closed: "bg-gray-100 text-gray-800",
    Unsuccessful: "bg-rose-100 text-rose-800",
  };
  const statusClassName =
    statusStyles[projectInfo.status] || "bg-gray-100 text-gray-800";

  return (
    <Link
      href={{
        pathname: `/${projectInfo.projectTitle}`,
        query: {
          ...projectInfo,
          backers: JSON.stringify(projectInfo.backers),
        },
      }}
      legacyBehavior // Good practice when the child is a custom component or `<a>` tag
    >
      {/* CARD CONTAINER: Added rounded corners, a subtle shadow, and a hover effect */}
      <a className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden group">
        {/* === 1. Image Section === */}
        <div className="relative w-full h-48">
          <Image
            src={newImageUrl}
            alt={`${projectInfo.projectTitle} cover image`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* === 2. Content Section with Consistent Padding === */}
        <div className="p-5">
          {/* STATUS BADGE: Moved off the image for better readability */}
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${statusClassName}`}
          >
            {projectInfo.status}
          </span>

          {/* TITLE: Made more prominent */}
          <h3 className="text-lg font-bold text-gray-900 truncate mt-3 mb-2">
            {projectInfo.projectTitle}
          </h3>

          {/* DESCRIPTION: Limited to 2 lines to keep the card tidy */}
          <p className="text-sm text-gray-600 h-10 leading-5 overflow-hidden">
            {projectInfo.projectNote.substring(0, 90)}...
          </p>

          {/* === 3. Progress & Funding Goal === */}
          <div className="mt-5">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${progressBarColor}`}
                style={{ width: `${projectInfo.percentFunded}%` }}
              ></div>
            </div>
            {/* FUNDING TEXT: Clearer display of progress */}
            <p className="text-sm font-semibold text-emerald-600 mt-2">
              <span className="text-gray-800">
                {projectInfo.percentFunded}%
              </span>{" "}
              of ${formattedGoal}
            </p>
          </div>

          {/* === 4. Key Stats Divider & Information === */}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm font-bold text-gray-800">
              {/* Using the available 'backers' data for social proof */}
              {projectInfo.backers.length}{" "}
              <span className="font-normal text-gray-600">
                {projectInfo.backers.length === 1 ? "backer" : "backers"}
              </span>
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}




// import { ethers } from "ethers";
// import { useMoralis, useWeb3Contract } from "react-moralis";
// import { useEffect, useState } from "react";
// import useSWR, { useSWRConfig } from "swr";
// import { contractAddresses, abi } from "../constants";
// import Link from "next/link";

// function replaceIpfsGateway(url) {
//   // Replace the old gateway with the new one
//   return url.replace(
//     "https://cloudflare-ipfs.com/ipfs/",
//     "https://gateway.pinata.cloud/ipfs/"
//   );
// }

// export default function ProjectCard({ projectInfo }) {
//   /*
  
//   daysLeft, percentFunded, backers, amountRaisedInDollars, 
//    */
//   const goal = ethers.utils.formatEther(projectInfo.goal.toString());

//   let color;
//   let statusBgColor;
//   let statusTextColor;

//   if (projectInfo.percentFunded > 70) {
//     color = "bg-green-700";
//   } else if (projectInfo.percentFunded > 50) {
//     color = "bg-yellow-600";
//   } else {
//     color = "bg-red-600";
//   }

//   if (["Active", "Successful"].includes(projectInfo.status)) {
//     statusBgColor = "bg-green-200";
//     statusTextColor = "text-green-700";
//   } else if (projectInfo.status == "Pending") {
//     statusBgColor = "bg-yellow-200";
//     statusTextColor = "text-yellow-700";
//   } else if (["Closed", "Unsuccessful"].includes(projectInfo.status)) {
//     statusBgColor = "bg-red-200";
//     statusTextColor = "text-red-700";
//   }

//   let dollarUSLocale = Intl.NumberFormat("en-US");

//   // const backers = JSON.stringify(projectInfo.backers)

//   // console.log("Backers::: ", backers)
//   // debugger

//   // console.log("Project Info: ", projectInfo)

//   console.log("Project Image URL: ", projectInfo.projectImageUrl);

//   const newImageUrl = `https://amethyst-intimate-swallow-509.mypinata.cloud/ipfs/${projectInfo.projectImageUrl}`;

//   // const newImageUrl = replaceIpfsGateway(projectInfo.projectImageUrl)

//   console.log("New image url: ", newImageUrl);

//   const formattedGoal = dollarUSLocale.format(goal).toString();
//   return (
//     <div className="my-3">
//       <Link
//         href={{
//           pathname: `/${projectInfo.projectTitle}`,
//           query: {
//             ...projectInfo,
//             backers: JSON.stringify(projectInfo.backers),
//           },
//           // the data
//         }}
//         // as={`/${projectInfo.projectTitle}`}
//       >
//         <div className="mx-3 my-3 relative w-auto h-full mb-5 lg:mb-0 bg-white-200 shadow-lg cursor-pointer">
//           <p
//             className={`px-2 py-1 absolute left-1 top-1 rounded-md ${statusBgColor} ${statusTextColor}`}
//           >
//             <small>{projectInfo.status}</small>
//           </p>
//           <div className="w-full h-56 ">
//             <img
//               alt="..."
//               src={newImageUrl}
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <div className="w-full bg-neutral-300 h-2.5 dark:bg-gray-700">
//             <div
//               className={`${color} h-2.5 `}
//               style={{ width: `${projectInfo.percentFunded}%` }}
//             ></div>
//           </div>
//           <div className=" px-2 py-3">
//             <h1 className="text-xl text-green-900 py-3">
//               {projectInfo.projectTitle}
//             </h1>
//             <p className="text-sm text-gray-800">
//               {projectInfo.projectNote.toString().substring(0, 200)}
//             </p>

//             <p className="pt-4 text-green-900">
//               {projectInfo.percentFunded}% of ${formattedGoal} Raised{" "}
//             </p>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
