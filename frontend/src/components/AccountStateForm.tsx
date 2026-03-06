import React, { useState } from "react"
import api from "../api/axios"

interface Transaction {
    id: number;
    amount: number;
    toEmail: string;
    fromEmail: string;
    createdAt: string;
}

const AccountStateForm = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [email, setEmail] = useState('')

    const [balance, setBalance] = useState(0)
    const [totalSent, setTotalSent] = useState(0)
    const [totalReceived, setTotalReceived] = useState(0)

    const [loading, setLoading] = useState(false)
    const [warning, setWarning] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validaciones del formulario
        if (!email.trim()) {
            setWarning('El email es obligatorio')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setWarning('El formato del email no es válido')
            return
        }

        setWarning('')
        setLoading(true)

        try {
            const response = await api.get(`/users/${email}/statement`)

            const tx = response.data.transactions

            if (tx.length === 0) {
                setError('No se han realizado transacciones')
            } else {
                setError('')
            }
            setTransactions(tx)

            // calcular valores a mostrar en el balance de la vista
            setBalanceData(tx, response.data.balance)
        } catch (error: any) {
            setError(error.response?.data?.message || 'Ocurrió un error al consultar el estado de las transacciones')
            setTransactions([])
        } finally {
            setLoading(false)
            setTimeout(() => {
                setError('')
            }, 8000)
        }
    }

    const setBalanceData = (transactions: Transaction[], balance: string) => {
        let sent = 0
        let received = 0

        transactions.forEach(transaction => {
            if (transaction.fromEmail === email) {
                sent += Number(transaction.amount)
            }

            if (transaction.toEmail === email) {
                received += Number(transaction.amount)
            }
        })

        setTotalSent(sent)
        setTotalReceived(received)
        setBalance(Number(balance))
    }

    return (
        <div className="flex flex-col justify-center max-w-5xl mx-auto p-6 space-y-6 md:min-h-screen">
            {warning &&
                <p className='my-4 py-2 bg-orange-400 text-white text-center font-medium rounded-lg'>
                    {warning}
                </p>
            }

            {error &&
                <p className='my-4 py-2 bg-red-500 text-white text-center font-medium rounded-lg'>
                    {error}
                </p>
            }

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-5 flex gap-4 items-end">
                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por email
                    </label>

                    <input
                        type="email"
                        placeholder="usuario@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? 'Consultando...' : 'Consultar'}
                </button>

            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-xl p-5">
                    <p className="text-sm text-gray-500">Balance actual</p>
                    <p className="text-2xl font-semibold">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(balance)}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-5">
                    <p className="text-sm text-gray-500">Total enviado</p>
                    <p className="text-2xl font-semibold text-red-600">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalSent)}
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-5">
                    <p className="text-sm text-gray-500">Total recibido</p>
                    <p className="text-2xl font-semibold text-green-600">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalReceived)}
                    </p>
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">
                    Últimas 10 transacciones
                </h2>

                <div className="overflow-x-auto max-h-45">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Origen</th>
                                <th className="px-4 py-3">Destino</th>
                                <th className="px-4 py-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 10).map((transaction) => (
                                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {transaction.createdAt}
                                    </td>
                                    <td className="px-4 py-3">
                                        {transaction.fromEmail}
                                    </td>
                                    <td className="px-4 py-3">
                                        {transaction.toEmail}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP'
                                        }).format(transaction.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AccountStateForm