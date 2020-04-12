function _createTitle(x, y, text) {
  return this.add.text(x, y, text, { font: '25px Arial ', fill: '#ffffff' });
}

function _createSubtitle(x, y, text) {
  return this.add.text(x, y, text, { font: '22px Arial ', fill: '#42ffef' });
}

function _createParagraph(x, y, text) {
  return this.add.text(x, y, text, { font: ' 20px Arial', fill: '#8ae888' });
}

function _createButton(x, y, text, callback) {
  this.add.image(x, y, 'btn_simple');
}
