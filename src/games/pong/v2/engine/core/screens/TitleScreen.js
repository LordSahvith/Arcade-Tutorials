import { Screen } from './Screen';
import { DEFAULT_MENU_KEYS } from '../../input/config';

export class TitleScreen extends Screen {
  #optionsIndex = 0;

  constructor({
    title = 'GAME',
    prompt = 'Choose Game Option',
    inputKeys = DEFAULT_MENU_KEYS,
    options = [],
    color = 'white',
    selectedColor = 'green',
  } = {}) {
    super();
    this.title = title;
    this.prompt = prompt;
    this.inputKeys = inputKeys;
    this.options = options;
    this.color = color;
    this.selectedColor = selectedColor;
  }

  tick() {
    this.handleInput();
  }

  render(renderer) {
    const x = renderer.width / 2;
    const y = renderer.height / 2;
    const LINE_SPACING = 40;

    renderer.drawText(
      { x, y: LINE_SPACING * 2 },
      this.title,
      '48px monospace',
      this.color,
      'center'
    );

    for (const [index, option] of this.options.entries()) {
      renderer.drawText(
        { x, y: y - LINE_SPACING + LINE_SPACING * index },
        option.title,
        '20px monospace',
        option.bIsSelected ? this.selectedColor : this.color,
        'center'
      );
    }

    renderer.drawText(
      { x, y: renderer.height - LINE_SPACING },
      this.prompt,
      '20px monospace',
      this.color,
      'center'
    );
  }

  handleInput() {
    if (this.game.input.wasPressed(this.inputKeys.select)) this.handleSelect();
    if (this.game.input.wasPressed(this.inputKeys.up)) this.handleUp();
    if (this.game.input.wasPressed(this.inputKeys.down)) this.handleDown();
  }

  handleSelect() {
    const option = this.options.filter(option => option.bIsSelected)[0];

    if (option.type === 'gameMode') {
      this.game.setGameMode(option.className);
      this.game.startMatch();
    }

    if (option.type === 'setting') {
      console.log('set settings class and activate');
    }
  }

  handleUp() {
    console.log('up1:', this.#optionsIndex);

    // top of the list
    if (this.#optionsIndex === 0) {
      this.#optionsIndex = this.options.length - 1;
      this.options.map(option => (option.bIsSelected = false));
      this.options[this.#optionsIndex].bIsSelected = true;
    } else {
      this.#optionsIndex--;
      this.options.map(option => (option.bIsSelected = false));
      this.options[this.#optionsIndex].bIsSelected = true;
    }
  }

  handleDown() {
    console.log('down');

    // end of list
    if (this.#optionsIndex === this.options.length - 1) {
      this.#optionsIndex = 0;
      this.options.map(option => (option.bIsSelected = false));
      this.options[this.#optionsIndex].bIsSelected = true;
    } else {
      this.#optionsIndex++;
      this.options.map(option => (option.bIsSelected = false));
      this.options[this.#optionsIndex].bIsSelected = true;
    }
  }
}
