import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { X } from "lucide-react";

export default function NairaSupportModal({
  campaign,
  handleCloseSupportModal,
}) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState(""); // 1. Add state for display name
  const [amount, setAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const handlePaystackSuccess = async (result) => {
    setMessage("Verifying your donation...");
    setIsLoading(true);
    const { reference } = result;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.get(`${apiUrl}/api/payments/verify/${reference}`);
      setMessage("Thank you! Your donation has been recorded.");
      setTimeout(() => {
        setEmail("");
        setDisplayName(""); // Reset display name
        setAmount("");
        setIsAnonymous(false);
        handleCloseSupportModal();
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Payment successful, but verification failed. Please contact support."
      );
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaystackClose = () => {
    if (!isLoading && !message.includes("Thank you")) {
      setMessage("Payment popup closed.");
    }
  };

  // Conditionally set the display name based on anonymous status
  const finalDisplayName = isAnonymous ? "Anonymous" : displayName;

  const componentProps = {
    email,
    amount: Number(amount) * 100,
    metadata: {
      campaignDbId: campaign._id,
      campaignId: campaign.campaignId, 
      isAnonymous: isAnonymous,
      displayName: finalDisplayName, // 2. Add final display name to metadata
    },
    publicKey: publicKey,
    text: "Donate with Paystack",
    subaccount: campaign.subaccountCode,
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  };

  // 3. Update form validation
  const isFormValid =
    email &&
    amount &&
    Number(amount) > 0 &&
    (isAnonymous || (!isAnonymous && displayName)); // Require display name only if not anonymous

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 transition-opacity flex items-center justify-center">
      <div
        tabIndex="-1"
        className="inline-block align-bottom rounded-lg w-full text-left outline-none overflow-hidden transform max-w-sm sm:max-w-md bg-white dark:bg-black shadow-xl"
      >
        <div className="relative p-5">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Support with Naira
            </h3>
            <button
              onClick={handleCloseSupportModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="mt-5 space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Display Name Input (Only show if not anonymous) */}
            {!isAnonymous && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isAnonymous} // Required only if not anonymous
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="How you want your name to appear"
                />
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Amount (NGN)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 5000"
              />
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="anonymous"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                Donate anonymously (display name will be hidden)
              </label>
            </div>

            {/* Paystack Button */}
            <PaystackButton
              {...componentProps}
              disabled={!isFormValid || isLoading}
              className={`inline-flex w-full justify-center items-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                !isFormValid || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {isLoading ? (
                <>
                  <ClipLoader color="#ffffff" loading={true} size={20} />
                  <span className="ml-2">{message || "Processing..."}</span>
                </>
              ) : (
                componentProps.text
              )}
            </PaystackButton>

            {/* Feedback Message */}
            {message && !isLoading && (
              <p
                className={`mt-4 text-center text-sm ${
                  message.includes("Thank you")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}