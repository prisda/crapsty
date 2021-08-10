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
    const frensCount = document.querySelector('#frens-count');
    
    outputAccount.textContent = nft.account.substring(0, 6) +'...'+ nft.account.substring(nft.account.length - 4);

    loginButton.style.display = "none";
    logoutButton.style.display = "";

    const tokens = await nft.getTokensInWallet();
    const outputMyTokens = document.querySelector('#output-my-tokens');
    frensCount.innerHTML = tokens.length;
    for (const token of tokens) {
      outputMyTokens.innerHTML += `
      <div id="w-node-_75e54c22-6c7b-67d1-b079-c8435ab11e22-a84748e5" class="my-card-title">
          <div class="cards-image-mask"><a href="${token.link}" target="_blank"><img src="${token.imageUrl}" alt="" class="cards-image"><img src="${token.imageUrl}" alt="" class="cards-image"><img src="${token.imageUrl}" alt="" class="cards-image"></a></div>
          <h3 class="my-card-desc">${token.name}</h3>
        </div>
      `;
    }
  }
})();