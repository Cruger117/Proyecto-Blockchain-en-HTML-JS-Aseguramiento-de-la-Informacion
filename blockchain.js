class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), {usuario: "Sistema", mensaje: "Genesis Block"}, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// 🚀 Blockchain global
let myBlockchain = new Blockchain();

// 🔹 Usuario actual
let currentUser = "Invitado";

// 🔑 Login como administrador
function loginAdmin() {
  const pass = prompt("Introduce la contraseña de Administrador:");
  if (pass === "12345") {
    currentUser = "Administrador";
    document.getElementById("currentUser").innerHTML = "Usuario actual: <b>Administrador</b>";
    alert("✅ Sesión iniciada como Administrador");
  } else {
    alert("❌ Contraseña incorrecta");
  }
}

// 🙋 Login como invitado
function loginInvitado() {
  currentUser = "Invitado";
  document.getElementById("currentUser").innerHTML = "Usuario actual: <b>Invitado</b>";
  alert("Sesión iniciada como Invitado");
}

// ➕ Agregar bloque con usuario activo
function agregarBloque() {
  const input = document.getElementById("dataInput");
  const data = input.value.trim();

  if (!data) {
    alert("⚠️ Por favor ingresa datos para el bloque.");
    return;
  }

  const payload = { usuario: currentUser, mensaje: data };
  myBlockchain.addBlock(new Block(myBlockchain.chain.length, Date.now(), payload));
  alert("✅ Bloque agregado por " + currentUser);
  input.value = "";
}

// 📜 Mostrar la blockchain
function mostrarCadena() {
  const output = document.getElementById("output");
  output.innerHTML = "<h2>Blockchain Completa</h2>";
  myBlockchain.chain.forEach(block => {
    output.innerHTML += `
      <div class="block">
        <p><b>Index:</b> ${block.index}</p>
        <p><b>Timestamp:</b> ${new Date(block.timestamp).toLocaleString()}</p>
        <p><b>Usuario:</b> ${block.data.usuario}</p>
        <p><b>Mensaje:</b> ${block.data.mensaje}</p>
        <p><b>Hash:</b> ${block.hash}</p>
        <p><b>Prev Hash:</b> ${block.previousHash}</p>
      </div>
    `;
  });
}

// ✅ Verificar la cadena
function verificarCadena() {
  const output = document.getElementById("output");
  if (myBlockchain.isChainValid()) {
    output.innerHTML = "<h2 class='valido'>✔ La cadena es válida</h2>";
  } else {
    output.innerHTML = "<h2 class='invalido'>✖ La cadena fue alterada</h2>";
  }
}

// 💀 Forzar alteración en la cadena
function alterarCadena() {
  if (myBlockchain.chain.length > 1) {
    // Tomamos el segundo bloque (index 1) y lo modificamos
    myBlockchain.chain[1].data.mensaje = "🔥 HACKED DATA 🔥";
    alert("⚠️ La cadena fue manipulada de forma maliciosa");
  } else {
    alert("La cadena no tiene bloques suficientes para alterar");
  }
}

// 🧹 Limpiar la cadena (mantener solo el bloque génesis)
function limpiarCadena() {
  if (myBlockchain.chain.length > 1) {
    myBlockchain.chain = [myBlockchain.createGenesisBlock()];
    alert("🧹 La cadena fue limpiada (solo queda el bloque génesis)");
    document.getElementById("output").innerHTML = "";
  } else {
    alert("La cadena ya está limpia (solo existe el bloque génesis)");
  }
}
