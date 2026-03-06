import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import SearchTransactionsForm from './components/SearchTransactionsForm'
import CreateTransactionForm from './components/CreateTransactionForm'
import CreateUserForm from './components/CreateUserForm'
import SearchUserForm from './components/SearchUserForm'

function App() {
  return (
    <BrowserRouter>
      <nav className='bg-white shadow-md px-8 py-4 flex flex-col justify-center items-center gap-6 w-full md:fixed md:top-0 md:flex-row'>
        <Link to="/" className='underline underline-offset-2'>
          Crear usuario
        </Link>
        <Link to="/search-user" className='underline underline-offset-3'>
          Buscar usuario
        </Link>
        <Link to="/create-transaction" className='underline underline-offset-3'>
          Crear transferencia
        </Link>
        <Link to="/search-transaction" className='underline underline-offset-3'>
          Buscar transacción
        </Link>
        <Link to="/account-state" className='underline underline-offset-3'>
          Estado de cuenta
        </Link>
      </nav>

      <Routes>
        {/* crear usuario */}
        <Route path='/' element={<CreateUserForm />} />

        {/* busqueda por email */}
        <Route path='/search-user' element={<SearchUserForm />} />

        {/* transferencias */}
        <Route path="/create-transaction" element={<CreateTransactionForm />} />

        {/* buscar transacciones por email */}
        <Route path='/search-transaction' element={<SearchTransactionsForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
