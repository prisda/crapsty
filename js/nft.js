/** @var Web3Modal */
/** @var Web3 */
/** @var Fortmatic */
/** @var WalletConnectProvider */

(() => {
  const nftAddress = '0x2c6e23AAb660912f8973bF8935e2bC3C4fea3D25';
  const ethPricePerToken = 0.1;

  const Web3Modal = window.Web3Modal.default;
  const WalletConnectProvider = window.WalletConnectProvider.default;

  class NFT {
    web3Modal;
    web3;
    account;
    contract;

    /**
     * Connect wallet
     * @returns {Promise<Object>}
     */
    async connectWallet() {
      this.web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          fortmatic: {
            package: Fortmatic,
            options: {
              key: 'pk_test_3E056FF9863F20AB',
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: '4e9d9e3d80b34bc2837e829694826732',
            },
          },
        },
      });

      let provider = await this.web3Modal.connect();

      if (provider.on) {
        provider.on('accountsChanged', accounts => {
          window.location.reload();
        });

        provider.on('chainChanged', chainId => {
          window.location.reload();
        });
      }

      this.web3 = new Web3(provider);
      this.contract = new this.web3.eth.Contract(NFT_ABI, nftAddress);
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
      console.log('Current account:', this.account);
    }

    async disconnectWallet() {
      this.web3Modal.clearCachedProvider();
      window.location.reload();
    }

    /**
     * Buy an NFT.
     * Throws an error if transaction failed.
     * Returns the links to the bought tokens on OpenSea.
     * @returns {Promise<String[]>}
     */
    async buy(amount) {
      const nftBalanceBefore = await this.getNFTBalance();
      console.log('nftBalanceBefore', nftBalanceBefore);

      return await this.contract.methods.buy(amount).
          send({
            from: this.account,
            value: (ethPricePerToken * amount * 1e18).toString(),
          }).
          then(async receipt => {
            if (!receipt.status) {
              throw new Error('The buy failed');
            }

            return new Promise(resolve => {
              const interval = setInterval(async () => {
                const nftBalance = await this.getNFTBalance();
                console.log('nftBalance', nftBalance);
                if (nftBalance > nftBalanceBefore) {
                  clearInterval(interval);

                  const urls = [];

                  for (let i = nftBalanceBefore; i < nftBalance; i++) {
                    const tokenId = await this.contract.methods.tokenOfOwnerByIndex(
                        this.account, i).call();
                    urls.push(
                        `https://opensea.io/assets/${nftAddress}/${tokenId}`);
                  }

                  resolve(urls);
                }
              }, 1000);
            });
          }).
          catch(e => {
            // if user rejected the transaction
            if ([
              // MetaMask
              4001,
              // Fortmatic
              -32603,
            ].indexOf(e.code) !== -1) {
              return [];
            }

            throw e;
          });
    }

    /**
     * Get amount of sold tokens.
     * @returns {Promise<Number>}
     */
    async getAmountSold() {
      return (await this.contract.methods.amountSold().call()).toString() * 1;
    }

    async getRandomNumber() {
      return (await this.contract.methods.randomNumber().call()).toString();
    }

    /**
     * Get ETH balance of the user.
     * @returns {Promise<Number>}
     */
    async getETHBalance() {
      return (await this.web3.eth.getBalance(this.account)).toString() / 1e18;
    }

    /**
     * Get NFT balance of the user.
     * @returns {Promise<Number>}
     */
    async getNFTBalance() {
      return (await this.contract.methods.balanceOf(this.account).
          call()).toString() * 1;
    }

    /**
     * Get tokens of the user.
     * @returns {Promise<{imageUrl, link, name}[]>}
     */
    async getTokensInWallet() {
      const chainId = await this.web3.eth.getChainId();

      const assets = (await fetch('https://' +
          (chainId == 4 ? 'rinkeby-' : '') +
          'api.opensea.io/api/v1/assets?offset=0&limit=50' +
          '&owner=' + this.account +
          '&asset_contract_address=' + this.contract.options.address).
          then(r => r.json())).assets;

      return assets.map(asset => {
        return {
          imageUrl: asset.image_url,
          link: asset.permalink,
          name: asset.name,
        };
      });
    }
  }

  window.NFT = NFT;
})();

