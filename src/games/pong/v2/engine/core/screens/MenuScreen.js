import { Screen } from './Screen';

export class MenuScreen extends Screen {
  selectedIndex = 0;

  constructor({
    title = 'GAME',
    prompt = 'Choose Game Option',
    options = [],
    onBack = null,
    selectedIndex = 0,
    color = 'white',
    selectedColor = 'green',
  } = {}) {
    super();
    this.title = title;
    this.prompt = prompt;
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
    const { input } = this.game;

    if (input.anyWasPressed(input.menuKeys.select)) {
      this.handleSelect();
      return;
    }

    if (this.onBack && input.anyWasPressed(input.menuKeys.back)) {
      this.onBack(this.game);
      return;
    }

    if (input.anyWasPressed(input.menuKeys.up)) this.moveSelection(-1);
    if (input.anyWasPressed(input.menuKeys.down)) this.moveSelection(1);
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
