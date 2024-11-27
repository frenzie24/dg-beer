import React, { useState, useEffect } from 'react';

const Dashboard = ({round, name, role, roundsRemaining}) => {
    return (
        <>
            <div className='flex flex-row flex-wrap justify-between p-4'>
                <h1 className="text-4xl font-bold mb-4"> Beer Game</h1>
                <h1 className="text-4xl font-bold mb-4">Round: {round + 1}</h1>
                <h1 className="text-4xl font-bold mb-4">Rounds Remaining: {roundsRemaining}</h1>
            </div>

        </>
    )
}

export default Dashboard;