import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

const chainsById = {
  1: {
    name: 'Mainnet',
    trustApiName: 'api',
    explorerUrl: 'https://etherscan.io',
  },

  3: {
    name: 'Ropsten',
    trustApiName: 'ropsten',
    explorerUrl: 'https://ropsten.etherscan.io',
  },

  4: {
    name: 'Rinkeby',
    trustApiName: 'rinkeby',
    explorerUrl: 'https://rinkeby.etherscan.io',
  },

  42: {
    name: 'Kovan',
    trustApiName: 'kovan',
    explorerUrl: 'https://kovan.etherscan.io',
  },

  99: {
    name: 'POA Core',
    trustApiName: 'poa',
    explorerUrl: 'https://poaexplorer.com',
  },

  77: {
    name: 'POA Sokol',
    trustApiName: 'https://trust-sokol.herokuapp.com',
    explorerUrl: 'https://sokol.poaexplorer.com',
  }
};

let getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async function () {
      const web3Provider = await detectEthereumProvider()

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (!web3Provider) {
        // Fallback to localhost if no web3 injection.
        const errorMsg = `Metamask is not installed. Please go to
        https://metamask.io and return to this page after you installed it`
        reject({message: errorMsg})
        console.log('No web3 instance injected, using Local web3.');
        console.error('Metamask not found');
        return;
      }
      // Use Mist/MetaMask's provider.
      const web3Instance = new Web3(web3Provider);

      let netIdHex = await ethereum.request({ method: 'eth_chainId' })

      const netId = web3Instance.utils.hexToNumber(netIdHex);
      console.log('netId', netId);

      const netDetails = chainsById[netId];

      if (netDetails === undefined) {
        reject({message: `${netIdHex} is an unknown network.`})
        return
      }

      console.log(`Chain is ${netDetails.name}`);

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        reject({message: 'Please connect to MetaMask.'})
        return
      }

      const defaultAccount = accounts[0]

      if(defaultAccount === null){
        reject({message: 'Please unlock your metamask and refresh the page.'})
        return
      }

      document.title = `${netDetails.name} - MultiSender dApp`

      resolve({
        web3Instance,
        netIdName: netDetails.name,
        netId: netId.toString(),
        injectedWeb3: true,
        defaultAccount,
        trustApiName: netDetails.trustApiName,
        explorerUrl: netDetails.explorerUrl
      })

      console.log('Injected web3 detected.');
    })
  })
}

export default getWeb3
