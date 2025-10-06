import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass w-full px-6 py-4 flex items-center justify-between text-slate-100 text-[15px] border border-cyan-200/10 shadow-lg shadow-cyan-500/10">
        <div className="navbar__logo heading-neon text-2xl tracking-tight">
            <Link to="/users">Graph Explorer</Link>
        </div>
        <ul className="navbar__links flex gap-6">
            <li><Link className="hover:text-cyan-300 transition-colors" to="/users">Users</Link></li>
            <li><Link className="hover:text-cyan-300 transition-colors" to="/transactions">Transactions</Link></li>
            {/* <li><Link to="/relationships">Relationships</Link></li> */}
        </ul>
    </nav>    ) 
}
    
export default Navbar   