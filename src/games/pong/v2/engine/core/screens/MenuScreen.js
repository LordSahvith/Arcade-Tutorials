import { Screen } from './Screen';
import { DEFAULT_MENU_KEYS } from '../../input/config';

export class MenuScreen extends Screen {
  selectedIndex = 0;

  constructor({
    title = 'GAME',
    prompt = 'Choose Game Option',
    inputKeys = DEFAULT_MENU_KEYS,
    options = [],
    onBack = null,
    selectedIndex = 0,
    color = 'white',
    selectedColor = 'green',
  } = {}) {
    super();
    this.title = title;
    this.prompt = prompt;
    this.inputKeys = inputKeys;
    this.options = options;
    this.onBack = onBack;
    this.selectedIndex = selectedIndex;
    this.color = color;
    this.selectedColor = selectedColor;
  }

  get selectedOption() {
    return this.options[this.selectedIndex];
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
      const color =
        index === this.selectedIndex ? this.selectedColor : this.color;
      renderer.drawText(
        { x, y: y - LINE_SPACING + LINE_SPACING * index },
        option.label,
        '20px monospace',
        color,
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
    if (this.game.input.anyWasPressed(this.inputKeys.select)) {
      this.handleSelect();
      return;
    }

    if (this.onBack && this.game.input.anyWasPressed(this.inputKeys.back)) {
      this.onBack(this.game);
      return;
    }

    if (this.game.input.anyWasPressed(this.inputKeys.up))
      this.moveSelection(-1);
    if (this.game.input.anyWasPressed(this.inputKeys.down))
      this.moveSelection(1);
  }

  handleSelect() {
    this.selectedOption?.onSelect(this.game);
  }

  moveSelection(step) {
    const count = this.options.length;
    if (!count) return;
    this.selectedIndex = (this.selectedIndex + step + count) % count;
  }
}
