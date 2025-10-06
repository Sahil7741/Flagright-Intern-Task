import React, { useEffect, useState } from 'react';
import Buttons from '../components/Button.jsx';
import { listAllTransactions, addTransactions } from '../apis/Transactions.js';
import { listAllUsers } from '../apis/Users.js';
import { toast } from 'react-toastify';
import TransactionCard from '../components/TransactionCard.jsx';

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [ip, setIp] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [searchWords, setSearchWords] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState('asc');
  const [filterProperties, setFilterProperties] = useState({
    sender_name: true,
    sender_email: false,
    sender_phone: false,
    sender_address: false,
    receiver_name: false,
    receiver_email: false,
    receiver_phone: false,
    receiver_address: false,
    ip: false,
    deviceId: false,
    amount: false
  });
  const [users, setUsers] = useState([]);

  const handleAddTransaction = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransactions({ senderId, receiverId, amount, ip, deviceId });
      toast.success('Transaction added successfully!');
    } catch (error) {
      toast.error('Failed to add transaction');
      console.error('Error adding transaction:', error);
    } finally {
      setShowModal(false);
      listTransactions();
      setSenderId('');
      setReceiverId('');
      setAmount('');
      setIp('');
      setDeviceId('');
    }
  };

  const listTransactions = async (opts={}) => {
    try {
      const params = { page, limit, sortBy, direction, ...opts };
      const res = await listAllTransactions(params);
      setTransactions(res.data);
      setTotal(res.total);
      setPage(res.page);
      setLimit(res.limit);
    } catch (error) {
      toast.error('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearch = () => {
    const active = Object.keys(filterProperties).filter(k=>filterProperties[k]);
    const opts = {};
    if (active.includes('ip')) opts.ip = searchWords;
    if (active.includes('deviceId')) opts.deviceId = searchWords;
    if (active.includes('amount')) {
      const v = Number(searchWords);
      if(!Number.isNaN(v)) opts.minAmount = v;
    }
    setPage(1);
    listTransactions({ page: 1, ...opts });
  };

  const handleReset = () => {
    setSearchWords('');
    setPage(1);
    listTransactions({ page: 1, ip: undefined, deviceId: undefined, minAmount: undefined, maxAmount: undefined });
  };

  useEffect(() => {
    listTransactions();
    // Fetch users for dropdowns
    const fetchUsers = async () => {
      try {
        const data = await listAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to fetch users for dropdown');
      }
    };
    fetchUsers();
  }, [page, limit, sortBy, direction]);

  return (
    <>
      <div className='glass max-w-4xl mx-auto my-10 px-8 py-10 text-center space-y-4 border border-cyan-200/15 shadow-cyan-500/20'>
        <h1 className='heading-neon text-4xl md:text-5xl font-extrabold'>Transactions Pulse</h1>
        <p className='text-lg md:text-xl text-slate-200/90 leading-relaxed'>Monitor inflows, track sender-receiver journeys, and keep your network healthy in real time.</p>
      </div>
      <div className='px-6 md:px-10 flex justify-end'>
        <Buttons text={'Add Transaction'} onClick={handleAddTransaction} className='btn-elevated' />
      </div>
      <div className='glass mx-4 md:mx-8 mt-6 p-6 md:p-7 flex flex-col gap-4 sticky top-24 z-10 border border-cyan-400/10 shadow-lg shadow-cyan-900/20'>
        <div className='flex flex-wrap gap-4 items-center justify-between text-slate-100'>
          <div className="flex flex-wrap gap-3 items-center">
            {Object.entries(filterProperties).map(([key, checked]) => (
              <label key={key} className="flex items-center text-sm cursor-pointer text-cyan-100/90">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setFilterProperties(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="accent-cyan-400 w-4 h-4 mr-2 rounded border border-cyan-300/40 bg-slate-900/60 focus:ring-2 focus:ring-cyan-200/60"
                />
                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            ))}
          </div>
          <div className='flex flex-1 flex-wrap gap-3 justify-end min-w-[240px]'>
            <input
              type='search'
              name='search'
              id='search'
              placeholder='Search transactions...'
              value={searchWords}
              className='input-field md:max-w-md'
              onChange={e => setSearchWords(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter') handleSearch(); }}
            />
            <Buttons text={'Search'} onClick={handleSearch} className='btn-elevated' />
            <Buttons text={'Reset'} onClick={handleReset} className='btn-ghost' />
          </div>
        </div>
        <div className='flex flex-wrap gap-4 items-center text-slate-200/90 text-sm md:text-base'>
          <span className='px-3 py-1 rounded-full bg-slate-900/60 border border-cyan-400/20 shadow-inner shadow-cyan-500/10'>Total: {total}</span>
          <label className='flex items-center gap-2'>Sort by
            <select className='input-field bg-slate-950/80 border border-cyan-300/30' value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value='id'>ID</option>
              <option value='amount'>Amount</option>
            </select>
          </label>
          <label className='flex items-center gap-2'>Dir
            <select className='input-field bg-slate-950/80 border border-cyan-300/30' value={direction} onChange={(e)=>setDirection(e.target.value)}>
              <option value='asc'>asc</option>
              <option value='desc'>desc</option>
            </select>
          </label>
          <label className='flex items-center gap-2'>Page
            <input className='input-field w-20 bg-slate-950/80 border border-cyan-300/30' type='number' min='1' value={page} onChange={(e)=>setPage(Number(e.target.value)||1)} />
          </label>
          <label className='flex items-center gap-2'>Limit
            <input className='input-field w-24 bg-slate-950/80 border border-cyan-300/30' type='number' min='1' max='200' value={limit} onChange={(e)=>setLimit(Number(e.target.value)||25)} />
          </label>
        </div>
        <h2 className='text-lg md:text-xl font-semibold text-cyan-100 tracking-wide'>Transactions</h2>
      </div>
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4'>
          <div className='modal-panel p-6 md:p-8 flex flex-col min-w-[320px] max-w-lg w-full'>
            <div className='flex justify-between items-center pb-3 border-b border-cyan-300/20'>
              <h2 className='text-xl font-semibold heading-neon'>Add Transaction</h2>
              <Buttons text={'X'} onClick={handleCloseModal} className='btn-ghost !px-3 !py-2' />
            </div>
            <form className='max-w-md mx-auto flex flex-col gap-5 w-full mt-5' onSubmit={handleSubmit}>
              <div className='relative z-0 w-full group'>
                <select
                  name='senderId'
                  id='senderId'
                  className='input-field bg-transparent border border-cyan-300/40 peer'
                  required
                  value={senderId}
                  onChange={e => setSenderId(e.target.value)}
                >
                  <option value=''>Select Sender</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <label htmlFor='senderId' className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Sender</label>
              </div>
              <div className='relative z-0 w-full group'>
                <select
                  name='receiverId'
                  id='receiverId'
                  className='input-field bg-transparent border border-cyan-300/40 peer'
                  required
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                >
                  <option value=''>Select Receiver</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <label htmlFor='receiverId' className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Receiver</label>
              </div>
              <div className='relative z-0 w-full group'>
                <input type='number' name='amount' id='amount' className='input-field bg-transparent border border-cyan-300/40 peer' placeholder=' ' required value={amount} onChange={e => setAmount(e.target.value)} />
                <label htmlFor='amount' className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Amount</label>
              </div>
              <div className='relative z-0 w-full group'>
                <input type='text' name='ip' id='ip' className='input-field bg-transparent border border-cyan-300/40 peer' placeholder=' ' required value={ip} onChange={e => setIp(e.target.value)} />
                <label htmlFor='ip' className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>IP Address</label>
              </div>
              <div className='relative z-0 w-full group'>
                <input type='text' name='deviceId' id='deviceId' className='input-field bg-transparent border border-cyan-300/40 peer' placeholder=' ' required value={deviceId} onChange={e => setDeviceId(e.target.value)} />
                <label htmlFor='deviceId' className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Device ID</label>
              </div>
              <div className='flex justify-end gap-3'>
                <Buttons text={'Cancel'} onClick={handleCloseModal} className='btn-ghost' />
                <button type='submit' className='btn-elevated px-6'>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className='p-4'>
        <div className='mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {transactions.map((txn, idx) => (
            <TransactionCard txn={txn} onUpdate = {() => listTransactions()}/>)) 
          }
        </div>
      </div>
    </>
  );
};

export default Transactions;
