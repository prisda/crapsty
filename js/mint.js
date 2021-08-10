(() => {
  const nft = new NFT();

  window.addEventListener('load', async () => {
    const loginButton = document.querySelector('#btn-login');
    loginButton.addEventListener('click', async () => {
      await nft.connectWallet();
      await afterLogin();
    });

    const logoutButton = document.querySelector('#btn-logout');
    logoutButton.addEventListener('click', async () => {
      await nft.disconnectWallet();
    });

    await nft.connectWallet();
    await afterLogin();
  });

  async function afterLogin() {
    const loginButton = document.querySelector('#btn-login');
    const logoutButton = document.querySelector('#btn-logout');
    const outputAccount = document.querySelector('#account');
    // outputAccount.textContent = nft.account;

    loginButton.style.display = "none";
    logoutButton.style.display = "";

    const selectBuyAmount = document.querySelector('#select-buy-amount');
    const buyButton = document.querySelector('#btn-buy');
    const dvResult = document.querySelector('#dv-result');
    buyButton.addEventListener('click', async () => {
      await nft.buy(selectBuyAmount.selectedOptions[0].value).
          then(openSeaURLs => {
            if (openSeaURLs.length){
              var str = '';
              for (const openUrl of openSeaURLs) {
                str += '<div id="w-node-_75e54c22-6c7b-67d1-b079-c8435ab11e22-a84748e5" class="my-card-title">\
                    <div class="cards-image-mask"><a href="'+ openUrl +'" target="_blank"><img src="'+ openUrl +'" alt="" class="cards-image"><img src="'+ openUrl +'" alt="" class="cards-image"><img src="'+ openUrl +'" alt="" class="cards-image"></a></div>\
                  </div>';
              }S
               alert('Buy successfull!');
              // console.log( openSeaURLs);
              dvResult.innerHTML = str;
            }
          });
    });

    // const outputAmountSold = document.querySelector('#amount-sold');
    // outputAmountSold.textContent = await nft.getAmountSold();

    console.log('ETH balance of the user:', await nft.getETHBalance());
    console.log('NFT balance of the user:', await nft.getNFTBalance());
    // console.log(await nft.contract.methods.tokenURI(1).call());
  }
})();