import React from 'react';

//headers should be a 1d array
const Table = ({ headers, data }) => {
    return (

            <table className= 'text-base w-full' cellPadding="2">
                <thead className=' w-full'>
                    <tr className='text-center'>
                        {headers.map((header, index) => {
                             const rowClassString = index % 2 != 1 ? 'text-left' : 'text-right'
                            return <th className={rowClassString} key={index} >{header} </th>
                        })}

                    </tr>
                </thead>
                <tbody className='text-sm w-full'>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {row.map((col, index) => {
                                const colClassString = index % 2 != 1 ? 'text-left' : 'text-right'
                                return <td className={colClassString} key={index}> {col}</td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>


    );
};

export default Table;
