import React, { useEffect, useState } from 'react';
import Buttons from '../components/Button.jsx';
import { addUser, listAllUsers } from '../apis/Users.js';
import { toast } from 'react-toastify';
import UserCard from '../components/UserCard.jsx';

const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethods, setPaymentMethods] = useState('');
    const [users, setUsers] = useState([]);
    const [searchWords, setSearchWords] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('asc');
    const [filterProperties, setFilterProperties] = useState({
        name: true,
        email: false,
        phone: false,
        address: false,
        payment_methods: false
    });

    const handleAddUser = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addUser({
                firstName,
                lastName,
                email,
                phone,
                address,
                payment_methods: paymentMethods
            });
            toast.success(`User ${firstName + ' ' + lastName} added successfully!`);
        } catch (error) {
            toast.error('Failed to add user');
            console.error('Error adding user:', error);
        } finally {
            setShowModal(false);
            listUsers();
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setPaymentMethods('');
        }
    };

    const listUsers = async (opts = {}) => {
        try {
            const params = { page, limit, sortBy, direction, q: searchWords, ...opts };
            const res = await listAllUsers(params);
            setUsers(res.data);
            setTotal(res.total);
            setPage(res.page);
            setLimit(res.limit);
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = () => {
        setPage(1);
        listUsers({ page: 1 });
    };

    useEffect(() => {
        listUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, sortBy, direction]);

    const handleReset = () => {
        setSearchWords('');
        setPage(1);
        listUsers({ page: 1, q: '' });
    };

    return (
        <>
            <div className='glass max-w-4xl mx-auto my-10 px-8 py-10 text-center space-y-4 border border-cyan-200/15 shadow-cyan-500/20'>
                <h1 className='heading-neon text-4xl md:text-5xl font-extrabold'>Users Graph Hub</h1>
                <p className='text-lg md:text-xl text-slate-200/90 leading-relaxed'>Visualize relationships at scale, discover patterns, and keep your network healthy. Add a new user or explore existing ones in just a few clicks.</p>
            </div>
            <div className='px-6 md:px-10 flex justify-end'>
                <Buttons text={'Add User'} onClick={handleAddUser} className='btn-elevated' />
            </div>
            <div className='glass mx-4 md:mx-8 mt-6 p-6 md:p-7 flex flex-col gap-4 sticky top-24 z-10 border border-cyan-400/10 shadow-lg shadow-cyan-900/20'>
                <div className='flex flex-wrap gap-4 items-center justify-between text-slate-100'>
                    <div className='flex flex-wrap gap-3 items-center'>
                        {Object.entries(filterProperties).map(([key, checked]) => (
                            <label key={key} className='flex items-center text-sm cursor-pointer text-cyan-100/90'>
                                <input
                                    type='checkbox'
                                    checked={checked}
                                    onChange={() => setFilterProperties(prev => ({ ...prev, [key]: !prev[key] }))}
                                    className='accent-cyan-400 w-4 h-4 mr-2 rounded border border-cyan-300/40 bg-slate-900/60 focus:ring-2 focus:ring-cyan-200/60'
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
                            placeholder='Search users...'
                            value={searchWords}
                            className='input-field md:max-w-md'
                            onChange={(e) => setSearchWords(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        />
                        <Buttons text={'Search'} onClick={handleSearch} className='btn-elevated' />
                        <Buttons text={'Reset'} onClick={handleReset} className='btn-ghost' />
                    </div>
                </div>
                <div className='flex flex-wrap gap-4 items-center text-slate-200/90 text-sm md:text-base'>
                    <span className='px-3 py-1 rounded-full bg-slate-900/60 border border-cyan-400/20 shadow-inner shadow-cyan-500/10'>Total: {total}</span>
                    <label className='flex items-center gap-2'>Sort by
                        <select className='input-field bg-slate-950/80 border border-cyan-300/30' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value='id'>ID</option>
                            <option value='name'>Name</option>
                        </select>
                    </label>
                    <label className='flex items-center gap-2'>Dir
                        <select className='input-field bg-slate-950/80 border border-cyan-300/30' value={direction} onChange={(e) => setDirection(e.target.value)}>
                            <option value='asc'>asc</option>
                            <option value='desc'>desc</option>
                        </select>
                    </label>
                    <label className='flex items-center gap-2'>Page
                        <input className='input-field w-20 bg-slate-950/80 border border-cyan-300/30' type='number' min='1' value={page} onChange={(e) => setPage(Number(e.target.value) || 1)} />
                    </label>
                    <label className='flex items-center gap-2'>Limit
                        <input className='input-field w-24 bg-slate-950/80 border border-cyan-300/30' type='number' min='1' max='200' value={limit} onChange={(e) => setLimit(Number(e.target.value) || 25)} />
                    </label>
                </div>
                <h2 className='text-lg md:text-xl font-semibold text-cyan-100 tracking-wide'>Users</h2>
            </div>
            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4'>
                    <div className='modal-panel p-6 md:p-8 flex flex-col min-w-[320px] max-w-lg w-full'>
                        <div className='flex justify-between items-center pb-3 border-b border-cyan-300/20'>
                            <h2 className='text-xl font-semibold heading-neon'>Add User</h2>
                            <Buttons text={'X'} onClick={handleCloseModal} className='btn-ghost !px-3 !py-2' />
                        </div>
                        <form className='max-w-md mx-auto flex flex-col text-left w-full space-y-5 mt-5' onSubmit={handleSubmit}>
                            <div className='relative z-0 w-full group'>
                                <input
                                    type='email'
                                    name='floating_email'
                                    id='floating_email'
                                    className='input-field bg-transparent border border-cyan-300/40 peer'
                                    placeholder=' '
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label
                                    htmlFor='floating_email'
                                    className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                                >
                                    Email address
                                </label>
                            </div>
                            <div className='grid md:grid-cols-2 md:gap-6 gap-5'>
                                <div className='relative z-0 w-full group'>
                                    <input
                                        type='text'
                                        name='floating_first_name'
                                        id='floating_first_name'
                                        className='input-field bg-transparent border border-cyan-300/40 peer'
                                        placeholder=' '
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <label
                                        htmlFor='floating_first_name'
                                        className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                                    >
                                        First name
                                    </label>
                                </div>
                                <div className='relative z-0 w-full group'>
                                    <input
                                        type='text'
                                        name='floating_last_name'
                                        id='floating_last_name'
                                        className='input-field bg-transparent border border-cyan-300/40 peer'
                                        placeholder=' '
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    <label
                                        htmlFor='floating_last_name'
                                        className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                                    >
                                        Last name
                                    </label>
                                </div>
                            </div>
                            <div className='grid md:grid-cols-2 md:gap-6 gap-5'>
                                <div className='relative z-0 w-full group'>
                                    <input
                                        type='tel'
                                        pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                                        name='floating_phone'
                                        id='floating_phone'
                                        className='input-field bg-transparent border border-cyan-300/40 peer'
                                        placeholder=' '
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <label
                                        htmlFor='floating_phone'
                                        className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                                    >
                                        Phone number
                                    </label>
                                </div>
                                <div className='relative z-0 w-full group'>
                                    <input
                                        type='text'
                                        name='floating_company'
                                        id='floating_company'
                                        className='input-field bg-transparent border border-cyan-300/40 peer'
                                        placeholder=' '
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <label
                                        htmlFor='floating_company'
                                        className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                                    >
                                        Address
                                    </label>
                                </div>
                                <div className='relative z-0 w-full group md:col-span-2'>
                                    <select
                                        name='floating_payment_methods'
                                        id='floating_payment_methods'
                                        className='input-field bg-transparent border border-cyan-300/40 peer'
                                        required
                                        value={paymentMethods}
                                        onChange={(e) => setPaymentMethods(e.target.value)}
                                    >
                                        <option value=''>Select a payment method</option>
                                        <option value='credit_card'>Credit Card</option>
                                        <option value='debit_card'>Debit Card</option>
                                        <option value='bank_transfer'>Bank Transfer</option>
                                        <option value='UPI'>UPI</option>
                                    </select>
                                    <label
                                        htmlFor='floating_payment_methods'
                                        className='peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                                    >
                                        Payment Methods
                                    </label>
                                </div>
                            </div>
                            <div className='flex justify-end gap-3'>
                                <Buttons text={'Cancel'} onClick={handleCloseModal} className='btn-ghost' />
                                <button type='submit' className='btn-elevated'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className='p-4'>
                <div className='mt-6 gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Users;