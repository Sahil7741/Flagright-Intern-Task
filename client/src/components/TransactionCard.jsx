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
  const transactionId = txn.transaction?.id;
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
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4">
          <div className="modal-panel p-6 md:p-7 flex flex-col min-w-[320px] max-w-md w-full">
            <div className="flex justify-between items-center pb-3 border-b border-cyan-300/20">
              <h2 className="text-xl font-semibold heading-neon">Update Transaction</h2>
              <Buttons text={"X"} onClick={handleCloseModal} className={'btn-ghost !px-3 !py-2'} />
            </div>
            <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
              <div className="relative z-0 w-full group">
                <input type="number" name="amount" id="amount" className="input-field bg-transparent border border-cyan-300/40 peer" placeholder=" " required value={amount} onChange={e => setAmount(e.target.value)} />
                <label htmlFor="amount" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Amount</label>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200/80'>
                <div className='p-3 rounded-xl bg-slate-900/40 border border-cyan-300/20'>
                  <p className='text-xs uppercase tracking-[0.3em] text-cyan-200/60'>Sender</p>
                  <p className='mt-1 font-semibold'>{txn.sender?.name}</p>
                  <p className='text-xs text-slate-300/70'>{txn.sender?.email}</p>
                </div>
                <div className='p-3 rounded-xl bg-slate-900/40 border border-orange-400/20'>
                  <p className='text-xs uppercase tracking-[0.3em] text-orange-200/60'>Receiver</p>
                  <p className='mt-1 font-semibold'>{txn.receiver?.name}</p>
                  <p className='text-xs text-slate-300/70'>{txn.receiver?.email}</p>
                </div>
              </div>
              <div className='flex justify-end gap-3'>
                <Buttons text={'Cancel'} onClick={handleCloseModal} className='btn-ghost' />
                <button type="submit" className="btn-elevated px-6">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div key={transactionId} className="surface-panel p-5 rounded-2xl text-slate-100 border border-cyan-400/10 shadow-lg shadow-cyan-900/20 flex flex-col gap-4">
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h3 className="text-xl font-semibold">Txn #{transactionId}</h3>
            <p className='text-xs uppercase tracking-[0.3em] text-cyan-200/60 mt-1'>Real-time transfer</p>
          </div>
          <span className='px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-sm font-semibold'>${txn.transaction?.amount}</span>
        </div>
        <div className='grid grid-cols-2 gap-3 text-sm text-slate-200/85'>
          <div>
            <p className='text-cyan-200/70 text-xs uppercase tracking-[0.25em] mb-1'>IP</p>
            <p>{txn.transaction?.ip}</p>
          </div>
          <div>
            <p className='text-cyan-200/70 text-xs uppercase tracking-[0.25em] mb-1'>Device</p>
            <p>{txn.transaction?.deviceId}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/45 border border-cyan-300/20">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-200/60 mb-2">Sender</div>
            <p className="text-sm font-semibold">{txn.sender?.name}</p>
            <p className="text-xs text-slate-300/75">{txn.sender?.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/45 border border-orange-300/20">
            <div className="text-xs uppercase tracking-[0.35em] text-orange-200/60 mb-2">Receiver</div>
            <p className="text-sm font-semibold">{txn.receiver?.name}</p>
            <p className="text-xs text-slate-300/75">{txn.receiver?.email}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-auto pt-2">
          <button className="btn-elevated px-4 py-2 text-sm" onClick={handleUpdate}>
            Update Amount
          </button>
          <button
          className='btn-danger px-4 py-2 text-sm'
          onClick={() => transactionId && navigate(`/relationships/transaction/${transactionId}`)}
        >
          Visualize
        </button>
        </div>
      </div>
    </>
  );
};

export default TransactionCard;