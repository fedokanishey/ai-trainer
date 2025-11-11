"use client";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
};

export default function ModalForm({ open, onClose, onSubmit }: Props) {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    onSubmit(data);
    onClose(); 
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); 
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-gray-900 p-6 text-gray-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-700 pb-3">
          <h3 className="text-xl font-semibold">Fitness Information Form</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                name="age"
                type="number"
                placeholder="e.g., 30"
                required
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input
                name="height"
                type="number"
                placeholder="e.g., 170 (cm)"
                required
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                placeholder="e.g., 60 (kg)"
                required
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Injuries</label>
              <input
                name="injuries"
                type="text"
                placeholder="e.g., knee pain"
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Workout Days per Week
              </label>
              <input
                name="workout_days"
                type="number"
                placeholder="e.g., 5 (days a week)"
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Fitness Goal</label>
              <select
                name="fitness_goal"
                aria-label="Fitness Goal"
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Endurance</option>
                <option>General Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Fitness Level</label>
              <select
                name="fitness_level"
                aria-label="Fitness Level"
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Dietary Restrictions
              </label>
              <input
                name="dietary_restrictions"
                type="text"
                placeholder="e.g., vegetarian"
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
