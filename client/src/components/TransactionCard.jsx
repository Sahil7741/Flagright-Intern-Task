import React, { useState, useEffect } from "react";
import { updateTransaction } from "../apis/Transactions";
import { listAllUsers } from "../apis/Users";
import { toast } from "react-toastify";
import Buttons from "./Button";
import { useNavigate } from 'react-router-dom';

const TransactionCard = ({ txn, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState(txn.sender?.id || "");
  const [receiverId, setReceiverId] = useState(txn.receiver?.id || "");
  const [amount, setAmount] = useState(txn.transaction?.amount || "");
  const [ip, setIp] = useState(txn.transaction?.ip || "");
  const [deviceId, setDeviceId] = useState(txn.transaction?.deviceId || "");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users for dropdowns
    const fetchUsers = async () => {
      try {
        const data = await listAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch users for dropdown");
      }
    };
    fetchUsers();
  }, []);

  const handleUpdate = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction({
        id: txn.transaction?.id,
        senderId,
        receiverId,
        amount,
        ip,
        deviceId,
      });
      toast.success("Transaction updated successfully!");
      setShowModal(false);
      window.location.reload();
    //   if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update transaction");
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-4 rounded shadow-md flex flex-col">
            <div className="flex justify-between gap-2">
              <h2 className="text-lg font-bold mb-2">Update Transaction</h2>
              <Buttons text={"X"} onClick={handleCloseModal} className={"bg-black"} />
            </div>
            <form className="max-w-md mx-auto flex flex-col" onSubmit={handleSubmit}>
              <div className="relative z-0 w-full mb-5 group">
                <input type="number" name="amount" id="amount" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required value={amount} onChange={e => setAmount(e.target.value)} />
                <label htmlFor="amount" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Amount</label>
              </div>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            </form>
          </div>
        </div>
      )}
      <div key={txn.transaction?.id} className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
        <h3 className="text-lg font-semibold mb-2">Transaction ID: {txn.transaction?.id}</h3>
        <p className="text-sm mb-1"><span className="font-semibold">Amount:</span> {txn.transaction?.amount}</p>
        <p className="text-sm mb-1"><span className="font-semibold">IP:</span> {txn.transaction?.ip}</p>
        <p className="text-sm mb-1"><span className="font-semibold">Device ID:</span> {txn.transaction?.deviceId}</p>
        <div className="mt-2 p-2 rounded bg-gray-700">
          <div className="font-semibold text-blue-300">Sender</div>
          <p className="text-xs">Name: {txn.sender?.name}</p>
          <p className="text-xs">Email: {txn.sender?.email}</p>
        </div>
        <div className="mt-2 p-2 rounded bg-gray-700">
          <div className="font-semibold text-green-300">Receiver</div>
          <p className="text-xs">Name: {txn.receiver?.name}</p>
          <p className="text-xs">Email: {txn.receiver?.email}</p>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={handleUpdate}>
            Update Amount
          </button>
          <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
          onClick={() => navigate(`/relationships/transaction/${txn.transaction.id}`)}
        >
          Visualize
        </button>
        </div>
      </div>
    </>
  );
};

export default TransactionCard;