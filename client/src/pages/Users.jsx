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
    const [tempUsers, setTempUsers] = useState([]);
    const [searchWords, setSearchWords] = useState('');
    const [filterProperties, setFilterProperties] = useState({
        name: true,
        email: false,
        phone: false,
        address: false,
        payment_methods: false
    });

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await addUser({
                firstName,
                lastName,
                email,
                phone,
                address,
                payment_methods: paymentMethods
            });
            toast.success(`User ${firstName + " " + lastName} added successfully!`);
        }
        catch (error) {
            toast.error("Failed to add user");
            console.error("Error adding user:", error);
        }
        finally {
            setShowModal(false);
            listUsers();
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setPaymentMethods('');
        }
    }

    const listUsers = async () => {
        try {
            const data = await listAllUsers();
            console.log("Fetched users:", data);
            toast.success("Users fetched successfully!");
            setUsers(data);
            setTempUsers(data);
        }
        catch (error) {
            toast.error("Failed to fetch users");
            console.error("Error fetching users:", error);
        }
    }

    const handleSearch = () => {
        const target = (searchWords.trim()).toLowerCase();
        const activeProps = Object.keys(filterProperties).filter(key => filterProperties[key]);
        const filteredUsers = tempUsers.filter(user => {
            return activeProps.some(prop => {
                if (!user[prop]) return false;
                return user[prop].toLowerCase().includes(target);
            });
        });
        setUsers(filteredUsers);
    }

    useEffect(() => {
        listUsers();
    }, []);

    const handleReset = () => {
        setUsers(tempUsers);
        setSearchWords("");
    };

    return (
        <>
            <div className='flex flex-col p-4 justify-center my-10'>
                <h1 className='text-white text-5xl font-bold mb-4'>Users Page</h1>
                <p className='text-2xl text-white'>Visualizing user connections had never been easier. Below is the list of all the users present in our database. Add a new User or view, update or visualize the relationships of existing users with a just a click!</p>
            </div>
            <div className='p-4'>
                <Buttons text={"Add User"} onClick={handleAddUser} />
            </div>
            <div className='flex flex-col p-4 gap-4 sticky top-0 z-10 bg-black'>
                <div className='flex flex-wrap gap-4 items-center'>
                    <div className="flex gap-3 items-center">
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
                    <input type="search" name="search" id="search" placeholder="Search users..." value={searchWords} className='md:w-1/2 w-full box-border text-white p-2 border border-gray-300 rounded focus:outline-0 bg-black' onChange={(e) => {
                        setSearchWords(e.target.value)
                        handleSearch();
                    }} />
                    <Buttons text={"Reset"} onClick={handleReset} disabled={users == tempUsers} />
                </div>
                <h2 className='text-lg font-semibold text-white'>Users List</h2>
            </div>
            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50'>
                    <div className='bg-white p-4 rounded shadow-md flex flex-col'>
                        <div className="flex justify-between">
                            <h2 className='text-lg font-bold mb-2'>Add User</h2>
                            <Buttons text={"X"} onClick={handleCloseModal} className={"bg-black"} />
                        </div>
                        <form className="max-w-md mx-auto flex flex-col">
                            <div className="relative z-0 w-full mb-5 group">
                                <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={(e) => setEmail(e.target.value)} />
                                <label for="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={(e) => setFirstName(e.target.value)} />
                                    <label for="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="text" name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={(e) => setLastName(e.target.value)} />
                                    <label for="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={(e) => setPhone(e.target.value)} />
                                    <label for="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="text" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={(e) => setAddress(e.target.value)} />
                                    <label for="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <select name="floating_payment_methods" id="floating_payment_methods" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required onChange={(e) => setPaymentMethods(e.target.value)}>
                                        <option value="">Select a payment method</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                    <label for="floating_payment_methods" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Payment Methods</label>
                                </div>
                            </div>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                </div>
            )}
            <div className='p-4'>
                <div className='mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Users;