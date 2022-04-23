import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';

const Company = () => {
    // const [company, setCompany] = useState(null);
    const [sendM, setRMoney] = useState(0)
    const [account, setAccount] = useState("not yet");
    const [balance, setBalance] = useState(null);
    const [connect, setConnect] = useState("Not Connected Yet");
    const [ownerbal, setOwnerbal] = useState(0);
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });
    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract("orderBook", provider)
            if (provider) {
                const chainId = await provider.request({
                    method: 'eth_requestAccounts'
                })
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract
                })
            }
            else {
                console.log('Please install MetaMask!')
            }
        }
        loadProvider()
    }, []);
    //getting account
    useEffect(() => {
        const getAccount = async () => {
            const account = await web3Api.web3.eth.getAccounts(); //get ethereum account
            setAccount(account[0]);
        }
        web3Api.web3 && getAccount(); //call when web3 api
    }, [web3Api.web3])

    useEffect(() => {
        const loadBalance = async () => {
            const { contract, web3 } = web3Api;
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, "ether"));
        }
        web3Api.contract && loadBalance();
    }, [web3Api])

    const connectAccount = async () => {
        alert("connect wallet");
        try {
            if (typeof window != null && typeof window.ethereum) {
                window.ethereum.request({ method: "eth_requestAccounts" });
                setConnect(account)
                abc()
            }
            else {
                alert("sry");
            }
        }
        catch (err) {
            alert("not connected yet");
        }

    }
    const regCust = async () => {
        console.log(account);
        const { web3, contract } = web3Api;
        await contract.regCust({
            from: account,
        }
        );
    }


    const buyEnergy = async () => {
        console.log("Triggering the buyEnergy function")
        const { web3, contract } = web3Api;
        console.log("10 units of enery has been deducted from the Owner's Stock.");
        await contract.buy({
            from: account,
            value: web3.utils.toWei(sendM, 'ether'),
        }
        );
    }

    const abc = async () => {
        const { web3, contract } = web3Api;
        let v = await contract.energy({
            from: account,
        }
        );
        console.log(v);
        setOwnerbal(v.words[0])
        console.log(v.words[0]);
    }
    const addEnergy = async () => {
        const { web3, contract } = web3Api;
        await contract.addEnergy({
            from: account,
        }
        );

    }
    return (
        <div className='container'>
            <div className='conntainer-fluid'>
                <div className='form'>
                    <button className='btn' onClick={connectAccount}>
                        connectAccount
                    </button>
                </div>
                <div className='form'>
                    <button className='btn' onClick={regCust}>
                        regCust
                    </button>
                </div>
                <div className='form'>
                    <input type="number" require="true" value={sendM} onChange={e => setRMoney(e.target.value)} />
                    <button className='btn' onClick={buyEnergy}>
                        buyEnergy
                    </button>
                </div>
                <div className='form'>
                    <button className='btn' onClick={abc}>
                        Energy_company
                    </button>
                </div>
                <div className='form'>
                    <button className='btn' onClick={addEnergy}>
                        addEnergy
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Company;