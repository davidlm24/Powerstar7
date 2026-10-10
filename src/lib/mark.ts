/* Splits a heading around the phrase that gets the ink underline (.ink-mark in
   global.css), so the phrase can be wrapped in its own element.

   The phrase lives in its own i18n key (home.mark, services.mark, …) and must
   appear verbatim in the heading beside it. If a copy edit changes one and not
   the other, this throws during the build instead of quietly dropping the
   underline from the page. */
export interface MarkedTitle {
  before: string;
  mark: string;
  after: string;
}

export function splitMark(title: string, phrase: string): MarkedTitle {
  const at = title.indexOf(phrase);
  if (!phrase || at < 0) {
    throw new Error(`Ink underline: "${phrase}" does not appear in the heading "${title}"`);
  }
  return {
    before: title.slice(0, at),
    mark: phrase,
    after: title.slice(at + phrase.length),
  };
}
