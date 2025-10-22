import Footer from "../components/Footer";
import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { contractAddresses, abi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import { RotateLoader, ClipLoader } from "react-spinners";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { now, now2, sDuration } from "../utils/helper";

import "react-datepicker/dist/react-datepicker.css";
// import { displayToast } from "../components/Toast";
import Layout from "./layout";
import ModalSuccess from "../components/ModalSuccess";
import ModalFailure from "../components/ModalFailure";
import axios from "axios";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_API_SECRET_KEY;

// console.log(projectId);
// console.log(projectSecret);

const Launch = () => {
  const {
    Moralis,
    isWeb3Enabled,
    chainId: chainIdHex,
    enableWeb3,
  } = useMoralis();
  const {
    runContractFunction: launch,
    isFetching,
    isLoading,
  } = useWeb3Contract();
  const { promiseInProgress } = usePromiseTracker();

  // const dispatch = useNotification();

  const chainId = parseInt(chainIdHex);
  const [currentUrl, setCurrentUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const length = contractAddresses[chainId]?.length;
  const crowdfundAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId][length - 1]
      : null;

  const hiddenFileInput = React.useRef(null);
  const [imageFile, setImageFile] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [allValid, setAllValid] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    subtitle: "",
    note: "",
    imageSrc: "",
    launchDate: new Date(),
    duration: "",
    goal: "",
  });
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // console.log("Date at the beggining that was set::::", new Date());
  const [isValidDuration, setIsValidDuration] = useState(true);
  const [isValidLaunchDate, setIsValidLaunchDate] = useState(true);
  const [isValidGoal, setIsValidGoal] = useState(true);

  const [launchText, setLaunchText] = useState("Publish Your Project");
  const [isLaunching, setIsLaunching] = useState(false);

  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  // console.log("Banks: ", banks);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/api/payments/banks`);

        // console.log("Bank response: ", response.data);
        setBanks(response.data); // Paystack nests the list in 'data'
      } catch (error) {
        console.error("Failed to fetch banks", error);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    console.log("Here is the current url: ", currentUrl);
    const tme = async () => {
      await now();
      // await now2()
    };

    tme();
  }, [currentUrl]);

  useEffect(() => {
    setAccountName("");
    setVerifyError("");

    // 2. Check if the inputs are valid
    if (bankCode && accountNumber.length === 10) {
      console.log("about to handle verifiy account");
      handleVerifyAccount();
    }
  }, [bankCode, accountNumber]);

  // // Original
  // useEffect(() => {
  //   setAllValid(
  //     Object.values(projectInfo).every(
  //       (item) => ![false, 0, null, "", {}].includes(item)
  //     ) &&
  //       isValidDuration &&
  //       isValidGoal &&
  //       accountName
  //   );
  // }, [projectInfo, isValidDuration, isValidGoal, accountName]);

  useEffect(() => {
    setAllValid(true);
  }, [projectInfo, isValidDuration, isValidGoal]);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleOnChange = async (event) => {
    const { id, value } = event.target;

    if (event.target.id === "bankCode") {
      setBankCode(value);
      setAccountName("");
      setVerifyError("");
      return;
    }
    if (event.target.id === "accountNumber") {
      setAccountNumber(value);
      setAccountName("");
      setVerifyError("");
      return;
    }

    let imagePath;
    let amount;

    if (event.target.id == "imageSrc") {
      imagePath = event.target.files[0] || "";
      setImageFile(imagePath);
    }

    if (event.target.id == "duration") {
      const duration = event.target.value;
      setIsValidDuration(() => {
        if (
          /[^0-9]/g.test(duration.toString()) ||
          Number(duration) > 1000 ||
          Number(duration) < 1
        ) {
          return false;
        }
        return true;
      });
    }
    if (event.target.id == "goal") {
      const price = event.target.value;
      let dollarUSLocale = Intl.NumberFormat("en-US");
      // amount = dollarUSLocale.format(price).toString();
      amount = price;

      setIsValidGoal(() => {
        if (/^\$?\d+(,\d{3})*(\.\d*)?$/.test(amount.toString())) {
          return true;
        }
        return false;
      });
    }

    setProjectInfo((prevProjectInfo) => {
      return {
        ...prevProjectInfo,
        [event.target.id]:
          event.target.id == "goal" ? amount : event.target.value,
        [event.target.id]:
          event.target.id == "imageSrc"
            ? URL.createObjectURL(imagePath)
            : event.target.value,
      };
    });
  };

  const handleVerifyAccount = async () => {
    if (accountNumber.length !== 10 || !bankCode) {
      setVerifyError(
        "Please select a bank and enter a 10-digit account number."
      );
      return;
    }
    setIsVerifying(true);
    setVerifyError("");
    setAccountName("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(
        `${apiUrl}/api/payments/resolve`,
        { accountNumber, bankCode },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setAccountName(response.data.data.account_name);
    } catch (error) {
      setVerifyError(
        error.response?.data?.message ||
          "Could not verify account. Check details."
      );
      setAccountName("");
    } finally {
      setIsVerifying(false);
    }
  };

  const getHash = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("network", "public");

    const res = await axios.post(
      "https://uploads.pinata.cloud/v3/files",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      }
    );
    return res;
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchText("Publishing Project");

    // Check if the token exists
    if (!authToken) {
      setFailureMessage(
        "You are not logged in. Please log in to create a campaign."
      );
      setIsLaunching(false);
      setLaunchText("Publish Your Project");
      return;
    }

    let newCampaign; // To store the campaign data from the backend

    const goalInDollars = projectInfo.goal.replace(/[^0-9]/g, "");
    const startDayInSeconds = Math.floor(
      projectInfo.launchDate.getTime() / 1000
    );

    const duration = sDuration.minutes(Number(projectInfo.duration));

    console.log("duration is", duration);

    // console.log(startDayInSeconds);

    // Phase 1: Create off-chain data
    // This creates the paystack subaccount and saves the campaign to the database with a status of pending
    try {
      setLaunchText("Securing campaign details...");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      console.log("API URL:", apiUrl);

      const response = await axios.post(
        `${apiUrl}/api/campaigns`,
        {
          title: projectInfo.title,
          description: projectInfo.note,
          goalAmount: projectInfo.goal.replace(/[^0-9]/g, ""),
          bankCode: bankCode,
          accountNumber: accountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send the user's login token
          },
        }
      );

      newCampaign = response.data.data; // Save the new campaign (we need its _id)
    } catch (error) {
      console.error(
        "Failed to create campaign on backend:",
        error.response?.data || error.message
      );
      setFailureMessage(
        error.response?.data?.message ||
          "Failed to save campaign. Please try again."
      );
      setIsLaunching(false);
      setLaunchText("Publish Your Project");
      return; // Stop if the backend fails
    }

    // PHASE 2: Create on-chain data (smart contract). This only runs if phase 1 was successful
    try {
      setLaunchText("Uploading data to IPFS");

      // console.log("Uploaded Image: ", uploadedImage);

      const res = await getHash(imageFile);
      const hash = res.data.data.cid;

      console.log("Res: ", res);
      console.log("Hash: ", hash);
      // const url = `https://cloudflare-ipfs.com/ipfs/${uploadedImage.path}`;

      setLaunchText("Publishing Project");

      launch({
        params: {
          abi: abi,
          contractAddress: crowdfundAddress, // specify the networkId
          functionName: "launch",
          params: {
            startDay: startDayInSeconds,
            duration,
            goal: ethers.utils.parseEther(goalInDollars),
            projectTitle: projectInfo.title,
            projectSubtitle: projectInfo.subtitle,
            projectNote: projectInfo.note,
            projectImageUrl: hash,
          },
        },
        // onSuccess: (tx) => handleSuccess(tx),
        onSuccess: (tx) => handleSuccess(tx, newCampaign._id, authToken),
        onError: (error) => {
          // handleFailure(error);
          handleFailure(error, newCampaign._id);
        },
      });
    } catch (error) {
      console.log(error);
      window.alert("Make sure you have an internet connection");
      setIsLaunching(false);
      setLaunchText("Publish Project");
    }
  };

  // Probably could add some error handling
  // const handleSuccess = async (tx, campaignDbId, authToken) => {
  //   console.log("Success transaction: ", tx);

  // const txReceipt = await trackPromise(tx.wait(1));
  // console.log("TransactionReceipt: ", txReceipt);

  // const campaignIdInHex = txReceipt.events[0].topics[1].toString();
  // const campaignId = ethers.BigNumber.from(campaignIdInHex).toNumber();
  // console.log("CampaignId: ", campaignId);

  //   // Update the campaign in the database
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //   await axios.patch(
  //     `${apiUrl}/api/campaigns/${campaignDbId}/activate`,
  //     { campaignId: campaignId }, // Send the on-chain ID
  //     {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`, // Send the user's login token
  //       },
  //     }
  //   );

  //   // updateUIValues()
  //   setLaunchText("Publish Your Project");
  //   setIsLaunching(false);

  //   // displayToast("success", "Project has been launched successfully");
  //   setSuccessMessage("Project has been launched");
  //   setTransactionHash(txReceipt.transactionHash);
  // };

  const handleSuccess = async (tx, campaignDbId, authToken) => {
    try {
      setLaunchText("Finalizing campaign..."); // Update status
      console.log("Success transaction: ", tx);

      const txReceipt = await trackPromise(tx.wait(1));
      console.log("TransactionReceipt: ", txReceipt);

      // const campaignId = txReceipt.events[0].args[0].toString();
      // console.log("On-Chain CampaignId: ", campaignId);

      const campaignIdInHex = txReceipt.events[0].topics[1].toString();
      const campaignId = ethers.BigNumber.from(campaignIdInHex).toNumber();
      console.log("CampaignId: ", campaignId);

      //uncomment this too.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.patch(
        `${apiUrl}/api/campaigns/${campaignDbId}/activate`,
        { campaignId: campaignId }, // Send the on-chain ID
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send the user's login token
          },
        }
      );

      setSuccessMessage("Project has been launched!");
      setTransactionHash(txReceipt.transactionHash);
    } catch (error) {
      console.error("Error finalizing campaign after success:", error);

      const backendErrorMessage = error.response?.data?.message;

      setFailureMessage(
        backendErrorMessage ||
          "Your project is on-chain, but failed to update on our site. Please contact support."
      );

      if (error.receipt) {
        setTransactionHash(error.receipt.transactionHash);
      }
    } finally {
      setLaunchText("Publish Your Project");
      setIsLaunching(false);
    }
  };

  // const handleFailure = async (error, campaignDbId) => {
  const handleFailure = async (error) => {
    console.log("Error: ", error);
    setLaunchText("Publish Your Project");
    setIsLaunching(false);

    // displayToast("failure", "Failed to launch Project");
    setFailureMessage("Failed to launch project");
  };

  const handleCloseModal = () => {
    setSuccessMessage("");
    setFailureMessage("");
  };

  return (
    <>
      {/* Main container with a light background to make the form stand out */}
      <main className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Main Page Header */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Create Your Project
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Make it easy for people to learn about your project and support
              your vision.
            </p>
          </div>

          {/* This div will hold all the form sections */}
          <div className="space-y-10">
            {/* --- Section 1: Project Title --- */}
            {/* Each section is a "card" with a shadow and rounded corners */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-3">
              {/* Left Side: Title and Description */}
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold leading-7 text-slate-900">
                  Project Title
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Write a clear, brief title and subtitle. This is the first
                  thing potential backers will see on your project page and in
                  search results.
                </p>
              </div>

              {/* Right Side: Form Inputs */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Title
                    </label>
                    <input
                      onChange={handleOnChange}
                      type="text"
                      maxLength="80"
                      name="title"
                      id="title"
                      placeholder="e.g., An Eco-Friendly Backpack from Recycled Materials"
                      className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subtitle"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Subtitle
                    </label>
                    <input
                      onChange={handleOnChange}
                      type="text"
                      name="subtitle"
                      id="subtitle"
                      maxLength="100"
                      placeholder="e.g., The perfect everyday bag, sustainably made."
                      className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Description --- */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold leading-7 text-slate-900">
                  Project Description
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Explain why you need this fund. A compelling story will grab
                  the attention of potential backers and inspire them to support
                  you.
                </p>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="note"
                  className="block text-sm font-medium leading-6 text-slate-900"
                >
                  Your Story
                </label>
                <textarea
                  onChange={handleOnChange}
                  id="note"
                  placeholder="Tell people about your project, your passion, and why this funding is important..."
                  className="mt-2 h-48 block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                ></textarea>
              </div>
            </div>

            {/* --- Project Image --- */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold leading-7 text-slate-900">
                  Project Image
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add a high-quality image that represents your project. It will
                  appear on your project page and across the website.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                  {projectInfo.imageSrc ? (
                    <div className="w-full h-auto max-h-80 relative group">
                      <img
                        src={projectInfo.imageSrc}
                        alt="Project preview"
                        className="object-cover w-full h-full rounded-md"
                      />
                      <button
                        onClick={handleClick}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      {/* An SVG icon makes it look more professional */}
                      <svg
                        className="mx-auto h-12 w-12 text-slate-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-slate-600">
                        <label
                          htmlFor="imageSrc"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="imageSrc"
                            name="imageSrc"
                            type="file"
                            className="sr-only"
                            onChange={handleOnChange}
                            ref={hiddenFileInput}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- Payout Details --- */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold leading-7 text-slate-900">
                  Payout Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  This is the Nigerian bank account where your Naira funds will
                  be sent. We'll verify the account name to make sure it's
                  correct.
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-3">
                  {/* Bank Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="bankCode"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Bank Name
                    </label>
                    <select
                      id="bankCode"
                      name="bankCode"
                      value={bankCode}
                      onChange={handleOnChange}
                      className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="">Select your bank</option>
                      <option value="001">Test Bank</option>

                      {banks &&
                        banks.length > 0 &&
                        banks.map((bank) => (
                          <option key={bank.id} value={bank.code}>
                            {bank.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Account Number (Now full width) */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      id="accountNumber"
                      value={accountNumber}
                      onChange={handleOnChange}
                      maxLength={10}
                      className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      placeholder="0123456789"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    {isVerifying && (
                      <div className="mt-2 flex items-center space-x-2">
                        <ClipLoader color="#475569" loading={true} size={20} />
                        <span className="text-sm text-slate-500">
                          Verifying...
                        </span>
                      </div>
                    )}
                    {accountName && (
                      <div className="mt-2 rounded-md bg-green-50 p-4">
                        <p className="text-sm font-medium text-green-800">
                          {accountName}
                        </p>
                      </div>
                    )}
                    {verifyError && (
                      <div className="mt-2 rounded-md bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800">
                          {verifyError}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Funding & Duration --- */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold leading-7 text-slate-900">
                  Funding Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Set your funding goal, launch date, and campaign duration.
                  Remember, you won't be able to change the duration after you
                  launch.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                  {/* Goal Amount */}
                  <div>
                    <label
                      htmlFor="goal"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Goal (in USD)
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        name="goal"
                        id="goal"
                        value={projectInfo.goal || ""}
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 py-2 pl-7 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        placeholder="50,000"
                      />
                    </div>
                    {!isValidGoal && (
                      <p className="mt-2 text-sm text-red-600">
                        Invalid amount
                      </p>
                    )}
                  </div>
                  {/* Duration */}
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Campaign Duration (minutes)
                    </label>
                    <input
                      type="text"
                      name="duration"
                      id="duration"
                      onChange={handleOnChange}
                      className="mt-2 block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      placeholder="Enter 1 - 1000"
                    />
                    {!isValidDuration && (
                      <p className="mt-2 text-sm text-red-600">
                        Duration must be between 1 and 1000.
                      </p>
                    )}
                  </div>
                  {/* Launch Date */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="launchDate"
                      className="block text-sm font-medium leading-6 text-slate-900"
                    >
                      Launch Date
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.5A.5.5 0 015 8h10a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5v-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <DatePicker
                        id="launchDate"
                        selected={projectInfo.launchDate}
                        onChange={(date) => {
                          /* Your onChange logic here */
                        }}
                        className="block w-full rounded-md border-0 py-2 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Launch Button --- */}
            <div className="flex items-center justify-end pt-6 border-t border-slate-900/10">
              <button
                type="button"
                onClick={handleLaunch}
                // disabled={!allValid || isLaunching}
                disabled={false}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <ClipLoader color="#ffffff" loading={true} size={20} />
                    <span className="ml-2">{launchText}</span>
                  </>
                ) : (
                  <span>{launchText}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Your Modals section - unchanged */}
        <div className="flex justify-center text-center sm:block sm:p-0 mt-2">
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
      </main>
    </>
  );
};

Launch.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Launch;
