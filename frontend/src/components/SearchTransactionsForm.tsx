import React, { useState } from "react"
import api from "../api/axios"

interface Transaction {
    id: number;
    amount: number;
    toEmail: string;
    fromEmail: string;
    createdAt: string;
}

const SearchTransactionsForm = () => {
    const [email, setEmail] = useState('')
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [warning, setWarning] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWarning('')
        setEmail(e.target.value)
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validaciones del formulario
        if (!email.trim()) {
            setWarning('El email es obligatorio')
            return
        }

        setWarning('')
        setLoading(true)

        try {
            const response = await api.get(`/transactions?email=${email}`)

            setError('')

            setTransactions(response.data)
        } catch (error: any) {
            setTransactions([])
            setError(error.response?.data?.message || 'Ocurrió un error al consultar las transacciones')
        } finally {
            setLoading(false)
            setTimeout(() => {
                setError('')
                setWarning('')
            }, 8000)
        }
    }

    const handleRevertTransaction = async (id: number) => {
        try {
            const response = await api.put('/transactions/revert', {
                transactionId: id
            })

            const updateTransactions = transactions.filter(t => t.id !== response.data.id)
            setTransactions(updateTransactions)

            setMessage('Transacción revertida exitosamente')
        } catch(error: any) {
            setError(error.response?.data?.message || 'Ocurrió un error al intentar revertir la transacción')
        }
    }

    // validar si la transaccion fue creada durante los ultimos 5 minutos
    const isRevertible = (createdAt: string): boolean => {
        const transactionDate = new Date(createdAt).getTime()
        const now = new Date().getTime()
        const diffInMinutes = (now - transactionDate) / 1000 / 60

        return diffInMinutes <= 1
    }

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6 md:min-h-screen">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    BUSCAR TRANSACCIONES
                </h2>

                {message &&
                    <p className='my-4 py-2 bg-green-500 text-white text-center font-medium rounded-lg'>
                        {message}
                    </p>
                }

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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email del usuario
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            placeholder="correo@mail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {transactions.length > 0 && (
                    <div className="overflow-x-auto mt-6 rounded-xl max-h-62.5">
                        <table className="min-w-full text-sm text-left text-gray-600">

                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Origen</th>
                                    <th className="px-6 py-3">Destino</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                    <th className="px-6 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className="bg-white border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {transaction.createdAt}
                                        </td>

                                        <td className="px-6 py-4">
                                            {transaction.fromEmail}
                                        </td>

                                        <td className="px-6 py-4">
                                            {transaction.toEmail}
                                        </td>

                                        <td className="px-6 py-4 text-right font-medium">
                                            {new Intl.NumberFormat('es-CO', {
                                                style: 'currency',
                                                currency: 'COP'
                                            }).format(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isRevertible(transaction.createdAt) && (
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200n"
                                                    onClick={() => handleRevertTransaction(transaction.id)}
                                                >
                                                    Revertir
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchTransactionsForm