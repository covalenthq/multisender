import ERC20ABI from './ERC20ABI'
export {
  getTokenDecimals
}
const getTokenDecimals = async ({web3Instance, tokenAddress}) => {
  const token = new web3Instance.eth.Contract(ERC20ABI, tokenAddress);
  return await token.methods.decimals().call();
}
