import { useMoralis, useWeb3Contract, useChain } from "react-moralis";
import { useEffect, useState, useMemo } from "react";
import ProjectCard from "../components/ProjectCard";
import useSWR from "swr";
import { contractAddresses, abi } from "../constants";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { ScaleLoader } from "react-spinners";

export default function ProjectCardSection() {
  const { isWeb3Enabled, chainId: chainIdHex, enableWeb3, Moralis } = useMoralis();
  const { switchNetwork, chain, account } = useChain();
  const router = useRouter();

  const chainId = useMemo(() => {
    return chainIdHex ? parseInt(chainIdHex) : null;
  }, [chainIdHex]);

  const length = chainId ? contractAddresses[chainId]?.length : 0;
  const crowdfundAddress =
    chainId && contractAddresses[chainId]
      ? contractAddresses[chainId][length - 1]
      : null;

  const { runContractFunction: getAllProjects, isFetching, isLoading } =
    useWeb3Contract({
      abi,
      contractAddress: crowdfundAddress,
      functionName: "getAllProjects",
      params: {},
    });

  const fetcher = async () => {
    if (!isWeb3Enabled || !crowdfundAddress) return [];

    const provider = await enableWeb3();
    const crowdfundContract = new ethers.Contract(crowdfundAddress, abi, provider);

    // Fetch all projects from contract
    const projects = await getAllProjects({
      onError: (error) => console.log("getAllProjects error:", error),
    });

    if (!projects || projects.length === 0) return [];

    const now = Math.floor(Date.now() / 1000);

    const allProjects = await Promise.all(
      projects.map(async (project) => {
        try {
          const [amountRaisedInDollars, backers, currentProject] = await Promise.all([
            crowdfundContract.getTotalAmountRaisedInDollars(project.id),
            crowdfundContract.getBackers(project.id),
            crowdfundContract.projects(project.id),
          ]);

          const [,,,,,,,,, isFinalized, isClaimed, isRefunded] = currentProject;

          const editedBackers = backers.map((backer) => [
            backer[0],
            backer[1],
            backer[2].toString(),
            backer[3].toString(),
          ]);

          let secondsLeft = 0;
          let status = "Pending";

          if (now > Number(project.endDay)) {
            if (project.contractStatus === 1) {
              status = "Successful";
            } else if (project.contractStatus === 2 || Number(amountRaisedInDollars) === 0) {
              status = "Unsuccessful";
            } else {
              status = "Closed";
            }
          } else if (now >= Number(project.startDay)) {
            status = "Active";
            secondsLeft = Number(project.endDay) - now;
          }

          const percentFunded =
            (Number(amountRaisedInDollars) / Number(project.goal)) * 100;

          return {
            ...project,
            id: project.id.toString(),
            goal: project.goal.toString(),
            startDay: project.startDay.toString(),
            endDay: project.endDay.toString(),
            amountRaisedInDollars: amountRaisedInDollars.toString(),
            secondsLeft,
            status,
            percentFunded: percentFunded >= 100 ? 100 : Math.floor(percentFunded),
            backers: editedBackers,
            isFinalized,
            isClaimed,
            isRefunded,
          };
        } catch (err) {
          console.error("Error processing project:", err);
          return null;
        }
      })
    );

    return allProjects.filter(Boolean).reverse();
  };

  const { data: allProjects, error } = useSWR(
    () => (isWeb3Enabled && chainId ? `web3/projects/${chainId}` : null),
    fetcher
  );

  const isTestnet = chainId === 97;
  const isHome = router.pathname === "/";

  return (
    <section className="px-5 lg:px-5 w-full">
      <div className="flex flex-col w-full items-center my-10 mb-14">
        {isWeb3Enabled && !isTestnet && (
          <button
            className="w-8/12 p-2 text-lg bg-red-100 hover:bg-red-200 text-red-700 rounded-md hover:text-red-900"
            onClick={() => switchNetwork("0x61")}
          >
            Switch to Binance Smart Chain Testnet
          </button>
        )}

        {(isLoading || isFetching) && (
          <div className="flex flex-col w-full my-4 items-center">
            <div className="my-1">
              <ScaleLoader color="black" loading={true} size={20} />
            </div>
            <p className="text-gray-500">Please wait a few seconds</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 my-4">
            Failed to load projects. Please try again.
          </div>
        )}

        {allProjects && isTestnet && (
          <div
            className={`grid ${
              allProjects.length >= 4
                ? "grid-rows-4"
                : `grid-rows-${allProjects.length}`
            } grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 xs:grid-rows-1 xs:grid-cols-4 gap-2 justify-start w-full`}
          >
            {isHome
              ? allProjects.slice(0, 4).map((projectInfo) => (
                  <ProjectCard key={projectInfo.id} projectInfo={projectInfo} />
                ))
              : allProjects.map((projectInfo) => (
                  <ProjectCard key={projectInfo.id} projectInfo={projectInfo} />
                ))}
          </div>
        )}

        {allProjects?.length >= 4 && isHome && isTestnet && (
          <button
            className="text-green-800 p-2 text-xl mt-5 border rounded-md border-green-800"
            onClick={() => {
              if (isWeb3Enabled) {
                router.push("/projects");
              } else {
                alert("Connect your wallet");
              }
            }}
          >
            See more
          </button>
        )}
      </div>
    </section>
  );
}
