import React, {useState} from 'react'
import Buttons from './Button';
import { toast } from 'react-toastify';
import { updateUser } from '../apis/Users';
import { useNavigate } from 'react-router-dom';

function UserCard({ user }) {
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState(user.name.split(" ")[0]);
    const [lastName, setLastName] = useState(user.name.split(" ")[1]);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [paymentMethods, setPaymentMethods] = useState(user.payment_methods);
    const navigate = useNavigate();

    const handleUpdate = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUser({id:user.id, firstName, lastName, email, phone, address, payment_methods:paymentMethods});
            toast.success('User updated successfully');
            setTimeout(()=>{
                window.location.reload();
            }, 2000);
        } catch (error) {
            toast.error('Failed to update user');
            console.error('Error updating user:', error);
        }
        finally{
            setShowModal(false);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setPaymentMethods('');
            document.getElementById(user.id).reset();
        }
    };

  return (
    <>
    {showModal && (
                    <div className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50'>
                        <div className='bg-white p-4 rounded shadow-md flex flex-col'>
                            <div className="flex justify-between">
                                <h2 className='text-lg font-bold mb-2'>Update User</h2>
                                <Buttons text={"X"} onClick={handleCloseModal} className={"bg-black"}/>
                            </div>
                            <form className="max-w-md mx-auto flex flex-col">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"  
                                    defaultValue={user.email}  required onChange={(e) => setEmail(e.target.value)}/>
                                    <label for="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"  defaultValue={user.name.split(" ")[0]} required onChange={(e) => setFirstName(e.target.value)}/>
                                        <label for="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"  required 
                                        defaultValue={user.name.split(" ")[1]} onChange={(e) => setLastName(e.target.value)}/>
                                        <label for="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" defaultValue={user.phone}   required onChange={(e) => setPhone(e.target.value)}/>
                                        <label for="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" defaultValue={user.address}  required onChange={(e) => setAddress(e.target.value)}/>
                                        <label for="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <select name="floating_payment_methods" id="floating_payment_methods" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required defaultValue={user.payment_methods} onChange={(e) => setPaymentMethods(e.target.value)}>
                                            <option value="" defaultValue={user.payment_methods}>Select a payment method</option>
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
    
    <div className='bg-gray-800 p-4 rounded-lg shadow-md text-white' id={user.id}>
      <h3 className='text-lg font-semibold'>{user.name}</h3>
      <p className='text-sm'>Email: {user.email}</p>
      <p className='text-sm'>Phone: {user.phone}</p>
      <p className='text-sm'>Address: {user.address}</p>
      <p className='text-sm'>Payment Methods: {user.payment_methods}</p>
      <div className='flex gap-2 mt-2'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={handleUpdate}>
          Update
        </button>
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
          onClick={() => navigate(`/relationships/user/${user.id}`)}
        >
          Visualize
        </button>
      </div>
    </div>
    </>
  )
}

export default UserCard