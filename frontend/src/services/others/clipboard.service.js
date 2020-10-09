import * as clipboard from 'clipboard-polyfill';

class ClipboardService {
  constructor() {
    this.clipboard = clipboard;
  }

  async copy(text) {
    try {
      return await this.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
      throw new Error('Votre navigateur interdit Croesus de copier dans votre Presse-Papier. Vous pouvez tout de même copier manuellement.');
    }
  }

  async read() {
    try {
      return await this.clipboard.readText();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      throw new Error('Votre navigateur interdit Croesus de lire dans votre Presse-Papier. Vous pouvez tout de même coller manuellement.');
    }
  }
}

export default new ClipboardService();
