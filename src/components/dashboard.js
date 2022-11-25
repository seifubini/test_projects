import React from 'react';
import { getUserName } from "../functions";

const Dashboard = ( props ) => {

	const userName = ( getUserName() ) ? getUserName() : '';

	return(
		<div>
			{ userName ? <h2>Welcome { userName }!!</h2>: '' }
		</div>
	)
};

export default Dashboard;