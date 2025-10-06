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
        <div className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 px-4'>
            <div className='modal-panel p-6 md:p-7 flex flex-col min-w-[320px] max-w-lg w-full'>
                <div className="flex justify-between items-center pb-3 border-b border-cyan-300/20">
                    <h2 className='text-xl font-semibold heading-neon'>Update User</h2>
                    <Buttons text={"X"} onClick={handleCloseModal} className={'btn-ghost !px-3 !py-2'}/>
                </div>
                <form className="max-w-md mx-auto flex flex-col w-full space-y-5 mt-5" onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full group">
                        <input type="email" name="floating_email" id="floating_email" className="input-field bg-transparent border border-cyan-300/40 peer"  defaultValue={user.email}  required onChange={(e) => setEmail(e.target.value)}/>
                        <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6 gap-5">
                        <div className="relative z-0 w-full group">
                            <input type="text" name="floating_first_name" id="floating_first_name" className="input-field bg-transparent border border-cyan-300/40 peer"  defaultValue={user.name.split(" ")[0]} required onChange={(e) => setFirstName(e.target.value)}/>
                            <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input type="text" name="floating_last_name" id="floating_last_name" className="input-field bg-transparent border border-cyan-300/40 peer"  required 
                            defaultValue={user.name.split(" ")[1]} onChange={(e) => setLastName(e.target.value)}/>
                            <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin/[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6 gap-5">
                        <div className="relative z-0 w-full group">
                            <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="input-field bg-transparent border border-cyan-300/40 peer" defaultValue={user.phone}   required onChange={(e) => setPhone(e.target.value)}/>
                            <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin/[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input type="text" name="floating_company" id="floating_company" className="input-field bg-transparent border border-cyan-300/40 peer" defaultValue={user.address}  required onChange={(e) => setAddress(e.target.value)}/>
                            <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin/[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
                        </div>
                        <div className="relative z-0 w-full group md:col-span-2">
                            <select name="floating_payment_methods" id="floating_payment_methods" className="input-field bg-transparent border border-cyan-300/40 peer" required defaultValue={user.payment_methods} onChange={(e) => setPaymentMethods(e.target.value)}>
                                <option value="" defaultValue={user.payment_methods}>Select a payment method</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="UPI">UPI</option>
                            </select>
                            <label htmlFor="floating_payment_methods" className="peer-focus:font-medium absolute text-sm text-cyan-200/70 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin/[0] peer-focus:start-0 peer-focus:text-cyan-200/90 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Payment Methods</label>
                        </div>
                    </div>
                    <div className='flex justify-end gap-3'>
                        <Buttons text={"Cancel"} onClick={handleCloseModal} className={'btn-ghost'} />
                        <button type="submit" className="btn-elevated px-6">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    <div className='surface-panel p-5 rounded-2xl text-slate-100 flex flex-col gap-3 border border-cyan-400/10 shadow-lg shadow-cyan-900/20 transition-transform hover:-translate-y-1' id={user.id}>
      <div>
        <h3 className='text-xl font-semibold'>{user.name}</h3>
        <p className='text-xs uppercase tracking-[0.35em] text-cyan-200/60 mt-1'>User #{user.id}</p>
      </div>
      <div className='space-y-1 text-sm text-slate-200/80'>
        <p><span className='text-cyan-200/80 mr-1'>Email:</span>{user.email}</p>
        <p><span className='text-cyan-200/80 mr-1'>Phone:</span>{user.phone}</p>
        <p><span className='text-cyan-200/80 mr-1'>Address:</span>{user.address}</p>
        <p><span className='text-cyan-200/80 mr-1'>Payment:</span>{user.payment_methods}</p>
      </div>
      <div className='flex gap-3 mt-auto pt-2'>
        <button className='btn-elevated px-4 py-2 text-sm' onClick={handleUpdate}>
          Update
        </button>
        <button
          className='btn-danger px-4 py-2 text-sm'
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