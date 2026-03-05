import React, { useState } from 'react'

import api from '../api/axios'

interface User {
    id: number,
    name: string,
    email: string,
    initialBalance: number
}

const SearchUser = () => {
    const [email, setEmail] = useState('')
    const [user, setUser] = useState<User | null>(null)

    const [loading, setLoading] = useState(false)
    const [warning, setWarning] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWarning('')
        setEmail(e.target.value)
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

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
            const response = await api.get(`/users/${email}`)

            setError('')
            setUser(response.data)
        } catch(error: any) {
            console.error('Error: ', error)

            setUser(null)
            setError(error.response?.data?.message || 'No se ha obtenido información del usuario.')
        } finally {
            setLoading(false)
            setTimeout(() => setError(''), 8000)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    BUSCAR USUARIO
                </h2>

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
                            type="email"
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

                {user && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <p className="flex">
                                <span className="flex-1 font-medium text-gray-800">ID:</span>
                                <span className="flex-1">{user.id}</span>
                            </p>
                            <p className="flex">
                                <span className="flex-1 font-medium text-gray-800">Nombre:</span>
                                <span className="flex-1">{user.name}</span>
                            </p>
                            <p className="flex">
                                <span className="flex-1 font-medium text-gray-800">Email:</span>
                                <span className="flex-1">{user.email}</span>
                            </p>
                            <p className="flex">
                                <span className="flex-1 font-medium text-gray-800">Saldo Inicial:</span>
                                <span className="flex-1">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(user.initialBalance)}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchUser