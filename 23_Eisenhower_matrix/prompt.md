The following SPA is an dynamic Eisenhower Matrix. It adds/removes cards, has movable cards to other quadrants, and the Card body is supposed to allow a textarea editor which renders as HTML.

It has 3 source files:
```html
``` 

```css
```

```javascript
```

Issue: the example entry in the HTML can be placed in the card correctly, hidden/viewed correctly, and the text area successfully renders as HTML. However, for existing HTML that is "re-edited" all of the HTML tags are removed, and they should remain.

Provide a fix.

=================

The following SPA is an dynamic Eisenhower Matrix. It adds/removes cards, has movable cards to other quadrants, and the Card body is supposed to allow a textarea editor which renders as HTML.

It has 3 source files:
```html
``` 

```css
```

```javascript
```

Issues: (1) the total amount of cards should be listed as a dynamically updated number in the title for each quadrant (it currently does not), and (2) each of the quadrants should be able to be scrolled to show multiple cards (i.e., only four cards can be shown so the fifth card is not visible, but the user should be able to scroll and see it).

Provide a updates to the code to resolve the issues.

=========================

The following SPA is an dynamic Eisenhower Matrix. It adds/removes cards, has movable cards to other quadrants, and the Card body is supposed to allow a textarea editor which renders as HTML.

It has 3 source files:
```html
``` 

```css
```

```javascript
```

Issue: When the total cards exceed a quadrant, they cannot be selected. Also the cards overflow their display on to lower quadrants. Each of the quadrants should be able to be scrolled to show multiple cards

Provide a updates to the code to resolve the issues.

=========================

The following SPA is an dynamic Eisenhower Matrix. It adds/removes cards, has movable cards to other quadrants, and the Card body is supposed to allow a textarea editor which renders as HTML.

It has 3 source files:
```html
``` 

```css
```

```javascript
```

Issue: All cards are lost on page refresh.

Provide: localstorage saving, loading, and a button to reset localstorage.

Regarding localstorage saving: save after any (1) input into textarea, (2) finish of a dragend, or (3) finish of a touchend, -- save all cards/quadrants to localstorage.

Regarding localstorage loading: when the page loads, restore any cards to their proper quadrants from localstorage.

=========================

The following SPA is an dynamic Eisenhower Matrix. It adds/removes cards, has movable cards to other quadrants, and the Card body is supposed to allow a textarea editor which renders as HTML.

It has 3 source files:
```html
``` 

```css
```

```javascript
```

Issue: LocalStorage can be deleted, thus a backup and restore function (via import/export) should exist.

Provide: edits to the code that adds an import and export button, left of "Reset LocalStorage" button, which will export the Matrix to a JSON file, and import from a JSON file.