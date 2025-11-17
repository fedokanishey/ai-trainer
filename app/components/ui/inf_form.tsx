"use client";
import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
};

type FormValues = {
  age: string;
  height: string;
  weight: string;
  injuries: string;
  workout_days: string;
  fitness_goal: string;
  fitness_level: string;
  dietary_restrictions?: string;
  gender: string;
  additional_instructions: string;
  sports: string;
  measurement_unit: string;
};

const DEFAULTS: FormValues = {
  age: "",
  height: "",
  weight: "",
  injuries: "",
  workout_days: "",
  fitness_goal: "Weight Loss",
  fitness_level: "Intermediate",
  dietary_restrictions: "",
  gender: "Male",
  additional_instructions: "",
  sports: "",
  measurement_unit: "grams",
};

export default function ModalForm({ open, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<FormValues>(DEFAULTS);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("fitnessForm");
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<FormValues>;
          setValues({ ...DEFAULTS, ...parsed });
        } else {
          setValues(DEFAULTS);
        }
      } catch {
        setValues(DEFAULTS);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      localStorage.setItem("fitnessForm", JSON.stringify(data));
    } catch {}
    onSubmit(data);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center overflow-hidden justify-center bg-black/70 backdrop-blur-sm max-h-screen"
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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                name="age"
                type="number"
                placeholder="e.g., 30"
                required
                value={values.age}
                onChange={handleChange}
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
                value={values.height}
                onChange={handleChange}
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
                value={values.weight}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Injuries</label>
              <input
                name="injuries"
                type="text"
                placeholder="e.g., knee pain"
                value={values.injuries}
                onChange={handleChange}
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
                value={values.workout_days}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Fitness Goal</label>
              <select
                name="fitness_goal"
                aria-label="Fitness Goal"
                value={values.fitness_goal}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Endurance">Endurance</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Fitness Level</label>
              <select
                name="fitness_level"
                aria-label="Fitness Level"
                value={values.fitness_level}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
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
                value={values.dietary_restrictions ?? ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                name="gender"
                aria-label="Gender"
                value={values.gender}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Measurement Unit */}
            <div>
              <label className="block text-sm font-medium">Measurement Unit</label>
              <input
                name="measurement_unit"
                type="text"
                placeholder="e.g., grams"
                value={values.measurement_unit}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Favorite Sports */}
          <div>
            <label className="block text-sm font-medium">Favorite/Practiced Sports</label>
            <textarea
              name="sports"
              placeholder="e.g., football, swimming"
              value={values.sports}
              onChange={handleChange}
              className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-20"
            />
          </div>

          {/* Additional Instructions */}
          <div>
            <label className="block text-sm font-medium">Additional Instructions</label>
            <textarea
              name="additional_instructions"
              placeholder="Any extra preferences or constraints..."
              value={values.additional_instructions}
              onChange={handleChange}
              className="mt-1 w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-20"
            />
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
