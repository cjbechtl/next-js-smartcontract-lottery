import { ConnectButton } from "web3uikit";

import React from "react";

function Header() {
	return (
		<div className="border-b-2 flex flex-row">
			<h1 className="py-4 px-4 font-bold text-3xl">Decentralized Lottery</h1>
			<div className="ml-auto py-4 px-4">
				<ConnectButton moralisAuth={false} />
			</div>
		</div>
	);
}

export default Header;
