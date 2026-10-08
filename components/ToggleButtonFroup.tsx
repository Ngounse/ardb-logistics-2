'use client';

import { useState } from 'react';

export default function PlatformToggle() {
    const [selected, setSelected] = useState('web');

    const options = ['web', 'android', 'ios'];

    return (
        <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`px-4 py-2 text-sm font-medium transition
            ${selected === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}