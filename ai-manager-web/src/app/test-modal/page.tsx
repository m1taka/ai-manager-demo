'use client';

import React, { useState } from 'react';
import { Modal, Button } from '../components/ui';

export default function TestModalPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Modal Test Page</h1>
      
      <Button onClick={() => setIsOpen(true)}>
        Open Test Modal
      </Button>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>Modal state: {isOpen ? 'Open' : 'Closed'}</p>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Test Modal"
        size="md"
      >
        <div className="space-y-4">
          <p>This is a test modal to verify modal functionality.</p>
          <p>If you can see this, the modal is working correctly!</p>
          
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => alert('Test button clicked!')}>
              Test Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}