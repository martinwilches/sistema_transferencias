import React, { useState } from "react"
import api from "../api/axios";

interface FormData {
    fromEmail: string;
    toEmail: string;
    amount: number | string;
}

const CreateTransactionForm = () => {
    const [formData, setFormData] = useState<FormData>({
        fromEmail: '',
        toEmail: '',
        amount: ''
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [warning, setWarning] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setWarning('')

        // actualizar el `formData` con los datos ingresados por el usuario en el input correspondiente
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validaciones del formulario
        const { fromEmail, toEmail, amount } = formData

        if (!fromEmail.trim()) {
            setWarning('El email origen es obligatorio')
            return
        }

        if (!toEmail.trim()) {
            setWarning('El email destino es obligatorio')
            return
        }

        const amountNumber = Number(amount)
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setWarning('El monto de la transacción debe ser mayor a 0')
            return
        }

        setWarning('')
        setLoading(true)

        try {
            await api.post('/transactions', formData)

            setError('')
            setMessage('Transacción creada correctamente')

            setFormData({
                fromEmail: '',
                toEmail: '',
                amount: ''
            })
        } catch(error: any) {
            console.error('Error: ', error)

            setError(error.response?.data?.message || 'Ocurrió un error al crear la transacción')
        } finally {
            setLoading(false)
            resetMessages()
        }
    }

    const resetMessages = () => {
        setTimeout(() => {
            setError('')
            setMessage('')
        }, 8000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    CREAR TRANSACCIÓN
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
                            Email origen
                        </label>
                        <input
                            type="email"
                            name="fromEmail"
                            value={formData.fromEmail}
                            placeholder="origen@mail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email destino
                        </label>
                        <input
                            type="email"
                            name="toEmail"
                            value={formData.toEmail}
                            placeholder="destino@mail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            placeholder="0.00"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        { loading ? 'Creando...' : 'Crear Transacción' }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateTransactionForm