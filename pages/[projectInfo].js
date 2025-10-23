import Header from "../components/Header";
import SupportModal from "../components/SupportModal";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  useMoralis,
  useWeb3Contract,
  useChain,
  useNativeBalance,
} from "react-moralis";
import { contractAddresses, abi, erc20Abi, wbnbAbi } from "../constants";
import { useNotification } from "web3uikit";
import useSWR, { useSWRConfig } from "swr";
import { RotateLoader, ClipLoader } from "react-spinners";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Footer from "../components/Footer";
import Backers from "../components/Backers";
import { toWei, fromWei, tokenToAddress } from "../utils/helper";
// import { displayToast } from "../components/Toast";
import { getProjectInfo } from "../lib/fetchProjectInfo";
import Layout from "./layout";
import ModalSuccess from "../components/ModalSuccess";
import ModalFailure from "../components/ModalFailure";
import axios from "axios";
import NairaSupportModal from "../components/NairaSupportModal";
// import { getAllProjects } from "../lib/projects";

function time2(seconds) {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const formattedTime = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };

  return `${days} Days ${hours} Hours ${minutes} Minutes ${
    minutes == 0 ? `${seconds} Seconds` : ""
  }`;

  // return formattedTime;
}

const PageInfo = ({ projectInfo }) => {
  const {
    Moralis,
    isWeb3Enabled,
    chainId: chainIdHex,
    enableWeb3,
    account,
  } = useMoralis();

  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [nairaSupportModalOpen, setNairaSupportModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState({});
  const [pledgeAmount, setPledgeAmount] = useState();
  const [isValidAmount, setIsValidAmount] = useState(false);
  // const dispatch = useNotification();
  const { promiseInProgress } = usePromiseTracker();
  const { mutate } = useSWRConfig();
  const [currentBalance, setCurrentBalance] = useState("");

  const [home, setHome] = useState(true);
  const [backers, setBackers] = useState(false);

  const [pledgeText, setPledgeText] = useState("Pledge");
  const [isPledging, setIsPledging] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const [campaign, setCampaign] = useState(null);
  const [nairaDonations, setNairaDonations] = useState([]);

  const [totalAmountRaisedInNaira, setTotalAmountRaisedInNaira] = useState(0);
  const [percentFunded, setPercentFunded] = useState(0);
  const [goalInNaira, setGoalInNaira] = useState(0);

  console.log("Naira donations: ", nairaDonations)
  // console.log("Total amount raised in Naira: ", totalAmountRaisedInNaira);
  // console.log("Percent funded: ", percentFunded);
  // console.log("Goal in Naira: ", goalInNaira);

  const handleCloseModal = () => {
    setSuccessMessage("");
    setFailureMessage("");
  };

  const [projectData, setProjectData] = useState({
    ...projectInfo,
  });

  console.log("Project data: ", projectData);


  useEffect(() => {
    if (campaign && projectData) {
      const dollarToNaira = 1500; // Example conversion rate: 1 USD = 1500 NGN

      // const goalInUSD = Number(projectData.goal);
      const goalInUSD = Number(
        ethers.utils.formatEther(projectData.goal || "0")
      );

      const nairaRaisedDirectly = campaign.amountRaised / 100; // e.g., 1000000 Kobo -> 10000 NGN

      let cryptoRaisedInNaira = 0;
      try {
        const cryptoRaisedInUSD = Number(
          ethers.utils.formatEther(projectData.amountRaisedInDollars || "0")
        );
        cryptoRaisedInNaira = cryptoRaisedInUSD * dollarToNaira;
      } catch (e) {
        console.error("Error formatting crypto amount:", e);
      }

      // Calculate Total Raised in Naira
      const totalNaira = nairaRaisedDirectly + cryptoRaisedInNaira;
      setTotalAmountRaisedInNaira(totalNaira);

      //  Calculate Goal in Naira
      const goalInNaira = goalInUSD * dollarToNaira;
      setGoalInNaira(goalInNaira);

      //  Calculate Percentage Funded
      let percentage = 0;
      if (goalInNaira > 0) {
        percentage = (totalNaira / goalInNaira) * 100;
      }
      // Ensure percentage doesn't exceed 100 if they raise more than the goal
      setPercentFunded(Math.min(percentage, 100).toFixed(2));
    }
  }, [campaign, projectData]);

  // Get the campaign from the database;
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!projectData.id) return; // Wait for router to be ready

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(
          `${apiUrl}/api/campaigns/${projectData.id}`
        );
        const campaign = response.data.data;
        setCampaign(campaign);

        // Fetch Naira donations
        const donationsResponse = await axios.get(
          `${apiUrl}/api/campaigns/${projectData.id}/donations`
        );
        setNairaDonations(donationsResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
      }
    };

    fetchCampaign();
  }, [projectData]);

  const { data: xyz, error } = useSWR(
    () => (isWeb3Enabled ? "web3/currentProject" : null),
    async () => {
      const provider = await enableWeb3();

      const crowdfundContract = new ethers.Contract(
        crowdfundAddress,
        abi,
        provider
      );

      console.log("Crowdfund Contract: ", crowdfundContract);

      const newprojects = await crowdfundContract.getAllProjects();

      const project = newprojects[projectData.id];

      const [
        owner,
        id,
        startDay,
        endDay,
        goal,
        projectTitle,
        projectSubtitle,
        projectNote,
        projectImageUrl,
        contractStatus,
        isClosed,
      ] = project;

      const amountRaisedInDollars =
        await crowdfundContract.getTotalAmountRaisedInDollars(id);
      const backers = await crowdfundContract.getBackers(id);

      const editedBackers = backers.map((backer) => {
        return [backer[0], backer[1], backer[2].toString()];
      });

      const isFinalized = (await crowdfundContract.projects(id))[9];
      const isClaimed = (await crowdfundContract.projects(id))[10];
      const isRefunded = (await crowdfundContract.projects(id))[11];

      let secondsLeft;
      let status;

      if (Math.floor(Number(new Date().getTime() / 1000)) > Number(endDay)) {
        if (contractStatus == 1) {
          status = "Successful";
        } else if (contractStatus == 2 || Number(amountRaisedInDollars) == 0) {
          status = "Unsuccessful";
        } else {
          status = "Closed";
        }
        secondsLeft = 0;
      } else if (
        Number(Math.floor(Number(new Date().getTime() / 1000))) >=
        Number(startDay)
      ) {
        status = "Active";
        secondsLeft =
          Number(endDay) -
          Number(Math.floor(Number(new Date().getTime() / 1000)));
      } else {
        status = "Pending";
        secondsLeft = 0;
      }

      const percentFunded =
        (Number(amountRaisedInDollars) / Number(goal)) * 100;

      return {
        owner,
        projectTitle,
        projectSubtitle,
        projectNote,
        projectImageUrl,
        contractStatus,
        isClosed,
        amountRaisedInDollars: amountRaisedInDollars.toString(),
        endDay: endDay.toString(),
        goal: goal.toString(),
        id: id.toString(),
        startDay: startDay.toString(),
        secondsLeft,
        status,
        percentFunded: percentFunded >= 100 ? 100 : Math.floor(percentFunded),
        backers: editedBackers,
        isFinalized,
        isClaimed,
        isRefunded,
      };
    }
  );

  useEffect(() => {
    const doSomeStuff = () => {
      if (xyz) {
        setProjectData(xyz);
      }
    };

    doSomeStuff();
  }, [xyz]);

  const chainId = parseInt(chainIdHex);

  const length = contractAddresses[chainId]?.length;
  const crowdfundAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId][length - 1]
      : null;

  const dollarUSLocale = Intl.NumberFormat("en-US");

  const formattedAmountRaised = dollarUSLocale
    .format(ethers.utils.formatEther(projectData.amountRaisedInDollars))
    .toString();
  const formattedGoal = dollarUSLocale
    .format(ethers.utils.formatEther(projectInfo.goal))
    .toString();

  let color;

  if (percentFunded > 70) {
    color = "bg-green-700";
  } else if (percentFunded > 50) {
    color = "bg-yellow-600";
  } else {
    color = "bg-red-600";
  }

  const {
    runContractFunction: pledge,
    isFetching: isFetchingSupport,
    isLoading: isLoadingSupport,
  } = useWeb3Contract();

  const {
    runContractFunction: claim,
    isFetching: isFetchingClaim,
    isLoading: isLoadingClaim,
  } = useWeb3Contract();
  const {
    runContractFunction: refund,
    isFetching: isFetchingRefund,
    isLoading: isLoadingRefund,
  } = useWeb3Contract();

  const fetchProjectInfo = async () => {
    // console.log("Inside fetchProject info method");
    const provider = await enableWeb3();

    const crowdfundContract = new ethers.Contract(
      crowdfundAddress,
      abi,
      provider
    );

    const projects = await crowdfundContract.getAllProjects();

    const project = projects.filter(
      (project) => project.id == projectInfo.id
    )[0];

    const isFinalized = (await crowdfundContract.projects(project.id))[9];
    const isClaimed = (await crowdfundContract.projects(project.id))[10];
    const isRefunded = (await crowdfundContract.projects(project.id))[11];
    // console.log("Is it finalized? ", isFinalized)

    const amountRaisedInDollars =
      await crowdfundContract.getTotalAmountRaisedInDollars(project.id);
    const backers = await crowdfundContract.getBackers(project.id);
    const editedBackers = backers.map((backer) => {
      console.log("Returning .............", [
        backer[0],
        backer[1],
        backer[2].toString(),
      ]);
      return [backer[0], backer[1], backer[2].toString()];
    });

    let secondsLeft;
    let status;

    if (
      Math.floor(Number(new Date().getTime() / 1000)) > Number(project.endDay)
    ) {
      status = "Closed";
      secondsLeft = 0;
    } else if (
      Number(Math.floor(Number(new Date().getTime() / 1000))) >=
      Number(project.startDay)
    ) {
      status = "Active";
      secondsLeft =
        Number(project.endDay) -
        Number(Math.floor(Number(new Date().getTime() / 1000)));
    } else {
      status = "Pending";
      secondsLeft = 0;
    }

    const percentFunded =
      (Number(amountRaisedInDollars) / Number(project.goal)) * 100;

    setProjectData({
      ...project,
      amountRaisedInDollars: amountRaisedInDollars.toString(),
      endDay: project.endDay.toString(),
      goal: project.goal.toString(),
      id: project.id.toString(),
      startDay: project.startDay.toString(),
      secondsLeft,
      status,
      percentFunded: percentFunded >= 100 ? 100 : Math.floor(percentFunded),
      backers: editedBackers,
      isFinalized,
      isClaimed,
      isRefunded,
    });
  };

  const handleSupport = () => {
    setSupportModalOpen(true);
  };

  const handleNairaSupport = () => {
    setNairaSupportModalOpen(true);
  };

  const handleCloseNairaSupportModal = () => {
    setNairaSupportModalOpen(false);
  };

  const handleCloseSupportModal = () => {
    setSupportModalOpen(false);
    setSelectedToken({});
  };

  const handleSelectToken = async (name, src) => {
    const tokenAddress = tokenToAddress[name];
    console.log("token address: ", tokenAddress);

    const provider = await enableWeb3();

    let balance;
    if (["BUSD", "XRP", "DAI"].includes(name)) {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20Abi,
        provider
      );

      console.log("token contract: ", tokenContract);

      balance = await tokenContract.balanceOf(account);
      console.log("Balance: ", balance);
    } else {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

      console.log("Web3 Provider: ", web3Provider);

      balance = (await web3Provider.getBalance(account)).toString();
    }

    const dollarUSLocale = Intl.NumberFormat("en-US");
    const formattedBalance = dollarUSLocale
      .format(fromWei(balance.toString()))
      .toString();

    setCurrentBalance(formattedBalance);

    setSelectedToken({ name, src });
  };

  const handleSuccess = async (tx) => {
    console.log("Success transaction: ", tx);
    const txReceipt = await trackPromise(tx.wait(1));
    setPledgeText("Pledge");
    setIsPledging(false);
    setSupportModalOpen(false);

    // displayToast("success", "Pledging has completed");
    setSuccessMessage("Pledging has completed");
    setTransactionHash(txReceipt.transactionHash);

    await fetchProjectInfo();
  };

  const getNoOfBackers = () => {
    const backersAddress =
      projectData.backers.length > 0
        ? projectData.backers.map((backer) => {
            return backer[0];
          })
        : "";

    const uniqueBackers = [...new Set(backersAddress)];

    return uniqueBackers.length;
  };

  const handleFailure = async (error) => {
    console.log("Error: ", error);
    setPledgeText("Pledge");
    setIsPledging(false);

    setFailureMessage("Failed to pledge");
  };

  const handlePledge = async () => {
    try {
      setIsPledging(true);
      setPledgeText("Pledging");
      const provider = await enableWeb3();

      // const projects = await crowdfundContract.getAllProjects();

      const formattedPledgeAmount = ethers.utils.parseEther(
        pledgeAmount.replace(/[^0-9.]/g, "")
      );
      const tokenAddress = tokenToAddress[selectedToken.name];
      const signer = provider.getSigner(account);

      const crowdfundContract = new ethers.Contract(
        crowdfundAddress,
        abi,
        provider
      );
      const tokensSupported =
        await crowdfundContract.getSupportedTokensAddress();
      console.log("Tokens Supported: ", tokensSupported);

      if (tokenAddress == tokenToAddress["BNB"]) {
        setPledgeText("Wrapping BNB to WBNB");
        const wbnb = new ethers.Contract(tokenAddress, wbnbAbi, provider);

        const depositTx = await trackPromise(
          wbnb.connect(signer).deposit({ value: formattedPledgeAmount })
        );
        await trackPromise(depositTx.wait(1));

        setPledgeText("Approving WBNB");
        const approveTx = await trackPromise(
          wbnb.connect(signer).approve(crowdfundAddress, formattedPledgeAmount)
        );
        await trackPromise(approveTx.wait(1));

        console.log("Balance of Account: ", await wbnb.balanceOf(account));
      } else {
        setPledgeText("Approving Token");
        const erc20 = new ethers.Contract(tokenAddress, erc20Abi, provider);
        console.log(
          "Balance of token Account: ",
          await erc20.balanceOf(account)
        );

        const approveTx = await trackPromise(
          erc20.connect(signer).approve(crowdfundAddress, formattedPledgeAmount)
        );
        await trackPromise(approveTx.wait(1));
      }

      setPledgeText("Pledging.. ");
      console.log("About to pledge");
      pledge({
        params: {
          abi: abi,
          contractAddress: crowdfundAddress, // specify the networkId
          functionName: "pledge",
          params: {
            _id: projectData.id,
            tokenAddress: tokenAddress,
            amount: formattedPledgeAmount,
          },
        },
        onSuccess: handleSuccess,
        onError: handleFailure,
      });
    } catch (err) {
      setIsPledging(false);
      setPledgeText("Pledge");
    }
  };

  const handleClaim = () => {
    claim({
      params: {
        abi: abi,
        contractAddress: crowdfundAddress, // specify the networkId
        functionName: "claim",
        params: {
          _id: projectData.id,
        },
      },
      onSuccess: handleSuccess,
      onError: handleFailure,
    });
  };

  const handleRefund = () => {
    refund({
      params: {
        abi: abi,
        contractAddress: crowdfundAddress, // specify the networkId
        functionName: "refund",
        params: {
          _id: projectData.id,
        },
      },
      onSuccess: handleSuccess,
      onError: handleFailure,
    });
  };

  const handleOnChange = (event) => {
    const pledgeAmount = event.target.value;
    console.log("This is the pledge amount: ", pledgeAmount);
    setIsValidAmount(() => {
      if (
        /^\$?\d+(,\d{3})*(\.\d*)?$/.test(pledgeAmount.toString()) &&
        Number(pledgeAmount) != 0
      ) {
        return true;
      }
      return false;
    });
    setPledgeAmount(pledgeAmount);
  };

  const newImageUrl = `https://amethyst-intimate-swallow-509.mypinata.cloud/ipfs/${projectInfo.projectImageUrl}`;

  return (
    <>
      <section>
        <h1 className="w-full text-center pt-3 text-2xl sm:text-3xl">
          {projectData.projectTitle}
        </h1>
        <p className="text-center text-gray-800">
          {projectData.projectSubtitle}
        </p>
        <div className="flex flex-col md:flex-row mt-11">
          <div className="flex flex-col md:w-7/12 px-8">
            {projectData.isClaimed && (
              <div className="p-2 bg-green-300 text-green-700">
                Project was successful
              </div>
            )}
            {projectData.isRefunded && (
              <div className="p-2 bg-red-300 text-red-700">
                Project was unsuccessful
              </div>
            )}

            <div className="flex justify-between text-sm lg:text-xl text-gray-500 my-3 py-3 border-b-2">
              <button
                className="hover:text-gray-800"
                onClick={() => {
                  setHome(true);
                  setBackers(false);
                }}
              >
                Home
              </button>
              <button
                className="hover:text-gray-800"
                onClick={() => {
                  if (!projectData.isClaimed && !projectData.isRefunded) {
                    setHome(false);
                    setBackers(true);
                  }
                }}
              >
                Backers
              </button>
              <button className="hover:text-gray-800">Updates</button>
              <button className="hover:text-gray-800">Comments</button>
            </div>
            {home && (
              <div>
                <div className="w-full h-96">
                  <img
                    alt="..."
                    src={newImageUrl}
                    className="object-cover w-full h-full"
                  />
                  <p className="text-end py-2">
                    <small>
                      <span className="text-gray-500">Owner</span>:{" "}
                      {projectData.owner.toString().substring(0, 7)}...
                      {projectData.owner
                        .toString()
                        .substring(
                          projectData.owner.toString().length - 8,
                          projectData.owner.toString().length
                        )}
                    </small>
                  </p>
                </div>

                <div className="py-4">
                  <h1 className=" text-xl md:text-3xl text-gray-800 pt-10 pb-4">
                    Why do I need this fund?
                  </h1>
                  <p className="md:text-base text-sm">
                    {projectData.projectNote}
                  </p>
                </div>
              </div>
            )}

            {backers && projectData.backers && (
              <div>
                <Backers backers={projectData.backers} />
              </div>
            )}
          </div>
          <div className="mx-8 lg:w-5/12 lg:px-8">
            <div className="bg-neutral-300 h-4 dark:bg-gray-700">
              <div
                className={`${color} h-4 `}
                style={{ width: `${percentFunded}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <p className="bg-yellow-100 text-yellow-800 rounded-md p-2 px-3 ">
                {percentFunded}% funded
              </p>
              <p className="bg-green-100 text-green-800 rounded-md p-2 px-3 ">
                {getNoOfBackers()}{" "}
                {getNoOfBackers() == 1 ? "backer" : "backers"}
              </p>
            </div>
            <div className="">
              <div className="flex flex-col mt-6">
                <h1 className=" text-xl md:text-3xl text-gray-800">
                  {/* ${formattedAmountRaised} */}₦
                  {dollarUSLocale.format(totalAmountRaisedInNaira).toString()}
                </h1>
                <p className="text-sm text-gray-500">
                  {/* raised of ${formattedGoal} */}
                  raised of ₦{dollarUSLocale.format(goalInNaira).toString()}
                </p>
              </div>

              {xyz && (
                <div className="flex flex-col mt-6">
                  <h1 className=" text-xl md:text-2xl text-gray-800">
                    {time2(projectData.secondsLeft)}
                  </h1>
                  <p className="text-sm text-gray-500">remaining</p>
                </div>
              )}
            </div>

            {projectData.secondsLeft > 0 && (
              <div className="flex space-x-3">
                <button
                  className="my-6 w-full rounded-md p-2 bg-green-200 text-green-800"
                  onClick={handleSupport}
                >
                  Donate with Crypto
                </button>
                <button
                  className="my-6 w-full rounded-md p-2 bg-yellow-200 text-yellow-800"
                  onClick={handleNairaSupport}
                >
                  Donate with Naira
                </button>
              </div>
            )}

            {Number(projectData.amountRaisedInDollars) == 0 &&
              projectData.status == "Unsuccessful" &&
              !projectData.isClaimed &&
              !projectData.isRefunded && (
                <button
                  className="my-6 w-full cursor-not-allowed rounded-md p-2 disabled:opacity-50 bg-yellow-200 text-yellow-800"
                  disabled={true}
                >
                  Project is Closed
                </button>
              )}

            {projectData.status == "Closed" &&
              !projectData.isFinalized &&
              Number(projectData.amountRaisedInDollars) <
                Number(projectData.goal) && (
                <button
                  className="my-6 w-full rounded-md p-2 text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleRefund}
                  disabled={
                    isFetchingRefund || isLoadingRefund || promiseInProgress
                  }
                >
                  {isFetchingRefund || isLoadingRefund || promiseInProgress ? (
                    <div className="flex flex-col w-full justify-between bg-red-300 rounded-md items-center px-3 py-3">
                      <div className="flex items-center">
                        <ClipLoader color="#990000" loading="true" size={30} />
                        <p className="ml-2">
                          {" "}
                          {promiseInProgress
                            ? "Wait a few Seconds"
                            : "Refunding"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full bg-red-300 rounded-md items-center px-3 py-3">
                      <p className="w-full">Refund Backers</p>
                    </div>
                  )}
                </button>
              )}

            {projectData.status == "Closed" &&
              !projectData.isFinalized &&
              Number(projectData.amountRaisedInDollars) >=
                Number(projectData.goal) && (
                <button
                  className="my-6 w-full rounded-md p-2 text-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleClaim}
                  disabled={
                    isFetchingClaim || isLoadingClaim || promiseInProgress
                  }
                >
                  {isFetchingClaim || isLoadingClaim || promiseInProgress ? (
                    <div className="flex flex-col w-full justify-between bg-green-300 rounded-md items-center px-3 py-3">
                      <div className="flex items-center">
                        <ClipLoader color="#004d00" loading="true" size={30} />
                        <p className="ml-2">
                          {" "}
                          {promiseInProgress
                            ? "Wait a few Seconds"
                            : "Claiming"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full bg-green-300 rounded-md items-center px-3 py-3">
                      <p className="w-full">Claim Funds</p>
                    </div>
                  )}
                </button>
              )}

            {projectData.status == "Pending" && (
              <button
                className="my-6 w-full rounded-md p-2 disabled:opacity-50 bg-green-200 text-green-800"
                disabled={true}
              >
                Support this Project
              </button>
            )}

            {(projectData.contractStatus == 1 ||
              projectData.contractStatus == 2) && (
              <button
                className="my-6 w-full cursor-not-allowed rounded-md p-2 disabled:opacity-50 bg-yellow-200 text-yellow-800"
                disabled={true}
              >
                Project is Closed
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-center text-center sm:block sm:p-0 mt-2 scrollbar-hide">
        {supportModalOpen && (
          <SupportModal
            handleCloseSupportModal={handleCloseSupportModal}
            handleSelectToken={handleSelectToken}
            selectedToken={selectedToken}
            currentBalance={currentBalance}
            handleOnChange={handleOnChange}
            isValidAmount={isValidAmount}
            handlePledge={handlePledge}
            isFetching={isFetchingSupport}
            isLoading={isLoadingSupport}
            isPledging={isPledging}
            pledgeText={pledgeText}
          />
        )}
        {nairaSupportModalOpen && (
          <NairaSupportModal
            campaign={campaign}
            handleCloseSupportModal={handleCloseNairaSupportModal}
          />
        )}
        {successMessage && (
          <ModalSuccess
            message={successMessage}
            transactionHash={transactionHash}
            closeModal={handleCloseModal}
          />
        )}

        {failureMessage && (
          <ModalFailure
            message={failureMessage}
            closeModal={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const query = context.query;
  console.log("Context::::", query);

  // const projectInfo1 = await getProjectInfo(1)
  // console.log("Proct info 1: ", projectInfo1)

  //  const {
  //   runContractFunction: getAllProjects,
  //   isFetching,
  //   isLoading,
  // } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress: crowdfundAddress,
  //   functionName: "getAllProjects",
  //   params: {},
  // });

  // console.log("query.isFinalized: ", query.isFinalized)
  // console.log("Query backers:::::: ", query.backers)
  const backers = JSON.parse(query.backers);
  const isFinalized = JSON.parse(query.isFinalized);
  const isClaimed = query.isClaimed ? JSON.parse(query.isClaimed) : "";
  const isRefunded = query.isRefunded ? JSON.parse(query.isRefunded) : "";
  // const availableAmountInContract = JSON.parse(query.availableAmountInContract);
  // const totalBorrowedInContract = JSON.parse(query.totalBorrowedInContract);
  // const totalSuppliedInContract = JSON.parse(query.totalSuppliedInContract);
  // const userTokenBorrowedAmount = JSON.parse(query.userTokenBorrowedAmount);
  // const userTokenLentAmount = JSON.parse(query.userTokenLentAmount);
  // const walletBalance = JSON.parse(query.walletBalance);

  const projectInfo = {
    ...query,
    backers,
    isFinalized,
    isClaimed,
    isRefunded,
  };

  return {
    props: {
      projectInfo,
    },
  };
}

// export async function getStaticPaths() {
//   const paths = await getAllProjects();
//   return {
//     paths,
//     fallback: false,
//   };
// }

PageInfo.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PageInfo;
