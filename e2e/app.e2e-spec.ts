import { DeepmailPage } from './app.po';

describe('deepmail App', () => {
  let page: DeepmailPage;

  beforeEach(() => {
    page = new DeepmailPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
