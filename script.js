let vaultItems = [];
let vaultOrder = [];

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event, target) {
  event.preventDefault();
  const itemId = event.dataTransfer.getData("text/plain");
  const draggedItem = document.getElementById(itemId);

  if (target === "vault") {
    event.currentTarget.appendChild(draggedItem);
    if (!vaultItems.includes(itemId)) {
      vaultItems.push(itemId);
      vaultOrder.push(itemId);
    }
  } else {
    document.getElementById("itemsContainer").appendChild(draggedItem);
    vaultItems = vaultItems.filter(id => id !== itemId);
    vaultOrder = vaultOrder.filter(id => id !== itemId);
  }

  updateVaultStatus();
}

function updateVaultStatus() {
    const vault = document.getElementById("vaultImg");
    const message = document.getElementById("message");
    const vaultStatus = document.getElementById("vaultStatus");
  
    const userKeyPresent = vaultItems.includes("userKey");
    const theyaKeyPresent = vaultItems.includes("theyaKey");
    const tbaKeyPresent = vaultItems.includes("tbaKey");
    const descriptorPresent = vaultItems.includes("descriptor");
  
    let isUnlocked = false;
    let scenarioMessage = "Vault is locked.";
    let statusMessage = "LOCKED";
  
    if (vaultItems.length === 2) {
      if (
        vaultOrder[0] === "userKey" &&
        (vaultOrder[1] === "theyaKey" || vaultOrder[1] === "tbaKey")
      ) {
        isUnlocked = true;
        scenarioMessage = "Vault is unlocked! Correct 2-key order used.";
        statusMessage = "UNLOCKED";
      }
    }
  
    if (!userKeyPresent && theyaKeyPresent && tbaKeyPresent && descriptorPresent) {
      isUnlocked = true;
      scenarioMessage = "Vault is unlocked by Theya + TBA + Descriptor (sovereign recovery).";
      statusMessage = "UNLOCKED";
    }
  
    if (isUnlocked) {
      vault.classList.remove("locked");
      vault.classList.add("unlocked");
      vaultStatus.style.color = "green";
    } else {
      vault.classList.remove("unlocked");
      vault.classList.add("locked");
      vaultStatus.style.color = "red";
    }
  
    message.textContent = scenarioMessage;
    vaultStatus.textContent = statusMessage;
  }

function resetDemo() {
  vaultItems = [];
  vaultOrder = [];

  const itemsContainer = document.getElementById("itemsContainer");
  const itemIds = ["userKey", "theyaKey", "tbaKey", "descriptor"];
  for (let itemId of itemIds) {
    const itemElement = document.getElementById(itemId);
    itemsContainer.appendChild(itemElement);
  }

  updateVaultStatus();
}