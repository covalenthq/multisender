import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

let getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async function () {
      var results

      const web3Provider = await detectEthereumProvider()

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (web3Provider) {
        // Use Mist/MetaMask's provider.
        const web3Instance = new Web3(web3Provider);

        ethereum.request({ method: 'eth_chainId' }).then((netIdHex) =>
        {
          let netIdName, trustApiName, explorerUrl;
          const netId = web3Instance.utils.hexToNumber(netIdHex);
          console.log('netId', netId);
          switch (netId) {
            case 1:
              netIdName = 'Foundation'
              trustApiName = 'api'
              explorerUrl = 'https://etherscan.io'
              console.log('This is Foundation', netId)
              break;
            case 3:
              netIdName = 'Ropsten'
              trustApiName = 'ropsten'
              explorerUrl = 'https://ropsten.etherscan.io'
              console.log('This is Ropsten', netId)
              break;
            case 4:
              netIdName = 'Rinkeby'
              trustApiName = 'rinkeby'
              explorerUrl = 'https://rinkeby.etherscan.io'
              console.log('This is Rinkeby', netId)
              break;
            case 42:
              netIdName = 'Kovan'
              trustApiName = 'kovan'
              explorerUrl = 'https://kovan.etherscan.io'
              console.log('This is Kovan', netId)
              break;
            case 99:
              netIdName = 'POA Core'
              trustApiName = 'poa'
              explorerUrl = 'https://poaexplorer.com'
              console.log('This is Core', netId)
              break;
            case 77:
              netIdName = 'POA Sokol'
              trustApiName = 'https://trust-sokol.herokuapp.com'
              explorerUrl = 'https://sokol.poaexplorer.com'
              console.log('This is Sokol', netId)
              break;
            default:
              netIdName = 'Unknown'
              console.log('This is an unknown network.', netId)
          }
          document.title = `${netIdName} - MultiSender dApp`

          var defaultAccount = null;

          ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) =>  {
            if (accounts.length === 0) {
              // MetaMask is locked or the user has not connected any accounts
              console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== defaultAccount) {
              defaultAccount = accounts[0];
              // Do any other work!
            }
            if(defaultAccount === null){
              reject({message: 'Please unlock your metamask and refresh the page'})
            }
            results = {
              web3Instance,
              netIdName,
              netId,
              injectedWeb3: true,
              defaultAccount,
              trustApiName,
              explorerUrl
            }
            resolve(results)
          })
          .catch((err) => {
            // Some unexpected error.
            // For backwards compatibility reasons, if no accounts are available,
            // eth_accounts will return an empty array.
            console.error(err);
          });          

        })

        console.log('Injected web3 detected.');

      } else {
        // Fallback to localhost if no web3 injection.
        const errorMsg = `Metamask is not installed. Please go to
        https://metamask.io and return to this page after you installed it`
        reject({message: errorMsg})
        console.log('No web3 instance injected, using Local web3.');
        console.error('Metamask not found'); 
      }
    })
  })
}

export default getWeb3
