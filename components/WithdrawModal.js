import { ClipLoader } from "react-spinners";

const WithdrawModal = ({ type, isOpen, onClose, onConfirm, isProcessing, amount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800">Confirm Withdrawal</h2>
        <p className="mt-4 text-gray-600">
          You are about to withdraw your <strong>{type}</strong> funds.
        </p>
        
        <div className="my-4 rounded-md bg-gray-50 p-4 border border-gray-200">
          <div className="flex justify-between text-sm">
            <span>Estimated Amount:</span>
            <span className="font-bold text-gray-900">{amount}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Method:</span>
            <span>{type === "Naira" ? "Bank Transfer (Paystack)" : "Wallet (Smart Contract)"}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 rounded-md py-2 text-white flex justify-center items-center ${
              type === "Naira" ? "bg-orange-500" : "bg-green-600"
            }`}
          >
            {isProcessing ? <ClipLoader size={20} color="#fff" /> : `Withdraw ${type}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;