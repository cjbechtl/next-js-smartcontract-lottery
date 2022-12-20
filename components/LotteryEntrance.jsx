import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const [entranceFee, setEntranceFee] = useState("0");
	const [numPlayers, setNumPlayers] = useState("0");
	const [recentWinner, setRecentWinner] = useState("0x");
	const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

	const dispatch = useNotification();

	const {
		runContractFunction: enterRaffle,
		isLoading,
		isFetching,
	} = useWeb3Contract({
		abi,
		contractAddress: raffleAddress,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi,
		contractAddress: raffleAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	});

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi,
		contractAddress: raffleAddress,
		functionName: "getRecentWinner",
		params: {},
	});

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const updateUI = async () => {
		const entranceFeeFromCall = (await getEntranceFee()).toString();
		const numPlayersFromCall = (await getNumberOfPlayers()).toString();
		const recentWinnerFromCall = (await getRecentWinner()).toString();
		setEntranceFee(entranceFeeFromCall);
		setNumPlayers(numPlayersFromCall);
		setRecentWinner(recentWinnerFromCall);
	};

	const handleNewNotification = () => {
		dispatch({
			type: "success",
			message: "transaction complete!",
			title: "Tx Notivication",
			position: "topR",
		});
	};

	const handleSuccess = async (tx) => {
		await tx.wait(1); // onSuccess only checks it was sent to MM, so we need to wait for a confirmation here
		handleNewNotification(tx);
		updateUI();
	};

	return (
		<div className="p-5">
			{raffleAddress ? (
				<div>
					<div>
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
							onClick={async () => {
								await enterRaffle({
									onSuccess: handleSuccess,
									onError: (error) => console.log(error),
								});
							}}
							disabled={isFetching || isLoading}
						>
							{isFetching || isLoading ? (
								<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
							) : (
								<div>Enter Raffle</div>
							)}
						</button>
					</div>
					<div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
					<div>Number of Players: {numPlayers}</div>
					<div>Recent Winner: {recentWinner}</div>
				</div>
			) : (
				<div>No Raffle Address Detected</div>
			)}
		</div>
	);
}

export default LotteryEntrance;
