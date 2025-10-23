import { useState } from "react";
import { addressToToken, fromWei } from "../utils/helper";
import { formatDistanceToNow } from 'date-fns'; // For relative timestamps

// Use Intl.NumberFormat for currency formatting
const nairaFormatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });
const cryptoFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });

export default function Backers({ backers = [], nairaDonations = [] }) {
  const [activeTab, setActiveTab] = useState("crypto"); // Default to 'crypto'

  // Format Crypto Backer Data (similar to original)
  const formattedCryptoBackers = backers.map((backer, index) => {
    const account = backer[0];
    const tokenName = addressToToken[backer[1]];
    const amount = fromWei(backer[2]);
    const formattedAmount = cryptoFormatter.format(amount.toString());
    const shortAccount = `${account.toString().substring(0, 7)}...${account.toString().substring(account.toString().length - 8)}`;
    // Assuming no timestamp from crypto data for now
    return {
        id: `crypto-${index}-${account}`, // Create a more unique key
        identifier: shortAccount,
        amountText: `${formattedAmount} ${tokenName}`,
        timestamp: null // Or get from event logs if available
    };
  });

  // Format Naira Donation Data
  const formattedNairaDonations = nairaDonations.map(donation => ({
    id: `naira-${donation._id}`, // Use MongoDB ID for key
    identifier: donation.isAnonymous ? "Anonymous" : donation.donorDisplayName || donation.donorEmail, // Show display name or email
    amountText: nairaFormatter.format(donation.amount / 100), // Kobo to Naira
    timestamp: new Date(donation.createdAt)
  }));

  // Combine for total count, decide which list to show
  const cryptoCount = formattedCryptoBackers.length;
  const nairaCount = formattedNairaDonations.length;
  const totalCount = cryptoCount + nairaCount;
  const donationsToShow = activeTab === "crypto" ? formattedCryptoBackers : formattedNairaDonations;

  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
      : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
      {/* Tabs */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("crypto")}
              className={getTabClass("crypto")}
            >
              Crypto Backers ({cryptoCount})
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("naira")}
              className={getTabClass("naira")}
            >
              Naira Donors ({nairaCount})
            </button>
          </li>
        </ul>
      </div>

      {/* Donation List */}
      <div className="h-96 overflow-auto scrollbar-hide p-4">
        {totalCount === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-gray-500">
            <p>No donations yet.</p>
          </div>
        ) : donationsToShow.length === 0 ? (
           <div className="h-full flex flex-col justify-center items-center text-gray-500">
            <p>No {activeTab === 'crypto' ? 'crypto' : 'Naira'} donations yet.</p>
          </div>
        ) : (
          donationsToShow.map((donation) => (
            <div
              className="text-gray-800 dark:text-gray-200 text-sm bg-gray-100 dark:bg-gray-700 p-3 mb-3 rounded-md shadow-sm"
              key={donation.id}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium truncate pr-4" title={donation.identifier}> {/* Tooltip for long names/emails */}
                    {donation.identifier}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {donation.amountText}
                </p>
              </div>
              {donation.timestamp && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                    {formatDistanceToNow(donation.timestamp, { addSuffix: true })}
                  </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}