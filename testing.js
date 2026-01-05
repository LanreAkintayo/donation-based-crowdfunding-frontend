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

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const [isOwner, setIsOwner] = useState(false);

  const handleCloseModal = () => {
    setSuccessMessage("");
    setFailureMessage("");
  };

  const [projectData, setProjectData] = useState({
    ...projectInfo,
  });

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

      const campaign = newprojects[projectData.id];

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
      ] = campaign;

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


  const handleFailure = async (error) => {
    console.log("Error: ", error);
    setPledgeText("Pledge");
    setIsPledging(false);

    setFailureMessage("Failed to pledge");
  };


  const handleWithdrawNaira = async () => {
    setIsWithdrawing(true);
    setWithdrawMessage(""); // Clear previous messages
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setWithdrawMessage("Error: You are not logged in.");
      setIsWithdrawing(false);
      return;
    }
    if (!campaign || !campaign.campaignId) {
      setWithdrawMessage("Error: Campaign data not loaded.");
      setIsWithdrawing(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Use the campaign's MongoDB _id for the API call
      const response = await axios.post(
        `${apiUrl}/api/payments/payout/${campaign.campaignId}`,
        {}, // No body needed for this request
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setWithdrawMessage(response.data.message); 
    } catch (error) {
      console.error("Withdrawal error:", error.response?.data || error.message);
      setWithdrawMessage(
        error.response?.data?.message || "Withdrawal failed. Please try again."
      );
    } finally {
      setIsWithdrawing(false);
    }
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
                Campaign was successful
              </div>
            )}
            {projectData.isRefunded && (
              <div className="p-2 bg-red-300 text-red-700">
                Campaign was unsuccessful
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
            


            {Number(projectData.amountRaisedInDollars) == 0 &&
              projectData.status == "Unsuccessful" &&
              !projectData.isClaimed &&
              !projectData.isRefunded && (
                <button
                  className="my-6 w-full cursor-not-allowed rounded-md p-2 disabled:opacity-50 bg-yellow-200 text-yellow-800"
                  disabled={true}
                >
                  Campaign is Closed
                </button>
              )}

    
            {(totalAmountRaisedInNaira >= goalInNaira || projectData.secondsLeft <= 0) && (
            // {projectData.status == "Closed" && !projectData.isFinalized && (
              <div className="flex justify-center">
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
                            : "Withdrawing"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full bg-green-300 rounded-md items-center px-3 py-3">
                      <p className="w-full">Withdraw Crypto</p>
                    </div>
                  )}
                </button>
                <button
                  onClick={handleWithdrawNaira}
                  disabled={isWithdrawing}
                  className={`my-6 w-full rounded-md text-orange-800 disabled:cursor-not-allowed disabled:opacity-50 bg-orange-300`}
                >
                  {isWithdrawing ? (
                    <>
                      <ClipLoader color="#ffffff" loading={true} size={20} />
                      <span className="ml-2">Initiating Payout...</span>
                    </>
                  ) : (
                    "Withdraw Naira"
                  )}
                </button>
              </div>
            )}

            {projectData.status == "Pending" && (
              <button
                className="my-6 w-full rounded-md p-2 disabled:opacity-50 bg-green-200 text-green-800"
                disabled={true}
              >
                Support this Campaign
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
       
      </div>
    </>
  );
};



PageInfo.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PageInfo;
