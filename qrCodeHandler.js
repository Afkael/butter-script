const qrcode = require('qrcode-terminal');

function handleQrCode(state) {
  if (state.qrCode) {
    qrcode.generate(state.qrCode, { small: true });
  }
}

module.exports = {
  handleQrCode,
};
