// components/PaystackBrowserModal.tsx
import { X } from "lucide-react";
import React from "react";

interface PaystackBrowserModalProps {
  paymentUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const PaystackBrowserModal: React.FC<PaystackBrowserModalProps> = ({
  paymentUrl,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl h-[80vh] relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Complete Your Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="w-full h-full">
          <iframe
            src={paymentUrl}
            className="w-full h-full border-none"
            title="Paystack Payment"
          />
        </div>
      </div>
    </div>
  );
};

export default PaystackBrowserModal;

/* <PaystackBrowserModal
paymentUrl={paymentUrl}
isOpen={isModalOpen}
onClose={closePaystackCheckout}
/> */
