import React, {useState} from 'react'
import generateFakePromotions from '../generateFakePromotions'

const PromotionsTable = () => {
    const [promotions] = useState(generateFakePromotions(10))

    return (
        <>
            <h1>Promotions</h1>
            <table>
                <thead>
                <tr>
                    <th>Promotion name</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>User Group Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    promotions.map(({promotionName, type, startDate, endDate, userGroupName}, i) => {
                        return (
                            <tr key={i}>
                                <td>{promotionName}</td>
                                <td>{type}</td>
                                <td>{startDate.toISOString()}</td>
                                <td>{endDate.toISOString()}</td>
                                <td>{userGroupName}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}

export default PromotionsTable