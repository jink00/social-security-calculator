import Link from 'next/link'
import React from 'react'

interface CardProps {
  title: string
  description: string
  href: string
  icon?: React.ReactNode
}

export default function Card({ title, description, href, icon }: CardProps) {
  return (
    <Link href={href} className="block">
      <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div className="relative z-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
            {title}
          </h3>
          <p className="text-gray-600 group-hover:text-gray-700">
            {description}
          </p>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  )
}