"use client"
import React, { useState } from 'react'
import ConfirmModal from '@/shared/common/ConfirmModal'

export const Button = ({ name }: { name: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        See name
      </button>

      <ConfirmModal
        open={isModalOpen}
        title="Name Info"
        message={`name is: ${name}`}
        type="alert"
        onConfirm={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}

