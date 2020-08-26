class ClipboardService {
  constructor() {
    this.clipboard = navigator.clipboard;
  }

  async copy(text) {
    try {
      return await this.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
      return err;
    }
  }

  async read() {
    try {
      return await this.clipboard.readText();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      return err;
    }
  }
}

export default new ClipboardService();
