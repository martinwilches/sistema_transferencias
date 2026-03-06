import React, { useState } from 'react'

import api from '../api/axios'

// interfaz de los datos del formulario
interface FormData {
    name: string;
    email: string;
    initialBalance: number | string;
}

const CreateUserForm = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        initialBalance: ''
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
        const { name, email, initialBalance } = formData

        if (!name.trim()) {
            setWarning('El nombre es obligatorio')
            return
        }

        if (!email.trim()) {
            setWarning('El email es obligatorio')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setWarning('El formato del email no es válido')
            return
        }

        if (!email.trim()) {
            setWarning('El email es obligatorio')
            return
        }

        const balanceNumber = Number(initialBalance)
        if (isNaN(balanceNumber) || balanceNumber <= 0) {
            setWarning('El saldo inicial debe ser mayor a 0')
            return
        }

        setWarning('') // limpiar advertencias de la validación del formulario
        setLoading(true)

        try {
            await api.post('/users', formData)

            setError('')
            setMessage('Usuario creado correctamente.')

            // limpiar la información previamente cargada en el formulario
            setFormData({
                name: '',
                email: '',
                initialBalance: ''
            })
        } catch (error: any) {
            console.error('Error: ', error)

            setError(error.response?.data?.message || 'Ocurrio un error al crear el usuario. Intentelo nuevamente.')
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
        <div className="flex items-center justify-center bg-gray-100 md:min-h-screen">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    CREAR USUARIO
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
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Juan Peréz"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="correo@mail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Saldo Inicial
                        </label>
                        <input
                            type="number"
                            name="initialBalance"
                            value={formData.initialBalance}
                            placeholder="0.00"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? 'Creando...' : 'Crear usuario'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateUserForm