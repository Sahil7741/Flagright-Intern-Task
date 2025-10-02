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
      <div className='flex flex-col p-4 justify-center my-10'>
        <h1 className='text-white text-5xl font-bold mb-4'>Transactions Page</h1>
        <p className='text-2xl text-white'>View, add, and search transactions in the system.</p>
      </div>
      <div className='p-4'>
        <Buttons text={'Add Transaction'} onClick={handleAddTransaction} />
      </div>
      <div className='flex flex-col p-4 gap-4 sticky top-0 z-10 bg-gray-950'>
        <div className='flex flex-wrap gap-4 items-center'>
          <div className="flex flex-wrap gap-3 items-center">
            {Object.entries(filterProperties).map(([key, checked]) => (
              <label key={key} className="flex items-center text-white text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setFilterProperties(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="accent-blue-600 w-4 h-4 mr-1 rounded focus:ring-2 focus:ring-blue-400 border-gray-300 bg-gray-800"
                />
                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            ))}
          </div>
          <input
            type='search'
            name='search'
            id='search'
            placeholder='Search transactions...'
            value={searchWords}
            className='md:w-1/2 w-full box-border text-white p-2 border border-gray-300 rounded focus:outline-0 bg-gray-900'
            onChange={e => {
                setSearchWords(e.target.value);
            }}
            onKeyDown={(e)=>{ if(e.key==='Enter') handleSearch(); }}
          />
          <Buttons text={'Search'} onClick={handleSearch} />
          <Buttons text={'Reset'} onClick={handleReset} />
        </div>
        <div className='flex items-center gap-3 text-white'>
          <span>Total: {total}</span>
          <label>Sort by
            <select className='ml-2 bg-gray-900 border border-gray-700' value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value='id'>ID</option>
              <option value='amount'>Amount</option>
            </select>
          </label>
          <label>Dir
            <select className='ml-2 bg-gray-900 border border-gray-700' value={direction} onChange={(e)=>setDirection(e.target.value)}>
              <option value='asc'>asc</option>
              <option value='desc'>desc</option>
            </select>
          </label>
          <label>Page
            <input className='ml-2 w-16 bg-gray-900 border border-gray-700' type='number' min='1' value={page} onChange={(e)=>setPage(Number(e.target.value)||1)} />
          </label>
          <label>Limit
            <input className='ml-2 w-16 bg-gray-900 border border-gray-700' type='number' min='1' max='200' value={limit} onChange={(e)=>setLimit(Number(e.target.value)||25)} />
          </label>
        </div>
        <h2 className='text-lg font-semibold text-white'>Transactions</h2>
      </div>
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50'>
          <div className='bg-white p-4 rounded shadow-md flex flex-col'>
            <div className='flex justify-between'>
              <h2 className='text-lg font-bold mb-2'>Add Transaction</h2>
              <Buttons text={'X'} onClick={handleCloseModal} className={'bg-black'} />
            </div>
            <form className='max-w-md mx-auto flex flex-col' onSubmit={handleSubmit}>
              <div className='relative z-0 w-full mb-5 group'>
                <select
                  name='senderId'
                  id='senderId'
                  className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                  required
                  value={senderId}
                  onChange={e => setSenderId(e.target.value)}
                >
                  <option value=''>Select Sender</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <label htmlFor='senderId' className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Sender</label>
              </div>
              <div className='relative z-0 w-full mb-5 group'>
                <select
                  name='receiverId'
                  id='receiverId'
                  className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                  required
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                >
                  <option value=''>Select Receiver</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <label htmlFor='receiverId' className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Receiver</label>
              </div>
              <div className='relative z-0 w-full mb-5 group'>
                <input type='number' name='amount' id='amount' className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer' placeholder=' ' required value={amount} onChange={e => setAmount(e.target.value)} />
                <label htmlFor='amount' className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Amount</label>
              </div>
              <div className='relative z-0 w-full mb-5 group'>
                <input type='text' name='ip' id='ip' className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer' placeholder=' ' required value={ip} onChange={e => setIp(e.target.value)} />
                <label htmlFor='ip' className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>IP Address</label>
              </div>
              <div className='relative z-0 w-full mb-5 group'>
                <input type='text' name='deviceId' id='deviceId' className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer' placeholder=' ' required value={deviceId} onChange={e => setDeviceId(e.target.value)} />
                <label htmlFor='deviceId' className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>Device ID</label>
              </div>
              <button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'>Submit</button>
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
