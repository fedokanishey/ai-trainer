import React from 'react'
import { generateFitnessPlan } from "./ai"
const Program = () =>
{
    const plan =  generateFitnessPlan({age: 30,fitness_goal: "Weight Loss",fitness_level: "Intermediate",height: "170",injuries: "",weight: "60",workout_days: "4"});

return (
    
    <div>
        generated program:
        {plan}
    </div>
)
}

export default Program
